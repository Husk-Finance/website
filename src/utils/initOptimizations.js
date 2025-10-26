/**
 * RPC Optimization Initialization
 * Initializes all optimization services on app startup
 */

import { getFromCache, STORE_NAMES, CACHE_TTL } from '../services/cacheService'

/**
 * Initialize the optimization system
 * Call this once when your app starts
 */
export async function initializeOptimizations() {
  try {
    // Force initialize IndexedDB by triggering a cache read
    // This ensures the DB is created immediately on app load
    await getFromCache(STORE_NAMES.TOKEN_INFO, { init: true }, CACHE_TTL.TOKEN_INFO)
    
    // Log current cache stats (dev only)
    if (process.env.NODE_ENV === 'development') {
      const { getCacheStats } = await import('../services/cacheService')
      const stats = await getCacheStats()
      console.log('Cache Stats:', stats)
    }
  } catch (error) {
    console.error('Failed to initialize optimizations:', error)
  }
}

