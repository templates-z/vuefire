/**
 * Simplified Firestore Collection Service
 * Core CRUD operations with authentication injection and event dispatching
 */

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
  type Query,
  type DocumentSnapshot,
  type QuerySnapshot,
  type DocumentData,
  type CollectionReference,
  type Unsubscribe
} from 'firebase/firestore'
import { firebase } from '@/services/firebase'
import { dispatch } from '@/services/dispatcher'
import { currentUser } from '@/services/auth'
import type {
  BaseDocument,
  QueryOptions,
  PaginationOptions,
  CollectionEvent
} from './types'

/**
 * Core Firestore collection operations
 * Handles CRUD with automatic audit fields and event dispatching
 */
export class FirestoreCollection<T extends BaseDocument> {
  private collectionRef: CollectionReference<DocumentData>
  private collectionName: string
  private subscriptions = new Map<string, Unsubscribe>()

  constructor(collectionName: string) {
    if (!firebase.db) {
      throw new Error('Firestore not initialized')
    }
    this.collectionName = collectionName
    this.collectionRef = collection(firebase.db, collectionName)
  }

  /**
   * Add audit fields (createdAt, updatedAt, etc.)
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
    }

    return {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: user?.uid || 'system',
      updatedBy: user?.uid || 'system'
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
   * Convert query snapshot to array
   */
  private queryToArray(snapshot: QuerySnapshot): T[] {
    return snapshot.docs.map(doc => this.docToData(doc)).filter(Boolean) as T[]
  }

  /**
   * Dispatch collection event
   */
  private dispatchEvent(event: Omit<CollectionEvent<T>, 'timestamp' | 'collection'>): void {
    const fullEvent: CollectionEvent<T> = {
      ...event,
      collection: this.collectionName,
      timestamp: new Date()
    }

    // Dispatch specific action event
    dispatch(`collection:${this.collectionName}:${event.action}`, fullEvent)

    // Dispatch generic collection event (except errors)
    if (event.action !== 'error') {
      dispatch(`collection:${this.collectionName}:changed`, fullEvent)
    }
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T> {
    try {
      const auditedData = this.addAuditFields(data as Partial<T>)
      const docRef = await addDoc(this.collectionRef, auditedData as DocumentData)
      const createdDoc = await getDoc(docRef)

      if (!createdDoc.exists()) {
        throw new Error('Failed to retrieve created document')
      }

      const document = this.docToData(createdDoc)!

      this.dispatchEvent({
        action: 'created',
        document
      })

      return document
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Create document with custom ID
   */
  async createWithId(
    id: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<T> {
    try {
      const auditedData = this.addAuditFields(data as Partial<T>)
      const docRef = doc(this.collectionRef, id)
      await setDoc(docRef, auditedData as DocumentData)

      const createdDoc = await getDoc(docRef)
      const document = this.docToData(createdDoc)!

      this.dispatchEvent({
        action: 'created',
        document
      })

      return document
    } catch (error) {
      console.error(`Error creating document with ID ${id}:`, error)
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
      console.error(`Error getting document ${id}:`, error)
      throw error
    }
  }

  /**
   * Get all documents with query options
   */
  async getAll(options?: QueryOptions): Promise<T[]> {
    try {
      const q = this.buildQuery(options)
      const snapshot = await getDocs(q)
      const documents = this.queryToArray(snapshot)

      this.dispatchEvent({
        action: 'loaded',
        documents
      })

      return documents
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Get paginated documents
   */
  async getPaginated(
    paginationOptions: PaginationOptions,
    queryOptions?: Omit<QueryOptions, 'limit' | 'startAfter' | 'endBefore'>
  ): Promise<{
    data: T[]
    hasMore: boolean
    lastDoc?: DocumentSnapshot
    firstDoc?: DocumentSnapshot
  }> {
    try {
      const options: QueryOptions = {
        ...queryOptions,
        limit: paginationOptions.limit
      }

      const q = this.buildQuery(options)
      const snapshot = await getDocs(q)
      const data = this.queryToArray(snapshot)

      return {
        data,
        hasMore: data.length === paginationOptions.limit,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        firstDoc: snapshot.docs[0]
      }
    } catch (error) {
      console.error(`Error getting paginated documents:`, error)
      throw error
    }
  }

  /**
   * Update document
   */
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>
  ): Promise<T> {
    try {
      const docRef = doc(this.collectionRef, id)

      // Get previous version
      const beforeDoc = await getDoc(docRef)
      const previousDocument = beforeDoc.exists() ? this.docToData(beforeDoc) : null

      // Update with audit fields
      const auditedData = this.addAuditFields(data as Partial<T>, true)
      await updateDoc(docRef, auditedData as DocumentData)

      // Get updated version
      const updatedDoc = await getDoc(docRef)
      const document = this.docToData(updatedDoc)!

      this.dispatchEvent({
        action: 'updated',
        document,
        previousDocument: previousDocument || undefined,
        changes: data as Partial<T>
      })

      return document
    } catch (error) {
      console.error(`Error updating document ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete document
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, id)

      // Get document before deletion
      const docSnap = await getDoc(docRef)
      const document = docSnap.exists() ? this.docToData(docSnap) : null

      await deleteDoc(docRef)

      if (document) {
        this.dispatchEvent({
          action: 'deleted',
          document
        })
      }
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error)
      throw error
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(
    subscriptionId: string,
    options: {
      queryOptions?: QueryOptions
      onData: (data: T[]) => void
      onError?: (error: Error) => void
    }
  ): Unsubscribe {
    try {
      const q = this.buildQuery(options.queryOptions)

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = this.queryToArray(snapshot)

          // Process document changes
          snapshot.docChanges().forEach((change) => {
            const doc = this.docToData(change.doc)
            if (!doc) return

            const actionMap = {
              added: 'created',
              modified: 'updated',
              removed: 'deleted'
            } as const

            const action = actionMap[change.type]

            this.dispatchEvent({
              action,
              document: doc
            })
          })

          options.onData(data)
        },
        (error) => {
          console.error(`Subscription error for ${this.collectionName}:`, error)

          this.dispatchEvent({
            action: 'error',
            error
          })

          options.onError?.(error)
        }
      )

      this.subscriptions.set(subscriptionId, unsubscribe)
      return unsubscribe
    } catch (error) {
      console.error(`Error creating subscription:`, error)
      throw error
    }
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(subscriptionId: string): void {
    const unsubscribe = this.subscriptions.get(subscriptionId)
    if (unsubscribe) {
      unsubscribe()
      this.subscriptions.delete(subscriptionId)
    }
  }

  /**
   * Unsubscribe all
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach(unsubscribe => unsubscribe())
    this.subscriptions.clear()
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
      console.error(`Error checking document existence:`, error)
      return false
    }
  }

  /**
   * Get collection name
   */
  getCollectionName(): string {
    return this.collectionName
  }

  /**
   * Cleanup all subscriptions
   */
  cleanup(): void {
    this.unsubscribeAll()
  }
}
