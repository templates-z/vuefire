import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore, type SupportedLocale } from '@/store/locale'

/**
 * Composable that integrates vue-i18n with our locale store
 * Provides centralized translation and localization functionality
 */
export function useLocalization() {
  const { t, locale, availableLocales } = useI18n()
  const localeStore = useLocaleStore()

  // Sync store with i18n on initialization
  const savedLocale = localStorage.getItem('locale') as SupportedLocale
  if (savedLocale && savedLocale in localeStore.availableLocales) {
    locale.value = savedLocale
    localeStore.currentLocale = savedLocale
  }

  // Watch for changes in either direction
  watch(locale, (newLocale) => {
    if (newLocale !== localeStore.currentLocale) {
      localeStore.currentLocale = newLocale as SupportedLocale
      localStorage.setItem('locale', newLocale)
      document.documentElement.lang = newLocale
    }
  })

  // Method to change locale that syncs both
  const changeLocale = (newLocale: SupportedLocale) => {
    if (newLocale in localeStore.availableLocales) {
      // Update Vue I18n (this will trigger the watcher above)
      locale.value = newLocale
      // Store will be updated by the watcher
    }
  }

  // Computed properties for commonly used translations
  const commonLabels = computed(() => ({
    loading: t('common.loading'),
    save: t('common.save'),
    cancel: t('common.cancel'),
    delete: t('common.delete'),
    edit: t('common.edit'),
    add: t('common.add'),
    search: t('common.search'),
    submit: t('common.submit'),
    confirm: t('common.confirm'),
    yes: t('common.yes'),
    no: t('common.no'),
    ok: t('common.ok'),
    close: t('common.close')
  }))

  const navLabels = computed(() => ({
    dashboard: t('nav.dashboard'),
    users: t('nav.users'),
    settings: t('nav.settings'),
    profile: t('nav.profile'),
    logout: t('nav.logout'),
    notifications: t('nav.notifications')
  }))

  const authLabels = computed(() => ({
    signIn: t('auth.signIn'),
    signUp: t('auth.signUp'),
    login: t('auth.login'),
    register: t('auth.register'),
    logout: t('auth.logout'),
    emailAddress: t('auth.emailAddress'),
    password: t('auth.password'),
    rememberMe: t('auth.rememberMe'),
    forgotPassword: t('auth.forgotPassword'),
    signingIn: t('auth.signingIn'),
    enterEmail: t('auth.enterEmail'),
    enterPassword: t('auth.enterPassword')
  }))

  // Validation messages helper
  const getValidationMessage = (key: string, params?: Record<string, any>) => {
    return params ? t(`auth.validation.${key}`, params) : t(`auth.validation.${key}`)
  }

  // Error messages helper
  const getErrorMessage = (key: string, params?: Record<string, any>) => {
    return params ? t(`auth.errors.${key}`, params) : t(`auth.errors.${key}`)
  }

  // Date and time formatting using the current locale
  const formatDate = (date: Date | string | number, format: 'short' | 'long' = 'short') => {
    return localeStore.formatDate(date, format)
  }

  const formatNumber = (number: number, style: 'decimal' | 'currency' | 'percent' = 'decimal', currency = 'USD') => {
    return localeStore.formatNumber(number, style, currency)
  }

  const formatRelativeTime = (date: Date | string | number) => {
    return localeStore.formatRelativeTime(date)
  }



  return {
    // Core i18n functions
    t,
    locale,
    availableLocales,
    
    // Store integration
    localeStore,
    changeLocale,
    
    // Computed labels
    commonLabels,
    navLabels,
    authLabels,
    
    // Helper functions
    getValidationMessage,
    getErrorMessage,
    formatDate,
    formatNumber,  
    formatRelativeTime
  }
}