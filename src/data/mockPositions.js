/**
 * Mock position data for testing and development.
 * This data simulates DEX position information for the Husk Finance platform.
 * Contains positions from multiple networks - filter by chainId as needed.
 */

export const mockPositions = [
  // Ethereum Mainnet Positions (chainId: 1)
  {
    id: 1,
    chainId: 1, // Ethereum Mainnet
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'XAUT/USDC',
    version: 'v3',
    fee: '30',
    createdAt: 1728993600000, // Oct 15, 2025 12:00:00
    huskAPY: '8065',
    tvl: '15770',
    revenue24h: '850',
    supplyAPY: '2500',
    liquidationLow: '4000000000', // 4,000 USDC (6 decimals)
    liquidationHigh: '5000000000', // 5,000 USDC (6 decimals)
    borrowRisk: '24',
    liquidityProviderAsset: '0x68749665FF8D2d112Fa859AA293F07A622782F38', // XAUT
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 2,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'WBTC/USDC',
    version: 'v4',
    fee: '30',
    createdAt: 1729330200000, // Oct 19, 2025 09:30:00
    huskAPY: '5665',
    tvl: '2400000',
    revenue24h: '12300',
    supplyAPY: '1344',
    liquidationLow: '95000000000', // 95,000 USDC (6 decimals)
    liquidationHigh: '105000000000', // 105,000 USDC (6 decimals)
    borrowRisk: '67',
    liquidityProviderAsset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 3,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'ETH/USDC',
    version: 'v3',
    fee: '5',
    createdAt: 1729433700000, // Oct 20, 2025 14:15:00
    huskAPY: '9234',
    tvl: '1200000',
    revenue24h: '8500',
    supplyAPY: '2870',
    liquidationLow: '3200000000', // 3,200 USDC (6 decimals)
    liquidationHigh: '3800000000', // 3,800 USDC (6 decimals)
    borrowRisk: '31',
    // Note: Using WETH. For native ETH, use EIP-7528 address: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
    liquidityProviderAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 4,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'USDT/DAI',
    version: 'v3',
    fee: '1',
    createdAt: 1725962400000, // Sep 10, 2025 11:00:00
    huskAPY: '1245',
    tvl: '856000',
    revenue24h: '1200',
    supplyAPY: '820',
    liquidationLow: '998000000000000000000', // 0.998 DAI (18 decimals)
    liquidationHigh: '1002000000000000000000', // 1.002 DAI (18 decimals)
    borrowRisk: '5',
    liquidityProviderAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    liquiditySupplierAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  },
  {
    id: 5,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'WBTC/ETH',
    version: 'v4',
    fee: '30',
    createdAt: 1728721200000, // Oct 12, 2025 08:20:00
    huskAPY: '6489',
    tvl: '3100000',
    revenue24h: '18600',
    supplyAPY: '1930',
    liquidationLow: '16500000000000000000', // 16.5 ETH (18 decimals)
    liquidationHigh: '18200000000000000000', // 18.2 ETH (18 decimals)
    borrowRisk: '42',
    liquidityProviderAsset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    liquiditySupplierAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  },
  {
    id: 6,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'MATIC/USDC',
    version: 'v3',
    fee: '30',
    createdAt: 1729169100000, // Oct 17, 2025 13:45:00
    huskAPY: '7321',
    tvl: '487000',
    revenue24h: '3800',
    supplyAPY: '2210',
    liquidationLow: '850000', // 0.85 USDC (6 decimals)
    liquidationHigh: '950000', // 0.95 USDC (6 decimals)
    borrowRisk: '38',
    liquidityProviderAsset: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 7,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'LINK/ETH',
    version: 'v3',
    fee: '30',
    createdAt: 1727280000000, // Sep 25, 2025 16:00:00
    huskAPY: '5892',
    tvl: '672000',
    revenue24h: '5100',
    supplyAPY: '1780',
    liquidationLow: '4800000000000000', // 0.0048 ETH (18 decimals)
    liquidationHigh: '5200000000000000', // 0.0052 ETH (18 decimals)
    borrowRisk: '29',
    liquidityProviderAsset: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
    liquiditySupplierAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  },
  {
    id: 8,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'UNI/USDC',
    version: 'v4',
    fee: '30',
    createdAt: 1729247400000, // Oct 18, 2025 10:30:00
    huskAPY: '4567',
    tvl: '923000',
    revenue24h: '6700',
    supplyAPY: '1450',
    liquidationLow: '8500000', // 8.5 USDC (6 decimals)
    liquidationHigh: '9500000', // 9.5 USDC (6 decimals)
    borrowRisk: '33',
    liquidityProviderAsset: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // UNI
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  
  // Base Network Positions (chainId: 8453)
  {
    id: 101,
    chainId: 8453, // Base
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'ETH/USDbC',
    version: 'v3',
    fee: '5',
    createdAt: 1729433700000, // Oct 20, 2025 14:15:00
    huskAPY: '8834',
    tvl: '890000',
    revenue24h: '6200',
    supplyAPY: '2650',
    liquidationLow: '3100000000', // 3,100 USDbC (6 decimals)
    liquidationHigh: '3900000000', // 3,900 USDbC (6 decimals)
    borrowRisk: '28',
    liquidityProviderAsset: '0x4200000000000000000000000000000000000006', // WETH on Base
    liquiditySupplierAsset: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC on Base
  },
  {
    id: 102,
    chainId: 8453,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'cbBTC/USDbC',
    version: 'v3',
    fee: '30',
    createdAt: 1729330200000, // Oct 19, 2025 09:30:00
    huskAPY: '5245',
    tvl: '1800000',
    revenue24h: '9800',
    supplyAPY: '1284',
    liquidationLow: '94000000000', // 94,000 USDbC (6 decimals)
    liquidationHigh: '106000000000', // 106,000 USDbC (6 decimals)
    borrowRisk: '64',
    liquidityProviderAsset: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', // cbBTC on Base
    liquiditySupplierAsset: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC on Base
  },
  {
    id: 103,
    chainId: 8453,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'USDC/USDbC',
    version: 'v3',
    fee: '1',
    createdAt: 1729169100000, // Oct 17, 2025 13:45:00
    huskAPY: '845',
    tvl: '2100000',
    revenue24h: '1500',
    supplyAPY: '320',
    liquidationLow: '998000', // 0.998 USDbC (6 decimals)
    liquidationHigh: '1002000', // 1.002 USDbC (6 decimals)
    borrowRisk: '3',
    liquidityProviderAsset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    liquiditySupplierAsset: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC on Base
  },
  {
    id: 104,
    chainId: 8453,
    protocol: 'aerodrome', // Protocol identifier for logo display (placeholder for future implementation)
    pair: 'DEGEN/ETH',
    version: 'v3',
    fee: '100',
    createdAt: 1728993600000, // Oct 15, 2025 12:00:00
    huskAPY: '12567',
    tvl: '340000',
    revenue24h: '4200',
    supplyAPY: '4250',
    liquidationLow: '85000000000000', // 0.000085 ETH (18 decimals)
    liquidationHigh: '95000000000000', // 0.000095 ETH (18 decimals)
    borrowRisk: '72',
    liquidityProviderAsset: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', // DEGEN on Base
    liquiditySupplierAsset: '0x4200000000000000000000000000000000000006', // WETH on Base
  },

  // Mantle
  {
    id: 401,
    chainId: 5000,
    protocol: 'agni',
    pair: 'MNT/USDC',
    version: 'v3',
    fee: '5',
    createdAt: 1761460809873,
    huskAPY: '3520',
    tvl: '40000',
    revenue24h: '200',
    supplyAPY: '530',
    liquidationLow: '850000', // 0.85 USDC (6 decimals)
    liquidationHigh: '1300000', // 1.3 USDC (6 decimals)
    borrowRisk: '72',
    liquidityProviderAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // MNT
    liquiditySupplierAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9', // USDC
  },
];
