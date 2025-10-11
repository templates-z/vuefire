// Collection System Exports
import type { BaseDocument } from './BaseCollection'
import { collectionManager, createServiceCollection, createUserCollection } from './CollectionManager'

// Core collection classes
export { default as BaseCollection } from './BaseCollection'
export { default as AuthenticatedCollection, createAuthenticatedCollection, createUserOwnedCollection } from './AuthenticatedCollection'
export { default as CollectionManager, collectionManager, createServiceCollection, createUserCollection, createSharedCollection } from './CollectionManager'

// Store factories
export { default as createCollectionStore } from './CollectionStore'
export { default as createCollectionPiniaStore } from './PiniaCollectionStore'

// Type exports
export type {
  BaseDocument,
  QueryOptions,
  PaginationOptions,
  SubscriptionOptions,
  DocumentSubscriptionOptions
} from './BaseCollection'

export type {
  AuthenticatedDocument,
  UserOwnedDocument,
  SecurityRule,
  AuthCollectionOptions
} from './AuthenticatedCollection'

export type {
  CollectionConfig,
  CacheMetrics
} from './CollectionManager'

export type {
  CollectionState,
  CollectionStoreOptions,
  LoadOptions,
  PaginateOptions
} from './CollectionStore'

export type {
  StoreConfig,
  StoreState
} from './PiniaCollectionStore'

// Utilities
export {
  createOptimizedCollection,
  invalidateCollectionCache,
  getCollectionMetrics,
  optimizeCollections
} from './CollectionManager'

// Event System
export * from './events'