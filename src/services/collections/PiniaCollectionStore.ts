import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { collectionManager } from './CollectionManager'
import type { BaseDocument } from './BaseCollection'
import type { AuthenticatedDocument } from './AuthenticatedCollection'
import { authReady, currentUser } from '@/services/auth'

export interface StoreConfig {
  collection: string
  authenticated?: boolean
  userOwned?: boolean
  realtime?: boolean
  preload?: boolean
  cacheTTL?: number
}

export interface StoreState<T extends BaseDocument> {
  items: T[]
  selectedItem: T | null
  loading: boolean
  error: string | null
  initialized: boolean
  syncing: boolean // Real-time sync status
}

/**
 * Create a Pinia store integrated with our collection system
 */
export function createCollectionPiniaStore<T extends BaseDocument>(
  storeId: string,
  config: StoreConfig
) {
  const {
    collection: collectionName,
    authenticated = false,
    userOwned = false,
    realtime = false,
    preload = true,
    cacheTTL = 5 * 60 * 1000
  } = config

  return defineStore(storeId, () => {
    // Get or register collection
    const collection = collectionManager.getCollection<T>(collectionName) || 
      collectionManager.registerCollection<T>({
        name: collectionName,
        authenticated,
        options: {
          requireAuth: authenticated,
          userOwned,
          adminOverride: true,
          autoAddUserId: userOwned
        },
        preload,
        realtime
      })

    // State
    const state = ref<StoreState<T>>({
      items: [],
      selectedItem: null,
      loading: false,
      error: null,
      initialized: false,
      syncing: false
    })

    // Computed getters
    const items = computed(() => state.value.items)
    const selectedItem = computed(() => state.value.selectedItem)
    const loading = computed(() => state.value.loading)
    const error = computed(() => state.value.error)
    const initialized = computed(() => state.value.initialized)
    const syncing = computed(() => state.value.syncing)
    const isEmpty = computed(() => state.value.items.length === 0)
    const count = computed(() => state.value.items.length)

    // Real-time subscription ID
    let realtimeSubscriptionId: string | null = null

    // Helper functions
    const setLoading = (isLoading: boolean) => {
      state.value.loading = isLoading
    }

    const setError = (errorMessage: string | null) => {
      state.value.error = errorMessage
    }

    const setSyncing = (isSyncing: boolean) => {
      state.value.syncing = isSyncing
    }

    const clearError = () => {
      state.value.error = null
    }

    // Find item by ID
    const findById = (id: string): T | undefined => {
      return state.value.items.find(item => item.id === id) as T | undefined
    }

    // Find items by field value
    const findByField = <K extends keyof T>(field: K, value: T[K]): T[] => {
      return state.value.items.filter(item => (item as any)[field] === value) as T[]
    }

    // Search items
    const search = (query: string, fields: (keyof T)[]): T[] => {
      const searchTerm = query.toLowerCase()
      return state.value.items.filter(item => {
        return fields.some(field => {
          const value = (item as any)[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm)
          }
          return false
        })
      }) as T[]
    }

    // Load data from collection
    const load = async (force = false): Promise<T[]> => {
      if (!force && state.value.initialized && !state.value.error) {
        return state.value.items as T[]
      }

      try {
        setLoading(true)
        clearError()

        // Use collection manager's optimized query with caching
        const data = await collectionManager.query<T>(collectionName, undefined, !force)
        
        state.value.items = data as any
        state.value.initialized = true

        return data
      } catch (err: any) {
        setError(err.message || 'Failed to load data')
        return []
      } finally {
        setLoading(false)
      }
    }

    // Refresh data (force reload)
    const refresh = async (): Promise<T[]> => {
      return load(true)
    }

    // Create new item
    const create = async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T | null> => {
      try {
        setLoading(true)
        clearError()

        const newItem = await collection.create(data)
        
        // Add to local state if not using real-time (real-time will update automatically)
        if (!realtime) {
          state.value.items.unshift(newItem as any)
        }

        return newItem
      } catch (err: any) {
        setError(err.message || 'Failed to create item')
        return null
      } finally {
        setLoading(false)
      }
    }

    // Update existing item
    const update = async (id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>): Promise<T | null> => {
      try {
        setLoading(true)
        clearError()

        const updatedItem = await collection.update(id, data)
        
        // Update local state if not using real-time
        if (!realtime) {
          const index = state.value.items.findIndex(item => item.id === id)
          if (index >= 0) {
            state.value.items[index] = updatedItem as any
          }
        }

        // Update selected item if it's the one being updated
        if (state.value.selectedItem?.id === id) {
          state.value.selectedItem = updatedItem as any
        }

        return updatedItem
      } catch (err: any) {
        setError(err.message || 'Failed to update item')
        return null
      } finally {
        setLoading(false)
      }
    }

    // Delete item
    const remove = async (id: string): Promise<boolean> => {
      try {
        setLoading(true)
        clearError()

        await collection.delete(id)
        
        // Remove from local state if not using real-time
        if (!realtime) {
          state.value.items = state.value.items.filter(item => item.id !== id)
        }

        // Clear selected item if it was deleted
        if (state.value.selectedItem?.id === id) {
          state.value.selectedItem = null
        }

        return true
      } catch (err: any) {
        setError(err.message || 'Failed to delete item')
        return false
      } finally {
        setLoading(false)
      }
    }

    // Select item
    const select = (item: T | null) => {
      state.value.selectedItem = item as any
    }

    // Select by ID (load from server if not in cache)
    const selectById = async (id: string): Promise<T | null> => {
      // Try to find in local cache first
      let item = findById(id)
      
      if (!item) {
        try {
          setLoading(true)
          const fetchedItem = await collection.getById(id)
          item = fetchedItem || undefined
          
          if (item && !realtime) {
            // Add to local cache if not using real-time
            const existingIndex = state.value.items.findIndex(i => i.id === id)
            if (existingIndex >= 0) {
              state.value.items[existingIndex] = item as any
            } else {
              state.value.items.push(item as any)
            }
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch item')
          return null
        } finally {
          setLoading(false)
        }
      }

      select(item || null)
      return item || null
    }

    // Clear all data
    const clear = () => {
      state.value.items = []
      state.value.selectedItem = null
      state.value.error = null
      state.value.initialized = false
      stopRealtime()
    }

    // Start real-time synchronization
    const startRealtime = () => {
      if (!realtime || realtimeSubscriptionId) return

      realtimeSubscriptionId = `${storeId}_realtime`
      setSyncing(true)

      try {
        collection.subscribe(realtimeSubscriptionId, {
          onData: (data: T[]) => {
            state.value.items = data as any
            state.value.initialized = true
            setSyncing(false)
          },
          onError: (error: Error) => {
            setError(error.message)
            setSyncing(false)
          }
        })
      } catch (err: any) {
        setError(err.message || 'Failed to start real-time sync')
        setSyncing(false)
      }
    }

    // Stop real-time synchronization
    const stopRealtime = () => {
      if (realtimeSubscriptionId) {
        collection.unsubscribe(realtimeSubscriptionId)
        realtimeSubscriptionId = null
        setSyncing(false)
      }
    }

    // Auto-initialize when auth is ready (for authenticated collections)
    if (authenticated) {
      watch(authReady, (ready) => {
        if (ready && currentUser.value) {
          if (preload) {
            load()
          }
          if (realtime) {
            startRealtime()
          }
        }
      }, { immediate: true })

      // Clear data when user signs out
      watch(currentUser, (user) => {
        if (!user) {
          clear()
        }
      })
    } else if (preload) {
      // For non-authenticated collections, load immediately
      load()
      if (realtime) {
        startRealtime()
      }
    }

    // Cleanup on store disposal
    const cleanup = () => {
      stopRealtime()
      clear()
    }

    // Return store interface
    return {
      // State (computed for reactivity)
      items,
      selectedItem,
      loading,
      error,
      initialized,
      syncing,
      isEmpty,
      count,

      // Getters
      findById,
      findByField,
      search,

      // Actions
      load,
      refresh,
      create,
      update,
      remove,
      select,
      selectById,
      clear,
      clearError,

      // Real-time controls
      startRealtime,
      stopRealtime,

      // Cleanup
      cleanup,

      // Access to underlying collection
      $collection: collection
    }
  })
}

export default createCollectionPiniaStore