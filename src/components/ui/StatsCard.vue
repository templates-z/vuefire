<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div 
          class="p-3 rounded-md"
          :class="iconBgClasses"
        >
          <component 
            :is="icon" 
            class="w-6 h-6"
            :class="iconClasses"
          />
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ value }}
            </div>
            <div 
              v-if="change"
              class="ml-2 flex items-baseline text-sm font-semibold"
              :class="changeClasses"
            >
              <ArrowUpIcon 
                v-if="isPositiveChange" 
                class="self-center flex-shrink-0 h-4 w-4"
              />
              <ArrowDownIcon 
                v-else 
                class="self-center flex-shrink-0 h-4 w-4"
              />
              <span class="sr-only">
                {{ isPositiveChange ? 'Increased' : 'Decreased' }} by
              </span>
              {{ change }}
            </div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'

interface StatsCardProps {
  title: string
  value: string
  change?: string
  icon: Component
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo'
}

const props = withDefaults(defineProps<StatsCardProps>(), {
  color: 'blue'
})

const isPositiveChange = computed(() => {
  if (!props.change) return false
  return props.change.startsWith('+')
})

const iconBgClasses = computed(() => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500'
  }
  return colorMap[props.color]
})

const iconClasses = computed(() => {
  return 'text-white'
})

const changeClasses = computed(() => {
  return isPositiveChange.value
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'
})
</script>