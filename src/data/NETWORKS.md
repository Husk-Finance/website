# Multi-Network Support

This directory contains network-specific data and utilities for supporting multiple blockchain networks in the Husk Finance platform.

## Supported Networks

### Ethereum Mainnet (Chain ID: 1)
- **Native Currency**: ETH
- **RPC**: https://eth.meowrpc.com
- **Explorer**: https://etherscan.io
- **DEX Positions**: 8 positions (XAUT/USDC, WBTC/USDC, ETH/USDC, etc.)
- **DeFi Positions**: 4 positions (Aethir, Compound, Maker, Euler)

### Base (Chain ID: 8453)
- **Native Currency**: ETH
- **RPC**: https://mainnet.base.org
- **Explorer**: https://basescan.org
- **DEX Positions**: 4 positions (ETH/USDbC, cbBTC/USDbC, USDC/USDbC, DEGEN/ETH)
- **DeFi Positions**: 4 positions (Aave, Moonwell, Seamless, Aerodrome)

## File Structure

```
src/
├── constants/
│   └── networks.js           # Network configurations and chain IDs
├── data/
│   ├── mockPositions.js       # DEX positions by network
│   └── mockDeFiPositions.js   # DeFi positions by network
└── utils/
    └── networkUtils.js        # Network filtering utilities
```

## Usage

### Import Network Constants

```javascript
import { NETWORKS, CHAIN_IDS, getNetworkByChainId } from '../constants/networks'

// Get network config
const mainnet = NETWORKS.MAINNET
const base = NETWORKS.BASE

// Check chain ID
if (chainId === CHAIN_IDS.MAINNET) {
  // Handle mainnet
}
```

### Get Positions by Network

```javascript
import { getDexPositionsByChain, getDeFiPositionsByChain, getAllPositionsByChain } from '../utils/networkUtils'

// Get DEX positions for Base
const baseDexPositions = getDexPositionsByChain(CHAIN_IDS.BASE)

// Get DeFi positions for Mainnet
const mainnetDeFiPositions = getDeFiPositionsByChain(CHAIN_IDS.MAINNET)

// Get all positions for a network
const { dex, defi } = getAllPositionsByChain(CHAIN_IDS.BASE)
```

### Component Example

```javascript
import { useState } from 'react'
import { CHAIN_IDS } from '../constants/networks'
import { getDexPositionsByChain } from '../utils/networkUtils'

function PositionsList() {
  const [selectedChain, setSelectedChain] = useState(CHAIN_IDS.MAINNET)
  const positions = getDexPositionsByChain(selectedChain)

  return (
    <div>
      <select onChange={(e) => setSelectedChain(Number(e.target.value))}>
        <option value={CHAIN_IDS.MAINNET}>Ethereum</option>
        <option value={CHAIN_IDS.BASE}>Base</option>
      </select>
      
      {positions.map(position => (
        <PositionCard key={position.id} position={position} />
      ))}
    </div>
  )
}
```

## Data Structure

Each position now includes a `chainId` field:

```javascript
{
  id: 1,
  chainId: 1, // Ethereum Mainnet
  pair: 'WBTC/USDC',
  // ... other fields
}
```

## Token Addresses by Network

### Ethereum Mainnet
- **USDC**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- **WETH**: `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- **WBTC**: `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`
- **DAI**: `0x6B175474E89094C44Da98b954EedeAC495271d0F`

### Base Network
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **USDbC**: `0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA` (Bridged USDC)
- **WETH**: `0x4200000000000000000000000000000000000006`
- **cbBTC**: `0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf` (Coinbase Wrapped BTC)

## Adding a New Network

1. **Add network config** in `constants/networks.js`:
```javascript
export const NETWORKS = {
  // ... existing networks
  NEW_NETWORK: {
    id: 12345,
    name: 'New Network',
    // ... other config
  },
}
```

2. **Create position data** in `data/mockPositions.js` and `data/mockDeFiPositions.js`:
```javascript
export const newNetworkDexPositions = [
  {
    id: 301,
    chainId: 12345,
    // ... position data
  },
]
```

3. **Update network utils** in `utils/networkUtils.js`:
```javascript
export function getDexPositionsByChain(chainId) {
  switch (chainId) {
    // ... existing cases
    case CHAIN_IDS.NEW_NETWORK:
      return newNetworkDexPositions
  }
}
```

## Migration Guide

If you have existing code using the old single-network structure:

**Before:**
```javascript
import { mockPositions } from './data/mockPositions'
```

**After:**
```javascript
import { mainnetDexPositions, baseDexPositions } from './data/mockPositions'
// Or use the utility:
import { getDexPositionsByChain } from './utils/networkUtils'
import { CHAIN_IDS } from './constants/networks'

const positions = getDexPositionsByChain(CHAIN_IDS.MAINNET)
```

**Legacy Support:**
For backwards compatibility, the old export still exists and defaults to mainnet:
```javascript
import { mockPositions } from './data/mockPositions' // Same as mainnetDexPositions
```
