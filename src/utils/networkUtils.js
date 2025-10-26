/**
 * Network and position filtering utilities
 */

import { mockPositions } from '../data/mockPositions'
import { mockDeFiPositions } from '../data/mockDeFiPositions'
import { mockBusinessPositions } from '../data/mockBusinessPositions'
import { CHAIN_IDS } from '../constants/networks'

/**
 * Get DEX positions for a specific chain
 * @param {number} chainId - The chain ID (1 for Mainnet, 8453 for Base)
 * @returns {Array} DEX positions for the specified chain
 */
export function getDexPositionsByChain(chainId) {
  return mockPositions.filter((position) => position.chainId === chainId)
}

/**
 * Get all DEX positions from all chains
 * @returns {Array} All DEX positions
 */
export function getAllDexPositions() {
  return mockPositions
}

/**
 * Get DeFi positions for a specific chain
 * @param {number} chainId - The chain ID (1 for Mainnet, 8453 for Base)
 * @returns {Array} DeFi positions for the specified chain
 */
export function getDeFiPositionsByChain(chainId) {
  return mockDeFiPositions.filter((position) => position.chainId === chainId)
}

/**
 * Get all DeFi positions from all chains
 * @returns {Array} All DeFi positions
 */
export function getAllDeFiPositions() {
  return mockDeFiPositions
}

/**
 * Get Business positions for a specific chain
 * @param {number} chainId - The chain ID (1 for Mainnet, 8453 for Base)
 * @returns {Array} Business positions for the specified chain
 */
export function getBusinessPositionsByChain(chainId) {
  return mockBusinessPositions.filter((position) => position.chainId === chainId)
}

/**
 * Get all Business positions from all chains
 * @returns {Array} All Business positions
 */
export function getAllBusinessPositions() {
  return mockBusinessPositions
}

/**
 * Get all positions (DEX, DeFi, and Business) for a specific chain
 * @param {number} chainId - The chain ID
 * @returns {object} Object with dex, defi, and business position arrays
 */
export function getAllPositionsByChain(chainId) {
  return {
    dex: getDexPositionsByChain(chainId),
    defi: getDeFiPositionsByChain(chainId),
    business: getBusinessPositionsByChain(chainId),
  }
}

/**
 * Check if a specific chain is supported
 * @param {number} chainId - The chain ID to check
 * @returns {boolean} True if the chain is supported
 */
export function isSupportedChain(chainId) {
  return Object.values(CHAIN_IDS).includes(chainId)
}

/**
 * Get the default chain ID (Mainnet)
 * @returns {number} Default chain ID
 */
export function getDefaultChainId() {
  return CHAIN_IDS.MAINNET
}
