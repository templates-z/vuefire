<template>
  <div class="space-y-6">
    <!-- Theme Selector -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Choose Theme
      </label>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          v-for="theme in availableThemes"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          :class="[
            'relative p-4 rounded-lg border-2 transition-all duration-200',
            'hover:border-primary-500 hover:shadow-md',
            isActiveTheme(theme.id)
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-200 dark:border-gray-700'
          ]"
        >
          <!-- Theme Preview Colors -->
          <div class="flex gap-1 mb-2">
            <div
              v-for="(color, idx) in getThemePreviewColors(theme)"
              :key="idx"
              class="w-6 h-6 rounded"
              :style="{ backgroundColor: `rgb(${color})` }"
            />
          </div>
          
          <!-- Theme Info -->
          <div class="text-left">
            <div class="font-medium text-sm text-gray-900 dark:text-white">
              {{ theme.name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ theme.description }}
            </div>
          </div>
          
          <!-- Active Indicator -->
          <div
            v-if="isActiveTheme(theme.id)"
            class="absolute top-2 right-2"
          >
            <svg class="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Delete Custom Theme -->
          <button
            v-if="isCustomTheme(theme)"
            @click.stop="deleteTheme(theme.id)"
            class="absolute bottom-2 right-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            title="Delete custom theme"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </button>
      </div>
    </div>

    <!-- Custom Theme Creator -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          Custom Theme
        </h3>
        <button
          @click="showCustomThemeForm = !showCustomThemeForm"
          class="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
        >
          {{ showCustomThemeForm ? 'Cancel' : 'Create Custom Theme' }}
        </button>
      </div>

      <div v-if="showCustomThemeForm" class="space-y-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <!-- Theme Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Name
          </label>
          <input
            v-model="customThemeName"
            type="text"
            placeholder="My Awesome Theme"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- Theme Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <input
            v-model="customThemeDescription"
            type="text"
            placeholder="A beautiful custom color scheme"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- Color Pickers -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="colorKey in colorKeys" :key="colorKey">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
              {{ colorKey.replace(/([A-Z])/g, ' $1').trim() }}
            </label>
            <div class="flex gap-2">
              <input
                v-model="customColors[colorKey]"
                type="color"
                class="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                v-model="customColors[colorKey]"
                type="text"
                placeholder="#6366f1"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button
            @click="createCustomTheme"
            :disabled="!canCreateTheme"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Theme
          </button>
          <button
            @click="resetCustomThemeForm"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Import/Export -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Import / Export
      </h3>
      <div class="flex gap-3">
        <button
          @click="handleExport"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Export Current Theme
        </button>
        <button
          @click="triggerImport"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Import Theme
        </button>
      </div>
      <input
        ref="importInput"
        type="file"
        accept=".json"
        @change="handleImport"
        class="hidden"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useThemeStore } from '@/store/theme'
import type { Theme, ThemeColors } from '@/config/themes'

const themeStore = useThemeStore()
const importInput = ref<HTMLInputElement>()

// State
const showCustomThemeForm = ref(false)
const customThemeName = ref('')
const customThemeDescription = ref('')
const customColors = ref({
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#6b7280',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
})

const colorKeys = Object.keys(customColors.value) as Array<keyof typeof customColors.value>

// Computed
const availableThemes = computed(() => themeStore.availableThemes)

const canCreateTheme = computed(() => {
  return customThemeName.value.trim().length > 0
})

// Methods
const isActiveTheme = (themeId: string) => {
  return themeStore.activeThemeId === themeId
}

const isCustomTheme = (theme: Theme | any) => {
  return 'isCustom' in theme && theme.isCustom
}

const selectTheme = (themeId: string) => {
  themeStore.setActiveTheme(themeId)
}

const getThemePreviewColors = (theme: Theme | any) => {
  if ('colors' in theme && 'light' in theme.colors) {
    const colors = theme.colors.light
    return [colors.primary, colors.success, colors.warning, colors.error]
  } else if ('colors' in theme) {
    const colors = theme.colors
    return [colors.primary, colors.success, colors.warning, colors.error]
  }
  return []
}

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    const r = parseInt(result[1]!, 16)
    const g = parseInt(result[2]!, 16)
    const b = parseInt(result[3]!, 16)
    return `${r} ${g} ${b}`
  }
  return '0 0 0'
}

const createCustomTheme = () => {
  const colors: ThemeColors = {
    primary: hexToRgb(customColors.value.primary),
    primaryDark: hexToRgb(customColors.value.primaryDark),
    secondary: hexToRgb(customColors.value.secondary),
    success: hexToRgb(customColors.value.success),
    warning: hexToRgb(customColors.value.warning),
    error: hexToRgb(customColors.value.error),
    info: hexToRgb(customColors.value.info),
  }

  const newTheme = themeStore.createCustomTheme(
    customThemeName.value,
    customThemeDescription.value,
    colors
  )

  themeStore.setActiveTheme(newTheme.id)
  resetCustomThemeForm()
  showCustomThemeForm.value = false
}

const resetCustomThemeForm = () => {
  customThemeName.value = ''
  customThemeDescription.value = ''
  customColors.value = {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#6b7280',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
}

const deleteTheme = (themeId: string) => {
  if (confirm('Are you sure you want to delete this custom theme?')) {
    themeStore.deleteCustomTheme(themeId)
  }
}

const handleExport = () => {
  const themeJson = themeStore.exportTheme()
  if (!themeJson) return

  const blob = new Blob([themeJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${themeStore.currentTheme?.name || 'theme'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const triggerImport = () => {
  importInput.value?.click()
}

const handleImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    const success = themeStore.importTheme(content)
    
    if (success) {
      alert('Theme imported successfully!')
    } else {
      alert('Failed to import theme. Please check the file format.')
    }
    
    // Reset input
    if (importInput.value) {
      importInput.value.value = ''
    }
  }
  reader.readAsText(file)
}
</script>
