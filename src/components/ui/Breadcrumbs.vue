<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in items" :key="item.path" class="flex items-center">
        <RouterLink
          v-if="index < items.length - 1"
          :to="item.path"
          class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {{ item.name }}
        </RouterLink>
        <span
          v-else
          class="text-sm font-medium text-gray-900 dark:text-white"
        >
          {{ item.name }}
        </span>
        <ChevronRightIcon
          v-if="index < items.length - 1"
          class="flex-shrink-0 w-4 h-4 ml-2 text-gray-400"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'

interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

defineProps<BreadcrumbsProps>()
</script>