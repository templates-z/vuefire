import { ref, computed } from 'vue'
import BaseCollection, { type BaseDocument } from './BaseCollection'
import AuthenticatedCollection, { type AuthenticatedDocument, type AuthCollectionOptions } from './AuthenticatedCollection'
import { currentUser, authReady } from '@/services/auth'

export interface CollectionConfig {
  name: string
  authenticated?: boolean
  options?: AuthCollectionOptions
  preload?: boolean // Load data immediately when user authenticates
  realtime?: boolean // Enable real-time subscriptions
}

export interface CacheMetrics {
  totalCollections: number
  totalDocuments: number
  cacheHits: number
  cacheMisses: number
  memoryUsage: number
}

/**
 * Central collection manager for optimized Firestore operations
 */
export class CollectionManager {
  private collections = new Map<string, BaseCollection<any> | AuthenticatedCollection<any>>()
  private subscriptions = new Map<string, string[]>() // Collection -> subscription IDs
  private cache = new Map<string, { data: any[], timestamp: number, ttl: number }>()
  private metrics = ref<CacheMetrics>({
    totalCollections: 0,
    totalDocuments: 0,
    cacheHits: 0,
    cacheMisses: 0,
    memoryUsage: 0
  })

  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
  private readonly MAX_CACHE_SIZE = 100 // Maximum number of cached queries

  constructor() {
    // Clear caches when user signs out
    this.watchAuthState()
  }

  /**
   * Watch authentication state changes
   */
  private watchAuthState() {
    // This would be implemented with a proper watcher in a real Vue app
    // For now, we'll provide the interface
  }

  /**
   * Register a collection
   */
  registerCollection<T extends BaseDocument>(
    config: CollectionConfig
  ): BaseCollection<T> | AuthenticatedCollection<T> {
    const { name, authenticated = false, options = {}, preload = false, realtime = false } = config

    let collection: BaseCollection<T> | AuthenticatedCollection<T>

    if (authenticated) {
      collection = new AuthenticatedCollection<T>(name, options)
    } else {
      collection = new BaseCollection<T>(name)
    }

    this.collections.set(name, collection)
    this.subscriptions.set(name, [])
    this.metrics.value.totalCollections++

    // Auto-preload if configured and user is authenticated
    if (preload && authReady.value && currentUser.value) {
      this.preloadCollection(name)
    }

    // Enable real-time if configured
    if (realtime) {
      this.enableRealtime(name)
    }

    return collection
  }

  /**
   * Get registered collection
   */
  getCollection<T extends BaseDocument>(name: string): BaseCollection<T> | AuthenticatedCollection<T> | null {
    return this.collections.get(name) || null
  }

  /**
   * Preload collection data
   */
  private async preloadCollection(name: string) {
    const collection = this.collections.get(name)
    if (!collection) return

    try {
      const data = await collection.getAll()
      this.setCacheData(name, data)
    } catch (error) {
      console.error(`Failed to preload collection ${name}:`, error)
    }
  }

  /**
   * Enable real-time subscriptions for a collection
   */
  private enableRealtime(name: string) {
    const collection = this.collections.get(name)
    if (!collection) return

    const subscriptionId = `${name}_realtime`
    
    try {
      collection.subscribe(subscriptionId, {
        onData: (data: any[]) => {
          this.setCacheData(name, data)
        },
        onError: (error: Error) => {
          console.error(`Real-time subscription error for ${name}:`, error)
        }
      })

      const subs = this.subscriptions.get(name) || []
      subs.push(subscriptionId)
      this.subscriptions.set(name, subs)
    } catch (error) {
      console.error(`Failed to enable real-time for ${name}:`, error)
    }
  }

  /**
   * Set cache data with TTL
   */
  private setCacheData(key: string, data: any[], ttl = this.DEFAULT_CACHE_TTL) {
    // Implement LRU cache eviction if needed
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = Array.from(this.cache.keys())[0]
      this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })

    this.updateMetrics()
  }

  /**
   * Get cached data if valid
   */
  private getCacheData(key: string): any[] | null {
    const cached = this.cache.get(key)
    if (!cached) {
      this.metrics.value.cacheMisses++
      return null
    }

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      this.metrics.value.cacheMisses++
      return null
    }

    this.metrics.value.cacheHits++
    return cached.data
  }

  /**
   * Update cache metrics
   */
  private updateMetrics() {
    this.metrics.value.totalDocuments = Array.from(this.cache.values())
      .reduce((total, cache) => total + cache.data.length, 0)
    
    // Rough memory usage estimation
    this.metrics.value.memoryUsage = Array.from(this.cache.values())
      .reduce((total, cache) => total + JSON.stringify(cache.data).length, 0)
  }

  /**
   * Optimized query with caching
   */
  async query<T extends BaseDocument>(
    collectionName: string,
    options?: any,
    useCache = true
  ): Promise<T[]> {
    const cacheKey = `${collectionName}_${JSON.stringify(options || {})}`
    
    // Try cache first
    if (useCache) {
      const cached = this.getCacheData(cacheKey)
      if (cached) {
        return cached
      }
    }

    // Query from Firestore
    const collection = this.getCollection<T>(collectionName)
    if (!collection) {
      throw new Error(`Collection ${collectionName} not registered`)
    }

    try {
      const data = await collection.getAll(options)
      
      // Cache the results
      if (useCache) {
        this.setCacheData(cacheKey, data)
      }

      return data
    } catch (error) {
      console.error(`Query failed for ${collectionName}:`, error)
      throw error
    }
  }

  /**
   * Batch operations across multiple collections
   */
  async batchOperations(operations: Array<{
    collection: string
    operation: 'create' | 'update' | 'delete'
    data?: any
    id?: string
  }>): Promise<void> {
    // Group operations by collection to optimize batch size
    const operationsByCollection = new Map<string, typeof operations>()
    
    for (const op of operations) {
      const existing = operationsByCollection.get(op.collection) || []
      existing.push(op)
      operationsByCollection.set(op.collection, existing)
    }

    // Execute batch operations per collection
    const promises = Array.from(operationsByCollection.entries()).map(async ([collectionName, ops]) => {
      const collection = this.getCollection(collectionName)
      if (!collection) {
        throw new Error(`Collection ${collectionName} not registered`)
      }

      const batch = collection.createBatch()

      for (const op of ops) {
        switch (op.operation) {
          case 'create':
            if (op.id) {
              collection.batchCreate(batch, op.data, op.id)
            } else {
              collection.batchCreate(batch, op.data)
            }
            break
          case 'update':
            if (op.id) {
              collection.batchUpdate(batch, op.id, op.data)
            }
            break
          case 'delete':
            if (op.id) {
              collection.batchDelete(batch, op.id)
            }
            break
        }
      }

      await collection.commitBatch(batch)
    })

    await Promise.all(promises)
    
    // Invalidate related caches
    for (const [collectionName] of operationsByCollection) {
      this.invalidateCache(collectionName)
    }
  }

  /**
   * Invalidate cache for a collection
   */
  invalidateCache(collectionName: string) {
    const keysToDelete = Array.from(this.cache.keys())
      .filter(key => key.startsWith(collectionName))
    
    for (const key of keysToDelete) {
      this.cache.delete(key)
    }

    this.updateMetrics()
  }

  /**
   * Clear cache for a specific collection
   */
  clearCache(collectionName: string) {
    // Remove all cache entries for this collection
    for (const key of this.cache.keys()) {
      if (key.startsWith(collectionName + ':')) {
        this.cache.delete(key)
      }
    }
    this.updateMetrics()
  }

  /**
   * Clear all caches
   */
  clearAllCaches() {
    this.cache.clear()
    this.metrics.value.cacheHits = 0
    this.metrics.value.cacheMisses = 0
    this.metrics.value.totalDocuments = 0
    this.metrics.value.memoryUsage = 0
  }

  /**
   * Get cache metrics
   */
  getMetrics() {
    return computed(() => this.metrics.value)
  }

  /**
   * Cleanup all resources
   */
  cleanup() {
    // Unsubscribe from all real-time subscriptions
    for (const [collectionName, subscriptionIds] of this.subscriptions) {
      const collection = this.collections.get(collectionName)
      if (collection) {
        for (const subId of subscriptionIds) {
          collection.unsubscribe(subId)
        }
        collection.cleanup()
      }
    }

    // Clear all data structures
    this.collections.clear()
    this.subscriptions.clear()
    this.clearAllCaches()
  }

  /**
   * Optimize collections (run periodically)
   */
  optimize() {
    const now = Date.now()
    
    // Remove expired cache entries
    for (const [key, cached] of this.cache) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key)
      }
    }

    this.updateMetrics()
  }
}

// Singleton instance
export const collectionManager = new CollectionManager()

// Utility functions for the collection system
export function createOptimizedCollection<T extends BaseDocument>(name: string, options?: Partial<CollectionConfig>) {
  return collectionManager.registerCollection<T>({
    name,
    authenticated: false,
    preload: true,
    realtime: false,
    ...options
  })
}

export function invalidateCollectionCache(collectionName: string) {
  collectionManager.clearCache(collectionName)
}

export function getCollectionMetrics() {
  return collectionManager.getMetrics()
}

export function optimizeCollections() {
  collectionManager.optimize()
}

// Helper functions for common collection types
export function createServiceCollection<T extends BaseDocument>(name: string) {
  return collectionManager.registerCollection<T>({
    name,
    authenticated: false,  
    preload: true,
    realtime: false
  })
}

export function createUserCollection<T extends AuthenticatedDocument>(name: string) {
  return collectionManager.registerCollection<T>({
    name,
    authenticated: true,
    options: {
      requireAuth: true,
      userOwned: true,
      adminOverride: true,
      autoAddUserId: true
    },
    preload: true,
    realtime: true
  })
}

export function createSharedCollection<T extends AuthenticatedDocument>(name: string) {
  return collectionManager.registerCollection<T>({
    name,
    authenticated: true,
    options: {
      requireAuth: true,
      userOwned: false,
      adminOverride: true,
      autoAddUserId: false
    },
    preload: false,
    realtime: true
  })
}

export default CollectionManager