import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  // State
  const mode = ref<ThemeMode>('system')
  const sidebarCollapsed = ref(false)
  const primaryColor = ref('indigo')

  // Getters
  const isDark = computed(() => {
    if (mode.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return mode.value === 'dark'
  })

  const currentTheme = computed(() => ({
    mode: mode.value,
    isDark: isDark.value,
    sidebarCollapsed: sidebarCollapsed.value,
    primaryColor: primaryColor.value
  }))

  // Actions
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
    updateHtmlClass()
    
    // Re-setup system listener if switching to system mode
    if (newMode === 'system') {
      setupSystemListener()
    }
  }

  const toggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(mode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setMode(modes[nextIndex]!)
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar-collapsed', String(sidebarCollapsed.value))
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
    localStorage.setItem('sidebar-collapsed', String(collapsed))
  }

  const setPrimaryColor = (color: string) => {
    primaryColor.value = color
    localStorage.setItem('primary-color', color)
    updateCSSVariables()
  }

  const updateHtmlClass = () => {
    const html = document.documentElement
    
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // Debug log
    console.log(`Theme updated: mode=${mode.value}, isDark=${isDark.value}, htmlClass=${html.classList.contains('dark')}`)
  }

  const setupSystemListener = () => {
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (mode.value === 'system') {
        updateHtmlClass()
      }
    }
    
    // Remove existing listener first
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
    // Add new listener
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }

  const updateCSSVariables = () => {
    const root = document.documentElement
    
    // Update CSS custom properties based on primary color
    const colorMap: Record<string, { primary: string; primaryDark: string }> = {
      indigo: { primary: '99 102 241', primaryDark: '79 70 229' },
      blue: { primary: '59 130 246', primaryDark: '37 99 235' },
      purple: { primary: '147 51 234', primaryDark: '126 34 206' },
      pink: { primary: '236 72 153', primaryDark: '219 39 119' },
      red: { primary: '239 68 68', primaryDark: '220 38 38' },
      orange: { primary: '249 115 22', primaryDark: '234 88 12' },
      amber: { primary: '245 158 11', primaryDark: '217 119 6' },
      yellow: { primary: '234 179 8', primaryDark: '202 138 4' },
      lime: { primary: '132 204 22', primaryDark: '101 163 13' },
      green: { primary: '34 197 94', primaryDark: '21 128 61' },
      emerald: { primary: '16 185 129', primaryDark: '5 150 105' },
      teal: { primary: '20 184 166', primaryDark: '13 148 136' },
      cyan: { primary: '6 182 212', primaryDark: '8 145 178' },
      sky: { primary: '14 165 233', primaryDark: '2 132 199' },
    }

    const colors = colorMap[primaryColor.value] || colorMap.indigo!
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-primary-dark', colors.primaryDark)
  }

  const initializeTheme = () => {
    // Load saved preferences
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    const savedSidebarCollapsed = localStorage.getItem('sidebar-collapsed')
    const savedPrimaryColor = localStorage.getItem('primary-color')

    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      mode.value = savedMode
    }

    if (savedSidebarCollapsed !== null) {
      sidebarCollapsed.value = savedSidebarCollapsed === 'true'
    }

    if (savedPrimaryColor) {
      primaryColor.value = savedPrimaryColor
    }

    updateHtmlClass()
    updateCSSVariables()
    setupSystemListener()
    
    console.log(`Theme initialized: mode=${mode.value}, systemPrefers=${window.matchMedia('(prefers-color-scheme: dark)').matches}`)
  }

  // Watch for changes
  watch(mode, (newMode) => {
    console.log(`Mode changed to: ${newMode}`)
    updateHtmlClass()
    if (newMode === 'system') {
      setupSystemListener()
    }
  })
  
  watch(isDark, (newIsDark) => {
    console.log(`isDark changed to: ${newIsDark}`)
    updateHtmlClass()
  })
  
  watch(primaryColor, updateCSSVariables)

  // Initialize on store creation
  if (typeof window !== 'undefined') {
    initializeTheme()
  }

  return {
    // State
    mode,
    sidebarCollapsed,
    primaryColor,
    
    // Getters
    isDark,
    currentTheme,
    
    // Actions
    setMode,
    toggleMode,
    toggleSidebar,
    setSidebarCollapsed,
    setPrimaryColor,
    initializeTheme
  }
})