/**
 * Network configuration and chain IDs
 * Defines supported networks for the Husk Finance platform
 *
 * NOTE: This file re-exports from main.jsx for backward compatibility.
 * All network configurations are centralized in main.jsx
 */

export {
  NETWORKS,
  CHAIN_IDS,
  DEFAULT_CHAIN_ID,
  getNetworkByChainId,
  isSupportedChain,
} from '../main'
