import { ref, computed, onMounted, onUnmounted } from 'vue'
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

/**
 * Enhanced theme management composable
 * Supports dark mode, multiple theme presets, and custom themes
 */
export function useTheme() {
  const isDarkMode = ref(false)
  const currentThemeId = ref<string>('default')
  const customThemes = ref<CustomTheme[]>([])
  
  /**
   * Load custom themes from localStorage
   */
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
  
  /**
   * Save custom themes to localStorage
   */
  const saveCustomThemes = () => {
    try {
      localStorage.setItem('custom-themes', JSON.stringify(customThemes.value))
    } catch (error) {
      console.error('Failed to save custom themes:', error)
    }
  }
  
  /**
   * Update dark mode based on mode setting
   */
  const updateDarkMode = () => {
    const html = document.documentElement
    const currentMode = (localStorage.getItem('theme-mode') || 'system') as ThemeMode
    
    let shouldBeDark = false
    
    if (currentMode === 'dark') {
      shouldBeDark = true
    } else if (currentMode === 'light') {
      shouldBeDark = false
    } else { // system
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    isDarkMode.value = shouldBeDark
    
    if (shouldBeDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }
  
  /**
   * Apply the current theme colors
   */
  const applyCurrentTheme = () => {
    const themeId = currentThemeId.value
    const theme = getTheme(themeId)
    
    if (theme) {
      const colors = isDarkMode.value ? theme.colors.dark : theme.colors.light
      applyThemeColors(colors)
    } else {
      // Check if it's a custom theme
      const customTheme = customThemes.value.find(t => t.id === themeId)
      if (customTheme) {
        applyThemeColors(customTheme.colors)
      }
    }
  }
  
  /**
   * Update theme (both dark mode and colors)
   */
  const updateTheme = () => {
    updateDarkMode()
    applyCurrentTheme()
  }
  
  /**
   * Set theme mode (light/dark/system)
   */
  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem('theme-mode', mode)
    updateTheme()
  }
  
  /**
   * Set active theme by ID
   */
  const setActiveTheme = (themeId: string) => {
    currentThemeId.value = themeId
    localStorage.setItem('active-theme', themeId)
    applyCurrentTheme()
  }
  
  /**
   * Get current theme mode
   */
  const getThemeMode = (): ThemeMode => {
    return (localStorage.getItem('theme-mode') || 'system') as ThemeMode
  }
  
  /**
   * Get all available themes (presets + custom)
   */
  const availableThemes = computed(() => {
    return [...getAllThemes(), ...customThemes.value]
  })
  
  /**
   * Get current theme object
   */
  const currentTheme = computed(() => {
    const themeId = currentThemeId.value
    const theme = getTheme(themeId)
    if (theme) return theme
    
    return customThemes.value.find(t => t.id === themeId)
  })
  
  /**
   * Create a custom theme
   */
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
  
  /**
   * Update a custom theme
   */
  const updateCustomTheme = (id: string, updates: Partial<Omit<CustomTheme, 'id' | 'isCustom'>>) => {
    const index = customThemes.value.findIndex(t => t.id === id)
    if (index !== -1) {
      const existing = customThemes.value[index]!
      customThemes.value[index] = { ...existing, ...updates } as CustomTheme
      saveCustomThemes()
      
      // Re-apply if it's the current theme
      if (currentThemeId.value === id) {
        applyCurrentTheme()
      }
    }
  }
  
  /**
   * Delete a custom theme
   */
  const deleteCustomTheme = (id: string) => {
    customThemes.value = customThemes.value.filter(t => t.id !== id)
    saveCustomThemes()
    
    // Switch to default if deleting current theme
    if (currentThemeId.value === id) {
      setActiveTheme('default')
    }
  }
  
  /**
   * Export current theme as JSON
   */
  const exportTheme = () => {
    const theme = currentTheme.value
    if (!theme) return null
    
    return JSON.stringify(theme, null, 2)
  }
  
  /**
   * Import theme from JSON
   */
  const importTheme = (jsonString: string): boolean => {
    try {
      const theme = JSON.parse(jsonString) as CustomTheme
      
      // Validate structure
      if (!theme.name || !theme.colors) {
        throw new Error('Invalid theme structure')
      }
      
      // Create as custom theme
      const imported = createCustomTheme(theme.name, theme.description || '', theme.colors)
      setActiveTheme(imported.id)
      
      return true
    } catch (error) {
      console.error('Failed to import theme:', error)
      return false
    }
  }
  
  const systemThemeQuery = computed(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)')
    }
    return null
  })
  
  onMounted(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('active-theme')
    if (savedTheme) {
      currentThemeId.value = savedTheme
    }
    
    // Load custom themes
    loadCustomThemes()
    
    // Apply theme
    updateTheme()
    
    // Listen for system theme changes
    const mediaQuery = systemThemeQuery.value
    if (mediaQuery) {
      mediaQuery.addEventListener('change', updateTheme)
    }
  })
  
  onUnmounted(() => {
    const mediaQuery = systemThemeQuery.value
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', updateTheme)
    }
  })
  
  return {
    // State
    isDarkMode,
    currentThemeId,
    currentTheme,
    availableThemes,
    customThemes,
    
    // Dark mode management
    setThemeMode,
    getThemeMode,
    updateTheme,
    
    // Theme management
    setActiveTheme,
    
    // Custom themes
    createCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    
    // Import/Export
    exportTheme,
    importTheme,
    
    // Legacy compatibility
    setTheme: setThemeMode,
  }
}