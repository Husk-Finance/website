/**
 * Request Manager Service
 * Handles request deduplication, debouncing, and throttling
 * Prevents duplicate simultaneous requests and excessive API calls
 */

/**
 * Request deduplication map
 * Stores in-flight requests by key
 */
const inflightRequests = new Map()

/**
 * Debounce timers map
 */
const debounceTimers = new Map()

/**
 * Throttle tracking map
 */
const throttleTracking = new Map()

/**
 * Generate a unique key for request deduplication
 */
function generateRequestKey(identifier, params) {
  const sortedParams = typeof params === 'object' && params !== null
    ? JSON.stringify(
      Object.keys(params)
        .sort()
        .reduce((acc, key) => {
          acc[key] = params[key]
          return acc
        }, {}),
    )
    : String(params)

  return `${identifier}:${sortedParams}`
}

/**
 * Deduplicate identical simultaneous requests
 * If a request with the same key is already in-flight, return the existing promise
 */
export async function deduplicateRequest(identifier, params, requestFn) {
  const key = generateRequestKey(identifier, params)

  // Check if request is already in-flight
  if (inflightRequests.has(key)) {
    console.log(`[Dedupe] Reusing in-flight request: ${key}`)
    return inflightRequests.get(key)
  }

  // Create new request
  const promise = (async () => {
    try {
      const result = await requestFn()
      return result
    } finally {
      // Clean up after request completes
      inflightRequests.delete(key)
    }
  })()

  inflightRequests.set(key, promise)
  return promise
}

/**
 * Debounce a function call
 * Delays execution until after wait time has elapsed since last call
 * Useful for search inputs, scroll events, etc.
 */
export function debounce(identifier, params, requestFn, wait = 300) {
  const key = generateRequestKey(identifier, params)

  return new Promise((resolve, reject) => {
    // Clear existing timer
    if (debounceTimers.has(key)) {
      clearTimeout(debounceTimers.get(key).timer)
    }

    // Set new timer
    const timer = setTimeout(async () => {
      try {
        const result = await requestFn()
        resolve(result)
      } catch (error) {
        reject(error)
      } finally {
        debounceTimers.delete(key)
      }
    }, wait)

    debounceTimers.set(key, { timer, resolve, reject })
  })
}

/**
 * Throttle a function call
 * Ensures function is called at most once per time period
 * Useful for rate-limited APIs
 */
export async function throttle(identifier, params, requestFn, limit = 1000) {
  const key = generateRequestKey(identifier, params)
  const now = Date.now()

  // Check throttle state
  const throttleState = throttleTracking.get(key)

  if (throttleState) {
    const timeSinceLastCall = now - throttleState.lastCall

    if (timeSinceLastCall < limit) {
      // Still within throttle period, return cached result if available
      if (throttleState.lastResult !== undefined) {
        console.log(`[Throttle] Returning cached result for: ${key}`)
        return throttleState.lastResult
      }

      // Wait for remaining time
      const waitTime = limit - timeSinceLastCall
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  // Execute request
  try {
    const result = await requestFn()

    // Update throttle state
    throttleTracking.set(key, {
      lastCall: Date.now(),
      lastResult: result,
    })

    return result
  } catch (error) {
    // On error, don't cache and allow immediate retry
    throttleTracking.delete(key)
    throw error
  }
}

/**
 * Combined debounce and deduplicate
 * Debounces calls and deduplicates simultaneous requests
 */
export async function debounceAndDedupe(identifier, params, requestFn, wait = 300) {
  const key = generateRequestKey(identifier, params)

  // Check if already debouncing
  if (debounceTimers.has(key)) {
    // Return existing debounce promise
    return new Promise((resolve, reject) => {
      const existing = debounceTimers.get(key)

      // Clear and reset timer
      clearTimeout(existing.timer)

      const timer = setTimeout(async () => {
        try {
          const result = await deduplicateRequest(identifier, params, requestFn)
          existing.resolve(result)
          resolve(result)
        } catch (error) {
          existing.reject(error)
          reject(error)
        } finally {
          debounceTimers.delete(key)
        }
      }, wait)

      debounceTimers.set(key, { timer, resolve: existing.resolve, reject: existing.reject })
    })
  }

  // Create new debounced request
  return debounce(identifier, params, () => deduplicateRequest(identifier, params, requestFn), wait)
}

/**
 * Batch multiple requests into time windows
 * Collects requests over a time period and executes them together
 */
class BatchWindow {
  constructor(identifier, batchFn, windowMs = 100) {
    this.identifier = identifier
    this.batchFn = batchFn
    this.windowMs = windowMs
    this.queue = []
    this.timer = null
  }

  add(params) {
    return new Promise((resolve, reject) => {
      this.queue.push({ params, resolve, reject })

      if (!this.timer) {
        this.timer = setTimeout(() => this.execute(), this.windowMs)
      }
    })
  }

  async execute() {
    if (this.queue.length === 0) return

    const batch = [...this.queue]
    this.queue = []
    this.timer = null

    try {
      const results = await this.batchFn(batch.map((item) => item.params))

      // Resolve individual promises
      batch.forEach((item, index) => {
        if (results[index] !== undefined) {
          item.resolve(results[index])
        } else {
          item.reject(new Error('No result for batch item'))
        }
      })
    } catch (error) {
      // Reject all promises
      batch.forEach((item) => item.reject(error))
    }
  }
}

const batchWindows = new Map()

/**
 * Add request to batch window
 */
export function batchRequest(identifier, params, batchFn, windowMs = 100) {
  if (!batchWindows.has(identifier)) {
    batchWindows.set(identifier, new BatchWindow(identifier, batchFn, windowMs))
  }

  return batchWindows.get(identifier).add(params)
}

/**
 * Cancel all pending debounced calls
 */
export function cancelAllDebounced() {
  debounceTimers.forEach(({ timer }) => clearTimeout(timer))
  debounceTimers.clear()
}

/**
 * Cancel specific debounced call
 */
export function cancelDebounced(identifier, params) {
  const key = generateRequestKey(identifier, params)
  const debounced = debounceTimers.get(key)

  if (debounced) {
    clearTimeout(debounced.timer)
    debounceTimers.delete(key)
  }
}

/**
 * Clear throttle cache for identifier
 */
export function clearThrottle(identifier, params) {
  const key = generateRequestKey(identifier, params)
  throttleTracking.delete(key)
}

/**
 * Clear all throttle caches
 */
export function clearAllThrottles() {
  throttleTracking.clear()
}

/**
 * Get request manager statistics
 */
export function getRequestStats() {
  return {
    inflightRequests: inflightRequests.size,
    debouncedRequests: debounceTimers.size,
    throttledRequests: throttleTracking.size,
    batchWindows: batchWindows.size,
  }
}

/**
 * Clear all request tracking
 */
export function clearAllRequests() {
  inflightRequests.clear()
  cancelAllDebounced()
  clearAllThrottles()
  batchWindows.forEach((window) => {
    if (window.timer) clearTimeout(window.timer)
  })
  batchWindows.clear()
}

/**
 * Smart request wrapper
 * Automatically applies best optimization strategy based on request type
 */
export async function smartRequest(options) {
  const {
    identifier,
    params,
    requestFn,
    strategy = 'dedupe', // 'dedupe', 'debounce', 'throttle', 'batch'
    wait = 300,
    batchFn,
  } = options

  switch (strategy) {
    case 'debounce':
      return debounce(identifier, params, requestFn, wait)

    case 'throttle':
      return throttle(identifier, params, requestFn, wait)

    case 'batch':
      if (!batchFn) {
        throw new Error('batchFn is required for batch strategy')
      }
      return batchRequest(identifier, params, batchFn, wait)

    case 'debounce-dedupe':
      return debounceAndDedupe(identifier, params, requestFn, wait)

    case 'dedupe':
    default:
      return deduplicateRequest(identifier, params, requestFn)
  }
}
