<template>
  <div>
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('profile.title') }}</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ t('profile.description') }}
      </p>
    </div>

    <!-- Profile Form -->
    <div class="max-w-2xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-8">
          <!-- Avatar Section -->
          <div class="flex items-center space-x-6 mb-8">
            <div class="relative">
              <img
                :src="profileData?.avatar || generateAvatarUrl(profileData?.firstName, profileData?.lastName)"
                :alt="fullName"
                class="w-20 h-20 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
              />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ fullName || authStore.user?.name || 'Complete your profile' }}
              </h2>
              <p class="text-gray-600 dark:text-gray-400">{{ authStore.user?.email }}</p>
            </div>
          </div>

          <!-- Profile Form -->
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="profileData.firstName"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="profileData.lastName"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                v-model="profileData.email"
                type="email"
                disabled
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                id="role"
                v-model="profileData.role"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="Author">Author</option>
              </select>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Select your role in the system
              </p>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-md font-medium transition-colors"
              >
                <span v-if="saving">Saving...</span>
                <span v-else>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firebase } from '@/services/firebase'

const { t } = useI18n()
const authStore = useAuthStore()

const saving = ref(false)

const profileData = ref({
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
  role: 'User' as 'User' | 'Admin' | 'Editor' | 'SuperAdmin' | 'Author'
})

const fullName = computed(() => {
  const first = profileData.value?.firstName?.trim()
  const last = profileData.value?.lastName?.trim()
  if (first && last) return `${first} ${last}`
  if (first) return first
  if (last) return last
  return ''
})

const generateAvatarUrl = (firstName?: string, lastName?: string) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  if (!initials) return `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff`
  return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff`
}

const loadProfile = async () => {
  if (!authStore.user?.id) return

  try {
    // Get the user document from Firestore
    const userDoc = await getDoc(doc(firebase.db!, 'users', authStore.user.id))
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      profileData.value = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || authStore.user.email || '',
        avatar: userData.avatar || '',
        role: userData.role || 'User'
      }
    } else {
      // Initialize with user data if no profile exists
      profileData.value.email = authStore.user.email || ''
      profileData.value.role = authStore.user?.role || 'User'
      if (authStore.user.name) {
        const nameParts = authStore.user.name.split(' ')
        profileData.value.firstName = nameParts[0] || ''
        profileData.value.lastName = nameParts.slice(1).join(' ') || ''
      }
    }
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
}

const saveProfile = async () => {
  if (!authStore.user?.id) return

  saving.value = true
  try {
    const profileUpdate = {
      firstName: profileData.value.firstName,
      lastName: profileData.value.lastName,
      email: profileData.value.email,
      avatar: profileData.value.avatar,
      role: profileData.value.role,
      displayName: `${profileData.value.firstName} ${profileData.value.lastName}`,
      updatedAt: new Date()
    }

    // Update user document in Firestore
    await updateDoc(doc(firebase.db!, 'users', authStore.user.id), profileUpdate)
    
    // Show success message (you can implement a toast system)
    console.log('Profile saved successfully!')
  } catch (error) {
    console.error('Failed to save profile:', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>