/**
 * Optimized Token Utils
 * Ultra-efficient token data fetching with all optimization layers
 * - Multi-layer caching (memory + IndexedDB)
 * - Multicall3 batching
 * - Request deduplication
 * - Load balancing with failover
 * - Stale-while-revalidate pattern
 * 
 * IMPORTANT: All balances are stored as integer strings (raw wei/smallest unit)
 * Convert to human-readable format ONLY in display layer using formatUnits()
 */

import { ERC20_ABI } from '../constants/contracts'
import { CHAIN_IDS, getNetworkByChainId } from '../constants/networks'
import {
  batchGetTokenData,
  batchGetTokenInfo,
  batchGetBalances,
  batchedRead,
} from '../services/multicallService'
import {
  getFromCache,
  setInCache,
  CACHE_TTL,
  STORE_NAMES,
  getOrFetch,
  invalidateCache,
  invalidateChainCache,
} from '../services/cacheService'
import {
  deduplicateRequest,
  smartRequest,
} from '../services/requestManager'
import {
  staleWhileRevalidate,
  smartFetch,
  preloadTokenData,
} from '../services/optimisticService'
import { executeWithLoadBalancing } from '../services/rpcLoadBalancer'

// EIP-7528: ETH native asset address convention
const ETH_NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

/**
 * Check if the address is the native ETH address (EIP-7528)
 */
export function isNativeETH(address) {
  return address && address.toLowerCase() === ETH_NATIVE_ADDRESS.toLowerCase()
}

/**
 * Export ETH native address constant
 */
export { ETH_NATIVE_ADDRESS }

/**
 * Get token info (symbol, decimals) - highly optimized with long cache
 */
export async function getTokenInfo(tokenAddress, chainId = CHAIN_IDS.MAINNET) {
  if (!tokenAddress) {
    return { symbol: 'UNKNOWN', decimals: 18 }
  }

  // Handle native token (EIP-7528)
  if (isNativeETH(tokenAddress)) {
    const network = getNetworkByChainId(chainId)
    const symbol = network?.nativeCurrency?.symbol || 'ETH'
    return { symbol, decimals: 18 }
  }

  const params = {
    tokenAddress: tokenAddress.toLowerCase(),
    chainId,
  }

  // Use getOrFetch pattern with deduplication
  return getOrFetch(
    STORE_NAMES.TOKEN_INFO,
    params,
    CACHE_TTL.TOKEN_INFO,
    async () => {
      const result = await batchedRead(
        chainId,
        tokenAddress,
        ERC20_ABI,
        'symbol',
      )

      const decimals = await batchedRead(
        chainId,
        tokenAddress,
        ERC20_ABI,
        'decimals',
      )

      return {
        symbol: result,
        decimals: Number(decimals),
      }
    },
  )
}

/**
 * Get token balance for a user - short cache with SWR
 * Returns balance as integer string (raw wei/smallest unit)
 */
export async function getTokenBalance(
  tokenAddress,
  userAddress,
  chainId = CHAIN_IDS.MAINNET,
  onUpdate = null,
) {
  if (!tokenAddress || !userAddress) {
    return '0'
  }

  const params = {
    tokenAddress: tokenAddress.toLowerCase(),
    userAddress: userAddress.toLowerCase(),
    chainId,
  }

  // Use SWR pattern for balances
  const result = await staleWhileRevalidate(
    STORE_NAMES.BALANCES,
    params,
    CACHE_TTL.BALANCES,
    async () => {
      // Handle native ETH balance differently
      if (isNativeETH(tokenAddress)) {
        const network = getNetworkByChainId(chainId)
        const balance = await executeWithLoadBalancing(
          chainId,
          network.rpcUrl,
          async (rpcUrl) => {
            const response = await fetch(rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [userAddress, 'latest'],
                id: 1,
              }),
            })
            const data = await response.json()
            return BigInt(data.result).toString()
          },
        )
        return balance
      }

      // ERC20 token balance via multicall
      const balanceRaw = await batchedRead(
        chainId,
        tokenAddress,
        ERC20_ABI,
        'balanceOf',
        [userAddress],
      )

      // Return as string (integer format)
      return balanceRaw.toString()
    },
    onUpdate,
  )

  return result.data
}

/**
 * Get complete token data (symbol, decimals, balance) - optimized with SWR
 */
export async function getTokenData(
  tokenAddress,
  userAddress,
  chainId = CHAIN_IDS.MAINNET,
  onUpdate = null,
) {
  if (!tokenAddress) {
    return {
      symbol: 'UNKNOWN',
      decimals: 18,
      balance: '0',
      needsWallet: !userAddress,
    }
  }

  // Handle native ETH
  if (isNativeETH(tokenAddress)) {
    // Get the native currency symbol based on chainId
    const network = getNetworkByChainId(chainId)
    const symbol = network?.nativeCurrency?.symbol || 'ETH'
    
    if (!userAddress) {
      return {
        symbol,
        decimals: 18,
        balance: 'Please connect wallet first',
        needsWallet: true,
      }
    }

    const balance = await getTokenBalance(tokenAddress, userAddress, chainId, onUpdate)
    return {
      symbol,
      decimals: 18,
      balance,
      needsWallet: false,
    }
  }

  // If no user address, only fetch token info
  if (!userAddress) {
    const tokenInfo = await getTokenInfo(tokenAddress, chainId)
    return {
      ...tokenInfo,
      balance: 'Please connect wallet first',
      needsWallet: true,
    }
  }

  // Fetch both token info and balance optimally
  const [tokenInfo, balance] = await Promise.all([
    getTokenInfo(tokenAddress, chainId),
    getTokenBalance(tokenAddress, userAddress, chainId, onUpdate),
  ])

  return {
    ...tokenInfo,
    balance,
    needsWallet: false,
  }
}

/**
 * Batch fetch multiple tokens data - MOST EFFICIENT METHOD
 */
export async function fetchMultipleTokensData(
  tokenAddresses,
  userAddress,
  chainId = CHAIN_IDS.MAINNET,
) {
  if (!tokenAddresses || tokenAddresses.length === 0) {
    return []
  }

  // Separate native ETH from ERC20 tokens
  const ethTokens = tokenAddresses.filter((addr) => isNativeETH(addr))
  const erc20Tokens = tokenAddresses.filter((addr) => !isNativeETH(addr))

  try {
    // Use multicall for ERC20 tokens
    const erc20Results = erc20Tokens.length > 0
      ? await deduplicateRequest(
        'batchGetTokenData',
        { chainId, tokens: erc20Tokens, userAddress },
        () => batchGetTokenData(chainId, erc20Tokens, userAddress),
      )
      : []

    // Handle ETH separately
    const ethResults = await Promise.all(
      ethTokens.map(async (address) => {
        const data = await getTokenData(address, userAddress, chainId)
        return {
          address,
          ...data,
        }
      }),
    )

    // Combine results
    const allResults = [...ethResults, ...erc20Results]

    // Cache individual token data
    await Promise.all(
      allResults.map(async (token) => {
        if (token.symbol && token.decimals) {
          await setInCache(
            STORE_NAMES.TOKEN_INFO,
            {
              tokenAddress: token.address.toLowerCase(),
              chainId,
            },
            { symbol: token.symbol, decimals: token.decimals },
            chainId,
          )
        }

        if (token.balance && userAddress) {
          await setInCache(
            STORE_NAMES.BALANCES,
            {
              tokenAddress: token.address.toLowerCase(),
              userAddress: userAddress.toLowerCase(),
              chainId,
            },
            token.balance,
            chainId,
          )
        }
      }),
    )

    return allResults
  } catch (error) {
    console.error('Error fetching multiple tokens data:', error)
    return tokenAddresses.map((address) => ({
      address,
      symbol: 'UNKNOWN',
      decimals: 18,
      balance: '0',
      needsWallet: false,
    }))
  }
}

/**
 * Optimized batch token info fetch (no balances)
 */
export async function fetchMultipleTokensInfo(tokenAddresses, chainId = CHAIN_IDS.MAINNET) {
  if (!tokenAddresses || tokenAddresses.length === 0) {
    return []
  }

  const erc20Tokens = tokenAddresses.filter((addr) => !isNativeETH(addr))

  try {
    const results = await deduplicateRequest(
      'batchGetTokenInfo',
      { chainId, tokens: erc20Tokens },
      () => batchGetTokenInfo(chainId, erc20Tokens),
    )

    // Cache results
    await Promise.all(
      results.map(async (token) => {
        await setInCache(
          STORE_NAMES.TOKEN_INFO,
          {
            tokenAddress: token.address.toLowerCase(),
            chainId,
          },
          { symbol: token.symbol, decimals: token.decimals },
          chainId,
        )
      }),
    )

    return results
  } catch (error) {
    console.error('Error fetching multiple tokens info:', error)
    return []
  }
}

/**
 * Optimized batch balance fetch
 * Returns balances as integer strings (raw wei/smallest unit)
 */
export async function fetchMultipleBalances(
  tokenAddresses,
  userAddress,
  chainId = CHAIN_IDS.MAINNET,
) {
  if (!tokenAddresses || tokenAddresses.length === 0 || !userAddress) {
    return []
  }

  const erc20Tokens = tokenAddresses.filter((addr) => !isNativeETH(addr))

  try {
    const results = await deduplicateRequest(
      'batchGetBalances',
      { chainId, tokens: erc20Tokens, userAddress },
      () => batchGetBalances(chainId, erc20Tokens, userAddress),
    )

    // Cache results as integer strings
    await Promise.all(
      results.map(async (item) => {
        // Store balance as integer string
        const balanceString = item.balance.toString()

        await setInCache(
          STORE_NAMES.BALANCES,
          {
            tokenAddress: item.tokenAddress.toLowerCase(),
            userAddress: userAddress.toLowerCase(),
            chainId,
          },
          balanceString,
          chainId,
        )
      }),
    )

    return results
  } catch (error) {
    console.error('Error fetching multiple balances:', error)
    return []
  }
}

/**
 * Preload token data for positions (predictive loading)
 */
export async function preloadPositionTokens(positions, chainId = CHAIN_IDS.MAINNET) {
  const tokenAddresses = new Set()

  positions.forEach((position) => {
    if (position.liquidityProviderAsset) {
      tokenAddresses.add(position.liquidityProviderAsset)
    }
    if (position.liquiditySupplierAsset) {
      tokenAddresses.add(position.liquiditySupplierAsset)
    }
  })

  const uniqueAddresses = Array.from(tokenAddresses)
  await preloadTokenData(chainId, uniqueAddresses)
}

/**
 * Invalidate balance cache for a user (force refresh)
 */
export async function invalidateUserBalances(userAddress, chainId = null) {
  if (chainId) {
    await invalidateChainCache(chainId)
  } else {
    // Clear all balance cache for this user across all chains
    const chainIds = Object.values(CHAIN_IDS)
    await Promise.all(
      chainIds.map((id) => invalidateChainCache(id)),
    )
  }
}

/**
 * Invalidate specific token cache
 */
export async function invalidateTokenCache(tokenAddress, chainId = CHAIN_IDS.MAINNET) {
  await invalidateCache(STORE_NAMES.TOKEN_INFO, {
    tokenAddress: tokenAddress.toLowerCase(),
    chainId,
  })
}

/**
 * Create a public client wrapper (for backward compatibility)
 */
export function createViemPublicClient(chainId = CHAIN_IDS.MAINNET) {
  // This is kept for backward compatibility but not recommended
  // Use the optimized functions above instead
  console.warn('createViemPublicClient is deprecated. Use optimized token functions instead.')
  return null
}

/**
 * Legacy function wrapper for backward compatibility
 */
export async function fetchTokenData(tokenAddress, userAddress, publicClient, chainId = 1) {
  console.warn('fetchTokenData is deprecated. Use getTokenData instead.')
  return getTokenData(tokenAddress, userAddress, chainId)
}

/**
 * Clear all caches (use sparingly)
 */
export async function clearAllTokenCaches() {
  const { clearAllCache } = await import('../services/cacheService')
  await clearAllCache()
}
