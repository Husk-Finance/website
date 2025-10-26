/**
 * Token Display Utilities
 * Convert raw integer balances to human-readable format
 * USE THESE FUNCTIONS IN YOUR COMPONENTS FOR DISPLAY
 */

import { formatUnits } from 'viem'

/**
 * Format token balance from integer string to human-readable decimal
 * @param {string} balance - Raw balance as integer string (wei/smallest unit)
 * @param {number} decimals - Token decimals
 * @param {number} maxDecimals - Max decimal places to show (default: 6)
 * @returns {string} Formatted balance
 * 
 * @example
 * formatTokenBalance('1500000000000000000', 18) // "1.5"
 * formatTokenBalance('1500000', 6) // "1.5"
 */
export function formatTokenBalance(balance, decimals, maxDecimals = 6) {
  if (!balance || balance === '0') return '0'
  
  try {
    const formatted = formatUnits(BigInt(balance), decimals)
    const num = parseFloat(formatted)
    
    // Format with appropriate decimals
    if (num === 0) return '0'
    if (num < 0.000001) return '< 0.000001'
    
    return num.toLocaleString(undefined, {
      maximumFractionDigits: maxDecimals,
      minimumFractionDigits: 0,
    })
  } catch (error) {
    console.error('Error formatting balance:', error)
    return '0'
  }
}

/**
 * Format token balance with symbol
 * @param {string} balance - Raw balance as integer string
 * @param {number} decimals - Token decimals
 * @param {string} symbol - Token symbol
 * @param {number} maxDecimals - Max decimal places to show
 * @returns {string} Formatted balance with symbol
 * 
 * @example
 * formatTokenBalanceWithSymbol('1500000000000000000', 18, 'ETH') // "1.5 ETH"
 */
export function formatTokenBalanceWithSymbol(balance, decimals, symbol, maxDecimals = 6) {
  const formatted = formatTokenBalance(balance, decimals, maxDecimals)
  return `${formatted} ${symbol}`
}

/**
 * Format compact balance (with K, M, B suffixes)
 * @param {string} balance - Raw balance as integer string
 * @param {number} decimals - Token decimals
 * @returns {string} Compact formatted balance
 * 
 * @example
 * formatCompactBalance('1500000000000000000000', 18) // "1.5K"
 * formatCompactBalance('1500000000000000000000000', 18) // "1.5M"
 */
export function formatCompactBalance(balance, decimals) {
  if (!balance || balance === '0') return '0'
  
  try {
    const formatted = formatUnits(BigInt(balance), decimals)
    const num = parseFloat(formatted)
    
    if (num === 0) return '0'
    if (num < 0.000001) return '< 0.000001'
    
    // Use compact notation for large numbers
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`
    }
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`
    }
    
    return num.toLocaleString(undefined, {
      maximumFractionDigits: 6,
      minimumFractionDigits: 0,
    })
  } catch (error) {
    console.error('Error formatting compact balance:', error)
    return '0'
  }
}

/**
 * Check if balance is sufficient for amount
 * @param {string} balance - Raw balance as integer string
 * @param {string} amount - Amount in human-readable format
 * @param {number} decimals - Token decimals
 * @returns {boolean} True if balance is sufficient
 */
export function hasSufficientBalance(balance, amount, decimals) {
  try {
    const balanceBigInt = BigInt(balance)
    const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 10 ** decimals))
    return balanceBigInt >= amountBigInt
  } catch (error) {
    return false
  }
}

/**
 * Convert human-readable amount to raw integer string
 * @param {string} amount - Amount in human-readable format
 * @param {number} decimals - Token decimals
 * @returns {string} Raw amount as integer string
 * 
 * @example
 * parseTokenAmount('1.5', 18) // "1500000000000000000"
 * parseTokenAmount('1.5', 6) // "1500000"
 */
export function parseTokenAmount(amount, decimals) {
  if (!amount || amount === '0') return '0'
  
  try {
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) return '0'
    
    // Convert to smallest unit
    const multiplier = 10 ** decimals
    const rawAmount = BigInt(Math.floor(num * multiplier))
    
    return rawAmount.toString()
  } catch (error) {
    console.error('Error parsing token amount:', error)
    return '0'
  }
}

/**
 * Get balance percentage used
 * @param {string} balance - Raw balance as integer string
 * @param {string} amount - Raw amount as integer string
 * @returns {number} Percentage (0-100)
 */
export function getBalancePercentage(balance, amount) {
  try {
    const balanceBigInt = BigInt(balance)
    const amountBigInt = BigInt(amount)
    
    if (balanceBigInt === 0n) return 0
    
    const percentage = Number((amountBigInt * 100n) / balanceBigInt)
    return Math.min(100, Math.max(0, percentage))
  } catch (error) {
    return 0
  }
}
