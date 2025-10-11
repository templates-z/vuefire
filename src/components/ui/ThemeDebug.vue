<template>
  <div v-if="visible" class="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-xs">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Theme Debug</h3>
    <div class="space-y-1 text-xs">
      <div>Mode: <span class="font-mono">{{ themeStore.mode }}</span></div>
      <div>Is Dark: <span class="font-mono">{{ themeStore.isDark }}</span></div>
      <div>System Prefers: <span class="font-mono">{{ systemPrefersDark }}</span></div>
      <div>HTML Class: <span class="font-mono">{{ htmlHasDarkClass }}</span></div>
      <div>Primary Color: <span class="font-mono">{{ themeStore.primaryColor }}</span></div>
    </div>
    <div class="mt-3 flex gap-2">
      <button
        @click="themeStore.setMode('light')"
        class="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
      >
        Light
      </button>
      <button
        @click="themeStore.setMode('dark')"
        class="px-2 py-1 text-xs bg-gray-800 text-white rounded"
      >
        Dark
      </button>
      <button
        @click="themeStore.setMode('system')"
        class="px-2 py-1 text-xs bg-blue-500 text-white rounded"
      >
        System
      </button>
    </div>
    <button
      @click="visible = false"
      class="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()
const visible = ref(true)

const systemPrefersDark = ref(false)
const htmlHasDarkClass = ref(false)

const updateDebugInfo = () => {
  systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  htmlHasDarkClass.value = document.documentElement.classList.contains('dark')
}

let interval: number

onMounted(() => {
  updateDebugInfo()
  
  // Update debug info periodically
  interval = setInterval(updateDebugInfo, 500)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

// Make debug panel globally accessible
if (typeof window !== 'undefined') {
  (window as any).themeDebug = {
    store: themeStore,
    updateDebugInfo
  }
}
</script>