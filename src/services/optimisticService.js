/**
 * Optimistic UI and Background Sync Service
 * Provides instant UI updates with cached data while fetching fresh data
 * Implements stale-while-revalidate pattern
 */

import {
  getFromCache, setInCache, CACHE_TTL, STORE_NAMES,
} from './cacheService'

/**
 * Stale-While-Revalidate (SWR) pattern
 * Returns cached data immediately (if available), then fetches fresh data in background
 */
export async function staleWhileRevalidate(
  storeName,
  params,
  ttl,
  fetchFn,
  onUpdate = null,
) {
  let cachedData = null
  let freshData = null

  // Try to get cached data first
  try {
    cachedData = await getFromCache(storeName, params, ttl)
  } catch (error) {
    console.error('Error reading cache in SWR:', error)
  }

  // If we have cached data, return it immediately
  const hasCached = cachedData !== null

  // Fetch fresh data in background
  const fetchPromise = (async () => {
    try {
      freshData = await fetchFn()

      // Update cache with fresh data
      await setInCache(storeName, params, freshData, params.chainId)

      // If callback provided and data changed, notify
      if (onUpdate && JSON.stringify(cachedData) !== JSON.stringify(freshData)) {
        onUpdate(freshData)
      }

      return freshData
    } catch (error) {
      console.error('Error fetching fresh data in SWR:', error)
      // If fetch fails but we have cache, that's okay
      if (hasCached) {
        return cachedData
      }
      throw error
    }
  })()

  // Return strategy:
  // If we have cached data, return it immediately with a promise for fresh data
  // If no cached data, wait for fetch to complete
  if (hasCached) {
    return {
      data: cachedData,
      isStale: true,
      refresh: fetchPromise,
    }
  }

  const data = await fetchPromise
  return {
    data,
    isStale: false,
    refresh: Promise.resolve(data),
  }
}

/**
 * Background sync queue for updating multiple items
 */
class BackgroundSyncQueue {
  constructor() {
    this.queue = []
    this.isProcessing = false
    this.maxConcurrent = 3
    this.activeCount = 0
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this.process()
    })
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true

    while (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const item = this.queue.shift()
      this.activeCount += 1

      item.task()
        .then((result) => {
          item.resolve(result)
        })
        .catch((error) => {
          item.reject(error)
        })
        .finally(() => {
          this.activeCount -= 1
          this.process()
        })
    }

    if (this.activeCount === 0) {
      this.isProcessing = false
    }
  }

  clear() {
    this.queue = []
  }

  getStats() {
    return {
      queueLength: this.queue.length,
      activeCount: this.activeCount,
      isProcessing: this.isProcessing,
    }
  }
}

const backgroundSyncQueue = new BackgroundSyncQueue()

/**
 * Add task to background sync queue
 */
export function syncInBackground(task) {
  return backgroundSyncQueue.add(task)
}

/**
 * Optimistic update with rollback on error
 * Updates UI immediately with optimistic data, then performs actual operation
 */
export async function optimisticUpdate(
  optimisticData,
  operation,
  onSuccess = null,
  onError = null,
) {
  // Return optimistic data immediately
  const rollback = () => {
    if (onError) {
      onError()
    }
  }

  // Perform actual operation in background
  syncInBackground(async () => {
    try {
      const result = await operation()
      if (onSuccess) {
        onSuccess(result)
      }
      return result
    } catch (error) {
      rollback()
      throw error
    }
  })

  return optimisticData
}

/**
 * Prefetch data for predictive loading
 * Useful for preloading data user is likely to need
 */
export async function prefetchData(storeName, paramsArray, ttl, fetchFn) {
  const prefetchTasks = paramsArray.map((params) => async () => {
    // Check if already cached
    const cached = await getFromCache(storeName, params, ttl)
    if (cached !== null) {
      return cached // Already cached, skip
    }

    // Fetch and cache
    try {
      const data = await fetchFn(params)
      await setInCache(storeName, params, data, params.chainId)
      return data
    } catch (error) {
      console.error('Prefetch error:', error)
      return null
    }
  })

  // Add all prefetch tasks to background queue
  const results = await Promise.allSettled(
    prefetchTasks.map((task) => syncInBackground(task)),
  )

  return results
}

/**
 * Predictive token data preloading
 * Preloads token data for positions user is viewing
 */
export async function preloadTokenData(chainId, tokenAddresses) {
  const params = tokenAddresses.map((address) => ({
    chainId,
    tokenAddress: address.toLowerCase(),
  }))

  // Using a dummy fetch function - actual implementation will use real fetch
  await prefetchData(
    STORE_NAMES.TOKEN_INFO,
    params,
    CACHE_TTL.TOKEN_INFO,
    async () => ({}), // Will be replaced with actual token fetch
  )
}

/**
 * Periodic background refresh for active data
 * Keeps frequently accessed data fresh
 */
class BackgroundRefresher {
  constructor() {
    this.refreshTasks = new Map()
    this.intervals = new Map()
  }

  register(key, fetchFn, interval = 30000) {
    // Clear existing if any
    this.unregister(key)

    // Set up periodic refresh
    const intervalId = setInterval(async () => {
      try {
        await fetchFn()
      } catch (error) {
        console.error(`Background refresh error for ${key}:`, error)
      }
    }, interval)

    this.refreshTasks.set(key, fetchFn)
    this.intervals.set(key, intervalId)
  }

  unregister(key) {
    const intervalId = this.intervals.get(key)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(key)
      this.refreshTasks.delete(key)
    }
  }

  unregisterAll() {
    this.intervals.forEach((intervalId) => clearInterval(intervalId))
    this.intervals.clear()
    this.refreshTasks.clear()
  }

  getStats() {
    return {
      activeRefreshers: this.refreshTasks.size,
    }
  }
}

const backgroundRefresher = new BackgroundRefresher()

/**
 * Register data for background refresh
 */
export function registerBackgroundRefresh(key, fetchFn, interval = 30000) {
  backgroundRefresher.register(key, fetchFn, interval)
}

/**
 * Unregister background refresh
 */
export function unregisterBackgroundRefresh(key) {
  backgroundRefresher.unregister(key)
}

/**
 * Unregister all background refreshes
 */
export function unregisterAllBackgroundRefresh() {
  backgroundRefresher.unregisterAll()
}

/**
 * Smart data fetcher with optimistic loading
 * Combines multiple optimization strategies
 */
export async function smartFetch(options) {
  const {
    storeName,
    params,
    ttl,
    fetchFn,
    enableSWR = true,
    enablePrefetch = false,
    prefetchParams = [],
    enableBackgroundRefresh = false,
    refreshInterval = 30000,
    onUpdate = null,
  } = options

  // Enable background refresh if requested
  if (enableBackgroundRefresh) {
    const key = `${storeName}:${JSON.stringify(params)}`
    registerBackgroundRefresh(
      key,
      async () => {
        const data = await fetchFn()
        await setInCache(storeName, params, data, params.chainId)
        if (onUpdate) onUpdate(data)
      },
      refreshInterval,
    )
  }

  // Prefetch related data if requested
  if (enablePrefetch && prefetchParams.length > 0) {
    syncInBackground(async () => {
      await prefetchData(storeName, prefetchParams, ttl, fetchFn)
    })
  }

  // Use SWR pattern if enabled
  if (enableSWR) {
    return staleWhileRevalidate(storeName, params, ttl, fetchFn, onUpdate)
  }

  // Fallback to regular fetch with cache
  const cached = await getFromCache(storeName, params, ttl)
  if (cached !== null) {
    return { data: cached, isStale: false }
  }

  const data = await fetchFn()
  await setInCache(storeName, params, data, params.chainId)
  return { data, isStale: false }
}

/**
 * Get sync queue statistics
 */
export function getSyncStats() {
  return {
    backgroundQueue: backgroundSyncQueue.getStats(),
    backgroundRefresher: backgroundRefresher.getStats(),
  }
}

/**
 * Clear all background tasks
 */
export function clearAllBackgroundTasks() {
  backgroundSyncQueue.clear()
  backgroundRefresher.unregisterAll()
}
