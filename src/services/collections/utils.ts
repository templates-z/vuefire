/**
 * Utility functions for collection system
 * Cache management, error formatting, authentication checks
 */

import { currentUser, isAuthenticated } from '@/services/auth'
import type { CacheEntry, CollectionError, CollectionErrorType } from './types'

/**
 * Cache manager for collection data
 */
export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly MAX_CACHE_SIZE = 100

  /**
   * Generate cache key from collection and query
   */
  generateKey(collection: string, query?: any): string {
    return query ? `${collection}:${JSON.stringify(query)}` : collection
  }

  /**
   * Set cache data
   */
  set<T>(key: string, data: T[], ttl: number): void {
    // Implement LRU eviction
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Get cache data if valid
   */
  get<T>(key: string): T[] | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Check if cache is valid
   */
  isValid(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Invalidate cache by key
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Invalidate all cache entries for a collection
   */
  invalidateCollection(collection: string): void {
    const keysToDelete: string[] = []
    for (const key of this.cache.keys()) {
      if (key.startsWith(collection)) {
        keysToDelete.push(key)
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key))
  }
}

/**
 * Singleton cache instance
 */
export const cache = new CacheManager()

/**
 * Authentication utilities
 */
export const auth = {
  /**
   * Check if user is authenticated
   */
  requireAuth(): void {
    if (!isAuthenticated.value || !currentUser.value) {
      throw createError('AUTHENTICATION_REQUIRED', 'You must be logged in to perform this action')
    }
  },

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return currentUser.value?.uid || null
  },

  /**
   * Check if current user is admin
   * You can customize this based on your auth setup
   */
  isAdmin(): boolean {
    const user = currentUser.value
    if (!user) return false
    
    // Check custom claims or email domain
    // This is a simple implementation - customize as needed
    return user.email?.endsWith('@admin.com') || false
  },

  /**
   * Check if user owns document
   */
  ownsDocument(document: { userId?: string }): boolean {
    const userId = this.getUserId()
    return !!userId && document.userId === userId
  }
}

/**
 * Error formatting utilities
 */

/**
 * Create structured collection error
 */
export function createError(
  type: CollectionErrorType,
  message: string,
  originalError?: Error,
  documentId?: string,
  collection?: string
): CollectionError {
  return {
    type,
    message,
    originalError,
    documentId,
    collection
  }
}

/**
 * Format Firestore error to user-friendly message
 */
export function formatFirestoreError(error: any, collection?: string): string {
  const code = error?.code || ''
  
  // Firebase error codes
  if (code.includes('permission-denied')) {
    return 'You do not have permission to perform this action'
  }
  
  if (code.includes('not-found')) {
    return collection ? `${collection} not found` : 'Document not found'
  }
  
  if (code.includes('already-exists')) {
    return 'This item already exists'
  }
  
  if (code.includes('unauthenticated')) {
    return 'You must be logged in to perform this action'
  }
  
  if (code.includes('unavailable') || code.includes('deadline-exceeded')) {
    return 'Network error. Please check your connection and try again'
  }
  
  if (code.includes('invalid-argument')) {
    return 'Invalid data provided'
  }
  
  if (code.includes('failed-precondition')) {
    return 'Operation failed due to system constraints'
  }
  
  // Generic error
  return error?.message || 'An unexpected error occurred'
}

/**
 * Default error formatter function
 */
export const defaultErrorFormatter = (error: Error): string => {
  return formatFirestoreError(error)
}

/**
 * Retry logic for failed operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on authentication or permission errors
      const code = (error as any)?.code || ''
      if (code.includes('permission-denied') || code.includes('unauthenticated')) {
        throw error
      }
      
      // Wait before retry (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}

/**
 * Debounce function for search/filtering
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func.apply(this, args)
    }

    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Deep clone object (for immutability)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Check if two objects are equal (shallow comparison)
 */
export function shallowEqual(obj1: any, obj2: any): boolean {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

/**
 * Filter documents by userId for user-owned collections
 */
export function addUserFilter(
  queryOptions: any = {},
  userId: string
): any {
  const where = queryOptions.where || []
  
  return {
    ...queryOptions,
    where: [
      ...where,
      { field: 'userId', operator: '==', value: userId }
    ]
  }
}

/**
 * Validate document data before save
 */
export function validateDocument(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Add custom validation rules here
  if (data && typeof data !== 'object') {
    errors.push('Document data must be an object')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize data for Firestore (remove undefined values)
 */
export function sanitizeData<T extends Record<string, any>>(data: T): Partial<T> {
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      sanitized[key] = value
    }
  }
  
  return sanitized
}
