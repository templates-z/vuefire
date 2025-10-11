<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
      :title="`${t('settings.language.current')}: ${localeStore.currentLanguage.name}`"
    >
      <span class="text-lg">{{ localeStore.currentLanguage.flag }}</span>
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
          <div class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
            {{ t('settings.language.title') }}
          </div>
          <button
            v-for="(language, code) in localeStore.availableLocales"
            :key="code"
            @click="selectLanguage(code)"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-100 dark:bg-gray-700': localeStore.currentLocale === code }"
          >
            <span class="text-lg mr-3">{{ language.flag }}</span>
            <span class="flex-1">{{ language.name }}</span>
            <CheckIcon 
              v-if="localeStore.currentLocale === code" 
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
import { CheckIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import { useLocaleStore, type SupportedLocale } from '@/store/locale'

const { t, locale } = useI18n()
const localeStore = useLocaleStore()
const showDropdown = ref(false)

const selectLanguage = (newLocale: SupportedLocale) => {
  // Update Vue I18n locale directly - this is the source of truth
  locale.value = newLocale
  // Update our store
  localeStore.setLocale(newLocale)
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