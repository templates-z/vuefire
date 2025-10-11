import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/locales'

export type { SupportedLocale }

export const useLocaleStore = defineStore('locale', () => {
  // State - this will be synced with Vue I18n
  const currentLocale = ref<SupportedLocale>('en')
  
  // Getters
  const availableLocales = computed(() => SUPPORTED_LOCALES)
  
  const currentLanguage = computed(() => {
    return SUPPORTED_LOCALES[currentLocale.value]
  })

  const isRTL = computed(() => {
    // Add RTL languages here when needed
    const rtlLanguages: SupportedLocale[] = []
    return rtlLanguages.indexOf(currentLocale.value) !== -1
  })

  // Actions
  const setLocale = (locale: SupportedLocale) => {
    if (locale in SUPPORTED_LOCALES) {
      currentLocale.value = locale
      
      // Save to localStorage
      localStorage.setItem('locale', locale)
      
      // Update document language attribute
      document.documentElement.lang = locale
      
      // Update document direction for RTL languages
      document.documentElement.dir = isRTL.value ? 'rtl' : 'ltr'
      
      console.log(`Locale changed to: ${locale}`)
    }
  }

  const initializeLocale = () => {
    // Get saved locale or detect browser language
    const savedLocale = localStorage.getItem('locale') as SupportedLocale
    const browserLang = navigator.language.split('-')[0] as SupportedLocale
    
    let initialLocale: SupportedLocale = 'en'
    
    if (savedLocale && savedLocale in SUPPORTED_LOCALES) {
      initialLocale = savedLocale
    } else if (browserLang && browserLang in SUPPORTED_LOCALES) {
      initialLocale = browserLang
    }
    
    setLocale(initialLocale)
  }

  // Format helpers that use the current locale
  const formatDate = (date: Date | string | number, format: 'short' | 'long' = 'short') => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
    return new Intl.DateTimeFormat(currentLocale.value, 
      format === 'short' 
        ? { year: 'numeric', month: 'short', day: 'numeric' }
        : { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
    ).format(dateObj)
  }

  const formatNumber = (number: number, style: 'decimal' | 'currency' | 'percent' = 'decimal', currency = 'USD') => {
    const options: Intl.NumberFormatOptions = { style }
    if (style === 'currency') {
      options.currency = currency
    }
    return new Intl.NumberFormat(currentLocale.value, options).format(number)
  }

  const formatRelativeTime = (date: Date | string | number) => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    // Simple relative time formatting
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} month${months !== 1 ? 's' : ''} ago`
    }
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} year${years !== 1 ? 's' : ''} ago`
  }

  return {
    // State
    currentLocale,
    
    // Getters
    availableLocales,
    currentLanguage,
    isRTL,
    
    // Actions
    setLocale,
    initializeLocale,
    
    // Helpers
    formatDate,
    formatNumber,
    formatRelativeTime
  }
})