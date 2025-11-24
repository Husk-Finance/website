/**
 * Centralized tag configuration for all position types.
 * Each tag has a unique name, background color, text color, and description.
 * 
 * Usage:
 * - Raw data should only reference the tag name (case-sensitive)
 * - The tag name will be used to look up styling and description
 */

export const TAG_DEFINITIONS = {
  // Network/Platform Tags
  'NEW': {
    bg: '#a6c724',
    color: '#000000',
    description: 'Newly added position'
  },

  'Onyx': {
    bg: '#1e442a',
    color: '#fdb85b',
    description: 'Onyx Network - Specialized blockchain for RWA tokenization'
  },

  'MNT': {
    bg: 'linear-gradient(135deg, #FF69B4 0%, #32CD32 100%)',
    color: '#ffffff',
    description: 'Mantle bridged asset - Assets from Ethereum that lives on Mantle Network with lower gas fees'
  },
  
  // Asset Type Tags
  'RWA': {
    bg: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    color: '#ffffff',
    description: 'Real World Assets - Tokenized physical or business assets'
  },
  
  'BTC': {
    bg: '#f7931a',
    color: '#ffffff',
    description: 'Bitcoin-related assets or wrapped BTC positions'
  },
  
  'LST': {
    bg: '#8b5cf6',
    color: '#ffffff',
    description: 'Liquid Staking Token - Earn staking rewards while maintaining liquidity'
  },
  
  'Stable': {
    bg: '#10b981',
    color: '#ffffff',
    description: 'Stablecoin positions - Low volatility, pegged to fiat currencies'
  },
  
  // Strategy Tags
  'AutoC': {
    bg: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    color: '#ffffff',
    description: 'Auto-Compounding - Automatically reinvests rewards for compound growth'
  },
  
  'CLM': {
    bg: '#3b82f6',
    color: '#ffffff',
    description: 'Concentrated Liquidity Manager - Optimizes LP positions in narrow ranges'
  },
  
  // Protocol Tags
  'UniV3': {
    bg: '#ff7777',
    color: '#000000',
    description: 'Uniswap V3 - Concentrated liquidity AMM protocol'
  },
}

/**
 * Get tag configuration by name
 * @param {string} tagName - The case-sensitive tag name
 * @returns {Object} Tag configuration object with bg, color, and description
 */
export function getTagConfig(tagName) {
  const config = TAG_DEFINITIONS[tagName]
  if (!config) {
    console.warn(`Tag "${tagName}" not found in TAG_DEFINITIONS. Using default styling.`)
    return {
      bg: '#666666',
      color: '#ffffff',
      description: tagName
    }
  }
  return config
}

/**
 * Transform raw tag names into full tag objects
 * @param {string[]} tagNames - Array of tag names
 * @returns {Array} Array of tag objects with label, bg, color, and description
 */
export function processTags(tagNames) {
  if (!tagNames || !Array.isArray(tagNames)) {
    return []
  }
  
  return tagNames.map(tagName => {
    const config = getTagConfig(tagName)
    return {
      label: tagName,
      ...config
    }
  })
}
