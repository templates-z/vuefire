import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useTheme() {
  const isDarkMode = ref(false)
  
  const updateTheme = () => {
    const html = document.documentElement
    const currentMode = localStorage.getItem('theme-mode') || 'system'
    
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
  
  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme-mode', mode)
    updateTheme()
  }
  
  const systemThemeQuery = computed(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)')
    }
    return null
  })
  
  onMounted(() => {
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
    isDarkMode,
    setTheme,
    updateTheme
  }
}