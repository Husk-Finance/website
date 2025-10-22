/**
 * Mock DeFi position data for development.
 */

export const mockDeFiPositions = [
  {
    id: 101,
    protocol: 'Aethir Gaming Pool',
    createdAt: 1761022597000, //should get NEW tag
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
    liquidityProviderAsset: '0x0000000000000000000000000000000000000001', // Mock AETHIR address
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    quotedAsset: 'USDC', // Token symbol for button labels
  },
  {
    id: 102,
    protocol: 'Compound USDC Market',
    createdAt: 1728567000000, // Oct 10, 2025 14:30:00 - 11 days ago - no NEW tag
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
    liquidityProviderAsset: '0xc00e94Cb662C3520282E6f5717214004A7f26888', // COMP
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    quotedAsset: 'USDC', // Token symbol for button labels
  },
  {
    id: 103,
    protocol: 'Maker DAI Savings',
    createdAt: 1726387200000, // Sep 15, 2025 08:00:00 - 36 days ago - no NEW tag
    tags: [],
  huskAPY: '8.1%',
  distribution: 'Monthly',
  nextDistribution: 'in 14 days',
    supplyAPY: '1.20%',
    tvl: '$2.3M',
    revenue24h: '$940',
    liquidationLow: '0.995 USDC',
    borrowRisk: '0.04',
    liquidityProviderAsset: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // MKR
    liquiditySupplierAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    quotedAsset: 'DAI', // Token symbol for button labels
  },
  {
    id: 104,
    protocol: 'Euler ETH Borrow',
    createdAt: 1761022590000, // should get NEW tag
    tags: [],
    huskAPY: '7.2%',
    distribution: 'Daily',
    nextDistribution: 'in 12 hours',
    supplyAPY: '4.50%',
    tvl: '$420k',
    revenue24h: '$120',
    liquidationLow: '2,800 USDC',
    borrowRisk: '0.35',
    liquidityProviderAsset: '0xd9Fcd98c322942075A5C3860693e9f4f03AAE07b', // EUL
    liquiditySupplierAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    quotedAsset: 'WETH', // Token symbol for button labels
  },
]
