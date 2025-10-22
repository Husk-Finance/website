import { createPublicClient, http, formatUnits, encodeFunctionData, decodeFunctionResult } from 'viem'
import { mainnet } from 'viem/chains'
import { ERC20_ABI } from '../constants/contracts'

/**
 * Create a public client for reading blockchain data
 * @param {object} chain - viem chain object (default: mainnet)
 * @returns {object} viem public client
 */
export function createViemPublicClient(chain = mainnet) {
  return createPublicClient({
    chain,
    transport: http('https://eth.meowrpc.com'), // MeowRPC Ethereum endpoint
  })
}

/**
 * Fetch token data (symbol, decimals, balance) using batched calls with direct call method
 * @param {string} tokenAddress - The token contract address
 * @param {string} userAddress - The user's wallet address (optional)
 * @param {object} publicClient - viem public client instance (optional)
 * @returns {Promise<{symbol: string, decimals: number, balance: string, needsWallet: boolean}>}
 */
export async function fetchTokenData(tokenAddress, userAddress, publicClient) {
  try {
    // Create a public client if not provided
    const client = publicClient || createViemPublicClient()
    
    if (!tokenAddress) {
      return { symbol: 'UNKNOWN', decimals: 18, balance: '0', needsWallet: false }
    }

    // Encode function calls
    const symbolData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'symbol',
    })

    const decimalsData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'decimals',
    })

    // Batch fetch symbol and decimals in parallel using call
    const [symbolResult, decimalsResult] = await Promise.all([
      client.call({
        to: tokenAddress,
        data: symbolData,
      }),
      client.call({
        to: tokenAddress,
        data: decimalsData,
      }),
    ])

    // Decode results
    const symbol = decodeFunctionResult({
      abi: ERC20_ABI,
      functionName: 'symbol',
      data: symbolResult.data,
    })

    const decimals = decodeFunctionResult({
      abi: ERC20_ABI,
      functionName: 'decimals',
      data: decimalsResult.data,
    })

    // If no user address, return placeholder for balance
    if (!userAddress) {
      return {
        symbol,
        decimals: Number(decimals),
        balance: 'Please connect wallet first',
        needsWallet: true,
      }
    }

    // Encode balance call
    const balanceData = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [userAddress],
    })

    // Fetch balance if user address is provided
    const balanceResult = await client.call({
      to: tokenAddress,
      data: balanceData,
    })

    const balanceRaw = decodeFunctionResult({
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      data: balanceResult.data,
    })

    // Format balance
    const balance = formatUnits(balanceRaw, decimals)

    return {
      symbol,
      decimals: Number(decimals),
      balance,
      needsWallet: false,
    }
  } catch (error) {
    console.error('Error fetching token data:', error)
    return { symbol: 'UNKNOWN', decimals: 18, balance: '0', needsWallet: false }
  }
}

/**
 * Fetch multiple tokens data using individual calls
 * @param {Array<{address: string, userAddress: string}>} tokens - Array of token addresses and user address
 * @param {object} publicClient - viem public client instance
 * @returns {Promise<Array<{address: string, symbol: string, decimals: number, balance: string}>>}
 */
export async function fetchMultipleTokensData(tokens, publicClient) {
  try {
    if (!tokens || tokens.length === 0) {
      return []
    }

    const client = publicClient || createViemPublicClient()

    // Fetch all tokens in parallel using Promise.all
    const results = await Promise.all(
      tokens.map(async ({ address, userAddress }) => {
        const tokenData = await fetchTokenData(address, userAddress, client)
        return {
          address,
          ...tokenData,
        }
      })
    )

    return results
  } catch (error) {
    console.error('Error fetching multiple tokens data:', error)
    return tokens.map(({ address }) => ({
      address,
      symbol: 'UNKNOWN',
      decimals: 18,
      balance: '0',
      needsWallet: false,
    }))
  }
}
