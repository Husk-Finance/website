/**
 * Mock business position data for testing and development.
 * This data simulates RWA (Real World Asset) business positions for the Husk Finance platform.
 * Contains positions from multiple networks - filter by chainId as needed.
 */

export const mockBusinessPositions = [
  // Ethereum Mainnet Positions (chainId: 1)
  {
    id: 1,
    chainId: 1, // Ethereum Mainnet
    businessName: 'Finding Nemo Live Action',
    businessImage: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=800&q=80',
    network: 'Onyx',
    createdAt: 1729416600000, // Oct 20, 2025 09:30:00
    huskAPY: '43.25%',
    tvlMcap: '$10.62k / $10M',
    revenue30d: '$850',
    distribution: 'Biquarter',
    nextDistribution: '21/12/2025',
    supplyAPY: '25%',
    participationRisk: '0.13',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000001', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 2,
    chainId: 1,
    businessName: 'Fishing Ship Rentals',
    businessImage: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
    network: 'Onyx',
    createdAt: 1729330200000, // Oct 19, 2025 09:30:00
    huskAPY: '38.50%',
    tvlMcap: '$25.3k / $15M',
    revenue30d: '$1,250',
    distribution: 'Quarter',
    nextDistribution: '01/01/2026',
    supplyAPY: '22%',
    participationRisk: '0.18',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000002', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  
  // Base Mainnet Positions (chainId: 8453)
  {
    id: 3,
    chainId: 8453, // Base
    businessName: 'Maritime Cargo Fleet',
    businessImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    network: 'Onyx',
    createdAt: 1729243800000, // Oct 18, 2025 09:30:00
    huskAPY: '52.75%',
    tvlMcap: '$45.8k / $22M',
    revenue30d: '$2,100',
    distribution: 'Biquarter',
    nextDistribution: '15/01/2026',
    supplyAPY: '30%',
    participationRisk: '0.22',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000003', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  },
  {
    id: 4,
    chainId: 8453,
    businessName: 'Commercial Fishing Fleet',
    businessImage: 'https://images.unsplash.com/photo-1589182337358-2cb63099350c?w=800&q=80',
    network: 'Onyx',
    createdAt: 1729157400000, // Oct 17, 2025 09:30:00
    huskAPY: '46.20%',
    tvlMcap: '$18.5k / $12M',
    revenue30d: '$980',
    distribution: 'Quarter',
    nextDistribution: '10/01/2026',
    supplyAPY: '28%',
    participationRisk: '0.15',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000004', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
  },
  
  // HyperEVM Mainnet Positions (chainId: 999)
  {
    id: 5,
    chainId: 999, // HyperEVM
    businessName: 'Naval Defense Systems',
    businessImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    network: 'Onyx',
    createdAt: 1729071000000, // Oct 16, 2025 09:30:00
    huskAPY: '55.80%',
    tvlMcap: '$32.4k / $18M',
    revenue30d: '$1,650',
    distribution: 'Biquarter',
    nextDistribution: '25/12/2025',
    supplyAPY: '32%',
    participationRisk: '0.20',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000005', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0xb88339CB7199b77E23DB6E890353E22632Ba630f', // USDC (placeholder for HyperEVM)
  },
  {
    id: 6,
    chainId: 999,
    businessName: 'Ocean Research Vessels',
    businessImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    network: 'Onyx',
    createdAt: 1728984600000, // Oct 15, 2025 09:30:00
    huskAPY: '41.30%',
    tvlMcap: '$15.2k / $9M',
    revenue30d: '$720',
    distribution: 'Quarter',
    nextDistribution: '05/01/2026',
    supplyAPY: '24%',
    participationRisk: '0.16',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000006', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0xb88339CB7199b77E23DB6E890353E22632Ba630f', // USDC (placeholder for HyperEVM)
  },
  
  {
    id: 7,
    chainId: 999,
    businessName: 'Cruise Line Operations',
    businessImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    network: 'Onyx',
    createdAt: 1728898200000, // Oct 14, 2025 09:30:00
    huskAPY: '39.90%',
    tvlMcap: '$28.7k / $16M',
    revenue30d: '$1,350',
    distribution: 'Biquarter',
    nextDistribution: '30/12/2025',
    supplyAPY: '23%',
    participationRisk: '0.17',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000007', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0xb88339CB7199b77E23DB6E890353E22632Ba630f', // USDC (placeholder for HyperEVM)
  },
  {
    id: 8,
    chainId: 999,
    businessName: 'Port Infrastructure',
    businessImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    network: 'Onyx',
    createdAt: 1728811800000, // Oct 13, 2025 09:30:00
    huskAPY: '48.60%',
    tvlMcap: '$52.1k / $25M',
    revenue30d: '$2,450',
    distribution: 'Quarter',
    nextDistribution: '15/01/2026',
    supplyAPY: '29%',
    participationRisk: '0.19',
    liquidityProviderAsset: '0x0000000000000000000000000000000000000008', // RWA Business Token (placeholder)
    liquiditySupplierAsset: '0xb88339CB7199b77E23DB6E890353E22632Ba630f', // USDC (placeholder for HyperEVM)
  },
]
