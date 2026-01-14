/**
 * Theme Persistence Service
 * 
 * Handles saving and syncing user theme preferences to Firestore.
 * This allows users to access their custom themes across devices.
 */

import { doc, setDoc, getDoc } from 'firebase/firestore'
import { firebase } from './firebase'
import type { CustomTheme } from '@/store/theme'

export interface UserThemePreferences {
  mode: 'light' | 'dark' | 'system'
  activeThemeId: string
  customThemes: CustomTheme[]
  lastUpdated: number
}

/**
 * Save user theme preferences to Firestore
 */
export async function saveThemePreferences(
  userId: string,
  preferences: Omit<UserThemePreferences, 'lastUpdated'>
): Promise<boolean> {
  try {
    if (!firebase.db) return false
    
    const userThemeRef = doc(firebase.db, 'userThemes', userId)
    
    await setDoc(userThemeRef, {
      ...preferences,
      lastUpdated: Date.now()
    })
    
    return true
  } catch (error) {
    console.error('Failed to save theme preferences:', error)
    return false
  }
}

/**
 * Load user theme preferences from Firestore
 */
export async function loadThemePreferences(
  userId: string
): Promise<UserThemePreferences | null> {
  try {
    if (!firebase.db) return null
    
    const userThemeRef = doc(firebase.db, 'userThemes', userId)
    const docSnap = await getDoc(userThemeRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as UserThemePreferences
    }
    
    return null
  } catch (error) {
    console.error('Failed to load theme preferences:', error)
    return null
  }
}

/**
 * Sync theme preferences between localStorage and Firestore
 * This ensures the most recent preferences are used
 */
export async function syncThemePreferences(
  userId: string,
  localPreferences: Omit<UserThemePreferences, 'lastUpdated'>
): Promise<UserThemePreferences | null> {
  try {
    const remotePreferences = await loadThemePreferences(userId)
    
    if (!remotePreferences) {
      // No remote preferences, save local ones
      await saveThemePreferences(userId, localPreferences)
      return {
        ...localPreferences,
        lastUpdated: Date.now()
      }
    }
    
    // Compare timestamps to determine which is more recent
    const localTimestamp = parseInt(localStorage.getItem('theme-last-updated') || '0')
    
    if (remotePreferences.lastUpdated > localTimestamp) {
      // Remote is more recent, use remote
      return remotePreferences
    } else {
      // Local is more recent or same, save to remote
      await saveThemePreferences(userId, localPreferences)
      return {
        ...localPreferences,
        lastUpdated: Date.now()
      }
    }
  } catch (error) {
    console.error('Failed to sync theme preferences:', error)
    return null
  }
}

/**
 * Update the last updated timestamp in localStorage
 */
export function updateLocalThemeTimestamp(): void {
  localStorage.setItem('theme-last-updated', Date.now().toString())
}

/**
 * Enable auto-sync for theme preferences
 * This will sync preferences to Firestore whenever they change
 */
export function enableAutoSync(
  userId: string,
  getPreferences: () => Omit<UserThemePreferences, 'lastUpdated'>
): () => void {
  let syncTimer: ReturnType<typeof setTimeout> | null = null
  
  const sync = () => {
    if (syncTimer) clearTimeout(syncTimer)
    
    syncTimer = setTimeout(async () => {
      const preferences = getPreferences()
      await saveThemePreferences(userId, preferences)
      updateLocalThemeTimestamp()
    }, 2000) // Debounce for 2 seconds
  }
  
  // Watch for storage events (changes in other tabs)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key?.startsWith('theme-') || e.key?.startsWith('active-theme') || e.key?.startsWith('custom-themes')) {
      sync()
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange)
    if (syncTimer) clearTimeout(syncTimer)
  }
}
