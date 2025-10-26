/**
 * Advanced Caching Service
 * Multi-layer caching with IndexedDB for persistence and memory for speed
 * Implements TTL, automatic cleanup, and smart invalidation
 */

import { openDB } from 'idb'

const DB_NAME = 'husk-finance-cache'
const DB_VERSION = 1
const STORE_NAMES = {
  TOKEN_INFO: 'token-info', // Symbol, decimals, name - long TTL
  BALANCES: 'balances', // User balances - short TTL
  POSITIONS: 'positions', // Position data - medium TTL
  PRICES: 'prices', // Token prices - short TTL
  METADATA: 'metadata', // General metadata
}

// Cache TTL configurations (in milliseconds)
export const CACHE_TTL = {
  TOKEN_INFO: 7 * 24 * 60 * 60 * 1000, // 7 days (rarely changes)
  BALANCES: 30 * 1000, // 30 seconds (changes frequently)
  POSITIONS: 2 * 60 * 1000, // 2 minutes
  PRICES: 60 * 1000, // 1 minute
  METADATA: 5 * 60 * 1000, // 5 minutes
}

// In-memory cache for ultra-fast access
const memoryCache = new Map()
const MEMORY_CACHE_SIZE_LIMIT = 500 // Max items in memory cache

// Pending requests map to prevent duplicate simultaneous requests
const pendingRequests = new Map()

/**
 * Initialize IndexedDB
 */
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores with indexes
      Object.values(STORE_NAMES).forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: 'key' })
          store.createIndex('timestamp', 'timestamp')
          store.createIndex('chainId', 'chainId', { unique: false })
        }
      })
    },
  })
}

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = initDB()
  }
  return dbPromise
}

/**
 * Generate cache key from parameters
 */
function generateCacheKey(type, params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]?.toString().toLowerCase()}`)
    .join('|')
  return `${type}:${sortedParams}`
}

/**
 * Check if cached data is still valid
 */
function isValidCache(entry, ttl) {
  if (!entry || !entry.timestamp) return false
  return Date.now() - entry.timestamp < ttl
}

/**
 * Get from memory cache
 */
function getFromMemory(key) {
  return memoryCache.get(key)
}

/**
 * Set in memory cache with size management
 */
function setInMemory(key, data) {
  // Implement LRU by removing oldest when limit is reached
  if (memoryCache.size >= MEMORY_CACHE_SIZE_LIMIT) {
    const firstKey = memoryCache.keys().next().value
    memoryCache.delete(firstKey)
  }
  memoryCache.set(key, data)
}

/**
 * Get data from cache (checks memory first, then IndexedDB)
 */
export async function getFromCache(storeName, params, ttl) {
  const key = generateCacheKey(storeName, params)

  // Check memory cache first
  const memoryEntry = getFromMemory(key)
  if (memoryEntry && isValidCache(memoryEntry, ttl)) {
    return memoryEntry.data
  }

  // Check IndexedDB
  try {
    const db = await getDB()
    const entry = await db.get(storeName, key)

    if (entry && isValidCache(entry, ttl)) {
      // Update memory cache
      setInMemory(key, entry)
      return entry.data
    }

    // Cache miss or expired
    return null
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

/**
 * Set data in cache (both memory and IndexedDB)
 */
export async function setInCache(storeName, params, data, chainId = null) {
  const key = generateCacheKey(storeName, params)
  const entry = {
    key,
    data,
    timestamp: Date.now(),
    chainId,
  }

  // Set in memory
  setInMemory(key, entry)

  // Set in IndexedDB
  try {
    const db = await getDB()
    await db.put(storeName, entry)
  } catch (error) {
    console.error('Cache write error:', error)
  }
}

/**
 * Invalidate specific cache entry
 */
export async function invalidateCache(storeName, params) {
  const key = generateCacheKey(storeName, params)

  // Remove from memory
  memoryCache.delete(key)

  // Remove from IndexedDB
  try {
    const db = await getDB()
    await db.delete(storeName, key)
  } catch (error) {
    console.error('Cache invalidation error:', error)
  }
}

/**
 * Invalidate all cache for a specific chain
 */
export async function invalidateChainCache(chainId) {
  // Clear memory cache for this chain
  const keysToDelete = []
  memoryCache.forEach((value, key) => {
    if (value.chainId === chainId) {
      keysToDelete.push(key)
    }
  })
  keysToDelete.forEach((key) => memoryCache.delete(key))

  // Clear IndexedDB cache for this chain
  try {
    const db = await getDB()
    for (const storeName of Object.values(STORE_NAMES)) {
      const tx = db.transaction(storeName, 'readwrite')
      const index = tx.store.index('chainId')
      let cursor = await index.openCursor(IDBKeyRange.only(chainId))

      while (cursor) {
        await cursor.delete()
        cursor = await cursor.continue()
      }
    }
  } catch (error) {
    console.error('Chain cache invalidation error:', error)
  }
}

/**
 * Clear all expired entries from cache
 */
export async function cleanupExpiredCache() {
  const now = Date.now()

  // Memory cache cleanup
  const expiredKeys = []
  memoryCache.forEach((value, key) => {
    // Determine TTL based on store name
    const storeName = key.split(':')[0]
    const ttl = CACHE_TTL[storeName.toUpperCase().replace(/-/g, '_')] || CACHE_TTL.METADATA
    if (!isValidCache(value, ttl)) {
      expiredKeys.push(key)
    }
  })
  expiredKeys.forEach((key) => memoryCache.delete(key))

  // IndexedDB cleanup
  try {
    const db = await getDB()
    for (const [storeKey, storeName] of Object.entries(STORE_NAMES)) {
      const ttl = CACHE_TTL[storeKey]
      const tx = db.transaction(storeName, 'readwrite')
      const { store } = tx
      let cursor = await store.openCursor()

      while (cursor) {
        if (!isValidCache(cursor.value, ttl)) {
          await cursor.delete()
        }
        cursor = await cursor.continue()
      }
    }
  } catch (error) {
    console.error('Cache cleanup error:', error)
  }
}

/**
 * Clear all cache
 */
export async function clearAllCache() {
  memoryCache.clear()

  try {
    const db = await getDB()
    for (const storeName of Object.values(STORE_NAMES)) {
      await db.clear(storeName)
    }
  } catch (error) {
    console.error('Clear all cache error:', error)
  }
}

/**
 * Get or fetch pattern with automatic caching
 * Prevents duplicate requests for the same data
 */
export async function getOrFetch(storeName, params, ttl, fetchFn) {
  // Check cache first
  const cached = await getFromCache(storeName, params, ttl)
  if (cached !== null) {
    return cached
  }

  // Check if there's already a pending request for this data
  const key = generateCacheKey(storeName, params)
  const pending = pendingRequests.get(key)
  if (pending) {
    return pending
  }

  // Create new request
  const fetchPromise = (async () => {
    try {
      const data = await fetchFn()
      await setInCache(storeName, params, data, params.chainId)
      return data
    } finally {
      pendingRequests.delete(key)
    }
  })()

  pendingRequests.set(key, fetchPromise)
  return fetchPromise
}

/**
 * Preload data into cache (for predictive caching)
 */
export async function preloadCache(storeName, paramsArray, ttl, fetchFn) {
  const promises = paramsArray.map((params) => getOrFetch(storeName, params, ttl, () => fetchFn(params)))

  try {
    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Preload cache error:', error)
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  const stats = {
    memorySize: memoryCache.size,
    pendingRequests: pendingRequests.size,
    stores: {},
  }

  try {
    const db = await getDB()
    for (const storeName of Object.values(STORE_NAMES)) {
      const count = await db.count(storeName)
      stats.stores[storeName] = count
    }
  } catch (error) {
    console.error('Get cache stats error:', error)
  }

  return stats
}

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cleanupExpiredCache()
  }, 5 * 60 * 1000)
}

export { STORE_NAMES }
