# Theme Customization Guide

A comprehensive guide to customizing and managing themes in your Vue.js application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Theme Presets](#theme-presets)
- [Using Themes](#using-themes)
- [Creating Custom Themes](#creating-custom-themes)
- [Dark Mode](#dark-mode)
- [Import/Export Themes](#importexport-themes)
- [Firestore Sync](#firestore-sync)
- [API Reference](#api-reference)
- [Advanced Usage](#advanced-usage)

## Overview

The theme system provides a flexible way to customize your application's appearance. It includes:

- **6 preset themes**: Default, Ocean, Forest, Sunset, Purple, and Rose
- **Custom theme creation**: Create unlimited custom color schemes
- **Dark mode support**: Automatic light/dark variants for all themes
- **Persistence**: Themes saved to localStorage and optionally synced to Firestore
- **Import/Export**: Share themes as JSON files
- **Live preview**: See changes instantly

## Quick Start

### Accessing the Theme Customizer

Navigate to **Settings > Theme** or visit `/dashboard/theme` to access the theme customization page.

### Selecting a Preset Theme

1. Browse available theme presets
2. Click on any theme card to apply it
3. The theme is applied immediately and saved automatically

### Switching Dark Mode

Use the dark mode toggle to switch between:
- **Light**: Always use light mode
- **Dark**: Always use dark mode  
- **System**: Follow system preferences

## Theme Presets

### Default (Indigo)
Classic indigo and gray color scheme. Professional and versatile.

```typescript
Primary: Indigo (#6366f1)
Secondary: Gray (#6b7280)
```

### Ocean (Cyan/Teal)
Cool blue and teal palette. Fresh and modern.

```typescript
Primary: Cyan (#06b6d4)
Secondary: Slate (#475569)
```

### Forest (Green)
Natural green and earth tones. Calming and organic.

```typescript
Primary: Green (#22c55e)
Secondary: Stone (#78716c)
```

### Sunset (Orange)
Warm orange and pink gradients. Energetic and vibrant.

```typescript
Primary: Orange (#f97316)
Secondary: Amber (#a16207)
```

### Purple (Purple/Violet)
Rich purple and violet shades. Creative and elegant.

```typescript
Primary: Purple (#a855f7)
Secondary: Gray (#6b7280)
```

### Rose (Pink)
Elegant pink and rose palette. Soft and sophisticated.

```typescript
Primary: Rose (#f43f5e)
Secondary: Gray (#6b7280)
```

## Using Themes

### In Components (Pinia Store)

```typescript
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()

// Switch theme
themeStore.setActiveTheme('ocean')

// Toggle dark mode
themeStore.setMode('dark')

// Get current theme
const currentTheme = themeStore.currentTheme

// Check if dark mode is active
const isDark = themeStore.isDark
```

### In Components (Composable)

```typescript
import { useTheme } from '@/composables/useTheme'

const {
  currentTheme,
  isDarkMode,
  setActiveTheme,
  setThemeMode,
  availableThemes
} = useTheme()

// Apply a theme
setActiveTheme('forest')

// Change dark mode
setThemeMode('system')
```

### Using Theme Colors in Templates

Theme colors are available as Tailwind utility classes:

```vue
<template>
  <!-- Background colors -->
  <div class="bg-primary-500">Primary background</div>
  <div class="bg-success-500">Success background</div>
  
  <!-- Text colors -->
  <span class="text-primary-600">Primary text</span>
  <span class="text-error-500">Error text</span>
  
  <!-- Borders -->
  <div class="border-2 border-warning-400">Warning border</div>
  
  <!-- Dark mode variants -->
  <div class="bg-gray-100 dark:bg-gray-800">
    Adapts to light/dark mode
  </div>
</template>
```

### Using CSS Variables Directly

```css
.custom-component {
  /* Using RGB format with alpha */
  background-color: rgb(var(--color-primary) / 0.1);
  color: rgb(var(--color-primary));
  border-color: rgb(var(--color-primary-dark));
}
```

## Creating Custom Themes

### Using the UI

1. Go to Theme Customization page
2. Click "Create Custom Theme"
3. Enter theme name and description
4. Select colors for each semantic purpose:
   - **Primary**: Main brand color
   - **Primary Dark**: Darker variant for hover states
   - **Secondary**: Secondary elements
   - **Success**: Success messages and indicators
   - **Warning**: Warning messages
   - **Error**: Error messages
   - **Info**: Informational messages
5. Click "Create Theme"

### Programmatically

```typescript
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()

const customTheme = themeStore.createCustomTheme(
  'My Custom Theme',
  'A beautiful custom color scheme',
  {
    primary: '139 92 246',        // RGB format: violet-500
    primaryDark: '124 58 237',    // violet-600
    secondary: '107 114 128',     // gray-500
    success: '34 197 94',         // green-500
    warning: '245 158 11',        // amber-500
    error: '239 68 68',           // red-500
    info: '59 130 246'            // blue-500
  }
)

// Apply the new theme
themeStore.setActiveTheme(customTheme.id)
```

### Color Format

Colors must be in RGB format without `rgb()` wrapper:

```typescript
// ✅ Correct
primary: '139 92 246'

// ❌ Wrong
primary: 'rgb(139, 92, 246)'
primary: '#8b5cf6'
```

### Converting Hex to RGB

Use the built-in helper in the theme customizer component:

```typescript
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    const r = parseInt(result[1]!, 16)
    const g = parseInt(result[2]!, 16)
    const b = parseInt(result[3]!, 16)
    return `${r} ${g} ${b}`
  }
  return '0 0 0'
}

const rgbColor = hexToRgb('#8b5cf6') // Returns '139 92 246'
```

## Dark Mode

Dark mode is automatically handled for preset themes. Each preset includes both light and dark color variants.

### Setting Dark Mode

```typescript
// Using store
themeStore.setMode('dark')    // Always dark
themeStore.setMode('light')   // Always light
themeStore.setMode('system')  // Follow system preference
```

### Custom Themes and Dark Mode

Custom themes use the same colors in both light and dark modes. For better dark mode support, consider:

- Using darker, less saturated colors
- Testing with the dark mode toggle
- Creating separate custom themes for light and dark if needed

## Import/Export Themes

### Exporting a Theme

1. Select the theme you want to export
2. Click "Export Current Theme"
3. A JSON file is downloaded

Or programmatically:

```typescript
const themeStore = useThemeStore()
const themeJson = themeStore.exportTheme()

if (themeJson) {
  // Save or share the JSON string
  console.log(themeJson)
}
```

### Importing a Theme

1. Click "Import Theme"
2. Select a JSON file
3. The theme is imported and automatically applied

Or programmatically:

```typescript
const themeStore = useThemeStore()
const success = themeStore.importTheme(jsonString)

if (success) {
  console.log('Theme imported successfully!')
}
```

### Theme JSON Format

```json
{
  "id": "custom-1234567890",
  "name": "My Custom Theme",
  "description": "A beautiful custom color scheme",
  "colors": {
    "primary": "139 92 246",
    "primaryDark": "124 58 237",
    "secondary": "107 114 128",
    "success": "34 197 94",
    "warning": "245 158 11",
    "error": "239 68 68",
    "info": "59 130 246"
  },
  "isCustom": true
}
```

## Firestore Sync

Optionally sync theme preferences across devices using Firestore.

### Enabling Sync

```typescript
import { enableAutoSync } from '@/services/themeSync'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'

const themeStore = useThemeStore()
const authStore = useAuthStore()

// Enable auto-sync when user is authenticated
if (authStore.user) {
  const cleanup = enableAutoSync(authStore.user.uid, () => ({
    mode: themeStore.mode,
    activeThemeId: themeStore.activeThemeId,
    customThemes: themeStore.customThemes
  }))
  
  // Call cleanup() when logging out or unmounting
}
```

### Manual Sync

```typescript
import { syncThemePreferences } from '@/services/themeSync'

// Sync preferences
const synced = await syncThemePreferences(userId, {
  mode: themeStore.mode,
  activeThemeId: themeStore.activeThemeId,
  customThemes: themeStore.customThemes
})

if (synced) {
  // Apply synced preferences
  themeStore.setMode(synced.mode)
  themeStore.setActiveTheme(synced.activeThemeId)
  // Update custom themes...
}
```

## API Reference

### useThemeStore

#### State

```typescript
mode: ThemeMode                    // 'light' | 'dark' | 'system'
isDark: boolean                    // Computed: Is dark mode active?
activeThemeId: string              // Current theme ID
currentTheme: Theme | undefined    // Current theme object
availableThemes: Theme[]           // All available themes
customThemes: CustomTheme[]        // User's custom themes
```

#### Actions

```typescript
setMode(mode: ThemeMode): void
setActiveTheme(themeId: string): void
createCustomTheme(name, description, colors): CustomTheme
updateCustomTheme(id, updates): void
deleteCustomTheme(id): void
exportTheme(): string | null
importTheme(jsonString): boolean
```

### useTheme Composable

Returns the same interface as the store, but as a composable.

## Advanced Usage

### Listening to Theme Changes

```typescript
import { watch } from 'vue'
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()

// Watch for theme changes
watch(() => themeStore.activeThemeId, (newTheme) => {
  console.log('Theme changed to:', newTheme)
  // Perform actions when theme changes
})

// Watch for dark mode changes
watch(() => themeStore.isDark, (isDark) => {
  console.log('Dark mode:', isDark ? 'enabled' : 'disabled')
})
```

### Applying Theme Colors Dynamically

```typescript
import { applyThemeColors } from '@/config/themes'

// Apply custom colors on the fly
applyThemeColors({
  primary: '139 92 246',
  primaryDark: '124 58 237',
  secondary: '107 114 128',
  success: '34 197 94',
  warning: '245 158 11',
  error: '239 68 68',
  info: '59 130 246'
})
```

### Custom Theme Validation

```typescript
import { validateThemeColors } from '@/config/themes'

const colors = {
  primary: '139 92 246',
  // ... other colors
}

if (validateThemeColors(colors)) {
  // Colors are valid
} else {
  // Invalid format
}
```

## Best Practices

1. **Test in Both Modes**: Always test your custom themes in both light and dark modes
2. **Accessibility**: Ensure sufficient contrast ratios for text readability
3. **Consistency**: Use semantic colors appropriately (e.g., red for errors)
4. **Performance**: Theme changes are applied via CSS variables, which is highly performant
5. **Persistence**: Themes are automatically saved to localStorage
6. **Sharing**: Export and share custom themes with your team

## Troubleshooting

### Theme Not Applying

- Check browser console for errors
- Ensure color values are in correct RGB format
- Clear localStorage and try again: `localStorage.clear()`

### Dark Mode Not Working

- Check if system preferences are overriding (set mode to 'light' or 'dark')
- Inspect HTML element for 'dark' class
- Verify Tailwind's dark mode is configured correctly

### Colors Not Updating

- Hard refresh the page (Ctrl+F5)
- Check if CSS custom properties are being set: Inspect element > Computed styles
- Ensure TailwindCSS is processing the color utilities

## Migration from Old Theme System

If you're migrating from the old theme system:

1. Old theme preferences in localStorage will be automatically migrated
2. CSS variables remain compatible
3. Update any direct references to the old `useTheme` composable
4. Test all components that use theme colors

## Support

For issues or questions:
- Check the [README](README.md)
- Review [TailwindCSS Documentation](https://tailwindcss.com/docs)
- File an issue in the project repository
