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
    fee: '0.3%',
    createdAt: 1728993600000, // Oct 15, 2025 12:00:00
    huskAPY: '80.65%',
    tvl: '$15.77k',
    revenue24h: '$850',
    supplyAPY: '25%',
    liquidationLow: '4,000 USDC',
    liquidationHigh: '5,000 USDC',
    borrowRisk: '0.24',
    liquidityProviderAsset: '0x68749665FF8D2d112Fa859AA293F07A622782F38', // XAUT
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 2,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'WBTC/USDC',
    version: 'v4',
    fee: '0.3%',
    createdAt: 1729330200000, // Oct 19, 2025 09:30:00
    huskAPY: '56.65%',
    tvl: '$2.4M',
    revenue24h: '$12.3k',
    supplyAPY: '13.44%',
    liquidationLow: '95,000 USDC',
    liquidationHigh: '105,000 USDC',
    borrowRisk: '0.67',
    liquidityProviderAsset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 3,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'ETH/USDC',
    version: 'v3',
    fee: '0.05%',
    createdAt: 1729433700000, // Oct 20, 2025 14:15:00
    huskAPY: '92.34%',
    tvl: '$1.2M',
    revenue24h: '$8.5k',
    supplyAPY: '28.7%',
    liquidationLow: '3,200 USDC',
    liquidationHigh: '3,800 USDC',
    borrowRisk: '0.31',
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
    fee: '0.01%',
    createdAt: 1725962400000, // Sep 10, 2025 11:00:00
    huskAPY: '12.45%',
    tvl: '$856k',
    revenue24h: '$1.2k',
    supplyAPY: '8.2%',
    liquidationLow: '0.998 USDC',
    liquidationHigh: '1.002 USDC',
    borrowRisk: '0.05',
    liquidityProviderAsset: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    liquiditySupplierAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  },
  {
    id: 5,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'WBTC/ETH',
    version: 'v4',
    fee: '0.3%',
    createdAt: 1728721200000, // Oct 12, 2025 08:20:00
    huskAPY: '64.89%',
    tvl: '$3.1M',
    revenue24h: '$18.6k',
    supplyAPY: '19.3%',
    liquidationLow: '16.5 ETH',
    liquidationHigh: '18.2 ETH',
    borrowRisk: '0.42',
    liquidityProviderAsset: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    liquiditySupplierAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  },
  {
    id: 6,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'MATIC/USDC',
    version: 'v3',
    fee: '0.3%',
    createdAt: 1729169100000, // Oct 17, 2025 13:45:00
    huskAPY: '73.21%',
    tvl: '$487k',
    revenue24h: '$3.8k',
    supplyAPY: '22.1%',
    liquidationLow: '0.85 USDC',
    liquidationHigh: '0.95 USDC',
    borrowRisk: '0.38',
    liquidityProviderAsset: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', // MATIC
    liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  },
  {
    id: 7,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'LINK/ETH',
    version: 'v3',
    fee: '0.3%',
    createdAt: 1727280000000, // Sep 25, 2025 16:00:00
    huskAPY: '58.92%',
    tvl: '$672k',
    revenue24h: '$5.1k',
    supplyAPY: '17.8%',
    liquidationLow: '0.0048 ETH',
    liquidationHigh: '0.0052 ETH',
    borrowRisk: '0.29',
    liquidityProviderAsset: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
    liquiditySupplierAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  },
  {
    id: 8,
    chainId: 1,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'UNI/USDC',
    version: 'v4',
    fee: '0.3%',
    createdAt: 1729247400000, // Oct 18, 2025 10:30:00
    huskAPY: '45.67%',
    tvl: '$923k',
    revenue24h: '$6.7k',
    supplyAPY: '14.5%',
    liquidationLow: '8.5 USDC',
    liquidationHigh: '9.5 USDC',
    borrowRisk: '0.33',
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
    fee: '0.05%',
    createdAt: 1729433700000, // Oct 20, 2025 14:15:00
    huskAPY: '88.34%',
    tvl: '$890k',
    revenue24h: '$6.2k',
    supplyAPY: '26.5%',
    liquidationLow: '3,100 USDbC',
    liquidationHigh: '3,900 USDbC',
    borrowRisk: '0.28',
    liquidityProviderAsset: '0x4200000000000000000000000000000000000006', // WETH on Base
    liquiditySupplierAsset: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC on Base
  },
  {
    id: 102,
    chainId: 8453,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'cbBTC/USDbC',
    version: 'v3',
    fee: '0.3%',
    createdAt: 1729330200000, // Oct 19, 2025 09:30:00
    huskAPY: '52.45%',
    tvl: '$1.8M',
    revenue24h: '$9.8k',
    supplyAPY: '12.84%',
    liquidationLow: '94,000 USDbC',
    liquidationHigh: '106,000 USDbC',
    borrowRisk: '0.64',
    liquidityProviderAsset: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf', // cbBTC on Base
    liquiditySupplierAsset: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC on Base
  },
  {
    id: 103,
    chainId: 8453,
    protocol: 'uniswap', // Protocol identifier for logo display
    pair: 'USDC/USDbC',
    version: 'v3',
    fee: '0.01%',
    createdAt: 1729169100000, // Oct 17, 2025 13:45:00
    huskAPY: '8.45%',
    tvl: '$2.1M',
    revenue24h: '$1.5k',
    supplyAPY: '3.2%',
    liquidationLow: '0.998 USDbC',
    liquidationHigh: '1.002 USDbC',
    borrowRisk: '0.03',
    liquidityProviderAsset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    liquiditySupplierAsset: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', // USDbC on Base
  },
  {
    id: 104,
    chainId: 8453,
    protocol: 'aerodrome', // Protocol identifier for logo display (placeholder for future implementation)
    pair: 'DEGEN/ETH',
    version: 'v3',
    fee: '1%',
    createdAt: 1728993600000, // Oct 15, 2025 12:00:00
    huskAPY: '125.67%',
    tvl: '$340k',
    revenue24h: '$4.2k',
    supplyAPY: '42.5%',
    liquidationLow: '0.000085 ETH',
    liquidationHigh: '0.000095 ETH',
    borrowRisk: '0.72',
    liquidityProviderAsset: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', // DEGEN on Base
    liquiditySupplierAsset: '0x4200000000000000000000000000000000000006', // WETH on Base
  },
];
