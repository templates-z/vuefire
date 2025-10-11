<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
      :title="'Current theme: ' + themeStore.mode"
    >
      <SunIcon v-if="themeStore.mode === 'light'" class="w-5 h-5" />
      <MoonIcon v-else-if="themeStore.mode === 'dark'" class="w-5 h-5" />
      <ComputerDesktopIcon v-else class="w-5 h-5" />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        @click.stop=""
      >
        <div class="py-1">
          <button
            v-for="option in themeOptions"
            :key="option.value"
            @click="selectTheme(option.value)"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-100 dark:bg-gray-700': themeStore.mode === option.value }"
          >
            <component :is="option.icon" class="w-4 h-4 mr-3" />
            {{ option.label }}
            <CheckIcon 
              v-if="themeStore.mode === option.value" 
              class="w-4 h-4 ml-auto text-primary-500" 
            />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Click outside to close -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="showDropdown = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { useThemeStore, type ThemeMode } from '@/store/theme'

const themeStore = useThemeStore()
const showDropdown = ref(false)

const themeOptions = [
  {
    value: 'light' as ThemeMode,
    label: 'Light',
    icon: SunIcon
  },
  {
    value: 'dark' as ThemeMode,
    label: 'Dark',
    icon: MoonIcon
  },
  {
    value: 'system' as ThemeMode,
    label: 'System',
    icon: ComputerDesktopIcon
  }
]

const selectTheme = (mode: ThemeMode) => {
  themeStore.setMode(mode)
  showDropdown.value = false
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>