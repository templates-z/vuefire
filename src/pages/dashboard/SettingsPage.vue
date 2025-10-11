<template>
  <div>
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('settings.title') }}</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ t('settings.profile.description') }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="[
              activeTab === tab.id
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
            ]"
          >
            <div class="flex items-center">
              <component :is="tab.icon" class="w-5 h-5 mr-3" />
              {{ tab.name }}
            </div>
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">


        <!-- Language Settings -->
        <div v-if="activeTab === 'language'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">{{ t('settings.language.title') }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">{{ t('settings.language.description') }}</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {{ t('settings.language.current') }}
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  v-for="(language, code) in localeStore.availableLocales"
                  :key="code"
                  @click="selectLanguage(code)"
                  class="flex items-center p-4 border-2 rounded-lg transition-colors"
                  :class="[
                    localeStore.currentLocale === code
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  ]"
                >
                  <span class="text-2xl mr-3">{{ language.flag }}</span>
                  <div class="text-left">
                    <div class="font-medium text-gray-900 dark:text-white">{{ language.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ language.code.toUpperCase() }}</div>
                  </div>
                  <div class="ml-auto">
                    <div 
                      v-if="localeStore.currentLocale === code" 
                      class="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
                    >
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme Settings -->
        <div v-if="activeTab === 'theme'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Appearance</h3>
          
          <div class="space-y-6">
            <!-- Theme Mode -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Theme Mode
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="option in themeOptions"
                  :key="option.value"
                  @click="themeStore.setMode(option.value)"
                  class="flex flex-col items-center p-4 border-2 rounded-lg transition-colors"
                  :class="[
                    themeStore.mode === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  ]"
                >
                  <component :is="option.icon" class="w-8 h-8 mb-2 text-gray-600 dark:text-gray-400" />
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ option.label }}</span>
                </button>
              </div>
            </div>

            <!-- Primary Color -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Primary Color
              </label>
              <div class="grid grid-cols-8 gap-2">
                <button
                  v-for="color in colorOptions"
                  :key="color.value"
                  @click="themeStore.setPrimaryColor(color.value)"
                  class="w-10 h-10 rounded-full border-2 transition-transform hover:scale-110"
                  :class="[
                    color.class,
                    themeStore.primaryColor === color.value
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-gray-300 dark:border-gray-600'
                  ]"
                  :title="color.label"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Security</h3>
          
          <form @submit.prevent="changePassword" class="space-y-6">
            <!-- Current Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  PaintBrushIcon,
  ShieldCheckIcon,
  LanguageIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/vue/24/outline'
import { useThemeStore, type ThemeMode } from '@/store/theme'
import { useLocaleStore } from '@/store/locale'
import { useI18n } from 'vue-i18n'

const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const { t, locale } = useI18n()

const activeTab = ref('language')

const tabs = [
  { id: 'language', name: t('settings.language.title'), icon: LanguageIcon },
  { id: 'theme', name: t('settings.theme.title'), icon: PaintBrushIcon },
  { id: 'security', name: t('settings.security.title'), icon: ShieldCheckIcon }
]

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const themeOptions = [
  { value: 'light' as ThemeMode, label: 'Light', icon: SunIcon },
  { value: 'dark' as ThemeMode, label: 'Dark', icon: MoonIcon },
  { value: 'system' as ThemeMode, label: 'System', icon: ComputerDesktopIcon }
]

const colorOptions = [
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'lime', label: 'Lime', class: 'bg-lime-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
  { value: 'sky', label: 'Sky', class: 'bg-sky-500' }
]

const changePassword = () => {
  // Mock change password
  console.log('Changing password')
  // In a real app, you would call an API here
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const selectLanguage = (newLocale: string) => {
  // Update Vue I18n locale directly - this is the source of truth
  locale.value = newLocale
  // Update our store
  localeStore.setLocale(newLocale as any)
}
</script>