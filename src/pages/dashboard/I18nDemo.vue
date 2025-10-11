<template>
  <div>
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('demo.title') }}</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ t('demo.description') }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Translation Examples -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">{{ t('demo.translations.title') }}</h3>
        
        <div class="space-y-4">
          <!-- Basic translations -->
          <div class="border-l-4 border-blue-500 pl-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ t('demo.translations.basic') }}</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
              <p>{{ t('common.loading') }}</p>
              <p>{{ t('common.save') }}</p>
              <p>{{ t('common.cancel') }}</p>
              <p>{{ t('auth.signIn') }}</p>
              <p>{{ t('nav.dashboard') }}</p>
            </div>
          </div>

          <!-- Pluralization -->
          <div class="border-l-4 border-green-500 pl-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ t('demo.translations.pluralization') }}</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
              <p>{{ t('time.minutesAgo', { count: 1 }) }}</p>
              <p>{{ t('time.minutesAgo', { count: 5 }) }}</p>
              <p>{{ t('time.hoursAgo', { count: 1 }) }}</p>
              <p>{{ t('time.hoursAgo', { count: 24 }) }}</p>
            </div>
          </div>

          <!-- Dynamic content -->
          <div class="border-l-4 border-purple-500 pl-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ t('demo.translations.dynamic') }}</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
              <p>{{ t('demo.welcome', { name: 'John Doe' }) }}</p>
              <p>{{ t('demo.itemsCount', { count: 42 }) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formatting Examples -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">{{ t('demo.formatting.title') }}</h3>
        
        <div class="space-y-4">
          <!-- Date formatting -->
          <div class="border-l-4 border-red-500 pl-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ t('demo.formatting.dates') }}</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
              <p><strong>{{ t('demo.formatting.now') }}:</strong> {{ formatDate(new Date()) }}</p>
              <p><strong>{{ t('demo.formatting.yesterday') }}:</strong> {{ formatDate(yesterday) }}</p>
              <p><strong>{{ t('demo.formatting.lastWeek') }}:</strong> {{ formatDate(lastWeek) }}</p>
            </div>
          </div>

          <!-- Number formatting -->
          <div class="border-l-4 border-yellow-500 pl-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ t('demo.formatting.numbers') }}</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
              <p><strong>{{ t('demo.formatting.decimal') }}:</strong> {{ formatNumber(1234.56) }}</p>
              <p><strong>{{ t('demo.formatting.currency') }}:</strong> {{ formatNumber(1234.56, 'currency') }}</p>
              <p><strong>{{ t('demo.formatting.percent') }}:</strong> {{ formatNumber(0.1567, 'percent') }}</p>
            </div>
          </div>

          <!-- Relative time -->
          <div class="border-l-4 border-indigo-500 pl-4">
            <h4 class="font-medium text-gray-900 dark:text-white">{{ t('demo.formatting.relativeTime') }}</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
              <p><strong>{{ t('demo.formatting.fiveMinutesAgo') }}:</strong> {{ formatRelativeTime(fiveMinutesAgo) }}</p>
              <p><strong>{{ t('demo.formatting.twoHoursAgo') }}:</strong> {{ formatRelativeTime(twoHoursAgo) }}</p>
              <p><strong>{{ t('demo.formatting.threeDaysAgo') }}:</strong> {{ formatRelativeTime(threeDaysAgo) }}</p>
            </div>
          </div>
        </div>
      </div>

     <!-- Current Locale Info -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-6">{{ t('demo.locale.title') }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl mb-2">{{ localeStore.currentLanguage.flag }}</div>
            <div class="font-medium text-gray-900 dark:text-white">{{ localeStore.currentLanguage.name }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ localeStore.currentLanguage.code.toUpperCase() }}</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {{ Object.keys(localeStore.availableLocales).length }}
            </div>
            <div class="font-medium text-gray-900 dark:text-white">{{ t('demo.locale.available') }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('demo.locale.languages') }}</div>
          </div>
          
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">✓</div>
            <div class="font-medium text-gray-900 dark:text-white">{{ t('demo.locale.persistent') }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('demo.locale.storage') }}</div>
          </div>
        </div>

        <!-- Quick language switcher -->
        <div class="mt-6 flex justify-center space-x-4">
          <button
            v-for="(language, code) in localeStore.availableLocales"
            :key="code"
            @click="selectLanguage(code)"
            class="px-4 py-2 rounded-lg border-2 transition-colors"
            :class="[
              localeStore.currentLocale === code
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-200'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
            ]"
          >
            <span class="mr-2">{{ language.flag }}</span>
            {{ language.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/store/locale'

const { t, locale } = useI18n()
const localeStore = useLocaleStore()

const selectLanguage = (newLocale: string) => {
  // Update Vue I18n locale directly - this is the source of truth
  locale.value = newLocale
  // Update our store
  localeStore.setLocale(newLocale as any)
}

// Sample dates for demonstration
const now = new Date()
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)

// Formatting functions
const formatDate = (date: Date) => {
  return localeStore.formatDate(date)
}

const formatNumber = (number: number, style: 'decimal' | 'currency' | 'percent' = 'decimal') => {
  return localeStore.formatNumber(number, style)
}

const formatRelativeTime = (date: Date) => {
  return localeStore.formatRelativeTime(date)
}
</script>