/**
 * Application constants for Husk Finance.
 * Centralized location for magic numbers, strings, and configuration values.
 */

// Re-export network constants
export * from './networks'

// Navigation Links
export const NAV_LINKS = [
  { label: 'Docs', href: '#docs' },
  { label: 'Explore', href: '#explore' },
  { label: 'Create Husk', href: '#create' },
]

// Hero Section Content
export const HERO_CONTENT = {
  title: 'Welcome to decentralized positive-sum game of crypto.',
  subtitle: 'Your journey of non-extractive profitable business starts here.',
}

// Section Titles
export const SECTION_TITLES = {
  businessPositionMarket: 'Business Position Market',
  dexPositionMarket: 'DEX Position Market',
  defiPositionMarket: 'DeFi Position Market',
}

// Button Labels
export const BUTTON_LABELS = {
  connect: 'Connect',
  supply: 'Supply USDC',
  borrow: 'Borrow USDC',
}

// Grid Labels
export const GRID_LABELS = {
  tvl: 'TVL',
  revenue24h: '24h rev.',
  liquidationLow: 'Liqd. Low Price',
  liquidationHigh: 'Liqd. High Price',
  supplyAPY: 'Supply APY',
  borrowRisk: 'Borrow Risk',
  participationRisk: 'Participation Risk',
  huskAPY: 'Husk APY',
}

// Layout Constants
export const LAYOUT = {
  maxWidth: '1920px',
  logoSize: 40,
}

// Responsive Breakpoints (matching variables.scss)
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1200,
}

// Grid Configuration
export const POSITION_CARD = {
  minWidth: 300,
  gridHeight: 202,
}
