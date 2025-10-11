import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import { 
  currentUser, 
  userProfile, 
  authReady, 
  isAuthenticated as authIsAuthenticated,
  signinUser,
  signupUser,
  signOutUser,
  signInWithGoogle as firebaseSignInWithGoogle,
  initAuthStateListener,
  type SignupData
} from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters - use the reactive refs from auth service
  const user = computed(() => {
    if (!userProfile.value) return null
    
    // Map Firebase user profile to our User type
    return {
      id: userProfile.value.uid,
      name: userProfile.value.displayName || `${userProfile.value.firstName} ${userProfile.value.lastName}`,
      email: userProfile.value.email,
      role: userProfile.value.role,
      avatar: userProfile.value.avatar,
      createdAt: userProfile.value.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: userProfile.value.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      isActive: true
    } as User
  })
  
  const isAuthenticated = computed(() => authIsAuthenticated.value)
  const userRole = computed(() => userProfile.value?.role || 'User')

  // Actions
  const login = async (credentials: { email: string; password: string }) => {
    loading.value = true
    error.value = null
    
    try {
      await signinUser(credentials)
      // The auth state listener will handle updating the user data
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      // Parse name into first and last name
      const nameParts = userData.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      const signupData: SignupData = {
        email: userData.email,
        password: userData.password,
        firstName,
        lastName,
        role: 'User'
      }
      
      await signupUser(signupData)
      // The auth state listener will handle updating the user data
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    
    try {
      await signOutUser()
    } catch (err) {
      console.warn('Logout request failed:', err)
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      await firebaseSignInWithGoogle()
      // The auth state listener will handle updating the user data
    } catch (err: any) {
      error.value = err.message || 'Google sign-in failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state listener
  initAuthStateListener().catch(console.error)

  return {
    // State
    user,
    loading,
    error,
    authReady,
    currentUser,
    userProfile,
    
    // Getters
    isAuthenticated,
    userRole,
    
    // Actions
    login,
    register,
    logout,
    signInWithGoogle,
    clearError
  }
})