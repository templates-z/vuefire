<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out"
      :class="[
        themeStore.sidebarCollapsed ? 'w-16' : 'w-64',
        'lg:translate-x-0',
        showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <h1 
              v-show="!themeStore.sidebarCollapsed" 
              class="text-xl font-bold text-gray-900 dark:text-white transition-opacity duration-200"
            >
              {{ t('nav.dashboard') }}
            </h1>
          </div>
          <button
            @click="themeStore.toggleSidebar"
            class="hidden lg:block p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <ChevronDoubleLeftIcon v-if="!themeStore.sidebarCollapsed" class="w-5 h-5" />
            <ChevronDoubleRightIcon v-else class="w-5 h-5" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <SidebarItem
            v-for="item in navigationItems"
            :key="item.name"
            :item="item"
            :collapsed="themeStore.sidebarCollapsed"
          />
        </nav>

        <!-- User Menu -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <img
              :src="authStore.user?.avatar || '/api/placeholder/32/32'"
              :alt="authStore.user?.name"
              class="w-8 h-8 rounded-full"
            />
            <div v-show="!themeStore.sidebarCollapsed" class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ authStore.user?.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="showMobileSidebar"
      class="fixed inset-0 z-40 lg:hidden"
      @click="showMobileSidebar = false"
    >
      <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
    </div>

    <!-- Main content -->
    <div 
      class="transition-all duration-300 ease-in-out"
      :class="[
        themeStore.sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      ]"
    >
      <!-- Top bar -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center space-x-4">
            <!-- Mobile menu button -->
            <button
              @click="showMobileSidebar = true"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>

            <!-- Breadcrumbs -->
            <Breadcrumbs :items="breadcrumbs" />
          </div>

          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300">
              <BellIcon class="w-6 h-6" />
            </button>

            <!-- Language toggle -->
            <LanguageToggle />

            <!-- Theme toggle -->
            <ThemeToggle />

            <!-- User menu -->
            <UserMenu />
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RouterView />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { 
  Bars3Icon, 
  BellIcon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
} from '@heroicons/vue/24/outline'
import {
  HomeIcon,
  UsersIcon,
  UserIcon,
  CogIcon,
  LanguageIcon,
} from '@heroicons/vue/24/solid'

import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'
import { useI18n } from 'vue-i18n'
import SidebarItem from '@/components/ui/SidebarItem.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import LanguageToggle from '@/components/ui/LanguageToggle.vue'
import UserMenu from '@/components/ui/UserMenu.vue'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const { t } = useI18n()

const showMobileSidebar = ref(false)

const navigationItems = computed(() => [
  {
    name: t('nav.dashboard'),
    href: '/dashboard',
    icon: HomeIcon,
    current: route.path === '/dashboard'
  },
  {
    name: t('nav.users'),
    href: '/dashboard/users',
    icon: UsersIcon,
    current: route.path === '/dashboard/users'
  },
  {
    name: t('nav.profile'),
    href: '/dashboard/profile',
    icon: UserIcon,
    current: route.path === '/dashboard/profile'
  },
  {
    name: t('nav.services'),
    href: '/dashboard/services',
    icon: UsersIcon,
    current: route.path === '/dashboard/services'
  },
  {
    name: 'I18n Demo',
    href: '/dashboard/i18n-demo',
    icon: LanguageIcon,
    current: route.path === '/dashboard/i18n-demo'
  },
  {
    name: t('nav.settings'),
    href: '/dashboard/settings',
    icon: CogIcon,
    current: route.path === '/dashboard/settings'
  }
])

const breadcrumbs = computed(() => {
  return route.meta.breadcrumbs || []
})
</script>