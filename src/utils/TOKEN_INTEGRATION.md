# Token Integration with Multicall3

This implementation uses Multicall3 to efficiently fetch token data (symbol, decimals, balance) from the blockchain.

## How It Works

### 1. Token Addresses
All positions now use actual ERC20 token addresses instead of symbols:
- `liquidityProviderAsset`: Token address for the provider asset
- `liquiditySupplierAsset`: Token address for the supplier asset

### 2. Multicall3
Uses the Multicall3 contract (deployed at `0xcA11bde05977b3631167028862bE2a173976CA11` on most chains) to batch multiple contract calls into a single RPC request:
- Fetches `symbol()` from the token contract
- Fetches `decimals()` from the token contract
- Fetches `balanceOf(userAddress)` from the token contract

### 3. Data Flow
1. Modal opens → Determines which token address to use (based on supply/borrow action)
2. Fetches provider (wallet or public RPC)
3. Fetches user address (from wallet or mock)
4. Calls `fetchTokenData()` with Multicall3
5. Displays token symbol and user balance
6. Updates input calculations based on real balance

## Files

### Contracts & ABIs
- `/src/constants/contracts.js` - Multicall3 and ERC20 ABIs, token addresses

### Utilities
- `/src/utils/tokenUtils.js` - Token fetching functions using Multicall3

### Components
- `/src/components/common/PositionOfferingModal.jsx` - Updated to fetch token data

### Data
- `/src/data/mockPositions.js` - DEX positions with token addresses
- `/src/data/mockDeFiPositions.js` - DeFi positions with token addresses

## Usage

The modal automatically:
1. Fetches token data when opened
2. Shows loading state while fetching
3. Displays the fetched symbol and balance
4. Handles errors gracefully with fallback values

## Token Addresses (Ethereum Mainnet)

- USDC: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- WBTC: `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`
- WETH: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- DAI: `0x6B175474E89094C44Da98b954EedeAC495271d0F`
- USDT: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- And more...

## Future Improvements

- Add support for multiple chains
- Cache token data to reduce RPC calls
- Add wallet connection UI
- Support for native ETH (not just WETH)
