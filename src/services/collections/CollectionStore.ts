import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import BaseCollection, { type BaseDocument, type QueryOptions, type PaginationOptions } from './BaseCollection'
import type { DocumentSnapshot } from 'firebase/firestore'

export interface CollectionState<T extends BaseDocument> {
  items: T[]
  selectedItem: T | null
  loading: boolean
  error: string | null
  initialized: boolean
  lastFetch: Date | null
  totalCount: number
  hasMore: boolean
  lastDoc?: DocumentSnapshot
  firstDoc?: DocumentSnapshot
}

export interface CollectionStoreOptions {
  cacheDuration?: number // in milliseconds, default 5 minutes
  autoLoad?: boolean // automatically load data when store is created
  realtime?: boolean // enable real-time subscriptions
}

export interface LoadOptions extends QueryOptions {
  force?: boolean // force reload even if cache is valid
  append?: boolean // append to existing data (for pagination)
}

export interface PaginateOptions extends Omit<PaginationOptions, 'startAfter' | 'endBefore'> {
  direction?: 'next' | 'prev'
  queryOptions?: Omit<QueryOptions, 'limit' | 'startAfter' | 'endBefore'>
}

/**
 * Factory function to create a Pinia store for a Firestore collection
 */
export function createCollectionStore<T extends BaseDocument>(
  storeId: string,
  collectionName: string,
  options: CollectionStoreOptions = {}
) {
  const {
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    autoLoad = true,
    realtime = false
  } = options

  return defineStore(storeId, () => {
    // Initialize collection service
    const collection = new BaseCollection<T>(collectionName)

    // State
    const state = ref<CollectionState<T>>({
      items: [],
      selectedItem: null,
      loading: false,
      error: null,
      initialized: false,
      lastFetch: null,
      totalCount: 0,
      hasMore: false,
      lastDoc: undefined,
      firstDoc: undefined
    })

    // Computed
    const items = computed(() => readonly(state.value.items))
    const selectedItem = computed(() => state.value.selectedItem)
    const loading = computed(() => state.value.loading)
    const error = computed(() => state.value.error)
    const initialized = computed(() => state.value.initialized)
    const hasMore = computed(() => state.value.hasMore)
    const totalCount = computed(() => state.value.totalCount)

    // Cache validation
    const isCacheValid = computed(() => {
      if (!state.value.lastFetch) return false
      const now = new Date()
      const diff = now.getTime() - state.value.lastFetch.getTime()
      return diff < cacheDuration
    })

    // Getters
    const getById = (id: string): T | undefined => {
      return state.value.items.find(item => item.id === id) as T | undefined
    }

    const getByField = (field: keyof T, value: any): T[] => {
      return state.value.items.filter(item => (item as any)[field] === value) as T[]
    }

    const search = (searchTerm: string, fields: (keyof T)[]): T[] => {
      const term = searchTerm.toLowerCase()
      return state.value.items.filter(item => {
        return fields.some(field => {
          const fieldValue = (item as any)[field]
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(term)
          }
          return false
        })
      }) as T[]
    }

    // Actions
    const clearError = () => {
      state.value.error = null
    }

    const setLoading = (isLoading: boolean) => {
      state.value.loading = isLoading
    }

    const setError = (errorMessage: string) => {
      state.value.error = errorMessage
      state.value.loading = false
    }

    const setItems = (newItems: T[], append = false) => {
      if (append) {
        // Remove duplicates when appending
        const existingIds = new Set(state.value.items.map(item => item.id))
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id))
        state.value.items = [...state.value.items as T[], ...uniqueNewItems] as any
      } else {
        state.value.items = newItems as any
      }
      state.value.lastFetch = new Date()
    }

    const addItem = (item: T) => {
      const existingIndex = state.value.items.findIndex(existing => existing.id === item.id)
      if (existingIndex >= 0) {
        state.value.items[existingIndex] = item as any
      } else {
        state.value.items.unshift(item as any)
        state.value.totalCount++
      }
    }

    const updateItem = (id: string, updates: Partial<T>) => {
      const index = state.value.items.findIndex(item => item.id === id)
      if (index >= 0) {
        state.value.items[index] = { ...state.value.items[index], ...updates }
      }
    }

    const removeItem = (id: string) => {
      const index = state.value.items.findIndex(item => item.id === id)
      if (index >= 0) {
        state.value.items.splice(index, 1)
        state.value.totalCount--
      }
      if (state.value.selectedItem?.id === id) {
        state.value.selectedItem = null
      }
    }

    const selectItem = (item: T | null) => {
      state.value.selectedItem = item as any
    }

    const selectById = async (id: string): Promise<T | null> => {
      // Try to find in cache first
      let item = getById(id)
      
      if (!item) {
        // Fetch from Firestore if not in cache
        try {
          setLoading(true)
          item = (await collection.getById(id)) as T | undefined
          if (item) {
            addItem(item)
          }
        } catch (err: any) {
          setError(err.message || 'Failed to fetch item')
          return null
        } finally {
          setLoading(false)
        }
      }

      selectItem(item || null)
      return item || null
    }

    const load = async (loadOptions: LoadOptions = {}): Promise<T[]> => {
      const { force = false, append = false, ...queryOptions } = loadOptions

      // Use cache if valid and not forcing reload
      if (!force && !append && isCacheValid.value && state.value.items.length > 0) {
        return state.value.items as T[]
      }

      try {
        clearError()
        setLoading(true)

        const data = await collection.getAll(queryOptions)
        setItems(data, append)
        state.value.totalCount = data.length
        state.value.initialized = true

        return data
      } catch (err: any) {
        setError(err.message || 'Failed to load data')
        return []
      } finally {
        setLoading(false)
      }
    }

    const paginate = async (paginateOptions: PaginateOptions): Promise<T[]> => {
      const { direction = 'next', queryOptions, limit } = paginateOptions

      try {
        clearError()
        setLoading(true)

        const paginationOptions = {
          limit,
          startAfter: direction === 'next' ? state.value.lastDoc : undefined,
          endBefore: direction === 'prev' ? state.value.firstDoc : undefined
        }

        const result = await collection.getPaginated(paginationOptions, queryOptions)
        
        setItems(result.data, direction === 'next')
        state.value.hasMore = result.hasMore
        state.value.lastDoc = result.lastDoc
        state.value.firstDoc = result.firstDoc

        return result.data
      } catch (err: any) {
        setError(err.message || 'Failed to paginate data')
        return []
      } finally {
        setLoading(false)
      }
    }

    const create = async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T | null> => {
      try {
        clearError()
        setLoading(true)

        const newItem = await collection.create(data)
        addItem(newItem)

        return newItem
      } catch (err: any) {
        setError(err.message || 'Failed to create item')
        return null
      } finally {
        setLoading(false)
      }
    }

    const update = async (id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>): Promise<T | null> => {
      try {
        clearError()
        setLoading(true)

        const updatedItem = await collection.update(id, data)
        updateItem(id, updatedItem)

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

    const remove = async (id: string): Promise<boolean> => {
      try {
        clearError()
        setLoading(true)

        await collection.delete(id)
        removeItem(id)

        return true
      } catch (err: any) {
        setError(err.message || 'Failed to delete item')
        return false
      } finally {
        setLoading(false)
      }
    }

    const refresh = async (queryOptions?: QueryOptions): Promise<T[]> => {
      return load({ ...queryOptions, force: true })
    }

    const clear = () => {
      state.value.items = []
      state.value.selectedItem = null
      state.value.error = null
      state.value.lastFetch = null
      state.value.initialized = false
      state.value.totalCount = 0
      state.value.hasMore = false
      state.value.lastDoc = undefined
      state.value.firstDoc = undefined
    }

    // Real-time subscriptions
    let subscriptionId: string | null = null

    const startRealtime = (queryOptions?: QueryOptions) => {
      if (!realtime || subscriptionId) return

      subscriptionId = `${storeId}_realtime`
      
      collection.subscribe(subscriptionId, {
        ...queryOptions,
        onData: (data: T[]) => {
          setItems(data)
          state.value.totalCount = data.length
          state.value.initialized = true
        },
        onError: (error: Error) => {
          setError(error.message)
        }
      })
    }

    const stopRealtime = () => {
      if (subscriptionId) {
        collection.unsubscribe(subscriptionId)
        subscriptionId = null
      }
    }

    // Cleanup
    const cleanup = () => {
      stopRealtime()
      collection.cleanup()
      clear()
    }

    // Auto-load data if enabled
    if (autoLoad) {
      load().then(() => {
        if (realtime) {
          startRealtime()
        }
      })
    }

    // Return store interface
    return {
      // State (readonly)
      items,
      selectedItem,
      loading,
      error,
      initialized,
      hasMore,
      totalCount,
      isCacheValid,

      // Getters
      getById,
      getByField,
      search,

      // Actions
      load,
      paginate,
      create,
      update,
      remove,
      refresh,
      clear,
      selectItem,
      selectById,
      clearError,

      // Real-time
      startRealtime,
      stopRealtime,

      // Cleanup
      cleanup,

      // Access to underlying collection (for advanced operations)
      $collection: collection
    }
  })
}

export default createCollectionStore