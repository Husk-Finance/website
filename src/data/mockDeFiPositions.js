/**
 * Mock DeFi position data for development.
 */

export const mockDeFiPositions = [
  {
    id: 101,
    protocol: 'Aethir Gaming Pool',
    createdAt: '2025-10-18T10:00:00Z', // 3 days ago - should get NEW tag
    tags: [
      { label: 'RWA', bg: '#2485c7', color: '#000000' },
      { label: 'AutoC', bg: '#0d9aa2', color: '#ffffff' },
    ],
    huskAPY: '43.25%',
    distribution: 'Thursday',
    nextDistribution: 'in 7 days 3 hours',
    supplyAPY: '25%',
    tvl: '$10.62k',
    revenue24h: '$850',
    liquidationLow: '0.99 USDC',
    borrowRisk: '0.13',
  },
  {
    id: 102,
    protocol: 'Compound USDC Market',
    createdAt: '2025-10-10T14:30:00Z', // 11 days ago - no NEW tag
    tags: [
      { label: 'AutoC', bg: '#0d9aa2', color: '#ffffff' },
    ],
    huskAPY: '12.45%',
    distribution: 'Weekly',
    nextDistribution: 'in 3 days',
    supplyAPY: '2.84%',
    tvl: '$860k',
    revenue24h: '$310',
    liquidationLow: '0.997 USDC',
    borrowRisk: '0.08',
  },
  {
    id: 103,
    protocol: 'Maker DAI Savings',
    createdAt: '2025-09-15T08:00:00Z', // 36 days ago - no NEW tag
    tags: [],
  huskAPY: '8.1%',
  distribution: 'Monthly',
  nextDistribution: 'in 14 days',
    supplyAPY: '1.20%',
    tvl: '$2.3M',
    revenue24h: '$940',
    liquidationLow: '0.995 USDC',
    borrowRisk: '0.04',
  },
  {
    id: 104,
    protocol: 'Euler ETH Borrow',
    createdAt: '2025-10-20T16:45:00Z', // 1 day ago - should get NEW tag
    tags: [],
    huskAPY: '7.2%',
    distribution: 'Daily',
    nextDistribution: 'in 12 hours',
    supplyAPY: '4.50%',
    tvl: '$420k',
    revenue24h: '$120',
    liquidationLow: '2,800 USDC',
    borrowRisk: '0.35',
  },
]
