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
    description: "This Uniswap V3 position is meticulously designed to provide liquidity for the Tether Gold (XAUT) and USDC pair. By capitalizing on the stability of gold pegged assets against the US dollar, this pool offers a unique hedging strategy for investors looking to balance their portfolios against crypto market volatility.\n\nThe position operates within the 0.3% fee tier, making it an attractive option for liquidity providers seeking steady returns from trading fees. The concentrated liquidity feature of Uniswap V3 allows for capital efficiency, meaning your assets are put to work within a specific price range where most trading occurs, maximizing potential fee generation.\n\nFurthermore, providing liquidity to gold-pegged assets on-chain facilitates decentralized access to commodities. This not only supports the broader DeFi ecosystem by integrating real-world asset exposure but also allows providers to earn yield on an asset class that typically sits idle in traditional finance portfolios.",
    createdAt: 1728993600000, // Oct 15, 2025 12:00:00
    huskAPY: '8065',
    tvl: '15770',
    revenue24h: '850',
    supplyAPY: '2500',
    supplyShare: '5000', // 50%
    provideShare: '4500', // 45%
    liquidationLow: '4000000000', // 4,000 USDC (6 decimals)
    liquidationHigh: '5000000000', // 5,000 USDC (6 decimals)
    provideRisk: '24',
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
    description: "Engage with the flagship cryptocurrency market through this WBTC/USDC position on Uniswap V4. As Bitcoin remains the dominant asset in the digital currency space, this pool captures substantial trading volume, translating into consistent fee revenue for liquidity providers.\n\nUniswap V4 introduces architectural improvements such as the 'singleton' contract design, which significantly lowers gas costs for multi-hop swaps and liquidity management. This efficiency gain enhances the profitability of your position by reducing the overhead associated with rebalancing and compounding your earnings.\n\nThis position is ideal for those who wish to maintain exposure to Bitcoin's potential upside while earning a yield on their holdings. By pairing WBTC with a stablecoin like USDC, you also mitigate some of the volatility risk compared to holding pure crypto assets, creating a balanced approach to DeFi yield farming.",
    createdAt: 1729330200000, // Oct 19, 2025 09:30:00
    huskAPY: '5665',
    tvl: '2400000',
    revenue24h: '12300',
    supplyAPY: '1344',
    supplyShare: '6000', // 60%
    provideShare: '3500', // 35%
    liquidationLow: '95000000000', // 95,000 USDC (6 decimals)
    liquidationHigh: '105000000000', // 105,000 USDC (6 decimals)
    provideRisk: '67',
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
    description: "Participate in one of the deepest and most liquid markets in DeFi with this Ethereum (ETH) and USDC pool on Uniswap V3. This pair is a cornerstone of the decentralized finance economy, facilitating massive trade volumes daily as users move between the network's native asset and stablecoins.\n\nconfigured with a 0.05% fee tier, this position is optimized for high-volume, low-slippage trading. While the fee percentage per trade is lower, the sheer frequency of transactions ensures that liquidity providers can generate significant cumulative returns over time, acting effectively as market makers for the ecosystem.\n\nFor investors, this acts as a 'blue-chip' DeFi strategy. It provides a reliable mechanism to earn yield on ETH holdings. The concentrated liquidity model further amplifies these returns by allowing you to focus your capital within tighter price ranges, effectively supercharging the efficiency of your deposit compared to traditional AMMs.",
    createdAt: 1729433700000, // Oct 20, 2025 14:15:00
    huskAPY: '9234',
    tvl: '1200000',
    revenue24h: '8500',
    supplyAPY: '2870',
    supplyShare: '4500', // 45%
    provideShare: '5000', // 50%
    liquidationLow: '3200000000', // 3,200 USDC (6 decimals)
    liquidationHigh: '3800000000', // 3,800 USDC (6 decimals)
    provideRisk: '31',
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
    description: "This stablecoin-focused position pairs USDT and DAI on Uniswap V3, offering one of the lowest risk profiles available in yield farming. Since both assets are pegged to the US Dollar, the risk of impermanent loss is virtually eliminated, making this an excellent choice for capital preservation.\n\nWith an ultra-low 0.01% fee tier, this pool is designed for arbitrageurs and high-frequency traders moving large sums between stablecoins. The minimal spread encourages massive volume, which compensates for the lower fee rate, resulting in steady and predictable APY for liquidity providers.\n\nThis strategy is particularly well-suited for 'cash' portions of a portfolio that would otherwise sit idle. By deploying stablecoins here, you maintain dollar-denominated value while earning a yield that typically outperforms traditional bank interest rates, all while retaining full custody and liquidity of your funds.",
    createdAt: 1725962400000, // Sep 10, 2025 11:00:00
    huskAPY: '1245',
    tvl: '856000',
    revenue24h: '1200',
    supplyAPY: '820',
    supplyShare: '7000', // 70%
    provideShare: '2500', // 25%
    liquidationLow: '998000000000000000000', // 0.998 DAI (18 decimals)
    liquidationHigh: '1002000000000000000000', // 1.002 DAI (18 decimals)
    provideRisk: '5',
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
    description: "Combine the two titans of the cryptocurrency world with this WBTC/ETH liquidity position on Uniswap V4. This pair allows for direct trading between Bitcoin and Ethereum wrappers, facilitating portfolio rebalancing for whales and institutions without routing through stablecoins.\n\nBy participating in this pool, you are effectively taking a long position on the broader crypto market rather than a specific asset. Impermanent loss here is often mitigated by the high correlation between BTC and ETH prices, which tend to move in tandem during broader market cycles.\n\nLeveraging Uniswap V4's advanced hooks and singleton architecture, this position offers optimized gas efficiency. It allows you to earn fees in both BTC and ETH terms, essentially growing your stack of the two most valuable assets in the ecosystem simultaneously.",
    createdAt: 1728721200000, // Oct 12, 2025 08:20:00
    huskAPY: '6489',
    tvl: '3100000',
    revenue24h: '18600',
    supplyAPY: '1930',
    supplyShare: '5500', // 55%
    provideShare: '4000', // 40%
    liquidationLow: '16500000000000000000', // 16.5 ETH (18 decimals)
    liquidationHigh: '18200000000000000000', // 18.2 ETH (18 decimals)
    provideRisk: '42',
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
    description: "Support the scaling of Ethereum by providing liquidity to the MATIC/USDC pair. As the native token of the Polygon network, MATIC plays a crucial role in the L2 ecosystem, and this pool on Ethereum mainnet serves as a critical bridge for assets moving between layers.\n\nThis position captures the volatility and trading volume associated with Layer 2 adoption and scaling narrative. With a 0.3% fee structure, it is well-positioned to benefit from substantial price swings and speculative trading activity surrounding the Polygon project.\n\nFor the provider, this offers a way to earn yield on a high-beta asset. While the risk of impermanent loss is higher compared to stablecoin pairs due to volatility, the potential for higher fee generation during market upswings makes it an attractive component of a diversified, risk-on yield farming strategy.",
    createdAt: 1729169100000, // Oct 17, 2025 13:45:00
    huskAPY: '7321',
    tvl: '487000',
    revenue24h: '3800',
    supplyAPY: '2210',
    supplyShare: '4000', // 40%
    provideShare: '5500', // 55%
    liquidationLow: '850000', // 0.85 USDC (6 decimals)
    liquidationHigh: '950000', // 0.95 USDC (6 decimals)
    provideRisk: '38',
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
    description: "This position connects the leading decentralized oracle network, Chainlink (LINK), with Ethereum (ETH). Oracles are the backbone of DeFi, and this pool ensures deep liquidity for protocols that need to acquire LINK for services or speculation.\n\nBy pairing two foundational DeFi assets, this pool appeals to investors who believe in the long-term infrastructure play. The correlation between LINK and ETH often leads to more favorable impermanent loss dynamics than pairing with stablecoins, as both assets tend to appreciate together during bull markets.\n\nThe 0.3% fee tier generates consistent revenue from the activity of developers, nodes, and traders. It acts as a dual-investment vehicle, allowing you to compound your stack of 'blue-chip' infrastructure tokens through trading fees rather than just relying on price appreciation.",
    createdAt: 1727280000000, // Sep 25, 2025 16:00:00
    huskAPY: '5892',
    tvl: '672000',
    revenue24h: '5100',
    supplyAPY: '1780',
    supplyShare: '6500', // 65%
    provideShare: '3000', // 30%
    liquidationLow: '4800000000000000', // 0.0048 ETH (18 decimals)
    liquidationHigh: '5200000000000000', // 0.0052 ETH (18 decimals)
    provideRisk: '29',
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
    description: "Participate in the governance of the Uniswap protocol itself by providing liquidity to the UNI/USDC pair. This V4 position supports the market for the Uniswap governance token, essential for DAO voting and protocol stewardship.\n\nLiquidity providers in this pool facilitate the entry and exit of governance participants. Given the spirited nature of DeFi governance and proposals, this token often sees spikes in volume around key votes, translating into surge pricing for liquidity providers via fees.\n\nHolding a UNI position also signals alignment with the protocol's long-term success. By earning fees in USDC, you can realize realized gains while maintaining your principal exposure, or use the yield to further accumulate governance power in the ecosystem.",
    createdAt: 1729247400000, // Oct 18, 2025 10:30:00
    huskAPY: '4567',
    tvl: '923000',
    revenue24h: '6700',
    supplyAPY: '1450',
    supplyShare: '5000', // 50%
    provideShare: '4500', // 45%
    liquidationLow: '8500000', // 8.5 USDC (6 decimals)
    liquidationHigh: '9500000', // 9.5 USDC (6 decimals)
    provideRisk: '33',
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
    description: "Anchor your portfolio on the Base network with this ETH/USDbC position. As the primary gateway for liquidity on Coinbase's L2, this pair sees consistent, high-volume flow from users bridging assets and executing trades within the ecosystem.\n\nThe 0.05% fee tier is tailored for this highly liquid market, ensuring that you capture a steady stream of fees from the constant arbitrage and utility-driven transactions. It serves as an excellent foundation for any L2-focused yield farming strategy, providing exposure to Ethereum's price action with the added benefit of reduced transaction costs typical of optimistic rollups.\n\nProviding liquidity here supports the overall health of the Base DeFi landscape. By ensuring deep liquidity for the network's native gas token against a stable settlement asset, you are directly facilitating the smooth operation of dApps and protocols across the chain.",
    createdAt: 1729433700000, // Oct 20, 2025 14:15:00
    huskAPY: '8834',
    tvl: '890000',
    revenue24h: '6200',
    supplyAPY: '2650',
    supplyShare: '5500', // 55%
    provideShare: '4000', // 40%
    liquidationLow: '3100000000', // 3,100 USDbC (6 decimals)
    liquidationHigh: '3900000000', // 3,900 USDbC (6 decimals)
    provideRisk: '28',
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
    description: "Tap into the first official Coinbase-wrapped Bitcoin liquidity pool on Base. This cbBTC/USDbC position bridges the gap between the world's largest cryptocurrency and the burgeoning L2 DeFi ecosystem, offering a seamless way to deploy Bitcoin capital on-chain.\n\nWith the backing of a major institutional custodian, cbBTC offers a layer of trust that appeals to both retail and institutional swappers. This positions the pool to capture significant volume from users looking to utilize their Bitcoin holdings in DeFi protocols without managing complex bridges or wrapping procedures manually.\n\nThe 0.3% fee tier provides a robust yield generation mechanism. Given Bitcoin's volatility relative to stablecoins, this fee level compensates providers for the inventory risk while offering an attractive APR, making it a compelling option for Bitcoin bulls looking to earn on their stash.",
    createdAt: 1729330200000, // Oct 19, 2025 09:30:00
    huskAPY: '5245',
    tvl: '1800000',
    revenue24h: '9800',
    supplyAPY: '1284',
    supplyShare: '6000', // 60%
    provideShare: '3500', // 35%
    liquidationLow: '94000000000', // 94,000 USDbC (6 decimals)
    liquidationHigh: '106000000000', // 106,000 USDbC (6 decimals)
    provideRisk: '64',
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
    description: "This stable-swap position between native USDC and bridged USDbC on Base is designed for ultra-low risk yield generation. As the ecosystem transitions between different standards of the stablecoin, this pool facilitates the necessary 1:1 swaps for users and protocols upgrading their asset integration.\n\nOperating at the 0.01% fee tier, this pool relies on extremely high turnover to generate returns. It is essentially a 'savings account' on the blockchain, where the primary risk is smart contract risk rather than market price movement, as the peg between these two assets is tightly maintained by arbitrageurs and redemption mechanics.\n\nFor liquidity providers, this represents the safest tier of DeFi engagement. It is an ideal parking spot for stablecoin capital that is waiting to be deployed elsewhere or for conservative investors seeking consistent, low-volatility returns in the crypto space.",
    createdAt: 1729169100000, // Oct 17, 2025 13:45:00
    huskAPY: '845',
    tvl: '2100000',
    revenue24h: '1500',
    supplyAPY: '320',
    supplyShare: '8000', // 80%
    provideShare: '1500', // 15%
    liquidationLow: '998000', // 0.998 USDbC (6 decimals)
    liquidationHigh: '1002000', // 1.002 USDbC (6 decimals)
    provideRisk: '3',
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
    description: "Embrace the 'degen' culture of Base with this high-octane DEGEN/ETH liquidity position. This pool supports the trading of one of the network's most popular community/meme tokens, capturing the immense volatility and speculative fervor that drives on-chain activity.\n\nWith a significantly higher fee tier of 1%, this position is structured to compensate liquidity providers for the extreme volatility and risk of impermanent loss associated with meme coins. During market rallies, the APR in such pools can skyrocket, offering outsized returns for those willing to stomach the price swings.\n\nContributing to this pool places you at the center of the Base social graph. Since DEGEN is often used for tipping and community grants, maintaining liquidity is vital for the ecosystem's vibrant social layer, making this more than just a financial position—it's a bet on the network's community growth.",
    createdAt: 1728993600000, // Oct 15, 2025 12:00:00
    huskAPY: '12567',
    tvl: '340000',
    revenue24h: '4200',
    supplyAPY: '4250',
    supplyShare: '4500', // 45%
    provideShare: '5000', // 50%
    liquidationLow: '85000000000000', // 0.000085 ETH (18 decimals)
    liquidationHigh: '95000000000000', // 0.000095 ETH (18 decimals)
    provideRisk: '72',
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
    description: "Provide essential liquidity for the Mantle ecosystem with this MNT/USDC position on Agni DEX. As the native gas and governance token of the network, MNT is required for every transaction, ensuring a baseline demand for this pair regardless of broader market conditions.\n\nThis position capitalizes on the growth of the Mantle L2, offering exposure to the network's success. The pairing with USDC creates a balanced volatility profile, allowing you to remain long on the ecosystem's infrastructure while hedging portion of the value in stablecoins.\n\nAgni DEX's concentrated liquidity features enable efficient capital deployment. By supporting this core pair, you are helping to bootstrap the liquidity required for new protocols and users onboarding to Mantle, earning trading fees from the expansion of this modular blockchain environment.",
    createdAt: 1761460809873,
    huskAPY: '3520',
    tvl: '40000',
    revenue24h: '200',
    supplyAPY: '530',
    supplyShare: '5000', // 50%
    provideShare: '4500', // 45%
    liquidationLow: '850000', // 0.85 USDC (6 decimals)
    liquidationHigh: '1300000', // 1.3 USDC (6 decimals)
    provideRisk: '72',
    liquidityProviderAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // MNT
    liquiditySupplierAsset: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9', // USDC
  },
]
