/**
 * Theme Configuration System
 * 
 * This file defines color themes that can be applied to the application.
 * Each theme includes primary, secondary, and semantic colors.
 */

export interface ThemeColors {
  primary: string
  primaryDark: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
}

export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
}

/**
 * Predefined theme presets
 */
export const themePresets: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Classic indigo and gray color scheme',
    colors: {
      light: {
        primary: '99 102 241',      // indigo-500
        primaryDark: '79 70 229',   // indigo-600
        secondary: '107 114 128',   // gray-500
        success: '34 197 94',       // green-500
        warning: '245 158 11',      // amber-500
        error: '239 68 68',         // red-500
        info: '59 130 246',         // blue-500
      },
      dark: {
        primary: '129 140 248',     // indigo-400
        primaryDark: '99 102 241',  // indigo-500
        secondary: '156 163 175',   // gray-400
        success: '74 222 128',      // green-400
        warning: '251 191 36',      // amber-400
        error: '248 113 113',       // red-400
        info: '96 165 250',         // blue-400
      },
    },
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blue and teal color palette',
    colors: {
      light: {
        primary: '6 182 212',       // cyan-500
        primaryDark: '8 145 178',   // cyan-600
        secondary: '71 85 105',     // slate-600
        success: '16 185 129',      // emerald-500
        warning: '245 158 11',      // amber-500
        error: '239 68 68',         // red-500
        info: '14 165 233',         // sky-500
      },
      dark: {
        primary: '34 211 238',      // cyan-400
        primaryDark: '6 182 212',   // cyan-500
        secondary: '148 163 184',   // slate-400
        success: '52 211 153',      // emerald-400
        warning: '251 191 36',      // amber-400
        error: '248 113 113',       // red-400
        info: '56 189 248',         // sky-400
      },
    },
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green and earth tones',
    colors: {
      light: {
        primary: '34 197 94',       // green-500
        primaryDark: '22 163 74',   // green-600
        secondary: '120 113 108',   // stone-500
        success: '132 204 22',      // lime-500
        warning: '234 179 8',       // yellow-500
        error: '239 68 68',         // red-500
        info: '6 182 212',          // cyan-500
      },
      dark: {
        primary: '74 222 128',      // green-400
        primaryDark: '34 197 94',   // green-500
        secondary: '168 162 158',   // stone-400
        success: '163 230 53',      // lime-400
        warning: '250 204 21',      // yellow-400
        error: '248 113 113',       // red-400
        info: '34 211 238',         // cyan-400
      },
    },
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and pink gradients',
    colors: {
      light: {
        primary: '249 115 22',      // orange-500
        primaryDark: '234 88 12',   // orange-600
        secondary: '161 98 7',      // amber-700
        success: '34 197 94',       // green-500
        warning: '245 158 11',      // amber-500
        error: '239 68 68',         // red-500
        info: '236 72 153',         // pink-500
      },
      dark: {
        primary: '251 146 60',      // orange-400
        primaryDark: '249 115 22',  // orange-500
        secondary: '251 191 36',    // amber-400
        success: '74 222 128',      // green-400
        warning: '251 191 36',      // amber-400
        error: '248 113 113',       // red-400
        info: '244 114 182',        // pink-400
      },
    },
  },

  purple: {
    id: 'purple',
    name: 'Purple',
    description: 'Rich purple and violet shades',
    colors: {
      light: {
        primary: '168 85 247',      // purple-500
        primaryDark: '147 51 234',  // purple-600
        secondary: '107 114 128',   // gray-500
        success: '34 197 94',       // green-500
        warning: '245 158 11',      // amber-500
        error: '239 68 68',         // red-500
        info: '139 92 246',         // violet-500
      },
      dark: {
        primary: '192 132 252',     // purple-400
        primaryDark: '168 85 247',  // purple-500
        secondary: '156 163 175',   // gray-400
        success: '74 222 128',      // green-400
        warning: '251 191 36',      // amber-400
        error: '248 113 113',       // red-400
        info: '167 139 250',        // violet-400
      },
    },
  },

  rose: {
    id: 'rose',
    name: 'Rose',
    description: 'Elegant pink and rose palette',
    colors: {
      light: {
        primary: '244 63 94',       // rose-500
        primaryDark: '225 29 72',   // rose-600
        secondary: '107 114 128',   // gray-500
        success: '34 197 94',       // green-500
        warning: '245 158 11',      // amber-500
        error: '239 68 68',         // red-500
        info: '236 72 153',         // pink-500
      },
      dark: {
        primary: '251 113 133',     // rose-400
        primaryDark: '244 63 94',   // rose-500
        secondary: '156 163 175',   // gray-400
        success: '74 222 128',      // green-400
        warning: '251 191 36',      // amber-400
        error: '248 113 113',       // red-400
        info: '244 114 182',        // pink-400
      },
    },
  },
}

/**
 * Get all available theme IDs
 */
export function getThemeIds(): string[] {
  return Object.keys(themePresets)
}

/**
 * Get a theme by ID
 */
export function getTheme(id: string): Theme | undefined {
  return themePresets[id]
}

/**
 * Get all themes
 */
export function getAllThemes(): Theme[] {
  return Object.values(themePresets)
}

/**
 * Apply theme colors to CSS variables
 */
export function applyThemeColors(colors: ThemeColors): void {
  const root = document.documentElement
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-primary-dark', colors.primaryDark)
  root.style.setProperty('--color-secondary', colors.secondary)
  root.style.setProperty('--color-success', colors.success)
  root.style.setProperty('--color-warning', colors.warning)
  root.style.setProperty('--color-error', colors.error)
  root.style.setProperty('--color-info', colors.info)
}

/**
 * Validate theme colors format
 */
export function validateThemeColors(colors: ThemeColors): boolean {
  const rgbPattern = /^\d{1,3} \d{1,3} \d{1,3}$/
  
  return Object.values(colors).every(color => rgbPattern.test(color))
}
