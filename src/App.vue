<template>
  <div id="top-app">
    <!-- Loading screen while auth is initializing -->
    <div v-if="!authStore.authReady" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div class="text-center">
        <div class="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">{{ t('common.loading') }}...</p>
      </div>
    </div>
    
    <!-- Main app content -->
    <RouterView v-else />
    
    
  </div>
  <!-- Debug component (remove in production) -->
    <ThemeDebug v-if="showDebug && authStore.authReady" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'
import ThemeDebug from '@/components/ui/ThemeDebug.vue'

const { t } = useI18n()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const showDebug = ref(false) // Set to false by default, enable for debugging

onMounted(() => {
  // Initialize theme after DOM is ready
  themeStore.initializeTheme()
  
  console.log('App mounted, auth ready:', authStore.authReady)
})
</script>

<style>
/* Global styles */
#app {
  min-height: 100vh;
}
</style>
