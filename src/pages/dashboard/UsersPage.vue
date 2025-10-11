<template>
  <div>
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Manage user accounts, roles, and permissions.
      </p>
    </div>

    <!-- Actions -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="filterUsers"
            type="text"
            placeholder="Search users..."
            class="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select 
          v-model="roleFilter"
          @change="filterUsers"
          class="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
        >
          <option value="">All Roles</option>
          <option value="SuperAdmin">SuperAdmin</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Author">Author</option>
          <option value="User">User</option>
        </select>
      </div>
      <button 
        v-if="authStore.user?.role === 'Admin' || authStore.user?.role === 'SuperAdmin'"
        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
      >
        <PlusIcon class="w-4 h-4 mr-2" />
        Add User
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Loading users...</p>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in filteredUsers" :key="user.uid">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img
                  :src="user.avatar || generateAvatarUrl(user.firstName, user.lastName)"
                  :alt="user.displayName"
                  class="h-10 w-10 rounded-full"
                />
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.displayName || `${user.firstName} ${user.lastName}` }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ user.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select
                v-if="canEditUser(user)"
                :value="user.role"
                @change="updateUserRole(user, ($event.target as HTMLSelectElement).value)"
                class="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
              >
                <option value="User">User</option>
                <option value="Author">Author</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
              <span 
                v-else
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getRoleBadgeClasses(user.role)"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Active
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button 
                  v-if="canEditUser(user)"
                  class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  title="Edit User"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button 
                  v-if="canDeleteUser(user)"
                  @click="deleteUser(user)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete User"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="p-8 text-center">
        <p class="text-gray-500 dark:text-gray-400">No users found matching your criteria.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> 
        of <span class="font-medium">25</span> results
      </div>
      <div class="flex items-center space-x-2">
        <button class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">
          Previous
        </button>
        <button class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firebase } from '@/services/firebase'
import { useAuthStore } from '@/store/auth'
import type { UserProfile } from '@/services/auth'

const authStore = useAuthStore()

// Reactive data
const loading = ref(true)
const users = ref<UserProfile[]>([])
const searchQuery = ref('')
const roleFilter = ref('')

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.displayName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query)
    )
  }

  // Filter by role
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  return filtered
})

// Methods
const loadUsers = async () => {
  try {
    loading.value = true
    const usersSnapshot = await getDocs(collection(firebase.db!, 'users'))
    users.value = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as UserProfile[]
  } catch (error) {
    console.error('Failed to load users:', error)
  } finally {
    loading.value = false
  }
}

const filterUsers = () => {
  // Filtering is handled by computed property
  // This function exists for template event handlers
}

const generateAvatarUrl = (firstName?: string, lastName?: string) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  if (!initials) return `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff`
  return `https://ui-avatars.com/api/?name=${initials}&background=6366f1&color=fff`
}

const getRoleBadgeClasses = (role: string) => {
  const roleClasses = {
    SuperAdmin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Editor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Author: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    User: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return roleClasses[role as keyof typeof roleClasses] || roleClasses.User
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return 'Unknown'
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const canEditUser = (user: UserProfile) => {
  const currentUserRole = authStore.user?.role
  if (!currentUserRole) return false
  
  // SuperAdmin can edit anyone
  if (currentUserRole === 'SuperAdmin') return true
  
  // Admin can edit anyone except SuperAdmin
  if (currentUserRole === 'Admin' && user.role !== 'SuperAdmin') return true
  
  return false
}

const canDeleteUser = (user: UserProfile) => {
  const currentUserRole = authStore.user?.role
  if (!currentUserRole) return false
  
  // Can't delete yourself
  if (user.uid === authStore.user?.id) return false
  
  // SuperAdmin can delete anyone (except themselves)
  if (currentUserRole === 'SuperAdmin') return true
  
  // Admin can delete anyone except SuperAdmin
  if (currentUserRole === 'Admin' && user.role !== 'SuperAdmin') return true
  
  return false
}

const updateUserRole = async (user: UserProfile, newRole: string) => {
  if (!canEditUser(user)) return
  
  try {
    await updateDoc(doc(firebase.db!, 'users', user.uid), {
      role: newRole,
      updatedAt: new Date()
    })
    
    // Update local state
    const userIndex = users.value.findIndex(u => u.uid === user.uid)
    if (userIndex !== -1 && users.value[userIndex]) {
      users.value[userIndex].role = newRole as any
    }
    
    console.log(`Updated ${user.displayName}'s role to ${newRole}`)
  } catch (error) {
    console.error('Failed to update user role:', error)
  }
}

const deleteUser = async (user: UserProfile) => {
  if (!canDeleteUser(user)) return
  
  if (!confirm(`Are you sure you want to delete ${user.displayName}? This action cannot be undone.`)) {
    return
  }
  
  try {
    await deleteDoc(doc(firebase.db!, 'users', user.uid))
    
    // Remove from local state
    users.value = users.value.filter(u => u.uid !== user.uid)
    
    console.log(`Deleted user ${user.displayName}`)
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>