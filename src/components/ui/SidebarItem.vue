<template>
  <RouterLink
    :to="item.href"
    class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
    :class="[
      item.current
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
    ]"
  >
    <component
      :is="item.icon"
      class="flex-shrink-0 w-5 h-5 transition-colors"
      :class="[
        item.current
          ? 'text-primary-500 dark:text-primary-300'
          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
      ]"
    />
    <span 
      v-show="!collapsed" 
      class="ml-3 transition-opacity duration-200"
    >
      {{ item.name }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Component } from 'vue'

interface SidebarItemProps {
  item: {
    name: string
    href: string
    icon: Component
    current: boolean
  }
  collapsed: boolean
}

defineProps<SidebarItemProps>()
</script>