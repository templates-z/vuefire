import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  runTransaction,
  type Query,
  type DocumentSnapshot,
  type QuerySnapshot,
  type QueryConstraint,
  type Unsubscribe,
  type DocumentData,
  type CollectionReference,
  type DocumentReference,
  type Transaction,
  type WriteBatch,
} from 'firebase/firestore'
import { firebase } from '@/services/firebase'
import { dispatch } from '@/services/dispatcher'
import { currentUser } from '@/services/auth'
import type { User } from 'firebase/auth'

export interface BaseDocument {
  id?: string
  createdAt?: any
  updatedAt?: any
  createdBy?: string
  updatedBy?: string
}

export interface QueryOptions {
  where?: Array<{
    field: string
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'
    value: any
  }>
  orderBy?: Array<{
    field: string
    direction?: 'asc' | 'desc'
  }>
  limit?: number
  startAfter?: DocumentSnapshot
  endBefore?: DocumentSnapshot
}

export interface PaginationOptions {
  limit: number
  startAfter?: DocumentSnapshot
  endBefore?: DocumentSnapshot
}

export interface SubscriptionOptions extends QueryOptions {
  onData: (data: any[]) => void
  onError?: (error: Error) => void
}

export interface DocumentSubscriptionOptions {
  onData: (data: any | null) => void
  onError?: (error: Error) => void
}

export class BaseCollection<T extends BaseDocument> {
  private collectionRef: CollectionReference<DocumentData>
  private collectionName: string
  private activeSubscriptions: Map<string, Unsubscribe> = new Map()

  constructor(collectionName: string) {
    if (!firebase.db) {
      throw new Error('Firestore not initialized')
    }
    this.collectionName = collectionName
    this.collectionRef = collection(firebase.db, collectionName)
  }

  /**
   * Get collection reference
   */
  getCollectionRef(): CollectionReference<DocumentData> {
    return this.collectionRef
  }

  /**
   * Get document reference
   */
  getDocRef(id: string): DocumentReference<DocumentData> {
    return doc(this.collectionRef, id)
  }

  /**
   * Add audit fields to document
   */
  private addAuditFields(data: Partial<T>, isUpdate = false): Partial<T> {
    const user = currentUser.value
    const timestamp = serverTimestamp()
    
    if (isUpdate) {
      return {
        ...data,
        updatedAt: timestamp,
        updatedBy: user?.uid || 'system'
      }
    } else {
      return {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: user?.uid || 'system',
        updatedBy: user?.uid || 'system'
      }
    }
  }

  /**
   * Build Firestore query from options
   */
  private buildQuery(options?: QueryOptions): Query<DocumentData> {
    let q: Query<DocumentData> = this.collectionRef

    if (options?.where) {
      for (const condition of options.where) {
        q = query(q, where(condition.field, condition.operator, condition.value))
      }
    }

    if (options?.orderBy) {
      for (const order of options.orderBy) {
        q = query(q, orderBy(order.field, order.direction || 'asc'))
      }
    }

    if (options?.limit) {
      q = query(q, limit(options.limit))
    }

    if (options?.startAfter) {
      q = query(q, startAfter(options.startAfter))
    }

    if (options?.endBefore) {
      q = query(q, endBefore(options.endBefore))
    }

    return q
  }

  /**
   * Convert Firestore document to typed object
   */
  private docToData(doc: DocumentSnapshot): T | null {
    if (!doc.exists()) return null
    return {
      id: doc.id,
      ...doc.data()
    } as T
  }

  /**
   * Convert Firestore query snapshot to typed array
   */
  private queryToDataArray(snapshot: QuerySnapshot): T[] {
    return snapshot.docs.map(doc => this.docToData(doc)!).filter(Boolean)
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T> {
    try {
      const auditedData = this.addAuditFields(data as Partial<T>, false)
      const docRef = await addDoc(this.collectionRef as any, auditedData as any)
      const createdDoc = await getDoc(docRef)
      
      if (!createdDoc.exists()) {
        throw new Error('Failed to retrieve created document')
      }
      
      const createdDocument = this.docToData(createdDoc)!
      
      // Dispatch create event
      dispatch(`collection:${this.collectionName}:created`, {
        action: 'created',
        document: createdDocument,
        collection: this.collectionName,
        timestamp: new Date()
      })
      
      // Dispatch generic collection change event
      dispatch(`collection:${this.collectionName}:changed`, {
        action: 'created',
        document: createdDocument,
        collection: this.collectionName,
        timestamp: new Date()
      })
      
      return createdDocument
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Create document with custom ID
   */
  async createWithId(id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T> {
    try {
      const auditedData = this.addAuditFields(data as Partial<T>, false)
      const docRef = doc(this.collectionRef, id)
      await setDoc(docRef as any, auditedData as any)
      
      const createdDoc = await getDoc(docRef)
      const createdDocument = this.docToData(createdDoc)!
      
      // Dispatch create event
      dispatch(`collection:${this.collectionName}:created`, {
        action: 'created',
        document: createdDocument,
        collection: this.collectionName,
        timestamp: new Date()
      })
      
      // Dispatch generic collection change event
      dispatch(`collection:${this.collectionName}:changed`, {
        action: 'created',
        document: createdDocument,
        collection: this.collectionName,
        timestamp: new Date()
      })
      
      return createdDocument
    } catch (error) {
      console.error(`Error creating document with ID ${id} in ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(this.collectionRef, id)
      const docSnap = await getDoc(docRef)
      return this.docToData(docSnap)
    } catch (error) {
      console.error(`Error getting document ${id} from ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Get multiple documents by IDs
   */
  async getByIds(ids: string[]): Promise<T[]> {
    if (ids.length === 0) return []
    
    try {
      // Firestore 'in' queries are limited to 10 items
      const chunks = []
      for (let i = 0; i < ids.length; i += 10) {
        chunks.push(ids.slice(i, i + 10))
      }

      const results: T[] = []
      for (const chunk of chunks) {
        const q = query(this.collectionRef, where('__name__', 'in', chunk.map(id => doc(this.collectionRef, id))))
        const snapshot = await getDocs(q)
        results.push(...this.queryToDataArray(snapshot))
      }

      return results
    } catch (error) {
      console.error(`Error getting documents by IDs from ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Get all documents with optional query
   */
  async getAll(options?: QueryOptions): Promise<T[]> {
    try {
      const q = this.buildQuery(options)
      const snapshot = await getDocs(q)
      return this.queryToDataArray(snapshot)
    } catch (error) {
      console.error(`Error getting all documents from ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Get documents with pagination
   */
  async getPaginated(paginationOptions: PaginationOptions, queryOptions?: Omit<QueryOptions, 'limit' | 'startAfter' | 'endBefore'>): Promise<{
    data: T[]
    hasMore: boolean
    lastDoc?: DocumentSnapshot
    firstDoc?: DocumentSnapshot
  }> {
    try {
      const options: QueryOptions = {
        ...queryOptions,
        ...paginationOptions
      }
      
      const q = this.buildQuery(options)
      const snapshot = await getDocs(q)
      const data = this.queryToDataArray(snapshot)
      
      return {
        data,
        hasMore: data.length === paginationOptions.limit,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        firstDoc: snapshot.docs[0]
      }
    } catch (error) {
      console.error(`Error getting paginated documents from ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Update document
   */
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>): Promise<T> {
    try {
      // Get the document before update for comparison
      const docRef = doc(this.collectionRef, id)
      const beforeDoc = await getDoc(docRef)
      const beforeData = beforeDoc.exists() ? this.docToData(beforeDoc) : null
      
      const auditedData = this.addAuditFields(data as Partial<T>, true)
      await updateDoc(docRef as any, auditedData as any)
      
      const updatedDoc = await getDoc(docRef)
      const updatedDocument = this.docToData(updatedDoc)!
      
      // Dispatch update event
      dispatch(`collection:${this.collectionName}:updated`, {
        action: 'updated',
        document: updatedDocument,
        previousDocument: beforeData,
        changes: data,
        collection: this.collectionName,
        timestamp: new Date()
      })
      
      // Dispatch generic collection change event
      dispatch(`collection:${this.collectionName}:changed`, {
        action: 'updated',
        document: updatedDocument,
        previousDocument: beforeData,
        changes: data,
        collection: this.collectionName,
        timestamp: new Date()
      })
      
      return updatedDocument
    } catch (error) {
      console.error(`Error updating document ${id} in ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Delete document
   */
  async delete(id: string): Promise<void> {
    try {
      // Get the document before deletion
      const docRef = doc(this.collectionRef, id)
      const docSnap = await getDoc(docRef)
      const documentToDelete = docSnap.exists() ? this.docToData(docSnap) : null
      
      await deleteDoc(docRef)
      
      if (documentToDelete) {
        // Dispatch delete event
        dispatch(`collection:${this.collectionName}:deleted`, {
          action: 'deleted',
          document: documentToDelete,
          collection: this.collectionName,
          timestamp: new Date()
        })
        
        // Dispatch generic collection change event
        dispatch(`collection:${this.collectionName}:changed`, {
          action: 'deleted',
          document: documentToDelete,
          collection: this.collectionName,
          timestamp: new Date()
        })
      }
    } catch (error) {
      console.error(`Error deleting document ${id} from ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Batch operations
   */
  createBatch(): WriteBatch {
    return writeBatch(firebase.db!)
  }

  /**
   * Add create operation to batch
   */
  batchCreate(batch: WriteBatch, data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>, id?: string): DocumentReference {
    const auditedData = this.addAuditFields(data as Partial<T>, false)
    const docRef = id ? doc(this.collectionRef, id) : doc(this.collectionRef)
    batch.set(docRef as any, auditedData as any)
    return docRef
  }

  /**
   * Add update operation to batch
   */
  batchUpdate(batch: WriteBatch, id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>): void {
    const auditedData = this.addAuditFields(data as Partial<T>, true)
    const docRef = doc(this.collectionRef, id)
    batch.update(docRef as any, auditedData as any)
  }

  /**
   * Add delete operation to batch
   */
  batchDelete(batch: WriteBatch, id: string): void {
    const docRef = doc(this.collectionRef, id)
    batch.delete(docRef)
  }

  /**
   * Commit batch
   */
  async commitBatch(batch: WriteBatch): Promise<void> {
    try {
      await batch.commit()
    } catch (error) {
      console.error(`Error committing batch for ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Run transaction
   */
  async runTransaction<R>(updateFunction: (transaction: Transaction) => Promise<R>): Promise<R> {
    try {
      return await runTransaction(firebase.db!, updateFunction)
    } catch (error) {
      console.error(`Error running transaction for ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Subscribe to collection changes
   */
  subscribe(subscriptionId: string, options: SubscriptionOptions): Unsubscribe {
    try {
      const q = this.buildQuery(options)
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = this.queryToDataArray(snapshot)
          
          // Process document changes and dispatch events
          snapshot.docChanges().forEach((change) => {
            const doc = this.docToData(change.doc)
            if (!doc) return
            
            let action = 'unknown'
            switch (change.type) {
              case 'added':
                action = 'created'
                break
              case 'modified':
                action = 'updated'
                break
              case 'removed':
                action = 'deleted'
                break
            }
            
            // Dispatch specific action event
            dispatch(`collection:${this.collectionName}:${action}`, {
              action,
              document: doc,
              collection: this.collectionName,
              subscriptionId,
              timestamp: new Date()
            })
            
            // Dispatch generic realtime event
            dispatch(`collection:${this.collectionName}:realtime`, {
              action,
              document: doc,
              collection: this.collectionName,
              subscriptionId,
              timestamp: new Date()
            })
          })
          
          // Dispatch data loaded event
          dispatch(`collection:${this.collectionName}:data`, {
            action: 'data_loaded',
            documents: data,
            collection: this.collectionName,
            subscriptionId,
            timestamp: new Date()
          })
          
          options.onData(data)
        },
        (error) => {
          console.error(`Subscription error for ${this.collectionName}:`, error)
          
          // Dispatch error event
          dispatch(`collection:${this.collectionName}:error`, {
            action: 'error',
            error,
            collection: this.collectionName,
            subscriptionId,
            timestamp: new Date()
          })
          
          if (options.onError) {
            options.onError(error)
          }
        }
      )

      this.activeSubscriptions.set(subscriptionId, unsubscribe)
      return unsubscribe
    } catch (error) {
      console.error(`Error creating subscription for ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Subscribe to single document changes
   */
  subscribeToDocument(subscriptionId: string, id: string, options: DocumentSubscriptionOptions): Unsubscribe {
    try {
      const docRef = doc(this.collectionRef, id)
      let previousData: T | null = null
      
      const unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          const data = this.docToData(doc)
          
          if (data) {
            // Determine action type
            let action = 'updated'
            if (!previousData) {
              action = 'created'
            }
            
            // Dispatch document-specific events
            dispatch(`collection:${this.collectionName}:document:${id}:${action}`, {
              action,
              document: data,
              previousDocument: previousData,
              collection: this.collectionName,
              documentId: id,
              subscriptionId,
              timestamp: new Date()
            })
            
            dispatch(`collection:${this.collectionName}:document:${id}:changed`, {
              action,
              document: data,
              previousDocument: previousData,
              collection: this.collectionName,
              documentId: id,
              subscriptionId,
              timestamp: new Date()
            })
            
            previousData = data
          } else if (previousData) {
            // Document was deleted
            dispatch(`collection:${this.collectionName}:document:${id}:deleted`, {
              action: 'deleted',
              document: previousData,
              collection: this.collectionName,
              documentId: id,
              subscriptionId,
              timestamp: new Date()
            })
            
            previousData = null
          }
          
          options.onData(data)
        },
        (error) => {
          console.error(`Document subscription error for ${this.collectionName}/${id}:`, error)
          
          // Dispatch error event
          dispatch(`collection:${this.collectionName}:document:${id}:error`, {
            action: 'error',
            error,
            collection: this.collectionName,
            documentId: id,
            subscriptionId,
            timestamp: new Date()
          })
          
          if (options.onError) {
            options.onError(error)
          }
        }
      )

      this.activeSubscriptions.set(subscriptionId, unsubscribe)
      return unsubscribe
    } catch (error) {
      console.error(`Error creating document subscription for ${this.collectionName}/${id}:`, error)
      throw error
    }
  }

  /**
   * Unsubscribe from specific subscription
   */
  unsubscribe(subscriptionId: string): void {
    const unsubscribe = this.activeSubscriptions.get(subscriptionId)
    if (unsubscribe) {
      unsubscribe()
      this.activeSubscriptions.delete(subscriptionId)
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll(): void {
    this.activeSubscriptions.forEach((unsubscribe) => {
      unsubscribe()
    })
    this.activeSubscriptions.clear()
  }

  /**
   * Check if document exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.collectionRef, id)
      const docSnap = await getDoc(docRef)
      return docSnap.exists()
    } catch (error) {
      console.error(`Error checking if document ${id} exists in ${this.collectionName}:`, error)
      return false
    }
  }

  /**
   * Count documents (limited to 1000 due to Firestore limitations)
   */
  async count(options?: QueryOptions): Promise<number> {
    try {
      const q = this.buildQuery({ ...options, limit: 1000 })
      const snapshot = await getDocs(q)
      return snapshot.size
    } catch (error) {
      console.error(`Error counting documents in ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Get collection name
   */
  getCollectionName(): string {
    return this.collectionName
  }

  /**
   * Cleanup - unsubscribe from all active subscriptions
   */
  cleanup(): void {
    this.unsubscribeAll()
  }
}

export default BaseCollection