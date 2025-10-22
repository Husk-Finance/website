/**
 * Mock DeFi position data for development.
 * Contains positions from multiple networks - filter by chainId as needed.
 */

export const mockDeFiPositions = [
  // Ethereum Mainnet DeFi Positions (chainId: 1)
  {
    id: 101,
    chainId: 1, // Ethereum Mainnet
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
    participationRisk: '0.13',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000001', // Mock AETHIR address
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    quotedAsset: 'USDC', // Token symbol for button labels
  },
  {
    id: 102,
    chainId: 1,
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
    participationRisk: '0.08',
    liquidityProviderAsset: '0xc00e94Cb662C3520282E6f5717214004A7f26888', // COMP
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    quotedAsset: 'USDC', // Token symbol for button labels
  },
  {
    id: 103,
    chainId: 1,
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
    participationRisk: '0.04',
    liquidityProviderAsset: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // MKR
    liquiditySupplierAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    quotedAsset: 'DAI', // Token symbol for button labels
  },
  {
    id: 104,
    chainId: 1,
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
    participationRisk: '0.35',
    liquidityProviderAsset: '0xd9Fcd98c322942075A5C3860693e9f4f03AAE07b', // EUL
    liquiditySupplierAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    quotedAsset: 'WETH', // Token symbol for button labels
  },

  // Base Network DeFi Positions (chainId: 8453)
  {
    id: 201,
    chainId: 8453, // Base
    protocol: 'Aave Base USDC',
    createdAt: 1729433700000, // Oct 20, 2025 - should get NEW tag
    tags: [
      { label: 'AutoC', bg: '#0d9aa2', color: '#ffffff' },
    ],
    huskAPY: '15.85%',
    distribution: 'Weekly',
    nextDistribution: 'in 5 days',
    supplyAPY: '4.2%',
    tvl: '$1.2M',
    revenue24h: '$520',
    liquidationLow: '0.997 USDbC',
    participationRisk: '0.09',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000002', // Mock AAVE on Base
    liquiditySupplierAsset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    quotedAsset: 'USDC', // Token symbol for button labels
  },
  {
    id: 202,
    chainId: 8453,
    protocol: 'Moonwell ETH Market',
    createdAt: 1729247400000, // Oct 18, 2025 - should get NEW tag
    tags: [
      { label: 'AutoC', bg: '#0d9aa2', color: '#ffffff' },
    ],
    huskAPY: '18.45%',
    distribution: 'Daily',
    nextDistribution: 'in 18 hours',
    supplyAPY: '5.8%',
    tvl: '$780k',
    revenue24h: '$340',
    liquidationLow: '3,100 USDbC',
    participationRisk: '0.32',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000003', // Mock WELL on Base
    liquiditySupplierAsset: '0x4200000000000000000000000000000000000006', // WETH on Base
    quotedAsset: 'WETH', // Token symbol for button labels
  },
  {
    id: 203,
    chainId: 8453,
    protocol: 'Seamless cbBTC Pool',
    createdAt: 1728993600000, // Oct 15, 2025 - should get NEW tag
    tags: [
      { label: 'BTC', bg: '#f7931a', color: '#ffffff' },
    ],
    huskAPY: '22.67%',
    distribution: 'Weekly',
    nextDistribution: 'in 4 days',
    supplyAPY: '6.5%',
    tvl: '$540k',
    revenue24h: '$280',
    liquidationLow: '94,000 USDbC',
    participationRisk: '0.42',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000004', // Mock SEAM on Base
    liquiditySupplierAsset: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', // cbBTC on Base
    quotedAsset: 'cbBTC', // Token symbol for button labels
  },
  {
    id: 204,
    chainId: 8453,
    protocol: 'Aerodrome Stable Pool',
    createdAt: 1727280000000, // Sep 25, 2025 16:00:00 - no NEW tag
    tags: [
      { label: 'Stable', bg: '#10b981', color: '#ffffff' },
    ],
    huskAPY: '9.2%',
    distribution: 'Weekly',
    nextDistribution: 'in 2 days',
    supplyAPY: '3.1%',
    tvl: '$2.1M',
    revenue24h: '$180',
    liquidationLow: '0.998 USDC',
    participationRisk: '0.05',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000005', // Mock AERO on Base
    liquiditySupplierAsset: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC on Base
    quotedAsset: 'USDbC', // Token symbol for button labels
  },
];
