import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Brain, Heart, Sprout, Monitor, Home, Palette } from 'lucide-react'

// Pfluger Brand Colors (matching ProjectPrism)
export const APP_COLORS = {
  // Primary Colors
  primary: {
    brick: '#9A3324',     // Dark Red/Brick Red
    black: '#000000',     // Black
    mediumGray: '#707372', // Medium Gray
    lightGray: '#C7C9C7',  // Light Gray
    white: '#FFFFFF'      // White
  },

  // Secondary Colors
  secondary: {
    darkBlue: '#003C71',    // Dark Blue
    skyBlue: '#00A9E0',     // Bright Cyan/Sky Blue
    oliveGreen: '#67823A',  // Olive Green
    chartreuse: '#B5BD00',  // Yellow-Green/Chartreuse
    orange: '#F2A900',       // Orange
    salmon: '#f16555'      // Salmon
  },

  // RGB Values for advanced usage
  rgb: {
    brick: { r: 154, g: 51, b: 36 },
    black: { r: 0, g: 0, b: 0 },
    mediumGray: { r: 112, g: 115, b: 114 },
    lightGray: { r: 199, g: 201, b: 199 },
    white: { r: 255, g: 255, b: 255 },
    darkBlue: { r: 0, g: 60, b: 113 },
    skyBlue: { r: 0, g: 169, b: 224 },
    oliveGreen: { r: 103, g: 130, b: 58 },
    chartreuse: { r: 181, g: 189, b: 0 },
    orange: { r: 242, g: 169, b: 0 },
    salmon: { r: 241, g: 101, b: 85 }
  }
}

// Research category color mappings
export const RESEARCH_CATEGORY_COLORS = {
  'psychology': {
    color: APP_COLORS.primary.brick,
    rgb: APP_COLORS.rgb.brick,
    tailwind: 'bg-[#9A3324]',
    label: 'Psychology',
    icon: Brain
  },
  'health-safety': {
    color: APP_COLORS.secondary.salmon,
    rgb: APP_COLORS.rgb.salmon,
    tailwind: 'bg-[#f16555]',
    label: 'Health & Safety',
    icon: Heart
  },
  'sustainability': {
    color: APP_COLORS.secondary.oliveGreen,
    rgb: APP_COLORS.rgb.oliveGreen,
    tailwind: 'bg-[#67823A]',
    label: 'Sustainability',
    icon: Sprout
  },
  'immersive': {
    color: APP_COLORS.secondary.skyBlue,
    rgb: APP_COLORS.rgb.skyBlue,
    tailwind: 'bg-[#00A9E0]',
    label: 'Immersive Learning',
    icon: Monitor
  },
  'campus-life': {
    color: APP_COLORS.secondary.chartreuse,
    rgb: APP_COLORS.rgb.chartreuse,
    tailwind: 'bg-[#B5BD00]',
    label: 'Campus Life',
    icon: Home
  },
  'fine-arts': {
    color: APP_COLORS.secondary.orange,
    rgb: APP_COLORS.rgb.orange,
    tailwind: 'bg-[#F2A900]',
    label: 'Fine Arts',
    icon: Palette
  }
}

// Helper function to get research category color
export function getResearchCategoryColor(category: string): typeof RESEARCH_CATEGORY_COLORS['psychology'] {
  const normalized = category.toLowerCase().trim()

  // Direct matches
  if (RESEARCH_CATEGORY_COLORS[normalized as keyof typeof RESEARCH_CATEGORY_COLORS]) {
    return RESEARCH_CATEGORY_COLORS[normalized as keyof typeof RESEARCH_CATEGORY_COLORS]
  }

  // Default fallback
  return {
    color: APP_COLORS.primary.mediumGray,
    rgb: APP_COLORS.rgb.mediumGray,
    tailwind: 'bg-[#707372]',
    label: category,
    icon: Brain
  }
}

// Helper function to get research category icon
export function getResearchCategoryIcon(category: string) {
  const categoryData = getResearchCategoryColor(category)
  return categoryData.icon
}

// Research phase color adjustment (brightness based on phase)
export function getPhaseColor(baseColor: string, phase: string): string {
  // Parse hex color to RGB
  const r = parseInt(baseColor.slice(1, 3), 16)
  const g = parseInt(baseColor.slice(3, 5), 16)
  const b = parseInt(baseColor.slice(5, 7), 16)

  // Adjust brightness based on phase
  let factor = 1
  if (phase === 'Pre-Research') {
    factor = 0.5 // Darker (50%)
  } else if (phase === 'Developmental') {
    factor = 0.75 // Medium (75%)
  } else if (phase === 'Completed') {
    factor = 1 // Full brightness (100%)
  }

  const newR = Math.round(r * factor)
  const newG = Math.round(g * factor)
  const newB = Math.round(b * factor)

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// Status/State Colors - Semantic colors for app states
export const STATUS_COLORS = {
  success: {
    color: APP_COLORS.secondary.oliveGreen,
    rgb: APP_COLORS.rgb.oliveGreen,
    tailwind: 'bg-[#67823A]',
    text: 'text-[#67823A]'
  },
  warning: {
    color: APP_COLORS.secondary.orange,
    rgb: APP_COLORS.rgb.orange,
    tailwind: 'bg-[#F2A900]',
    text: 'text-[#F2A900]'
  },
  error: {
    color: APP_COLORS.primary.brick,
    rgb: APP_COLORS.rgb.brick,
    tailwind: 'bg-[#9A3324]',
    text: 'text-[#9A3324]'
  },
  info: {
    color: APP_COLORS.secondary.skyBlue,
    rgb: APP_COLORS.rgb.skyBlue,
    tailwind: 'bg-[#00A9E0]',
    text: 'text-[#00A9E0]'
  },
  neutral: {
    color: APP_COLORS.primary.mediumGray,
    rgb: APP_COLORS.rgb.mediumGray,
    tailwind: 'bg-[#707372]',
    text: 'text-[#707372]'
  }
}

// Dark theme configuration (Material Design recommended)
export const DARK_THEME = {
  background: '#121212',  // Material Design dark surface
  card: '#1e1e1e',
  border: '#2a2a2a',
  text: {
    primary: APP_COLORS.primary.white,
    secondary: APP_COLORS.primary.lightGray,
    muted: APP_COLORS.primary.mediumGray
  },
  accent: APP_COLORS.secondary.skyBlue
}

// Component-Specific Theming
export const COMPONENT_THEMES = {
  sidebar: {
    dark: {
      bg: DARK_THEME.card + 'f2', // with opacity
      text: DARK_THEME.text.primary,
      activeBg: APP_COLORS.secondary.skyBlue,
      activeText: APP_COLORS.primary.white,
      hoverBg: DARK_THEME.border
    }
  },
  map: {
    dark: {
      tileLayer: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      markerSize: 36,
      confidentialColor: '#666666'
    }
  },
  cards: {
    dark: {
      bg: DARK_THEME.card,
      border: DARK_THEME.border,
      hover: '#252525',
      shadow: 'rgba(0, 0, 0, 0.3)'
    }
  }
}

// Utility functions for color manipulation
export const colorUtils = {
  // Convert hex to RGB
  hexToRgb: (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  },

  // Create RGBA with opacity
  rgba: (hex: string, opacity: number) => {
    const rgb = colorUtils.hexToRgb(hex)
    return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : hex
  },

  // Adjust brightness
  adjustBrightness: (hex: string, factor: number) => {
    return getPhaseColor(hex, factor === 0.5 ? 'Pre-Research' : factor === 0.75 ? 'Developmental' : 'Completed')
  }
}

// Theme context
type ThemeContextType = {
  colors: typeof APP_COLORS
  researchColors: typeof RESEARCH_CATEGORY_COLORS
  statusColors: typeof STATUS_COLORS
  darkTheme: typeof DARK_THEME
  componentThemes: typeof COMPONENT_THEMES
  utils: typeof colorUtils
  getResearchCategoryColor: typeof getResearchCategoryColor
  getResearchCategoryIcon: typeof getResearchCategoryIcon
  getPhaseColor: typeof getPhaseColor
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Theme provider component
interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    // Apply theme CSS variables to document root
    const root = document.documentElement

    // Apply dark theme class
    root.classList.add('dark')

    // Apply app brand colors as CSS variables
    Object.entries(APP_COLORS.primary).forEach(([key, value]) => {
      root.style.setProperty(`--app-${key}`, value)
    })

    Object.entries(APP_COLORS.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--app-${key}`, value)
    })

    // Apply dark theme colors
    root.style.setProperty('--dark-bg', DARK_THEME.background)
    root.style.setProperty('--dark-card', DARK_THEME.card)
    root.style.setProperty('--dark-border', DARK_THEME.border)
    root.style.setProperty('--dark-accent', DARK_THEME.accent)
  }, [])

  return (
    <ThemeContext.Provider value={{
      colors: APP_COLORS,
      researchColors: RESEARCH_CATEGORY_COLORS,
      statusColors: STATUS_COLORS,
      darkTheme: DARK_THEME,
      componentThemes: COMPONENT_THEMES,
      utils: colorUtils,
      getResearchCategoryColor,
      getResearchCategoryIcon,
      getPhaseColor
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
