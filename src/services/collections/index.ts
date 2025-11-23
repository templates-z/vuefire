/**
 * Simplified Collection System - Clean Exports
 * Single, focused approach to Firestore + Pinia integration
 */

// Main store factory
export { createCollectionStore } from './createCollectionStore'

// Core Firestore service (for advanced use cases)
export { FirestoreCollection } from './FirestoreCollection'

// Utilities
export { cache, auth, formatFirestoreError, createError } from './utils'

// Type exports
export type {
  BaseDocument,
  UserDocument,
  QueryOptions,
  QueryOperator,
  WhereCondition,
  OrderByConfig,
  PaginationOptions,
  CollectionStoreConfig,
  CollectionState,
  LoadOptions,
  CollectionEvent,
  CollectionError,
  CollectionErrorType,
  CacheEntry
} from './types'