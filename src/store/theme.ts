import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { 
  type ThemeColors,
  getTheme, 
  getAllThemes,
  applyThemeColors 
} from '@/config/themes'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface CustomTheme {
  id: string
  name: string
  description: string
  colors: ThemeColors
  isCustom: true
}

export const useThemeStore = defineStore('theme', () => {
  // State
  const mode = ref<ThemeMode>('system')
  const sidebarCollapsed = ref(false)
  const primaryColor = ref('indigo')
  const activeThemeId = ref<string>('default')
  const customThemes = ref<CustomTheme[]>([])

  // Getters
  const isDark = computed(() => {
    if (mode.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return mode.value === 'dark'
  })

  const currentTheme = computed(() => {
    const themeId = activeThemeId.value
    const theme = getTheme(themeId)
    if (theme) return theme
    
    return customThemes.value.find(t => t.id === themeId)
  })

  const availableThemes = computed(() => {
    return [...getAllThemes(), ...customThemes.value]
  })

  const themeState = computed(() => ({
    mode: mode.value,
    isDark: isDark.value,
    sidebarCollapsed: sidebarCollapsed.value,
    primaryColor: primaryColor.value,
    activeTheme: currentTheme.value
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

  const setActiveTheme = (themeId: string) => {
    activeThemeId.value = themeId
    localStorage.setItem('active-theme', themeId)
    applyCurrentThemeColors()
  }

  const loadCustomThemes = () => {
    try {
      const stored = localStorage.getItem('custom-themes')
      if (stored) {
        customThemes.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load custom themes:', error)
    }
  }

  const saveCustomThemes = () => {
    try {
      localStorage.setItem('custom-themes', JSON.stringify(customThemes.value))
    } catch (error) {
      console.error('Failed to save custom themes:', error)
    }
  }

  const createCustomTheme = (name: string, description: string, colors: ThemeColors): CustomTheme => {
    const customTheme: CustomTheme = {
      id: `custom-${Date.now()}`,
      name,
      description,
      colors,
      isCustom: true,
    }
    
    customThemes.value.push(customTheme)
    saveCustomThemes()
    
    return customTheme
  }

  const updateCustomTheme = (id: string, updates: Partial<Omit<CustomTheme, 'id' | 'isCustom'>>) => {
    const index = customThemes.value.findIndex(t => t.id === id)
    if (index !== -1) {
      const existing = customThemes.value[index]!
      customThemes.value[index] = { ...existing, ...updates } as CustomTheme
      saveCustomThemes()
      
      if (activeThemeId.value === id) {
        applyCurrentThemeColors()
      }
    }
  }

  const deleteCustomTheme = (id: string) => {
    customThemes.value = customThemes.value.filter(t => t.id !== id)
    saveCustomThemes()
    
    if (activeThemeId.value === id) {
      setActiveTheme('default')
    }
  }

  const exportTheme = () => {
    const theme = currentTheme.value
    if (!theme) return null
    
    return JSON.stringify(theme, null, 2)
  }

  const importTheme = (jsonString: string): boolean => {
    try {
      const theme = JSON.parse(jsonString) as CustomTheme
      
      if (!theme.name || !theme.colors) {
        throw new Error('Invalid theme structure')
      }
      
      const imported = createCustomTheme(theme.name, theme.description || '', theme.colors)
      setActiveTheme(imported.id)
      
      return true
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }

  const applyCurrentThemeColors = () => {
    const theme = currentTheme.value
    if (!theme) return
    
    if ('isCustom' in theme && theme.isCustom) {
      // It's a custom theme - colors is ThemeColors
      applyThemeColors(theme.colors)
    } else if ('colors' in theme) {
      // It's a preset theme - colors has light/dark variants
      const themeColors = theme.colors as { light: ThemeColors; dark: ThemeColors }
      const colors = isDark.value ? themeColors.dark : themeColors.light
      applyThemeColors(colors)
    }
  }

  const updateHtmlClass = () => {
    const html = document.documentElement
    
    if (isDark.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // Apply current theme colors when dark mode changes
    applyCurrentThemeColors()
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
    const savedThemeId = localStorage.getItem('active-theme')

    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      mode.value = savedMode
    }

    if (savedSidebarCollapsed !== null) {
      sidebarCollapsed.value = savedSidebarCollapsed === 'true'
    }

    if (savedPrimaryColor) {
      primaryColor.value = savedPrimaryColor
    }

    if (savedThemeId) {
      activeThemeId.value = savedThemeId
    }

    // Load custom themes
    loadCustomThemes()

    updateHtmlClass()
    updateCSSVariables()
    applyCurrentThemeColors()
    setupSystemListener()
  }

  // Watch for changes
  watch(mode, () => {
    updateHtmlClass()
    if (mode.value === 'system') {
      setupSystemListener()
    }
  })
  
  watch(isDark, () => {
    updateHtmlClass()
  })
  
  watch(primaryColor, updateCSSVariables)
  
  watch(activeThemeId, applyCurrentThemeColors)

  // Initialize on store creation
  if (typeof window !== 'undefined') {
    initializeTheme()
  }

  return {
    // State
    mode,
    sidebarCollapsed,
    primaryColor,
    activeThemeId,
    customThemes,
    
    // Getters
    isDark,
    currentTheme,
    themeState,
    availableThemes,
    
    // Actions
    setMode,
    toggleMode,
    toggleSidebar,
    setSidebarCollapsed,
    setPrimaryColor,
    setActiveTheme,
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
    initializeTheme
  }
})