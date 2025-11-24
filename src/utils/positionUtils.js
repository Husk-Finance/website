import { processTags } from '../constants/tags'

/**
 * Utility functions for position data processing and formatting.
 * Provides common operations for DEX and DeFi positions.
 */

import { getNetworkByChainId } from '../constants/networks'

// EIP-7528: ETH native asset address convention
const ETH_NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

/**
 * Check if the address is the native token address (EIP-7528)
 * @param {string} address - Token address
 * @returns {boolean} True if it's the native token address
 */
function isNativeAddress(address) {
  return address && address.toLowerCase() === ETH_NATIVE_ADDRESS.toLowerCase()
}

/**
 * Get the native token symbol for a given chainId
 * @param {number} chainId - The chain ID
 * @returns {string} Native token symbol (e.g., "ETH", "MNT", "HYPE")
 */
export function getNativeTokenSymbol(chainId) {
  const network = getNetworkByChainId(chainId)
  return network?.nativeCurrency?.symbol || 'ETH'
}

/**
 * Formats a number string to compact notation (K, M, B)
 * @param {string|number} value - Number value as string or number
 * @returns {string} Formatted value (e.g., "1.23K", "4.56M", "7.89B")
 */
export function formatCompactNumber(value) {
  const num = typeof value === 'string' ? parseInt(value, 10) : value

  if (Number.isNaN(num)) return '0'

  const absNum = Math.abs(num)

  if (absNum >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`
  }
  if (absNum >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`
  }
  if (absNum >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`
  }

  return num.toFixed(2)
}

/**
 * Formats a percentage string to 2 decimal places with % symbol
 * @param {string|number} value - Percentage value as string or number (e.g., "4325" for 43.25%)
 * @returns {string} Formatted percentage (e.g., "43.25%")
 */
export function formatPercent(value) {
  const num = typeof value === 'string' ? parseInt(value, 10) : value

  if (Number.isNaN(num)) return '0.00%'

  return `${(num / 100).toFixed(2)}%`
}

/**
 * Formats a dollar amount with compact notation and $ prefix
 * @param {string|number} value - Dollar amount as string or number
 * @returns {string} Formatted dollar amount (e.g., "$1.23K", "$4.56M")
 */
export function formatDollar(value) {
  const formatted = formatCompactNumber(value)
  return `$${formatted}`
}

/**
 * Formats a token amount from smallest unit to human-readable format
 * @param {string|number} value - Token amount in smallest unit (e.g., wei for 18 decimals, microunits for 6 decimals)
 * @param {number} decimals - Number of decimals for the token (e.g., 18 for ETH, 6 for USDC)
 * @param {string} symbol - Token symbol (e.g., "ETH", "USDC")
 * @returns {string} Formatted token amount (e.g., "16.5 ETH", "4,000 USDC")
 */
export function formatTokenAmount(value, decimals, symbol) {
  const num = typeof value === 'string' ? BigInt(value) : BigInt(value)
  const divisor = BigInt(10 ** decimals)

  // Convert to number for formatting
  const amount = Number(num) / Number(divisor)

  // Format based on size
  let formatted
  if (amount >= 1000) {
    formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  } else if (amount >= 1) {
    formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  } else {
    // For small amounts, show more precision
    formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })
  }

  return `${formatted} ${symbol}`
}

/**
 * Gets the number of decimals for a token based on its address
 * @param {string} tokenAddress - Token contract address
 * @returns {number} Number of decimals (default: 18)
 */
export function getTokenDecimals(tokenAddress) {
  // Common token decimals mapping
  const decimalsMap = {
    // USDC addresses (6 decimals)
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': 6, // USDC on Ethereum
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': 6, // USDC on Base
    '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA': 6, // USDbC on Base
    '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9': 6, // USDC on Mantle

    // USDT (6 decimals)
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': 6, // USDT on Ethereum

    // WBTC (8 decimals)
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': 8, // WBTC on Ethereum
    '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf': 8, // cbBTC on Base
  }

  return decimalsMap[tokenAddress] || 18 // Default to 18 decimals for ETH and most ERC20s
}

/**
 * Sorts positions by creation time (newest first)
 * @param {Array} positions - Array of position objects
 * @returns {Array} Sorted array of positions
 */
export function sortByCreationTime(positions) {
  return [...positions].sort((a, b) => {
    const dateA = a.createdAt ? a.createdAt : 0
    const dateB = b.createdAt ? b.createdAt : 0
    return dateB - dateA // Descending order (newest first)
  })
}

/**
 * Automatically adds "NEW" tag to DeFi positions created within the last 7 days
 * @param {Array} positions - Array of DeFi position objects
 * @returns {Array} Positions with updated tags
 */
export function autoTagNewPositions(positions) {
  const now = Date.now()
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
  const sevenDaysAgo = now - sevenDaysInMs

  return positions.map((position) => {
    const createdAt = position.createdAt || 0
    const isNew = createdAt >= sevenDaysAgo

    // Clone the position to avoid mutation
    const updatedPosition = { ...position }

    // Initialize tags if not present
    if (!updatedPosition.tags) {
      updatedPosition.tags = []
    } else {
      // Clone tags array to avoid mutation
      updatedPosition.tags = [...updatedPosition.tags]
    }

    // Check if NEW tag already exists
    const hasNewTag = updatedPosition.tags.some((tag) => tag.label === 'NEW')

    if (isNew && !hasNewTag) {
      // Add NEW tag at the beginning
      updatedPosition.tags.unshift({
        label: 'NEW',
        bg: '#a6c724',
        color: '#000000',
      })
    } else if (!isNew && hasNewTag) {
      // Remove NEW tag if position is older than 7 days
      updatedPosition.tags = updatedPosition.tags.filter((tag) => tag.label !== 'NEW')
    }

    return updatedPosition
  })
}

/**
 * Processes DeFi positions: adds NEW tags and processes tag names into full tag objects
 * @param {Array} positions - Array of DeFi position objects
 * @returns {Array} Processed positions with full tag objects
 */
export function processDeFiPositions(positions) {
  const tagged = autoTagNewPositions(positions)
  return sortByCreationTime(tagged).map(position => ({
    ...position,
    tags: processTags(position.tags)
  }))
}

/**
 * Processes DEX positions: sorts by creation time (DEX positions don't have tags)
 * @param {Array} positions - Array of DEX position objects
 * @returns {Array} Processed positions
 */
export function processDexPositions(positions) {
  return sortByCreationTime(positions)
}

/**
 * Processes Business positions: sorts by creation time and processes tag names into full tag objects
 * @param {Array} positions - Array of Business position objects
 * @returns {Array} Processed positions with full tag objects
 */
export function processBusinessPositions(positions) {
  return sortByCreationTime(positions).map(position => ({
    ...position,
    tags: processTags(position.tags)
  }))
}

/**
 * Extracts the quoted token symbol from a position (what you're supplying/providing)
 * For DEX positions: extracts from pair name (e.g., "WBTC/USDC" → "USDC")
 * For DeFi positions: uses the quotedAsset property (e.g., "USDC", "WETH", "DAI")
 * @param {Object} position - Position object
 * @returns {string} Token symbol
 */
export function getQuotedTokenSymbol(position) {
  // For DeFi positions with quotedAsset property
  if (position.quotedAsset) {
    return position.quotedAsset
  }

  // For DEX positions, extract from pair name (always return quote asset)
  if (position.pair) {
    const tokens = position.pair.split('/')
    if (tokens.length === 2) {
      // Return the second token (quote asset, e.g., "USDC" in "WBTC/USDC")
      return tokens[1].trim()
    }
  }

  // Default fallback
  return 'USDC'
}
