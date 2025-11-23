/**
 * Core Types for Collection System
 * Centralized type definitions for the simplified collection architecture
 */

import type { DocumentSnapshot } from 'firebase/firestore'

/**
 * Base document interface - all Firestore documents extend this
 */
export interface BaseDocument {
  id?: string
  createdAt?: any
  updatedAt?: any
  createdBy?: string
  updatedBy?: string
}

/**
 * Document with user ownership for authenticated collections
 */
export interface UserDocument extends BaseDocument {
  userId: string // Owner of the document
}

/**
 * Query filter operators supported by Firestore
 */
export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'

/**
 * Query where condition
 */
export interface WhereCondition {
  field: string
  operator: QueryOperator
  value: any
}

/**
 * Query ordering configuration
 */
export interface OrderByConfig {
  field: string
  direction?: 'asc' | 'desc'
}

/**
 * Query options for filtering and sorting
 */
export interface QueryOptions {
  where?: WhereCondition[]
  orderBy?: OrderByConfig[]
  limit?: number
  startAfter?: DocumentSnapshot
  endBefore?: DocumentSnapshot
}

/**
 * Pagination configuration
 */
export interface PaginationOptions {
  limit: number
  direction?: 'next' | 'prev'
}

/**
 * Collection store configuration
 */
export interface CollectionStoreConfig {
  // Collection name in Firestore
  collection: string
  
  // Authentication settings
  authenticated?: boolean  // Require user to be authenticated
  userOwned?: boolean     // Filter by userId automatically
  
  // Caching settings
  cacheTTL?: number       // Cache time-to-live in milliseconds (default: 5 minutes)
  
  // Real-time settings
  realtime?: boolean      // Enable Firestore real-time subscriptions
  
  // Auto-load settings
  autoLoad?: boolean      // Load data automatically when store is created
  
  // Error handling
  formatError?: (error: Error) => string  // Custom error message formatter
}

/**
 * Store state interface
 */
export interface CollectionState<T extends BaseDocument> {
  // Data
  items: T[]
  selectedItem: T | null
  
  // Loading states
  loading: boolean
  syncing: boolean
  
  // Error state
  error: string | null
  
  // Metadata
  initialized: boolean
  lastFetch: Date | null
  
  // Pagination
  hasMore: boolean
  lastDoc?: DocumentSnapshot
  firstDoc?: DocumentSnapshot
}

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  data: T[]
  timestamp: number
  ttl: number
}

/**
 * Load options for fetching data
 */
export interface LoadOptions extends QueryOptions {
  force?: boolean   // Force reload ignoring cache
  append?: boolean  // Append to existing data (for pagination)
}

/**
 * Collection event data
 */
export interface CollectionEvent<T = any> {
  action: 'created' | 'updated' | 'deleted' | 'loaded' | 'error'
  collection: string
  document?: T
  documents?: T[]
  previousDocument?: T
  changes?: Partial<T>
  error?: Error
  timestamp: Date
}

/**
 * Store actions return type
 */
export interface StoreActions<T extends BaseDocument> {
  // Data loading
  load(options?: LoadOptions): Promise<T[]>
  refresh(): Promise<T[]>
  paginate(options: PaginationOptions, queryOptions?: QueryOptions): Promise<T[]>
  
  // CRUD operations
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T | null>
  update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>): Promise<T | null>
  remove(id: string): Promise<boolean>
  
  // Search and filtering
  findById(id: string): T | undefined
  findByField<K extends keyof T>(field: K, value: T[K]): T[]
  search(query: string, fields: (keyof T)[]): T[]
  
  // Selection
  select(item: T | null): void
  selectById(id: string): Promise<T | null>
  
  // State management
  clear(): void
  clearError(): void
  
  // Real-time controls
  startRealtime(queryOptions?: QueryOptions): void
  stopRealtime(): void
  
  // Cleanup
  cleanup(): void
}

/**
 * Store getters return type
 */
export interface StoreGetters<T extends BaseDocument> {
  items: T[]
  selectedItem: T | null
  loading: boolean
  syncing: boolean
  error: string | null
  initialized: boolean
  isEmpty: boolean
  count: number
  hasMore: boolean
  isCacheValid: boolean
}

/**
 * Complete store interface
 */
export interface CollectionStore<T extends BaseDocument> extends StoreGetters<T>, StoreActions<T> {
  $state: CollectionState<T>
}

/**
 * Error types for better error handling
 */
export type CollectionErrorType = 
  | 'AUTHENTICATION_REQUIRED'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR'

/**
 * Structured error for collection operations
 */
export interface CollectionError {
  type: CollectionErrorType
  message: string
  originalError?: Error
  documentId?: string
  collection?: string
}
