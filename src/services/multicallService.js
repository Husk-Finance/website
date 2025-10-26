/**
 * Multicall3 Batching Service
 * Aggregates multiple contract calls into a single RPC request
 * Dramatically reduces RPC calls for token info, balances, and other data
 */

import {
  createPublicClient, http, encodeFunctionData, decodeFunctionResult,
} from 'viem'
import { MULTICALL3_ADDRESS, MULTICALL3_ABI, ERC20_ABI } from '../constants/contracts'
import { NETWORKS } from '../main'

// Batch configuration
const BATCH_CONFIG = {
  maxBatchSize: 100, // Maximum calls per batch
  batchDelay: 50, // Milliseconds to wait before executing batch
  timeout: 10000, // Request timeout
}

// Per-chain batching queues
const batchQueues = new Map()

/**
 * Get public client for a specific chain with caching
 */
const clientCache = new Map()

function getPublicClient(chainId) {
  if (clientCache.has(chainId)) {
    return clientCache.get(chainId)
  }

  const network = Object.values(NETWORKS).find((n) => n.id === chainId)
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  const client = createPublicClient({
    chain: network.chain,
    transport: http(network.rpcUrl, {
      batch: true,
      retryCount: 3,
      timeout: BATCH_CONFIG.timeout,
    }),
  })

  clientCache.set(chainId, client)
  return client
}

/**
 * Batch queue structure
 */
class BatchQueue {
  constructor(chainId) {
    this.chainId = chainId
    this.queue = []
    this.timer = null
  }

  add(call) {
    return new Promise((resolve, reject) => {
      this.queue.push({ ...call, resolve, reject })

      // Auto-execute if batch is full
      if (this.queue.length >= BATCH_CONFIG.maxBatchSize) {
        this.execute()
      } else if (!this.timer) {
        // Schedule batch execution
        this.timer = setTimeout(() => this.execute(), BATCH_CONFIG.batchDelay)
      }
    })
  }

  async execute() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, BATCH_CONFIG.maxBatchSize)

    try {
      const client = getPublicClient(this.chainId)

      // Prepare multicall data
      const calls = batch.map((item) => ({
        target: item.target,
        callData: item.callData,
      }))

      // Execute multicall
      const results = await client.readContract({
        address: MULTICALL3_ADDRESS,
        abi: MULTICALL3_ABI,
        functionName: 'aggregate',
        args: [calls],
      })

      // Decode and resolve each call
      results[1].forEach((returnData, index) => {
        try {
          const decodedResult = decodeFunctionResult({
            abi: batch[index].abi,
            functionName: batch[index].functionName,
            data: returnData,
          })
          batch[index].resolve(decodedResult)
        } catch (error) {
          batch[index].reject(new Error(`Failed to decode result: ${error.message}`))
        }
      })
    } catch (error) {
      // Reject all calls in batch
      batch.forEach((item) => item.reject(error))
    }

    // Execute next batch if queue has more items
    if (this.queue.length > 0) {
      this.execute()
    }
  }
}

/**
 * Get or create batch queue for a chain
 */
function getBatchQueue(chainId) {
  if (!batchQueues.has(chainId)) {
    batchQueues.set(chainId, new BatchQueue(chainId))
  }
  return batchQueues.get(chainId)
}

/**
 * Add a contract read call to the batch queue
 */
export async function batchedRead(chainId, contractAddress, abi, functionName, args = []) {
  try {
    const callData = encodeFunctionData({
      abi,
      functionName,
      args,
    })

    const queue = getBatchQueue(chainId)
    const result = await queue.add({
      target: contractAddress,
      callData,
      abi,
      functionName,
    })

    return result
  } catch (error) {
    console.error('Batched read error:', error)
    throw error
  }
}

/**
 * Batch multiple token info calls (symbol, decimals, name)
 * Returns array of token info objects
 */
export async function batchGetTokenInfo(chainId, tokenAddresses) {
  const uniqueAddresses = [...new Set(tokenAddresses)]

  try {
    const calls = uniqueAddresses.flatMap((address) => [
      {
        target: address,
        callData: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'symbol',
        }),
        abi: ERC20_ABI,
        functionName: 'symbol',
        tokenAddress: address,
        field: 'symbol',
      },
      {
        target: address,
        callData: encodeFunctionData({
          abi: ERC20_ABI,
          functionName: 'decimals',
        }),
        abi: ERC20_ABI,
        functionName: 'decimals',
        tokenAddress: address,
        field: 'decimals',
      },
    ])

    const client = getPublicClient(chainId)
    const results = await client.readContract({
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'aggregate',
      args: [calls],
    })

    // Decode results and group by token
    const tokenInfoMap = new Map()

    results[1].forEach((returnData, index) => {
      const call = calls[index]
      try {
        const decodedResult = decodeFunctionResult({
          abi: call.abi,
          functionName: call.functionName,
          data: returnData,
        })

        if (!tokenInfoMap.has(call.tokenAddress)) {
          tokenInfoMap.set(call.tokenAddress, {
            address: call.tokenAddress,
          })
        }

        tokenInfoMap.get(call.tokenAddress)[call.field] = decodedResult
      } catch (error) {
        console.error(`Failed to decode ${call.field} for ${call.tokenAddress}:`, error)
      }
    })

    return Array.from(tokenInfoMap.values())
  } catch (error) {
    console.error('Batch get token info error:', error)
    throw error
  }
}

/**
 * Batch multiple balance checks
 * Returns array of balance objects
 */
export async function batchGetBalances(chainId, tokenAddresses, userAddress) {
  if (!userAddress) {
    throw new Error('User address is required')
  }

  const uniqueAddresses = [...new Set(tokenAddresses)]

  try {
    const calls = uniqueAddresses.map((address) => ({
      target: address,
      callData: encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      }),
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      tokenAddress: address,
    }))

    const client = getPublicClient(chainId)
    const results = await client.readContract({
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'aggregate',
      args: [calls],
    })

    // Decode results
    const balances = results[1].map((returnData, index) => {
      try {
        const balance = decodeFunctionResult({
          abi: calls[index].abi,
          functionName: calls[index].functionName,
          data: returnData,
        })

        return {
          tokenAddress: calls[index].tokenAddress,
          balance,
        }
      } catch (error) {
        console.error(`Failed to decode balance for ${calls[index].tokenAddress}:`, error)
        return {
          tokenAddress: calls[index].tokenAddress,
          balance: 0n,
          error: error.message,
        }
      }
    })

    return balances
  } catch (error) {
    console.error('Batch get balances error:', error)
    throw error
  }
}

/**
 * Batch multiple token info AND balances in one call
 * Most efficient method for getting complete token data
 */
export async function batchGetTokenData(chainId, tokenAddresses, userAddress) {
  const uniqueAddresses = [...new Set(tokenAddresses)]

  try {
    const calls = uniqueAddresses.flatMap((address) => {
      const baseCalls = [
        {
          target: address,
          callData: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'symbol',
          }),
          abi: ERC20_ABI,
          functionName: 'symbol',
          tokenAddress: address,
          field: 'symbol',
        },
        {
          target: address,
          callData: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'decimals',
          }),
          abi: ERC20_ABI,
          functionName: 'decimals',
          tokenAddress: address,
          field: 'decimals',
        },
      ]

      if (userAddress) {
        baseCalls.push({
          target: address,
          callData: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [userAddress],
          }),
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          tokenAddress: address,
          field: 'balance',
        })
      }

      return baseCalls
    })

    const client = getPublicClient(chainId)
    const results = await client.readContract({
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'aggregate',
      args: [calls],
    })

    // Decode results and group by token
    const tokenDataMap = new Map()

    results[1].forEach((returnData, index) => {
      const call = calls[index]
      try {
        const decodedResult = decodeFunctionResult({
          abi: call.abi,
          functionName: call.functionName,
          data: returnData,
        })

        if (!tokenDataMap.has(call.tokenAddress)) {
          tokenDataMap.set(call.tokenAddress, {
            address: call.tokenAddress,
          })
        }

        tokenDataMap.get(call.tokenAddress)[call.field] = decodedResult
      } catch (error) {
        console.error(`Failed to decode ${call.field} for ${call.tokenAddress}:`, error)
      }
    })

    return Array.from(tokenDataMap.values())
  } catch (error) {
    console.error('Batch get token data error:', error)
    throw error
  }
}

/**
 * Force execute all pending batches immediately
 */
export function flushAllBatches() {
  batchQueues.forEach((queue) => {
    if (queue.queue.length > 0) {
      queue.execute()
    }
  })
}

/**
 * Clear all batch queues
 */
export function clearAllBatches() {
  batchQueues.forEach((queue) => {
    if (queue.timer) {
      clearTimeout(queue.timer)
    }
    queue.queue = []
  })
  batchQueues.clear()
}

/**
 * Get batching statistics
 */
export function getBatchingStats() {
  const stats = {}
  batchQueues.forEach((queue, chainId) => {
    stats[chainId] = {
      queueLength: queue.queue.length,
      hasPendingTimer: !!queue.timer,
    }
  })
  return stats
}
