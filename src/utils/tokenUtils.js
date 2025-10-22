import { createPublicClient, http, encodeFunctionData, decodeFunctionResult, formatUnits } from 'viem'
import { mainnet } from 'viem/chains'
import { MULTICALL3_ADDRESS, MULTICALL3_ABI, ERC20_ABI } from '../constants/contracts'

/**
 * Create a public client for reading blockchain data
 * @param {object} chain - viem chain object (default: mainnet)
 * @returns {object} viem public client
 */
export function createViemPublicClient(chain = mainnet) {
  return createPublicClient({
    chain,
    transport: http(),
  })
}

/**
 * Fetch token data (symbol, decimals, balance) using Multicall3
 * @param {string} tokenAddress - The token contract address
 * @param {string} userAddress - The user's wallet address
 * @param {object} publicClient - viem public client instance
 * @returns {Promise<{symbol: string, decimals: number, balance: string}>}
 */
export async function fetchTokenData(tokenAddress, userAddress, publicClient) {
  try {
    if (!publicClient || !tokenAddress || !userAddress) {
      return { symbol: 'UNKNOWN', decimals: 18, balance: '0' }
    }

    // Prepare call data for each function
    const symbolCallData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'symbol',
    })

    const decimalsCallData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'decimals',
    })

    const balanceCallData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress],
    })

    // Prepare multicall calls
    const calls = [
      { target: tokenAddress, callData: symbolCallData },
      { target: tokenAddress, callData: decimalsCallData },
      { target: tokenAddress, callData: balanceCallData },
    ]

    // Execute multicall
    const result = await publicClient.readContract({
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'aggregate',
      args: [calls],
    })

    const [, returnData] = result

    // Decode results
    const symbol = decodeFunctionResult({
      abi: ERC20_ABI,
      functionName: 'symbol',
      data: returnData[0],
    })

    const decimals = decodeFunctionResult({
      abi: ERC20_ABI,
      functionName: 'decimals',
      data: returnData[1],
    })

    const balanceRaw = decodeFunctionResult({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      data: returnData[2],
    })

    // Format balance
    const balance = formatUnits(balanceRaw, decimals)

    return {
      symbol,
      decimals: Number(decimals),
      balance,
    }
  } catch (error) {
    console.error('Error fetching token data:', error)
    return { symbol: 'UNKNOWN', decimals: 18, balance: '0' }
  }
}

/**
 * Fetch multiple tokens data in a single multicall
 * @param {Array<{address: string, userAddress: string}>} tokens - Array of token addresses and user address
 * @param {object} publicClient - viem public client instance
 * @returns {Promise<Array<{address: string, symbol: string, decimals: number, balance: string}>>}
 */
export async function fetchMultipleTokensData(tokens, publicClient) {
  try {
    if (!publicClient || !tokens || tokens.length === 0) {
      return []
    }

    // Prepare all calls
    const calls = []
    tokens.forEach(({ address, userAddress }) => {
      calls.push(
        {
          target: address,
          callData: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'symbol',
          }),
        },
        {
          target: address,
          callData: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'decimals',
          }),
        },
        {
          target: address,
          callData: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [userAddress],
          }),
        }
      )
    })

    // Execute multicall
    const result = await publicClient.readContract({
      address: MULTICALL3_ADDRESS,
      abi: MULTICALL3_ABI,
      functionName: 'aggregate',
      args: [calls],
    })

    const [, returnData] = result

    // Decode results
    const results = []
    for (let i = 0; i < tokens.length; i++) {
      const baseIndex = i * 3
      
      const symbol = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'symbol',
        data: returnData[baseIndex],
      })

      const decimals = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'decimals',
        data: returnData[baseIndex + 1],
      })

      const balanceRaw = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        data: returnData[baseIndex + 2],
      })

      const balance = formatUnits(balanceRaw, decimals)

      results.push({
        address: tokens[i].address,
        symbol,
        decimals: Number(decimals),
        balance,
      })
    }

    return results
  } catch (error) {
    console.error('Error fetching multiple tokens data:', error)
    return tokens.map(({ address }) => ({
      address,
      symbol: 'UNKNOWN',
      decimals: 18,
      balance: '0',
    }))
  }
}
