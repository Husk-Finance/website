# Token Integration with viem

This implementation uses viem to efficiently fetch token data (symbol, decimals, balance) from the blockchain, with built-in caching for improved performance.

## How It Works

### 1. Token Addresses
All positions use actual token addresses instead of symbols:
- `liquidityProviderAsset`: Token address for the provider asset (collateral for borrowing)
- `liquiditySupplierAsset`: Token address for the supplier asset (what you deposit/borrow)

### 2. Native ETH Support (EIP-7528)
The implementation follows [EIP-7528](https://ethereum-magicians.org/t/eip-7528-eth-native-asset-address-convention/15989) for native ETH:
- **ETH Native Address**: `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
- Automatically detects and handles native ETH differently than ERC20 tokens
- Uses `getBalance()` for ETH instead of ERC20 `balanceOf()`
- Returns symbol as "ETH" and decimals as 18

### 3. Session Caching
Implements a two-tier caching system using `sessionStorage`:
- **Token Info Cache** (24 hours): Caches symbol and decimals
- **Balance Cache** (5 minutes): Caches user balances
- Reduces blockchain calls and improves load times

### 4. Data Flow
1. Modal opens → Determines which token address to use (based on supply/borrow action)
2. Checks cache first for existing data
3. If not cached or expired, fetches from blockchain using viem
4. For native ETH: Uses `getBalance()` directly
5. For ERC20: Fetches `symbol()`, `decimals()`, and `balanceOf()`
6. Caches the results for future use
7. Displays token symbol and user balance
8. Updates input calculations based on real balance

## Files

### Contracts & ABIs
- `/src/constants/contracts.js` - ERC20 ABI and token addresses

### Utilities
- `/src/utils/tokenUtils.js` - Token fetching functions using viem with caching support

### Components
- `/src/components/common/PositionOfferingModal.jsx` - Updated to fetch both collateral and action token data

### Data
- `/src/data/mockPositions.js` - DEX positions with token addresses
- `/src/data/mockDeFiPositions.js` - DeFi positions with token addresses

## Usage

The modal automatically:
1. Fetches token data when opened (checks cache first)
2. Shows loading state while fetching
3. Displays the fetched symbol and balance
4. Handles errors gracefully with fallback values
5. Caches results for improved performance

### Native ETH Example

```javascript
// Use EIP-7528 address for native ETH
const position = {
  pair: 'ETH/USDC',
  liquidityProviderAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native ETH
  liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
}
```

### WETH Example

```javascript
// Use WETH contract address for wrapped ETH
const position = {
  pair: 'ETH/USDC',
  liquidityProviderAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  liquiditySupplierAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
}
```

## Token Addresses (Ethereum Mainnet)

### Special Addresses
- **Native ETH (EIP-7528)**: `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`

### Common Tokens

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
