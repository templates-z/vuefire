<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Theme Customization
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Customize the appearance of your application with preset themes or create your own.
      </p>
    </div>

    <!-- Dark Mode Toggle -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Dark Mode
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Current mode: <span class="font-medium">{{ themeModeLabel }}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button
            v-for="mode in themeModes"
            :key="mode.value"
            @click="themeStore.setMode(mode.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              themeStore.mode === mode.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Theme Customizer -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <ThemeCustomizer />
    </div>

    <!-- Theme Preview -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Theme Preview
      </h2>
      <div class="space-y-4">
        <!-- Buttons -->
        <div class="flex flex-wrap gap-2">
          <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Primary Button
          </button>
          <button class="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700">
            Secondary Button
          </button>
          <button class="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700">
            Success Button
          </button>
          <button class="px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700">
            Warning Button
          </button>
          <button class="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700">
            Error Button
          </button>
          <button class="px-4 py-2 bg-info-600 text-white rounded-lg hover:bg-info-700">
            Info Button
          </button>
        </div>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 rounded-full text-sm font-medium">
            Primary Badge
          </span>
          <span class="px-3 py-1 bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300 rounded-full text-sm font-medium">
            Success Badge
          </span>
          <span class="px-3 py-1 bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300 rounded-full text-sm font-medium">
            Warning Badge
          </span>
          <span class="px-3 py-1 bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300 rounded-full text-sm font-medium">
            Error Badge
          </span>
        </div>

        <!-- Alerts -->
        <div class="space-y-2">
          <div class="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-primary-800 dark:text-primary-300">
                  This is a primary alert with important information.
                </p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-success-600 dark:text-success-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-success-800 dark:text-success-300">
                  Your changes have been saved successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/theme'
import ThemeCustomizer from '@/components/ui/ThemeCustomizer.vue'

const themeStore = useThemeStore()

const themeModes = [
  { label: 'Light', value: 'light' as const },
  { label: 'Dark', value: 'dark' as const },
  { label: 'System', value: 'system' as const },
]

const themeModeLabel = computed(() => {
  const mode = themeModes.find(m => m.value === themeStore.mode)
  return mode?.label || 'System'
})
</script>
