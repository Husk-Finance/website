/**
 * RPC Load Balancer and Failover Service
 * Distributes requests across multiple RPC endpoints
 * Implements automatic failover, rate limiting, and health monitoring
 */

import { http } from 'viem'

// Free public RPC endpoints as fallbacks (per chain)
const FALLBACK_RPC_ENDPOINTS = {
  1: [ // Ethereum Mainnet
    'https://eth.llamarpc.com',
    'https://rpc.ankr.com/eth',
    'https://ethereum.publicnode.com',
    'https://eth-pokt.nodies.app',
    'https://eth.drpc.org',
  ],
  8453: [ // Base
    'https://mainnet.base.org',
    'https://base.llamarpc.com',
    'https://base-pokt.nodies.app',
    'https://base.drpc.org',
  ],
  5000: [ // Mantle
    'https://rpc.mantle.xyz',
    'https://mantle.publicnode.com',
    'https://mantle.drpc.org',
  ],
  998: [ // HyperEVM
    'https://api.hyperliquid-testnet.xyz/evm',
  ],
}

// Rate limiting configuration (requests per second)
const RATE_LIMITS = {
  primary: 50, // Primary RPC
  fallback: 10, // Free RPC endpoints
}

// Health check configuration
const HEALTH_CHECK_CONFIG = {
  interval: 60000, // Check every 60 seconds
  timeout: 5000, // 5 second timeout
  failureThreshold: 3, // Mark as unhealthy after 3 failures
  successThreshold: 2, // Mark as healthy after 2 successes
}

/**
 * RPC Endpoint class with health tracking
 */
class RPCEndpoint {
  constructor(url, isPrimary = false) {
    this.url = url
    this.isPrimary = isPrimary
    this.isHealthy = true
    this.failureCount = 0
    this.successCount = 0
    this.lastUsed = 0
    this.requestCount = 0
    this.totalRequests = 0
    this.totalErrors = 0
    this.avgResponseTime = 0
    this.lastHealthCheck = 0
  }

  recordSuccess(responseTime) {
    this.successCount += 1
    this.failureCount = Math.max(0, this.failureCount - 1)
    this.requestCount += 1
    this.totalRequests += 1

    // Update average response time (exponential moving average)
    this.avgResponseTime = this.avgResponseTime === 0
      ? responseTime
      : this.avgResponseTime * 0.9 + responseTime * 0.1

    if (this.successCount >= HEALTH_CHECK_CONFIG.successThreshold) {
      this.isHealthy = true
      this.successCount = 0
    }
  }

  recordFailure() {
    this.failureCount += 1
    this.successCount = 0
    this.totalErrors += 1

    if (this.failureCount >= HEALTH_CHECK_CONFIG.failureThreshold) {
      this.isHealthy = false
    }
  }

  resetRateLimit() {
    this.requestCount = 0
  }

  canAcceptRequest() {
    const limit = this.isPrimary ? RATE_LIMITS.primary : RATE_LIMITS.fallback
    return this.requestCount < limit
  }

  getStats() {
    return {
      url: this.url,
      isPrimary: this.isPrimary,
      isHealthy: this.isHealthy,
      avgResponseTime: Math.round(this.avgResponseTime),
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      errorRate: this.totalRequests > 0
        ? `${((this.totalErrors / this.totalRequests) * 100).toFixed(2)}%`
        : '0%',
    }
  }
}

/**
 * RPC Provider Manager for a specific chain
 */
class RPCProviderManager {
  constructor(chainId, primaryUrl) {
    this.chainId = chainId
    this.endpoints = [new RPCEndpoint(primaryUrl, true)]

    // Add fallback endpoints
    const fallbacks = FALLBACK_RPC_ENDPOINTS[chainId] || []
    fallbacks.forEach((url) => {
      if (url !== primaryUrl) {
        this.endpoints.push(new RPCEndpoint(url, false))
      }
    })

    this.currentEndpointIndex = 0
    this.rateLimitResetInterval = null

    this.startRateLimitReset()
  }

  startRateLimitReset() {
    // Reset rate limit counters every second
    this.rateLimitResetInterval = setInterval(() => {
      this.endpoints.forEach((endpoint) => endpoint.resetRateLimit())
    }, 1000)
  }

  /**
   * Get the best available endpoint
   */
  getEndpoint() {
    // Try to find a healthy endpoint that can accept requests
    const healthyEndpoints = this.endpoints.filter(
      (ep) => ep.isHealthy && ep.canAcceptRequest(),
    )

    if (healthyEndpoints.length === 0) {
      // All endpoints are rate limited or unhealthy, use any healthy one
      const anyHealthy = this.endpoints.find((ep) => ep.isHealthy)
      if (anyHealthy) return anyHealthy

      // All endpoints unhealthy, use primary as last resort
      return this.endpoints[0]
    }

    // Prefer primary if available
    const primaryHealthy = healthyEndpoints.find((ep) => ep.isPrimary)
    if (primaryHealthy) return primaryHealthy

    // Use round-robin for fallbacks
    const fallbacks = healthyEndpoints.filter((ep) => !ep.isPrimary)
    if (fallbacks.length > 0) {
      const endpoint = fallbacks[this.currentEndpointIndex % fallbacks.length]
      this.currentEndpointIndex += 1
      return endpoint
    }

    return healthyEndpoints[0]
  }

  /**
   * Execute request with automatic failover
   */
  async executeRequest(requestFn) {
    const maxRetries = this.endpoints.length
    let lastError

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const endpoint = this.getEndpoint()
      const startTime = Date.now()

      try {
        const result = await requestFn(endpoint.url)
        const responseTime = Date.now() - startTime
        endpoint.recordSuccess(responseTime)
        return result
      } catch (error) {
        lastError = error
        endpoint.recordFailure()

        console.warn(
          `RPC request failed on ${endpoint.url} (attempt ${attempt + 1}/${maxRetries}):`,
          error.message,
        )

        // If this was the last attempt, throw the error
        if (attempt === maxRetries - 1) {
          break
        }

        // Wait a bit before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.min(100 * 2 ** attempt, 1000)))
      }
    }

    throw new Error(`All RPC endpoints failed for chain ${this.chainId}: ${lastError?.message}`)
  }

  /**
   * Get health statistics for all endpoints
   */
  getStats() {
    return {
      chainId: this.chainId,
      endpoints: this.endpoints.map((ep) => ep.getStats()),
      healthyCount: this.endpoints.filter((ep) => ep.isHealthy).length,
      totalCount: this.endpoints.length,
    }
  }

  cleanup() {
    if (this.rateLimitResetInterval) {
      clearInterval(this.rateLimitResetInterval)
    }
  }
}

// Global manager instances per chain
const providerManagers = new Map()

/**
 * Get or create provider manager for a chain
 */
export function getProviderManager(chainId, primaryUrl) {
  if (!providerManagers.has(chainId)) {
    providerManagers.set(chainId, new RPCProviderManager(chainId, primaryUrl))
  }
  return providerManagers.get(chainId)
}

/**
 * Execute an RPC request with load balancing and failover
 */
export async function executeWithLoadBalancing(chainId, primaryUrl, requestFn) {
  const manager = getProviderManager(chainId, primaryUrl)
  return manager.executeRequest(requestFn)
}

/**
 * Create a smart transport for viem with load balancing
 */
export function createSmartTransport(chainId, primaryUrl) {
  const manager = getProviderManager(chainId, primaryUrl)

  return http(primaryUrl, {
    batch: true,
    retryCount: 0, // We handle retries ourselves
    timeout: 10000,
    onFetchRequest: async (request) => {
      // Intercept and use load balancing
      const endpoint = manager.getEndpoint()
      if (endpoint.url !== primaryUrl) {
        // Use fallback endpoint
        const url = new URL(request.url)
        url.host = new URL(endpoint.url).host
        url.protocol = new URL(endpoint.url).protocol
        return new Request(url.toString(), request)
      }
      return request
    },
    onFetchResponse: (response) => {
      if (response.ok) {
        const endpoint = manager.endpoints[0]
        endpoint.recordSuccess(100)
      }
      return response
    },
  })
}

/**
 * Get health statistics for all chains
 */
export function getAllRPCStats() {
  const stats = {}
  providerManagers.forEach((manager, chainId) => {
    stats[chainId] = manager.getStats()
  })
  return stats
}

/**
 * Force health check on all endpoints
 */
export async function healthCheckAll() {
  const checks = []

  providerManagers.forEach((manager) => {
    manager.endpoints.forEach(async (endpoint) => {
      const check = (async () => {
        const controller = new AbortController()
        const timeout = setTimeout(
          () => controller.abort(),
          HEALTH_CHECK_CONFIG.timeout,
        )

        try {
          const response = await fetch(endpoint.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_blockNumber',
              params: [],
              id: 1,
            }),
            signal: controller.signal,
          })

          clearTimeout(timeout)

          if (response.ok) {
            endpoint.recordSuccess(100)
          } else {
            endpoint.recordFailure()
          }
        } catch (error) {
          endpoint.recordFailure()
        }
      })()

      checks.push(check)
    })
  })

  await Promise.allSettled(checks)
}

/**
 * Reset all endpoints to healthy state
 */
export function resetAllEndpoints() {
  providerManagers.forEach((manager) => {
    manager.endpoints.forEach((endpoint) => {
      endpoint.isHealthy = true
      endpoint.failureCount = 0
      endpoint.successCount = 0
    })
  })
}

/**
 * Cleanup all managers
 */
export function cleanupAllManagers() {
  providerManagers.forEach((manager) => manager.cleanup())
  providerManagers.clear()
}

// Periodic health check
if (typeof window !== 'undefined') {
  setInterval(() => {
    healthCheckAll()
  }, HEALTH_CHECK_CONFIG.interval)
}
