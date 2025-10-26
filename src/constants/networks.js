/**
 * Network configuration and chain IDs
 * Defines supported networks for the Husk Finance platform
 */

export const NETWORKS = {
  MAINNET: {
    id: 1,
    name: 'Ethereum',
    shortName: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://eth.meowrpc.com',
    blockExplorer: 'https://etherscan.io',
  },
  MANTLE: {
    id: 5000,
    name: 'Mantle',
    shortname: 'Mantle',
    nativeCurrency: {
      name: 'Mantle',
      symbol: 'MNT',
      decimals: 18,
    },
    rpcUrl: 'https://lb.drpc.live/mantle/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT',
    blockExplorer: 'https://mantlescan.xyz'
  },
  BASE: {
    id: 8453,
    name: 'Base',
    shortName: 'Base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
  },
  HYPEREVM: {
    id: 999,
    name: 'HyperEVM',
    shortName: 'HyperEVM',
    nativeCurrency: {
      name: 'Hype',
      symbol: 'HYPE',
      decimals: 18
    },
    rpcUrl: 'https://lb.drpc.live/hyperliquid/ApV7qFFPZUNojcZQujPHrTH9b6q7rvcR8LoqQrxF2MGT',
    blockExplorer: 'https://hyperevmscan.io'
  }
}

// Chain IDs for easy reference
export const CHAIN_IDS = {
  MAINNET: 1,
  MANTLE: 5000,
  BASE: 8453,
  HYPEREVM: 999
}

// Default network
export const DEFAULT_CHAIN_ID = CHAIN_IDS.MAINNET

/**
 * Get network configuration by chain ID
 * @param {number} chainId - The chain ID
 * @returns {object|null} Network configuration or null if not found
 */
export function getNetworkByChainId(chainId) {
  return Object.values(NETWORKS).find(network => network.id === chainId) || null
}

/**
 * Check if a chain ID is supported
 * @param {number} chainId - The chain ID to check
 * @returns {boolean} True if supported
 */
export function isSupportedChain(chainId) {
  return Object.values(CHAIN_IDS).includes(chainId)
}
