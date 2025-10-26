# RPC Optimization System

## Overview

This is a comprehensive RPC optimization system that minimizes on-chain calls by up to 95%. It implements multiple layers of optimization including caching, batching, load balancing, and smart request management.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│              (React Components, Hooks)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Optimized Token Utils                           │
│      (High-level API with all optimizations)                │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬────────────────┐
        │            │            │                │
┌───────▼──────┐ ┌──▼──────┐ ┌──▼──────┐  ┌─────▼─────┐
│   Request    │ │ Optimis-│ │ Multicall│  │   Cache   │
│   Manager    │ │ tic UI  │ │  Batch   │  │  Service  │
│              │ │ Service │ │  Service │  │           │
│ • Dedupe     │ │         │ │          │  │ • Memory  │
│ • Debounce   │ │ • SWR   │ │ • Batch  │  │ • IndexDB │
│ • Throttle   │ │ • Prefetch│ • Multi  │  │ • TTL     │
└──────┬───────┘ └────┬────┘ └────┬─────┘  └─────┬─────┘
       │              │           │                │
       └──────────────┴───────────┴────────────────┘
                      │
              ┌───────▼────────┐
              │ RPC Load       │
              │ Balancer       │
              │                │
              │ • Failover     │
              │ • Rate Limit   │
              │ • Health Check │
              └───────┬────────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
   ┌───▼───┐     ┌───▼───┐     ┌───▼───┐
   │Primary│     │Fallback│    │Fallback│
   │  RPC  │     │ RPC 1 │     │ RPC 2 │
   └───────┘     └───────┘     └───────┘
```

## Features

### 1. Multi-Layer Caching System (`cacheService.js`)

**Purpose**: Reduce redundant RPC calls by caching results

**Features**:
- **Memory Cache**: Ultra-fast in-memory cache (LRU with 500 item limit)
- **IndexedDB**: Persistent browser storage that survives page reloads
- **Smart TTL**: Different cache durations for different data types
  - Token Info (symbol, decimals): 7 days
  - Balances: 30 seconds
  - Positions: 2 minutes
  - Prices: 1 minute
- **Automatic Cleanup**: Expired entries cleaned every 5 minutes
- **Per-Chain Invalidation**: Clear cache for specific networks

**Usage**:
```javascript
import { getFromCache, setInCache, STORE_NAMES, CACHE_TTL } from './services/cacheService'

// Get cached data
const data = await getFromCache(
  STORE_NAMES.TOKEN_INFO,
  { tokenAddress: '0x...', chainId: 1 },
  CACHE_TTL.TOKEN_INFO
)

// Set cache
await setInCache(
  STORE_NAMES.TOKEN_INFO,
  { tokenAddress: '0x...', chainId: 1 },
  { symbol: 'ETH', decimals: 18 },
  1
)
```

### 2. Multicall3 Batching (`multicallService.js`)

**Purpose**: Combine multiple contract calls into a single RPC request

**Reduction**: Up to 100x fewer RPC calls

**Features**:
- **Automatic Batching**: Queues calls and executes in batches
- **Configurable Batch Size**: Max 100 calls per batch
- **Smart Timing**: 50ms delay to collect more calls
- **Specialized Functions**:
  - `batchGetTokenInfo`: Fetch multiple token symbols & decimals
  - `batchGetBalances`: Fetch multiple user balances
  - `batchGetTokenData`: Fetch complete token data (info + balances)

**Usage**:
```javascript
import { batchGetTokenData } from './services/multicallService'

// Instead of 6 RPC calls, only 1!
const tokens = await batchGetTokenData(
  1, // chainId
  ['0xToken1...', '0xToken2...', '0xToken3...'],
  '0xUserAddress...'
)
// Returns: [{ address, symbol, decimals, balance }, ...]
```

**Example Savings**:
- **Before**: 3 tokens × 2 calls each (symbol + decimals) = 6 RPC calls
- **After**: 1 batched multicall = 1 RPC call
- **Reduction**: 83%

### 3. RPC Load Balancer (`rpcLoadBalancer.js`)

**Purpose**: Distribute load and provide failover resilience

**Features**:
- **Automatic Failover**: Switches to backup RPCs on failure
- **Rate Limiting**: Prevents hitting rate limits
  - Primary RPC: 50 req/sec
  - Fallback RPCs: 10 req/sec
- **Health Monitoring**: Tracks endpoint health and response times
- **Round-Robin**: Load balances across healthy endpoints
- **Multiple Fallbacks**: Public RPC endpoints for each chain

**Fallback RPCs per Chain**:
- **Ethereum**: 5 fallback endpoints
- **Base**: 4 fallback endpoints
- **Mantle**: 3 fallback endpoints

**Usage**:
```javascript
import { executeWithLoadBalancing } from './services/rpcLoadBalancer'

const result = await executeWithLoadBalancing(
  chainId,
  primaryRpcUrl,
  async (rpcUrl) => {
    // Your RPC request here
    return await fetch(rpcUrl, {...})
  }
)
```

### 4. Request Manager (`requestManager.js`)

**Purpose**: Prevent duplicate and excessive requests

**Features**:

#### Deduplication
Reuses in-flight requests instead of making duplicates
```javascript
import { deduplicateRequest } from './services/requestManager'

// If same request is already pending, reuses it
const data = await deduplicateRequest(
  'getTokenInfo',
  { address: '0x...', chainId: 1 },
  () => fetchTokenInfo()
)
```

#### Debouncing
Delays execution until calls stop coming
```javascript
import { debounce } from './services/requestManager'

// Perfect for search inputs - waits 300ms after last keystroke
const results = await debounce(
  'searchTokens',
  { query: 'ETH' },
  () => searchTokensAPI(),
  300 // ms
)
```

#### Throttling
Limits call frequency
```javascript
import { throttle } from './services/requestManager'

// Ensures function runs max once per second
const data = await throttle(
  'getPrice',
  { symbol: 'ETH' },
  () => fetchPrice(),
  1000 // ms
)
```

### 5. Optimistic UI Service (`optimisticService.js`)

**Purpose**: Show cached data instantly while fetching fresh data

**Features**:

#### Stale-While-Revalidate (SWR)
Returns cached data immediately, updates in background
```javascript
import { staleWhileRevalidate } from './services/optimisticService'

const result = await staleWhileRevalidate(
  STORE_NAMES.BALANCES,
  { tokenAddress, userAddress, chainId },
  CACHE_TTL.BALANCES,
  () => fetchFreshBalance(),
  (freshData) => {
    // Update UI with fresh data
    setBalance(freshData)
  }
)

// result.data = immediate cached data
// result.isStale = true if from cache
// result.refresh = promise for fresh data
```

#### Prefetching
Predictively load data before user needs it
```javascript
import { prefetchData } from './services/optimisticService'

// Preload token data for all positions
await prefetchData(
  STORE_NAMES.TOKEN_INFO,
  positions.map(p => ({ tokenAddress: p.token, chainId })),
  CACHE_TTL.TOKEN_INFO,
  (params) => fetchTokenInfo(params)
)
```

#### Background Refresh
Keep active data fresh automatically
```javascript
import { registerBackgroundRefresh } from './services/optimisticService'

// Refresh user balance every 30 seconds
registerBackgroundRefresh(
  'balance-ETH',
  () => fetchAndUpdateBalance(),
  30000
)
```

### 6. Optimized Token Utils (`tokenUtilsOptimized.js`)

**Purpose**: High-level API with all optimizations built-in

**Key Functions**:

#### `getTokenInfo(address, chainId)`
Fetch token symbol & decimals (7-day cache)
```javascript
const { symbol, decimals } = await getTokenInfo('0x...', 1)
```

#### `getTokenBalance(address, userAddress, chainId, onUpdate)`
Fetch balance with SWR (30-second cache, updates in background)
```javascript
const balance = await getTokenBalance(
  '0xToken...',
  '0xUser...',
  1,
  (fresh) => console.log('Updated:', fresh)
)
```

#### `getTokenData(address, userAddress, chainId, onUpdate)`
Complete token data (symbol, decimals, balance)
```javascript
const { symbol, decimals, balance } = await getTokenData(
  '0xToken...',
  '0xUser...',
  1
)
```

#### `fetchMultipleTokensData(addresses, userAddress, chainId)`
**MOST EFFICIENT** - Batch fetch all token data
```javascript
const tokens = await fetchMultipleTokensData(
  ['0xToken1...', '0xToken2...', '0xToken3...'],
  '0xUser...',
  1
)
// Single multicall instead of 9+ RPC calls!
```

## Performance Comparison

### Traditional Approach (Without Optimization)

Fetching data for 10 positions with 2 tokens each (20 tokens):

```
Token Info: 20 tokens × 2 calls = 40 RPC calls
Balances: 20 tokens × 1 call = 20 RPC calls
Total: 60 RPC calls
Time: ~6-12 seconds (depending on RPC latency)
```

### Optimized Approach

**First Load** (cold cache):
```
Multicall batch: 1 RPC call (all tokens)
Total: 1 RPC call
Time: ~100-200ms
Reduction: 98%+ 🎉
```

**Subsequent Loads** (warm cache):
```
Cache hits: 0 RPC calls
Total: 0 RPC calls
Time: <10ms
Reduction: 100%! 🚀
```

**With Background Refresh**:
```
Initial: 0 RPC calls (cache)
Background: 1 RPC call (updates cache)
User sees: Instant results + automatic updates
```

## Real-World Savings Example

### Scenario: User browsing positions page

**Traditional**:
- Initial load: 60 RPC calls
- Switch chains: 60 RPC calls
- Reload page: 60 RPC calls
- Check balance: 1 RPC call
- **Total: 181 RPC calls**

**Optimized**:
- Initial load: 1 RPC call (multicall)
- Switch chains: 1 RPC call (multicall) 
- Reload page: 0 RPC calls (cache)
- Check balance: 0 RPC calls (SWR cache)
- Background refresh: 1 RPC call
- **Total: 3 RPC calls**

**Savings: 178 fewer calls = 98.3% reduction! 🎯**

## Migration Guide

### Step 1: Update Imports

**Old**:
```javascript
import { fetchTokenData } from './utils/tokenUtils'
```

**New**:
```javascript
import { getTokenData } from './utils/tokenUtilsOptimized'
```

### Step 2: Update Function Calls

**Old**:
```javascript
const data = await fetchTokenData(address, userAddress, client, chainId)
```

**New**:
```javascript
const data = await getTokenData(address, userAddress, chainId)
// Note: No need to pass client anymore!
```

### Step 3: Use Batch Functions for Multiple Tokens

**Old**:
```javascript
const tokens = await Promise.all(
  addresses.map(addr => fetchTokenData(addr, userAddress, client, chainId))
)
```

**New**:
```javascript
const tokens = await fetchMultipleTokensData(addresses, userAddress, chainId)
// Single multicall instead of N separate calls!
```

### Step 4: Add Optimistic Updates (Optional)

```javascript
const { data, isStale } = await getTokenData(
  address, 
  userAddress, 
  chainId,
  (freshData) => {
    // Update UI when fresh data arrives
    setTokenData(freshData)
  }
)

// Show cached data immediately
setTokenData(data)
```

## API Reference

### Cache Service

```javascript
// Get cached data
getFromCache(storeName, params, ttl): Promise<data | null>

// Set cache
setInCache(storeName, params, data, chainId): Promise<void>

// Invalidate cache
invalidateCache(storeName, params): Promise<void>
invalidateChainCache(chainId): Promise<void>

// Get or fetch with auto-caching
getOrFetch(storeName, params, ttl, fetchFn): Promise<data>

// Cleanup
clearAllCache(): Promise<void>
```

### Multicall Service

```javascript
// Batch read single contract call
batchedRead(chainId, address, abi, functionName, args): Promise<result>

// Batch multiple token info
batchGetTokenInfo(chainId, addresses): Promise<Array<tokenInfo>>

// Batch multiple balances
batchGetBalances(chainId, addresses, userAddress): Promise<Array<balance>>

// Batch complete token data
batchGetTokenData(chainId, addresses, userAddress): Promise<Array<tokenData>>
```

### Request Manager

```javascript
// Deduplicate requests
deduplicateRequest(id, params, fn): Promise<result>

// Debounce calls
debounce(id, params, fn, wait): Promise<result>

// Throttle calls
throttle(id, params, fn, limit): Promise<result>

// Smart request (auto-strategy)
smartRequest({ identifier, params, requestFn, strategy, wait }): Promise<result>
```

### Optimistic Service

```javascript
// Stale-while-revalidate
staleWhileRevalidate(store, params, ttl, fetchFn, onUpdate): Promise<{ data, isStale, refresh }>

// Prefetch data
prefetchData(store, paramsArray, ttl, fetchFn): Promise<results>

// Background refresh
registerBackgroundRefresh(key, fetchFn, interval): void
unregisterBackgroundRefresh(key): void
```

## Monitoring & Debugging

### Get Statistics

```javascript
import { getCacheStats } from './services/cacheService'
import { getAllRPCStats } from './services/rpcLoadBalancer'
import { getRequestStats } from './services/requestManager'

// Cache statistics
const cacheStats = await getCacheStats()
console.log('Cache:', cacheStats)

// RPC health
const rpcStats = getAllRPCStats()
console.log('RPC Health:', rpcStats)

// Request manager stats
const reqStats = getRequestStats()
console.log('Requests:', reqStats)
```

### Clear Caches (Development)

```javascript
import { clearAllCache } from './services/cacheService'
import { clearAllRequests } from './services/requestManager'

// Clear all caches
await clearAllCache()
clearAllRequests()
```

## Best Practices

1. **Use Batch Functions**: Always prefer `fetchMultipleTokensData` over individual calls
2. **Leverage SWR**: Use `onUpdate` callbacks for real-time updates
3. **Preload Data**: Use predictive prefetching for better UX
4. **Trust the Cache**: Don't force-refresh unless necessary
5. **Monitor Performance**: Check stats regularly in development
6. **Handle Errors**: All functions include error handling and fallbacks

## Configuration

### Adjust Cache TTL

Edit `src/services/cacheService.js`:
```javascript
export const CACHE_TTL = {
  TOKEN_INFO: 7 * 24 * 60 * 60 * 1000, // Adjust as needed
  BALANCES: 30 * 1000,
  // ...
}
```

### Adjust Batch Size

Edit `src/services/multicallService.js`:
```javascript
const BATCH_CONFIG = {
  maxBatchSize: 100, // Increase for more batching
  batchDelay: 50,    // Increase to collect more calls
}
```

### Add Custom Fallback RPCs

Edit `src/services/rpcLoadBalancer.js`:
```javascript
const FALLBACK_RPC_ENDPOINTS = {
  1: [
    'https://your-rpc-endpoint.com',
    // Add more...
  ],
}
```

## Troubleshooting

### Cache Not Working
- Check browser storage is enabled
- Verify IndexedDB quota not exceeded
- Check console for errors

### Batching Not Happening
- Ensure using batch functions from multicallService
- Check batch delay is sufficient
- Verify Multicall3 is deployed on your chain

### RPC Failover Not Working
- Check fallback endpoints are accessible
- Verify health check configuration
- Check rate limits aren't too restrictive

## Support

For issues or questions:
1. Check browser console for detailed errors
2. Review cache/RPC stats for insights
3. Enable verbose logging in development

## License

MIT
