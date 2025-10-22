import { createPublicClient, http, formatUnits, encodeFunctionData, decodeFunctionResult } from 'viem'
import { mainnet } from 'viem/chains'
import { ERC20_ABI } from '../constants/contracts'

// Cache key prefix for sessionStorage
const TOKEN_CACHE_PREFIX = 'husk_token_'
const BALANCE_CACHE_PREFIX = 'husk_balance_'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes for balance cache
const TOKEN_INFO_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours for token info (symbol, decimals)

/**
 * Get cached token info from sessionStorage
 * @param {string} tokenAddress - The token contract address
 * @returns {object|null} Cached token info or null if not found/expired
 */
function getCachedTokenInfo(tokenAddress) {
  try {
    const cacheKey = TOKEN_CACHE_PREFIX + tokenAddress.toLowerCase()
    const cached = sessionStorage.getItem(cacheKey)
    if (!cached) return null
    
    const { data, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid
    if (now - timestamp < TOKEN_INFO_CACHE_DURATION) {
      return data
    }
    
    // Cache expired, remove it
    sessionStorage.removeItem(cacheKey)
    return null
  } catch (error) {
    console.error('Error reading token cache:', error)
    return null
  }
}

/**
 * Save token info to sessionStorage
 * @param {string} tokenAddress - The token contract address
 * @param {object} tokenInfo - Token info to cache (symbol, decimals)
 */
function setCachedTokenInfo(tokenAddress, tokenInfo) {
  try {
    const cacheKey = TOKEN_CACHE_PREFIX + tokenAddress.toLowerCase()
    const cacheData = {
      data: tokenInfo,
      timestamp: Date.now()
    }
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error saving token cache:', error)
  }
}

/**
 * Get cached balance from sessionStorage
 * @param {string} tokenAddress - The token contract address
 * @param {string} userAddress - The user's wallet address
 * @returns {string|null} Cached balance or null if not found/expired
 */
function getCachedBalance(tokenAddress, userAddress) {
  try {
    if (!userAddress) return null
    
    const cacheKey = BALANCE_CACHE_PREFIX + tokenAddress.toLowerCase() + '_' + userAddress.toLowerCase()
    const cached = sessionStorage.getItem(cacheKey)
    if (!cached) return null
    
    const { balance, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is still valid (shorter duration for balance)
    if (now - timestamp < CACHE_DURATION) {
      return balance
    }
    
    // Cache expired, remove it
    sessionStorage.removeItem(cacheKey)
    return null
  } catch (error) {
    console.error('Error reading balance cache:', error)
    return null
  }
}

/**
 * Save balance to sessionStorage
 * @param {string} tokenAddress - The token contract address
 * @param {string} userAddress - The user's wallet address
 * @param {string} balance - Balance to cache
 */
function setCachedBalance(tokenAddress, userAddress, balance) {
  try {
    if (!userAddress) return
    
    const cacheKey = BALANCE_CACHE_PREFIX + tokenAddress.toLowerCase() + '_' + userAddress.toLowerCase()
    const cacheData = {
      balance,
      timestamp: Date.now()
    }
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error saving balance cache:', error)
  }
}

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
 * Implements caching to reduce blockchain calls
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

    // Try to get cached token info (symbol, decimals)
    let cachedTokenInfo = getCachedTokenInfo(tokenAddress)
    let symbol, decimals

    if (cachedTokenInfo) {
      // Use cached data
      symbol = cachedTokenInfo.symbol
      decimals = cachedTokenInfo.decimals
    } else {
      // Fetch from blockchain
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
      symbol = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'symbol',
        data: symbolResult.data,
      })

      decimals = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'decimals',
        data: decimalsResult.data,
      })

      // Cache the token info
      setCachedTokenInfo(tokenAddress, { symbol, decimals: Number(decimals) })
    }

    // If no user address, return placeholder for balance
    if (!userAddress) {
      return {
        symbol,
        decimals: Number(decimals),
        balance: 'Please connect wallet first',
        needsWallet: true,
      }
    }

    // Try to get cached balance
    let balance = getCachedBalance(tokenAddress, userAddress)

    if (balance === null) {
      // Fetch balance from blockchain
      const balanceData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      })

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
      balance = formatUnits(balanceRaw, decimals)

      // Cache the balance
      setCachedBalance(tokenAddress, userAddress, balance)
    }

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

/**
 * Clear all token cache from sessionStorage
 * Useful when user disconnects wallet or wants to force refresh
 */
export function clearTokenCache() {
  try {
    // Get all keys from sessionStorage
    const keys = Object.keys(sessionStorage)
    
    // Remove all token and balance cache entries
    keys.forEach(key => {
      if (key.startsWith(TOKEN_CACHE_PREFIX) || key.startsWith(BALANCE_CACHE_PREFIX)) {
        sessionStorage.removeItem(key)
      }
    })
    
    console.log('Token cache cleared')
  } catch (error) {
    console.error('Error clearing token cache:', error)
  }
}

/**
 * Clear balance cache for a specific user
 * Useful when user wants to refresh their balance
 * @param {string} userAddress - The user's wallet address
 */
export function clearBalanceCache(userAddress) {
  try {
    if (!userAddress) return
    
    const keys = Object.keys(sessionStorage)
    const userAddressLower = userAddress.toLowerCase()
    
    // Remove all balance cache entries for this user
    keys.forEach(key => {
      if (key.startsWith(BALANCE_CACHE_PREFIX) && key.includes(userAddressLower)) {
        sessionStorage.removeItem(key)
      }
    })
    
    console.log('Balance cache cleared for user:', userAddress)
  } catch (error) {
    console.error('Error clearing balance cache:', error)
  }
}
