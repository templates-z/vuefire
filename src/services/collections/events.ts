/**
 * Collection Event System
 * Provides utilities to subscribe to collection events using the app-level event dispatcher
 */

import { subscribe, unsubscribe, dispatch } from '@/services/dispatcher'

export interface CollectionEventData {
  action: 'created' | 'updated' | 'deleted' | 'data_loaded' | 'error' | 'unknown'
  document?: any
  documents?: any[]
  previousDocument?: any
  changes?: any
  collection: string
  subscriptionId?: string
  documentId?: string
  error?: any
  timestamp: Date
}

export type CollectionEventCallback = (data: CollectionEventData) => void

/**
 * Collection Event Subscriptions
 * These utilities make it easy to listen to collection changes throughout the app
 */

// ========== COLLECTION-LEVEL EVENTS ==========

/**
 * Subscribe to all changes in a collection (create, update, delete)
 */
export function subscribeToCollectionChanges(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:changed`, callback)
}

/**
 * Subscribe to document creation in a collection
 */
export function subscribeToCollectionCreates(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:created`, callback)
}

/**
 * Subscribe to document updates in a collection
 */
export function subscribeToCollectionUpdates(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:updated`, callback)
}

/**
 * Subscribe to document deletions in a collection
 */
export function subscribeToCollectionDeletes(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:deleted`, callback)
}

/**
 * Subscribe to real-time changes (from Firestore subscriptions)
 */
export function subscribeToCollectionRealtime(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:realtime`, callback)
}

/**
 * Subscribe to data loading events
 */
export function subscribeToCollectionData(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:data`, callback)
}

/**
 * Subscribe to collection errors
 */
export function subscribeToCollectionErrors(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:error`, callback)
}

// ========== DOCUMENT-LEVEL EVENTS ==========

/**
 * Subscribe to changes on a specific document
 */
export function subscribeToDocumentChanges(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:document:${documentId}:changed`, callback)
}

/**
 * Subscribe to a specific document creation
 */
export function subscribeToDocumentCreated(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:document:${documentId}:created`, callback)
}

/**
 * Subscribe to a specific document updates
 */
export function subscribeToDocumentUpdated(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:document:${documentId}:updated`, callback)
}

/**
 * Subscribe to a specific document deletion
 */
export function subscribeToDocumentDeleted(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:document:${documentId}:deleted`, callback)
}

/**
 * Subscribe to errors on a specific document
 */
export function subscribeToDocumentErrors(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  subscribe(`collection:${collectionName}:document:${documentId}:error`, callback)
}

// ========== UNSUBSCRIBE UTILITIES ==========

/**
 * Unsubscribe from all collection events
 */
export function unsubscribeFromCollectionChanges(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:changed`, callback)
}

export function unsubscribeFromCollectionCreates(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:created`, callback)
}

export function unsubscribeFromCollectionUpdates(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:updated`, callback)
}

export function unsubscribeFromCollectionDeletes(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:deleted`, callback)
}

export function unsubscribeFromCollectionRealtime(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:realtime`, callback)
}

export function unsubscribeFromCollectionData(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:data`, callback)
}

export function unsubscribeFromCollectionErrors(
  collectionName: string, 
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:error`, callback)
}

// Document unsubscribe functions
export function unsubscribeFromDocumentChanges(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:document:${documentId}:changed`, callback)
}

export function unsubscribeFromDocumentCreated(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:document:${documentId}:created`, callback)
}

export function unsubscribeFromDocumentUpdated(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:document:${documentId}:updated`, callback)
}

export function unsubscribeFromDocumentDeleted(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:document:${documentId}:deleted`, callback)
}

export function unsubscribeFromDocumentErrors(
  collectionName: string,
  documentId: string,
  callback: CollectionEventCallback
): void {
  unsubscribe(`collection:${collectionName}:document:${documentId}:error`, callback)
}

// ========== MANUAL EVENT DISPATCHING ==========

/**
 * Manually dispatch a collection event (useful for testing or custom scenarios)
 */
export function dispatchCollectionEvent(
  collectionName: string,
  action: CollectionEventData['action'],
  data: Partial<CollectionEventData>
): void {
  const eventData: CollectionEventData = {
    action,
    collection: collectionName,
    timestamp: new Date(),
    ...data
  }

  // Dispatch specific action event
  dispatch(`collection:${collectionName}:${action}`, eventData)
  
  // Dispatch generic change event (unless it's data_loaded or error)
  if (action !== 'data_loaded' && action !== 'error') {
    dispatch(`collection:${collectionName}:changed`, eventData)
  }
}

/**
 * Manually dispatch a document event
 */
export function dispatchDocumentEvent(
  collectionName: string,
  documentId: string,
  action: CollectionEventData['action'],
  data: Partial<CollectionEventData>
): void {
  const eventData: CollectionEventData = {
    action,
    collection: collectionName,
    documentId,
    timestamp: new Date(),
    ...data
  }

  // Dispatch specific document action event
  dispatch(`collection:${collectionName}:document:${documentId}:${action}`, eventData)
  
  // Dispatch generic document change event (unless it's error)
  if (action !== 'error') {
    dispatch(`collection:${collectionName}:document:${documentId}:changed`, eventData)
  }
}

// ========== UTILITIES ==========

/**
 * Create a complete event handler that logs all collection activity
 */
export function createCollectionLogger(collectionName: string): CollectionEventCallback {
  return (data: CollectionEventData) => {
    console.log(`[${collectionName.toUpperCase()}] ${data.action}:`, {
      timestamp: data.timestamp,
      document: data.document?.id,
      collection: data.collection,
      subscriptionId: data.subscriptionId,
      documentId: data.documentId
    })
  }
}

/**
 * Create a simple notification handler for collection changes
 */
export function createCollectionNotifier(
  collectionName: string,
  notifyCallback: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void
): CollectionEventCallback {
  return (data: CollectionEventData) => {
    let message = ''
    let type: 'success' | 'info' | 'warning' | 'error' = 'info'
    
    switch (data.action) {
      case 'created':
        message = `New ${collectionName} created`
        type = 'success'
        break
      case 'updated':
        message = `${collectionName} updated`
        type = 'info'
        break
      case 'deleted':
        message = `${collectionName} deleted`
        type = 'warning'
        break
      case 'error':
        message = `Error in ${collectionName}: ${data.error?.message || 'Unknown error'}`
        type = 'error'
        break
      default:
        return // Don't notify for data_loaded and other events
    }
    
    notifyCallback(message, type)
  }
}

/**
 * Batch subscribe to multiple collection events with one callback
 */
export function batchSubscribeToCollection(
  collectionName: string,
  events: Array<'created' | 'updated' | 'deleted' | 'realtime' | 'data' | 'error'>,
  callback: CollectionEventCallback
): void {
  events.forEach(event => {
    switch (event) {
      case 'created':
        subscribeToCollectionCreates(collectionName, callback)
        break
      case 'updated':
        subscribeToCollectionUpdates(collectionName, callback)
        break
      case 'deleted':
        subscribeToCollectionDeletes(collectionName, callback)
        break
      case 'realtime':
        subscribeToCollectionRealtime(collectionName, callback)
        break
      case 'data':
        subscribeToCollectionData(collectionName, callback)
        break
      case 'error':
        subscribeToCollectionErrors(collectionName, callback)
        break
    }
  })
}

/**
 * Batch unsubscribe from multiple collection events
 */
export function batchUnsubscribeFromCollection(
  collectionName: string,
  events: Array<'created' | 'updated' | 'deleted' | 'realtime' | 'data' | 'error'>,
  callback: CollectionEventCallback
): void {
  events.forEach(event => {
    switch (event) {
      case 'created':
        unsubscribeFromCollectionCreates(collectionName, callback)
        break
      case 'updated':
        unsubscribeFromCollectionUpdates(collectionName, callback)
        break
      case 'deleted':
        unsubscribeFromCollectionDeletes(collectionName, callback)
        break
      case 'realtime':
        unsubscribeFromCollectionRealtime(collectionName, callback)
        break
      case 'data':
        unsubscribeFromCollectionData(collectionName, callback)
        break
      case 'error':
        unsubscribeFromCollectionErrors(collectionName, callback)
        break
    }
  })
}