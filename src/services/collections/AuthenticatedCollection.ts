import BaseCollection, { type BaseDocument, type QueryOptions } from './BaseCollection'
import { currentUser, isAuthenticated } from '@/services/auth'
import type { User } from 'firebase/auth'

export interface AuthenticatedDocument extends BaseDocument {
  userId?: string // Owner of the document
  visibility?: 'public' | 'private' | 'shared' // Document visibility
  sharedWith?: string[] // User IDs who have access
}

export interface UserOwnedDocument extends AuthenticatedDocument {
  userId: string // Required for user-owned documents
}

export interface SecurityRule {
  read: boolean
  write: boolean
  delete: boolean
}

export interface AuthCollectionOptions {
  requireAuth?: boolean // Require authentication for all operations
  userOwned?: boolean // Documents are owned by users
  adminOverride?: boolean // Admins can access all documents
  autoAddUserId?: boolean // Automatically add userId to documents
}

/**
 * Authentication-aware collection that enforces security rules
 */
export class AuthenticatedCollection<T extends AuthenticatedDocument> extends BaseCollection<T> {
  private options: AuthCollectionOptions

  constructor(collectionName: string, options: AuthCollectionOptions = {}) {
    super(collectionName)
    this.options = {
      requireAuth: true,
      userOwned: false,
      adminOverride: true,
      autoAddUserId: false,
      ...options
    }
  }

  /**
   * Check if user is authenticated
   */
  private requireAuthentication(): User {
    if (!isAuthenticated.value || !currentUser.value) {
      throw new Error('Authentication required')
    }
    return currentUser.value
  }

  /**
   * Check if user has access to document
   */
  private checkAccess(document: T, operation: 'read' | 'write' | 'delete'): boolean {
    const user = currentUser.value
    if (!user) return false

    // Admin override
    if (this.options.adminOverride && this.isAdmin(user)) {
      return true
    }

    // Public documents are readable by all authenticated users
    if (operation === 'read' && document.visibility === 'public') {
      return true
    }

    // User owns the document
    if (document.userId === user.uid) {
      return true
    }

    // Document is shared with user
    if (document.sharedWith?.includes(user.uid)) {
      return operation === 'read' // Shared documents are read-only
    }

    return false
  }

  /**
   * Check if user is admin (you can customize this logic)
   */
  private isAdmin(user: User): boolean {
    // This is a simple implementation - you can enhance this based on your needs
    // For example, check custom claims or a separate admin collection
    return user.email?.endsWith('@admin.com') || false
  }

  /**
   * Add user context to document data
   */
  private addUserContext<D>(data: D): D & Partial<T> {
    const user = currentUser.value
    if (!user) return data as D & Partial<T>

    const contextData: Partial<T> = {}

    if (this.options.autoAddUserId) {
      ;(contextData as any).userId = user.uid
    }

    if (this.options.userOwned) {
      ;(contextData as any).userId = user.uid
      ;(contextData as any).visibility = 'private' // Default to private for user-owned documents
    }

    return { ...data, ...contextData } as D & Partial<T>
  }

  /**
   * Filter documents based on user access
   */
  private filterByAccess(documents: T[]): T[] {
    const user = currentUser.value
    if (!user) return []

    return documents.filter(doc => this.checkAccess(doc, 'read'))
  }

  /**
   * Get user-specific query constraints
   */
  private getUserConstraints(): QueryOptions {
    const user = currentUser.value
    if (!user) return {}

    const constraints: QueryOptions = {}

    if (this.options.userOwned) {
      // Only get documents owned by the current user
      constraints.where = [
        { field: 'userId', operator: '==', value: user.uid }
      ]
    } else if (!this.options.adminOverride || !this.isAdmin(user)) {
      // Get documents that are public, owned by user, or shared with user
      // Note: Firestore doesn't support complex OR queries, so this might need to be handled client-side
      // For now, we'll use the most restrictive approach
      constraints.where = [
        { field: 'userId', operator: '==', value: user.uid }
      ]
    }

    return constraints
  }

  /**
   * Merge query options with user constraints
   */
  private mergeQueryOptions(options?: QueryOptions): QueryOptions {
    const userConstraints = this.getUserConstraints()
    
    if (!options) return userConstraints

    return {
      ...options,
      where: [
        ...(userConstraints.where || []),
        ...(options.where || [])
      ]
    }
  }

  // Override parent methods with authentication

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T> {
    if (this.options.requireAuth) {
      this.requireAuthentication()
    }

    const contextualData = this.addUserContext(data)
    return super.create(contextualData)
  }

  async createWithId(id: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<T> {
    if (this.options.requireAuth) {
      this.requireAuthentication()
    }

    const contextualData = this.addUserContext(data)
    return super.createWithId(id, contextualData)
  }

  async getById(id: string): Promise<T | null> {
    if (this.options.requireAuth) {
      this.requireAuthentication()
    }

    const document = await super.getById(id)
    if (!document) return null

    if (!this.checkAccess(document, 'read')) {
      throw new Error('Access denied')
    }

    return document
  }

  async getAll(options?: QueryOptions): Promise<T[]> {
    if (this.options.requireAuth) {
      this.requireAuthentication()
    }

    const mergedOptions = this.mergeQueryOptions(options)
    const documents = await super.getAll(mergedOptions)
    
    // Additional client-side filtering if needed
    return this.filterByAccess(documents)
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>): Promise<T> {
    if (this.options.requireAuth) {
      this.requireAuthentication()
    }

    // Check if document exists and user has access
    const existingDoc = await super.getById(id)
    if (!existingDoc) {
      throw new Error('Document not found')
    }

    if (!this.checkAccess(existingDoc, 'write')) {
      throw new Error('Access denied')
    }

    return super.update(id, data)
  }

  async delete(id: string): Promise<void> {
    if (this.options.requireAuth) {
      this.requireAuthentication()
    }

    // Check if document exists and user has access
    const existingDoc = await super.getById(id)
    if (!existingDoc) {
      throw new Error('Document not found')
    }

    if (!this.checkAccess(existingDoc, 'delete')) {
      throw new Error('Access denied')
    }

    return super.delete(id)
  }

  /**
   * Get documents owned by current user
   */
  async getMyDocuments(options?: QueryOptions): Promise<T[]> {
    const user = this.requireAuthentication()

    const queryOptions: QueryOptions = {
      ...options,
      where: [
        { field: 'userId', operator: '==', value: user.uid },
        ...(options?.where || [])
      ]
    }

    return super.getAll(queryOptions)
  }

  /**
   * Get public documents
   */
  async getPublicDocuments(options?: QueryOptions): Promise<T[]> {
    const queryOptions: QueryOptions = {
      ...options,
      where: [
        { field: 'visibility', operator: '==', value: 'public' },
        ...(options?.where || [])
      ]
    }

    return super.getAll(queryOptions)
  }

  /**
   * Share document with other users
   */
  async shareDocument(id: string, userIds: string[]): Promise<T> {
    const user = this.requireAuthentication()

    // Check if document exists and user owns it
    const document = await super.getById(id)
    if (!document) {
      throw new Error('Document not found')
    }

    if (document.userId !== user.uid && !this.isAdmin(user)) {
      throw new Error('Only document owner can share')
    }

    const currentShared = document.sharedWith || []
    const newShared = [...new Set([...currentShared, ...userIds])]

    return super.update(id, { sharedWith: newShared } as Partial<T>)
  }

  /**
   * Unshare document from specific users
   */
  async unshareDocument(id: string, userIds: string[]): Promise<T> {
    const user = this.requireAuthentication()

    // Check if document exists and user owns it
    const document = await super.getById(id)
    if (!document) {
      throw new Error('Document not found')
    }

    if (document.userId !== user.uid && !this.isAdmin(user)) {
      throw new Error('Only document owner can unshare')
    }

    const currentShared = document.sharedWith || []
    const newShared = currentShared.filter(userId => !userIds.includes(userId))

    return super.update(id, { sharedWith: newShared } as Partial<T>)
  }

  /**
   * Change document visibility
   */
  async changeVisibility(id: string, visibility: 'public' | 'private' | 'shared'): Promise<T> {
    const user = this.requireAuthentication()

    // Check if document exists and user owns it
    const document = await super.getById(id)
    if (!document) {
      throw new Error('Document not found')
    }

    if (document.userId !== user.uid && !this.isAdmin(user)) {
      throw new Error('Only document owner can change visibility')
    }

    return super.update(id, { visibility } as Partial<T>)
  }
}

/**
 * Factory function for creating authenticated collections
 */
export function createAuthenticatedCollection<T extends AuthenticatedDocument>(
  collectionName: string,
  options?: AuthCollectionOptions
): AuthenticatedCollection<T> {
  return new AuthenticatedCollection<T>(collectionName, options)
}

/**
 * Factory function for creating user-owned collections
 */
export function createUserOwnedCollection<T extends UserOwnedDocument>(
  collectionName: string,
  options: Omit<AuthCollectionOptions, 'userOwned' | 'autoAddUserId'> = {}
): AuthenticatedCollection<T> {
  return new AuthenticatedCollection<T>(collectionName, {
    ...options,
    userOwned: true,
    autoAddUserId: true
  })
}

export default AuthenticatedCollection