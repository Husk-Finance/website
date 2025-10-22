import { createPublicClient, http, formatUnits, encodeFunctionData, decodeFunctionResult } from 'viem'
import { mainnet, base } from 'viem/chains'
import { ERC20_ABI } from '../constants/contracts'
import { CHAIN_IDS } from '../constants/networks'

// EIP-7528: ETH native asset address convention
// https://ethereum-magicians.org/t/eip-7528-eth-native-asset-address-convention/15989
const ETH_NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

// Cache key prefix for sessionStorage
const TOKEN_CACHE_PREFIX = 'husk_token_'
const BALANCE_CACHE_PREFIX = 'husk_balance_'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes for balance cache
const TOKEN_INFO_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours for token info (symbol, decimals)

/**
 * Check if the address is the native ETH address (EIP-7528)
 * @param {string} address - Token address
 * @returns {boolean} True if it's the native ETH address
 */
function isNativeETH(address) {
  return address && address.toLowerCase() === ETH_NATIVE_ADDRESS.toLowerCase()
}

/**
 * Get cached token info from sessionStorage
 * @param {string} tokenAddress - The token contract address
 * @param {number} chainId - The chain ID (optional, defaults to 1 for mainnet)
 * @returns {object|null} Cached token info or null if not found/expired
 */
function getCachedTokenInfo(tokenAddress, chainId = 1) {
  try {
    const cacheKey = TOKEN_CACHE_PREFIX + chainId + '_' + tokenAddress.toLowerCase()
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
 * @param {number} chainId - The chain ID (optional, defaults to 1 for mainnet)
 */
function setCachedTokenInfo(tokenAddress, tokenInfo, chainId = 1) {
  try {
    const cacheKey = TOKEN_CACHE_PREFIX + chainId + '_' + tokenAddress.toLowerCase()
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
 * @param {number} chainId - The chain ID (optional, defaults to 1 for mainnet)
 * @returns {string|null} Cached balance or null if not found/expired
 */
function getCachedBalance(tokenAddress, userAddress, chainId = 1) {
  try {
    if (!userAddress) return null
    
    const cacheKey = BALANCE_CACHE_PREFIX + chainId + '_' + tokenAddress.toLowerCase() + '_' + userAddress.toLowerCase()
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
 * @param {number} chainId - The chain ID (optional, defaults to 1 for mainnet)
 */
function setCachedBalance(tokenAddress, userAddress, balance, chainId = 1) {
  try {
    if (!userAddress) return
    
    const cacheKey = BALANCE_CACHE_PREFIX + chainId + '_' + tokenAddress.toLowerCase() + '_' + userAddress.toLowerCase()
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
 * Export ETH native address constant (EIP-7528)
 */
export { ETH_NATIVE_ADDRESS }

/**
 * Check if an address is the native ETH address
 * @param {string} address - Token address
 * @returns {boolean} True if it's native ETH
 */
export { isNativeETH }

/**
 * Get the viem chain configuration by chainId
 * @param {number} chainId - The chain ID
 * @returns {object} viem chain configuration
 */
function getChainConfig(chainId) {
  switch (chainId) {
    case CHAIN_IDS.BASE:
      return base
    case CHAIN_IDS.MAINNET:
    default:
      return mainnet
  }
}

/**
 * Get the RPC URL for a specific chain
 * @param {number} chainId - The chain ID
 * @returns {string} RPC URL
 */
function getRpcUrl(chainId) {
  switch (chainId) {
    case CHAIN_IDS.BASE:
      return 'https://mainnet.base.org'
    case CHAIN_IDS.MAINNET:
    default:
      return 'https://eth.meowrpc.com'
  }
}

/**
 * Create a public client for reading blockchain data for a specific chain
 * @param {number} chainId - The chain ID (1 for Mainnet, 8453 for Base)
 * @returns {object} viem public client
 */
export function createViemPublicClient(chainId = CHAIN_IDS.MAINNET) {
  const chain = getChainConfig(chainId)
  const rpcUrl = getRpcUrl(chainId)
  
  return createPublicClient({
    chain,
    transport: http(rpcUrl),
  })
}

/**
 * Fetch token data (symbol, decimals, balance) using batched calls with direct call method
 * Implements caching to reduce blockchain calls
 * @param {string} tokenAddress - The token contract address
 * @param {string} userAddress - The user's wallet address (optional)
 * @param {object} publicClient - viem public client instance (optional)
 * @param {number} chainId - The chain ID (optional, defaults to 1 for mainnet)
 * @returns {Promise<{symbol: string, decimals: number, balance: string, needsWallet: boolean}>}
 */
export async function fetchTokenData(tokenAddress, userAddress, publicClient, chainId = 1) {
  try {
    // Always create a chain-specific client if chainId is provided
    // This ensures we use the correct RPC endpoint for the token's network
    const client = chainId ? createViemPublicClient(chainId) : (publicClient || createViemPublicClient(1))
    
    if (!tokenAddress) {
      return { symbol: 'UNKNOWN', decimals: 18, balance: '0', needsWallet: false }
    }

    // Handle native ETH (EIP-7528)
    if (isNativeETH(tokenAddress)) {
      const symbol = 'ETH'
      const decimals = 18

      // If no user address, return placeholder for balance
      if (!userAddress) {
        return {
          symbol,
          decimals,
          balance: 'Please connect wallet first',
          needsWallet: true,
        }
      }

      // Fetch ETH balance directly
      try {
        const balanceRaw = await client.getBalance({ address: userAddress })
        const balance = formatUnits(balanceRaw, decimals)
        
        // Cache the balance with chainId
        setCachedBalance(tokenAddress, userAddress, balance, chainId)

        return {
          symbol,
          decimals,
          balance,
          needsWallet: false,
        }
      } catch (error) {
        console.error('Error fetching ETH balance:', error)
        return { symbol, decimals, balance: '0', needsWallet: false }
      }
    }

    // Try to get cached token info (symbol, decimals) with chainId
    let cachedTokenInfo = getCachedTokenInfo(tokenAddress, chainId)
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

      // Cache the token info with chainId
      setCachedTokenInfo(tokenAddress, { symbol, decimals: Number(decimals) }, chainId)
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

    // Try to get cached balance with chainId
    let balance = getCachedBalance(tokenAddress, userAddress, chainId)

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

      // Cache the balance with chainId
      setCachedBalance(tokenAddress, userAddress, balance, chainId)
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
