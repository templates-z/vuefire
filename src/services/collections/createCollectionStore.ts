/**
 * Unified Pinia Store Factory for Collections
 * Single, focused approach to collection state management
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { FirestoreCollection } from './FirestoreCollection'
import { cache, auth, formatFirestoreError, addUserFilter } from './utils'
import { currentUser, authReady } from '@/services/auth'
import type {
  BaseDocument,
  CollectionStoreConfig,
  CollectionState,
  QueryOptions,
  LoadOptions,
  PaginationOptions
} from './types'

/**
 * Create a Pinia store for a Firestore collection
 * This is the main entry point for collection management
 */
export function createCollectionStore<T extends BaseDocument>(
  storeId: string,
  config: CollectionStoreConfig
) {
  const {
    collection: collectionName,
    authenticated = false,
    userOwned = false,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    realtime = false,
    autoLoad = true,
    formatError = formatFirestoreError
  } = config

  return defineStore(storeId, () => {
    // Initialize Firestore collection service
    const firestoreCollection = new FirestoreCollection<T>(collectionName)

    // State
    const state = ref<CollectionState<T>>({
      items: [],
      selectedItem: null,
      loading: false,
      syncing: false,
      error: null,
      initialized: false,
      lastFetch: null,
      hasMore: false,
      lastDoc: undefined,
      firstDoc: undefined
    })

    // Real-time subscription ID
    let realtimeSubscriptionId: string | null = null

    // ==================== COMPUTED GETTERS ====================

    const items = computed(() => state.value.items)
    const selectedItem = computed(() => state.value.selectedItem)
    const loading = computed(() => state.value.loading)
    const syncing = computed(() => state.value.syncing)
    const error = computed(() => state.value.error)
    const initialized = computed(() => state.value.initialized)
    const isEmpty = computed(() => state.value.items.length === 0)
    const count = computed(() => state.value.items.length)
    const hasMore = computed(() => state.value.hasMore)

    const isCacheValid = computed(() => {
      if (!state.value.lastFetch) return false
      const now = Date.now()
      const diff = now - state.value.lastFetch.getTime()
      return diff < cacheTTL
    })

    // ==================== HELPER FUNCTIONS ====================

    const setLoading = (isLoading: boolean) => {
      state.value.loading = isLoading
    }

    const setSyncing = (isSyncing: boolean) => {
      state.value.syncing = isSyncing
    }

    const setError = (errorMessage: string | null) => {
      state.value.error = errorMessage
    }

    const clearError = () => {
      state.value.error = null
    }

    const getCacheKey = (queryOptions?: QueryOptions): string => {
      return cache.generateKey(collectionName, queryOptions)
    }

    const applyCachedData = (key: string): boolean => {
      const cachedData = cache.get<T>(key)
      if (cachedData) {
        state.value.items = cachedData as any
        state.value.initialized = true
        return true
      }
      return false
    }

    const cacheData = (key: string, data: T[]): void => {
      cache.set(key, data, cacheTTL)
      state.value.lastFetch = new Date()
    }

    const applyQueryOptions = (options?: QueryOptions): QueryOptions | undefined => {
      if (!userOwned) return options

      // Add userId filter for user-owned collections
      const userId = auth.getUserId()
      if (!userId) {
        throw new Error('User must be authenticated for user-owned collections')
      }

      return addUserFilter(options, userId)
    }

    const checkAuth = (): void => {
      if (authenticated || userOwned) {
        auth.requireAuth()
      }
    }

    // ==================== SEARCH & FILTERING ====================

    const findById = (id: string): T | undefined => {
      return state.value.items.find(item => item.id === id) as T | undefined
    }

    const findByField = <K extends keyof T>(field: K, value: T[K]): T[] => {
      return state.value.items.filter(item => (item as any)[field] === value) as T[]
    }

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

    // ==================== DATA LOADING ====================

    const load = async (options?: LoadOptions): Promise<T[]> => {
      const { force = false, append = false, ...queryOptions } = options || {}

      try {
        // Check authentication if required
        checkAuth()

        // Check cache first (unless forcing reload or appending)
        if (!force && !append) {
          const cacheKey = getCacheKey(queryOptions)
          if (applyCachedData(cacheKey)) {
            return state.value.items as T[]
          }
        }

        clearError()
        setLoading(true)

        // Apply query options with user filter if needed
        const finalOptions = applyQueryOptions(queryOptions)

        // Fetch from Firestore
        const data = await firestoreCollection.getAll(finalOptions)

        // Update state
        if (append) {
          // Remove duplicates when appending
          const existingIds = new Set(state.value.items.map(item => item.id))
          const newItems = data.filter(item => !existingIds.has(item.id))
          state.value.items = [...state.value.items, ...newItems] as any
        } else {
          state.value.items = data as any
        }

        state.value.initialized = true

        // Cache the results
        if (!append) {
          const cacheKey = getCacheKey(queryOptions)
          cacheData(cacheKey, data)
        }

        return data
      } catch (err: any) {
        const errorMessage = formatError(err)
        setError(errorMessage)
        console.error(`Error loading ${collectionName}:`, err)
        return []
      } finally {
        setLoading(false)
      }
    }

    const refresh = async (): Promise<T[]> => {
      // Invalidate cache and reload
      cache.invalidateCollection(collectionName)
      return load({ force: true })
    }

    const paginate = async (
      paginationOptions: PaginationOptions,
      queryOptions?: QueryOptions
    ): Promise<T[]> => {
      try {
        checkAuth()
        clearError()
        setLoading(true)

        const finalOptions = applyQueryOptions(queryOptions)

        const result = await firestoreCollection.getPaginated(
          paginationOptions,
          finalOptions
        )

        // Update state based on direction
        if (paginationOptions.direction === 'prev') {
          state.value.items = result.data as any
        } else {
          // Append for 'next' direction
          const existingIds = new Set(state.value.items.map(item => item.id))
          const newItems = result.data.filter(item => !existingIds.has(item.id))
          state.value.items = [...state.value.items, ...newItems] as any
        }

        state.value.hasMore = result.hasMore
        state.value.lastDoc = result.lastDoc
        state.value.firstDoc = result.firstDoc

        return result.data
      } catch (err: any) {
        const errorMessage = formatError(err)
        setError(errorMessage)
        console.error(`Error paginating ${collectionName}:`, err)
        return []
      } finally {
        setLoading(false)
      }
    }

    // ==================== CRUD OPERATIONS ====================

    const create = async (
      data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
    ): Promise<T | null> => {
      try {
        checkAuth()
        clearError()
        setLoading(true)

        // Add userId for user-owned collections
        let finalData = data
        if (userOwned) {
          const userId = auth.getUserId()
          if (userId) {
            finalData = { ...data, userId } as any
          }
        }

        const newItem = await firestoreCollection.create(finalData)

        // Add to state if not using real-time (real-time will update automatically)
        if (!realtime) {
          state.value.items.unshift(newItem as any)
        }

        // Invalidate cache
        cache.invalidateCollection(collectionName)

        return newItem
      } catch (err: any) {
        const errorMessage = formatError(err)
        setError(errorMessage)
        console.error(`Error creating ${collectionName}:`, err)
        return null
      } finally {
        setLoading(false)
      }
    }

    const update = async (
      id: string,
      data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>
    ): Promise<T | null> => {
      try {
        checkAuth()
        clearError()
        setLoading(true)

        // Check ownership for user-owned collections
        if (userOwned) {
          const existingItem = findById(id)
          if (existingItem && !auth.ownsDocument(existingItem as any)) {
            throw new Error('You do not have permission to update this item')
          }
        }

        const updatedItem = await firestoreCollection.update(id, data)

        // Update state if not using real-time
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

        // Invalidate cache
        cache.invalidateCollection(collectionName)

        return updatedItem
      } catch (err: any) {
        const errorMessage = formatError(err)
        setError(errorMessage)
        console.error(`Error updating ${collectionName}:`, err)
        return null
      } finally {
        setLoading(false)
      }
    }

    const remove = async (id: string): Promise<boolean> => {
      try {
        checkAuth()
        clearError()
        setLoading(true)

        // Check ownership for user-owned collections
        if (userOwned) {
          const existingItem = findById(id)
          if (existingItem && !auth.ownsDocument(existingItem as any)) {
            throw new Error('You do not have permission to delete this item')
          }
        }

        await firestoreCollection.delete(id)

        // Remove from state if not using real-time
        if (!realtime) {
          state.value.items = state.value.items.filter(item => item.id !== id)
        }

        // Clear selected item if it was deleted
        if (state.value.selectedItem?.id === id) {
          state.value.selectedItem = null
        }

        // Invalidate cache
        cache.invalidateCollection(collectionName)

        return true
      } catch (err: any) {
        const errorMessage = formatError(err)
        setError(errorMessage)
        console.error(`Error deleting ${collectionName}:`, err)
        return false
      } finally {
        setLoading(false)
      }
    }

    // ==================== SELECTION ====================

    const select = (item: T | null) => {
      state.value.selectedItem = item as any
    }

    const selectById = async (id: string): Promise<T | null> => {
      // Try to find in cache first
      let item = findById(id)

      if (!item) {
        try {
          checkAuth()
          setLoading(true)
          const fetchedItem = await firestoreCollection.getById(id)
          item = fetchedItem || undefined

          // Add to cache if not using real-time
          if (item && !realtime) {
            const existingIndex = state.value.items.findIndex(i => i.id === id)
            if (existingIndex >= 0) {
              state.value.items[existingIndex] = item as any
            } else {
              state.value.items.push(item as any)
            }
          }
        } catch (err: any) {
          const errorMessage = formatError(err)
          setError(errorMessage)
          console.error(`Error fetching ${collectionName}/${id}:`, err)
          return null
        } finally {
          setLoading(false)
        }
      }

      select(item || null)
      return item || null
    }

    // ==================== REAL-TIME SUBSCRIPTIONS ====================

    const startRealtime = (queryOptions?: QueryOptions) => {
      if (!realtime || realtimeSubscriptionId) return

      try {
        checkAuth()
        setSyncing(true)

        const finalOptions = applyQueryOptions(queryOptions)
        realtimeSubscriptionId = `${storeId}_realtime`

        firestoreCollection.subscribe(realtimeSubscriptionId, {
          queryOptions: finalOptions,
          onData: (data: T[]) => {
            state.value.items = data as any
            state.value.initialized = true
            setSyncing(false)

            // Update cache
            const cacheKey = getCacheKey(queryOptions)
            cacheData(cacheKey, data)
          },
          onError: (err: Error) => {
            const errorMessage = formatError(err)
            setError(errorMessage)
            setSyncing(false)
          }
        })
      } catch (err: any) {
        const errorMessage = formatError(err)
        setError(errorMessage)
        setSyncing(false)
      }
    }

    const stopRealtime = () => {
      if (realtimeSubscriptionId) {
        firestoreCollection.unsubscribe(realtimeSubscriptionId)
        realtimeSubscriptionId = null
        setSyncing(false)
      }
    }

    // ==================== STATE MANAGEMENT ====================

    const clear = () => {
      state.value.items = []
      state.value.selectedItem = null
      state.value.error = null
      state.value.initialized = false
      state.value.lastFetch = null
      state.value.hasMore = false
      state.value.lastDoc = undefined
      state.value.firstDoc = undefined
      stopRealtime()
    }

    const cleanup = () => {
      stopRealtime()
      firestoreCollection.cleanup()
      clear()
    }

    // ==================== INITIALIZATION ====================

    // Auto-initialize for authenticated collections
    if (authenticated || userOwned) {
      watch(
        authReady,
        (ready) => {
          if (ready && currentUser.value) {
            if (autoLoad) {
              load()
            }
            if (realtime) {
              startRealtime()
            }
          }
        },
        { immediate: true }
      )

      // Clear data when user signs out
      watch(currentUser, (user) => {
        if (!user) {
          clear()
        }
      })
    } else if (autoLoad) {
      // For non-authenticated collections, load immediately
      load()
      if (realtime) {
        startRealtime()
      }
    }

    // ==================== RETURN STORE INTERFACE ====================

    return {
      // State (computed for reactivity)
      items,
      selectedItem,
      loading,
      syncing,
      error,
      initialized,
      isEmpty,
      count,
      hasMore,
      isCacheValid,

      // Search & filtering
      findById,
      findByField,
      search,

      // Data loading
      load,
      refresh,
      paginate,

      // CRUD operations
      create,
      update,
      remove,

      // Selection
      select,
      selectById,

      // State management
      clear,
      clearError,

      // Real-time controls
      startRealtime,
      stopRealtime,

      // Cleanup
      cleanup,

      // Direct access to state (for debugging)
      $state: state.value
    }
  })
}
