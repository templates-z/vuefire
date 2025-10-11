<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="flex justify-center mb-8">
        <div class="text-9xl font-bold text-primary-500 dark:text-primary-400">
          404
        </div>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Page not found
      </h1>
      
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Sorry, we couldn't find the page you're looking for. The page may have been moved or deleted.
      </p>
      
      <div class="space-x-4">
        <button
          @click="$router.back()"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Go back
        </button>
        
        <RouterLink
          to="/dashboard"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <HomeIcon class="w-4 h-4 mr-2" />
          Go to Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowLeftIcon, HomeIcon } from '@heroicons/vue/24/outline'
</script>