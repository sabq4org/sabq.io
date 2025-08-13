// نظام الثيمات المتقدم مع دعم OKLCH
export interface OKLCHColor {
  l: number // Lightness (0-1)
  c: number // Chroma (0-0.4)
  h: number // Hue (0-360)
}

export interface ThemeColors {
  primary: OKLCHColor
  primaryForeground: OKLCHColor
  secondary: OKLCHColor
  secondaryForeground: OKLCHColor
  accent: OKLCHColor
  accentForeground: OKLCHColor
  background: OKLCHColor
  foreground: OKLCHColor
  card: OKLCHColor
  cardForeground: OKLCHColor
  muted: OKLCHColor
  mutedForeground: OKLCHColor
  border: OKLCHColor
  input: OKLCHColor
  ring: OKLCHColor
  destructive: OKLCHColor
  destructiveForeground: OKLCHColor
}

export interface ThemeSettings {
  borderRadius: number // 0-20px
  fontSize: number // 0.8-1.5x
  lineHeight: number // 1.2-2.0
  letterSpacing: number // -0.05-0.1em
}

export interface Theme {
  id: string
  name: string
  nameAr: string
  description: string
  colors: ThemeColors
  settings: ThemeSettings
  isBuiltIn: boolean
}

// الثيمات الجاهزة
export const builtInThemes: Theme[] = [
  {
    id: 'sabq-editorial',
    name: 'Sabq Editorial',
    nameAr: 'سبق التحريري',
    description: 'الهوية البصرية الأساسية لصحيفة سبق',
    isBuiltIn: true,
    colors: {
      primary: { l: 0.25, c: 0.08, h: 250 },
      primaryForeground: { l: 1, c: 0, h: 0 },
      secondary: { l: 0.9, c: 0, h: 0 },
      secondaryForeground: { l: 0.1, c: 0, h: 0 },
      accent: { l: 0.7, c: 0.15, h: 45 },
      accentForeground: { l: 0.1, c: 0, h: 0 },
      background: { l: 1, c: 0, h: 0 },
      foreground: { l: 0.1, c: 0, h: 0 },
      card: { l: 1, c: 0, h: 0 },
      cardForeground: { l: 0.1, c: 0, h: 0 },
      muted: { l: 0.95, c: 0, h: 0 },
      mutedForeground: { l: 0.5, c: 0, h: 0 },
      border: { l: 0.9, c: 0, h: 0 },
      input: { l: 0.95, c: 0, h: 0 },
      ring: { l: 0.25, c: 0.08, h: 250 },
      destructive: { l: 0.5, c: 0.2, h: 0 },
      destructiveForeground: { l: 1, c: 0, h: 0 }
    },
    settings: {
      borderRadius: 8,
      fontSize: 1,
      lineHeight: 1.6,
      letterSpacing: 0
    }
  },
  {
    id: 'professional-dark',
    name: 'Professional Dark',
    nameAr: 'احترافي داكن',
    description: 'ثيم داكن أنيق للقراءة المريحة',
    isBuiltIn: true,
    colors: {
      primary: { l: 0.7, c: 0.1, h: 220 },
      primaryForeground: { l: 0.1, c: 0, h: 0 },
      secondary: { l: 0.2, c: 0, h: 0 },
      secondaryForeground: { l: 0.9, c: 0, h: 0 },
      accent: { l: 0.6, c: 0.12, h: 280 },
      accentForeground: { l: 0.1, c: 0, h: 0 },
      background: { l: 0.05, c: 0, h: 0 },
      foreground: { l: 0.9, c: 0, h: 0 },
      card: { l: 0.1, c: 0, h: 0 },
      cardForeground: { l: 0.9, c: 0, h: 0 },
      muted: { l: 0.15, c: 0, h: 0 },
      mutedForeground: { l: 0.6, c: 0, h: 0 },
      border: { l: 0.2, c: 0, h: 0 },
      input: { l: 0.15, c: 0, h: 0 },
      ring: { l: 0.7, c: 0.1, h: 220 },
      destructive: { l: 0.6, c: 0.2, h: 0 },
      destructiveForeground: { l: 0.1, c: 0, h: 0 }
    },
    settings: {
      borderRadius: 12,
      fontSize: 1.1,
      lineHeight: 1.7,
      letterSpacing: 0.01
    }
  },
  {
    id: 'golden-royal',
    name: 'Golden Royal',
    nameAr: 'ذهبي ملكي',
    description: 'تصميم فاخر بلمسات ذهبية',
    isBuiltIn: true,
    colors: {
      primary: { l: 0.2, c: 0.1, h: 280 },
      primaryForeground: { l: 1, c: 0, h: 0 },
      secondary: { l: 0.15, c: 0.05, h: 280 },
      secondaryForeground: { l: 0.9, c: 0, h: 0 },
      accent: { l: 0.7, c: 0.2, h: 45 },
      accentForeground: { l: 0.1, c: 0, h: 0 },
      background: { l: 0.98, c: 0.01, h: 45 },
      foreground: { l: 0.1, c: 0, h: 0 },
      card: { l: 1, c: 0, h: 0 },
      cardForeground: { l: 0.1, c: 0, h: 0 },
      muted: { l: 0.95, c: 0.01, h: 45 },
      mutedForeground: { l: 0.5, c: 0, h: 0 },
      border: { l: 0.9, c: 0.02, h: 45 },
      input: { l: 0.95, c: 0.01, h: 45 },
      ring: { l: 0.7, c: 0.2, h: 45 },
      destructive: { l: 0.5, c: 0.2, h: 0 },
      destructiveForeground: { l: 1, c: 0, h: 0 }
    },
    settings: {
      borderRadius: 16,
      fontSize: 1.05,
      lineHeight: 1.8,
      letterSpacing: 0.02
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    nameAr: 'أزرق المحيط',
    description: 'ألوان مستوحاة من المحيط',
    isBuiltIn: true,
    colors: {
      primary: { l: 0.4, c: 0.15, h: 220 },
      primaryForeground: { l: 1, c: 0, h: 0 },
      secondary: { l: 0.85, c: 0.02, h: 220 },
      secondaryForeground: { l: 0.2, c: 0, h: 0 },
      accent: { l: 0.6, c: 0.12, h: 200 },
      accentForeground: { l: 0.1, c: 0, h: 0 },
      background: { l: 0.98, c: 0.01, h: 220 },
      foreground: { l: 0.15, c: 0, h: 0 },
      card: { l: 1, c: 0, h: 0 },
      cardForeground: { l: 0.15, c: 0, h: 0 },
      muted: { l: 0.92, c: 0.02, h: 220 },
      mutedForeground: { l: 0.5, c: 0, h: 0 },
      border: { l: 0.88, c: 0.03, h: 220 },
      input: { l: 0.95, c: 0.01, h: 220 },
      ring: { l: 0.4, c: 0.15, h: 220 },
      destructive: { l: 0.5, c: 0.2, h: 0 },
      destructiveForeground: { l: 1, c: 0, h: 0 }
    },
    settings: {
      borderRadius: 6,
      fontSize: 0.95,
      lineHeight: 1.5,
      letterSpacing: -0.01
    }
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth',
    nameAr: 'ترابي دافئ',
    description: 'ألوان طبيعية دافئة ومريحة',
    isBuiltIn: true,
    colors: {
      primary: { l: 0.35, c: 0.12, h: 30 },
      primaryForeground: { l: 1, c: 0, h: 0 },
      secondary: { l: 0.9, c: 0.03, h: 30 },
      secondaryForeground: { l: 0.2, c: 0, h: 0 },
      accent: { l: 0.65, c: 0.15, h: 15 },
      accentForeground: { l: 0.1, c: 0, h: 0 },
      background: { l: 0.97, c: 0.02, h: 30 },
      foreground: { l: 0.2, c: 0, h: 0 },
      card: { l: 1, c: 0, h: 0 },
      cardForeground: { l: 0.2, c: 0, h: 0 },
      muted: { l: 0.93, c: 0.03, h: 30 },
      mutedForeground: { l: 0.5, c: 0, h: 0 },
      border: { l: 0.87, c: 0.04, h: 30 },
      input: { l: 0.95, c: 0.02, h: 30 },
      ring: { l: 0.35, c: 0.12, h: 30 },
      destructive: { l: 0.5, c: 0.2, h: 0 },
      destructiveForeground: { l: 1, c: 0, h: 0 }
    },
    settings: {
      borderRadius: 10,
      fontSize: 1.02,
      lineHeight: 1.65,
      letterSpacing: 0.005
    }
  },
  {
    id: 'mint-fresh',
    name: 'Mint Fresh',
    nameAr: 'نعناع منعش',
    description: 'ألوان منعشة مع لمسات خضراء',
    isBuiltIn: true,
    colors: {
      primary: { l: 0.4, c: 0.1, h: 160 },
      primaryForeground: { l: 1, c: 0, h: 0 },
      secondary: { l: 0.92, c: 0.02, h: 160 },
      secondaryForeground: { l: 0.2, c: 0, h: 0 },
      accent: { l: 0.7, c: 0.12, h: 140 },
      accentForeground: { l: 0.1, c: 0, h: 0 },
      background: { l: 0.99, c: 0.01, h: 160 },
      foreground: { l: 0.15, c: 0, h: 0 },
      card: { l: 1, c: 0, h: 0 },
      cardForeground: { l: 0.15, c: 0, h: 0 },
      muted: { l: 0.95, c: 0.02, h: 160 },
      mutedForeground: { l: 0.5, c: 0, h: 0 },
      border: { l: 0.9, c: 0.03, h: 160 },
      input: { l: 0.97, c: 0.01, h: 160 },
      ring: { l: 0.4, c: 0.1, h: 160 },
      destructive: { l: 0.5, c: 0.2, h: 0 },
      destructiveForeground: { l: 1, c: 0, h: 0 }
    },
    settings: {
      borderRadius: 14,
      fontSize: 0.98,
      lineHeight: 1.55,
      letterSpacing: 0
    }
  }
]

// تحويل OKLCH إلى CSS
export function oklchToCSS(color: OKLCHColor): string {
  return `oklch(${color.l} ${color.c} ${color.h})`
}

// تحويل الثيم إلى متغيرات CSS
export function themeToCSS(theme: Theme): string {
  const cssVars = Object.entries(theme.colors)
    .map(([key, color]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `  --${cssKey}: ${oklchToCSS(color)};`
    })
    .join('\n')

  const settingsVars = [
    `  --border-radius: ${theme.settings.borderRadius}px;`,
    `  --font-size-scale: ${theme.settings.fontSize};`,
    `  --line-height: ${theme.settings.lineHeight};`,
    `  --letter-spacing: ${theme.settings.letterSpacing}em;`
  ].join('\n')

  return `:root {\n${cssVars}\n${settingsVars}\n}`
}

// توليد لوحة ألوان من لون أساسي
export function generatePaletteFromPrimary(primary: OKLCHColor): Partial<ThemeColors> {
  return {
    primary,
    primaryForeground: { l: primary.l > 0.5 ? 0.1 : 0.9, c: 0, h: 0 },
    secondary: { l: 0.9, c: primary.c * 0.3, h: primary.h },
    secondaryForeground: { l: 0.1, c: 0, h: 0 },
    accent: { l: 0.7, c: primary.c * 1.2, h: (primary.h + 30) % 360 },
    accentForeground: { l: 0.1, c: 0, h: 0 },
    ring: primary
  }
}

// فحص التباين للوصولية
export function checkContrast(foreground: OKLCHColor, background: OKLCHColor): {
  ratio: number
  level: 'AAA' | 'AA' | 'A' | 'FAIL'
} {
  // تقدير مبسط لنسبة التباين
  const lightnessDiff = Math.abs(foreground.l - background.l)
  const chromaDiff = Math.abs(foreground.c - background.c)
  
  const estimatedRatio = (lightnessDiff * 20) + (chromaDiff * 5) + 1
  
  let level: 'AAA' | 'AA' | 'A' | 'FAIL'
  if (estimatedRatio >= 7) level = 'AAA'
  else if (estimatedRatio >= 4.5) level = 'AA'
  else if (estimatedRatio >= 3) level = 'A'
  else level = 'FAIL'
  
  return { ratio: estimatedRatio, level }
}

// نظام إدارة الثيمات
export class ThemeManager {
  private currentTheme: Theme
  private customThemes: Theme[] = []

  constructor() {
    this.currentTheme = builtInThemes[0]
    this.loadCustomThemes()
  }

  // تطبيق ثيم
  applyTheme(theme: Theme) {
    this.currentTheme = theme
    const css = themeToCSS(theme)
    
    // إزالة الستايل السابق
    const existingStyle = document.getElementById('dynamic-theme')
    if (existingStyle) {
      existingStyle.remove()
    }
    
    // إضافة الستايل الجديد
    const style = document.createElement('style')
    style.id = 'dynamic-theme'
    style.textContent = css
    document.head.appendChild(style)
    
    // حفظ في التخزين المحلي
    // حفظ الثيم الحالي
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('current-theme', JSON.stringify(theme))
    }
  }

  // الحصول على الثيم الحالي
  getCurrentTheme(): Theme {
    return this.currentTheme
  }

  // الحصول على جميع الثيمات
  getAllThemes(): Theme[] {
    return [...builtInThemes, ...this.customThemes]
  }

  // حفظ ثيم مخصص
  saveCustomTheme(theme: Theme) {
    const existingIndex = this.customThemes.findIndex(t => t.id === theme.id)
    if (existingIndex >= 0) {
      this.customThemes[existingIndex] = theme
    } else {
      this.customThemes.push(theme)
    }
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('custom-themes', JSON.stringify(this.customThemes))
    }
  }

  // حذف ثيم مخصص
  deleteCustomTheme(themeId: string) {
    this.customThemes = this.customThemes.filter(t => t.id !== themeId)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('custom-themes', JSON.stringify(this.customThemes))
    }
  }

  // تحميل الثيمات المخصصة
  private loadCustomThemes() {
    try {
      // التحقق من وجود localStorage (متاح فقط في المتصفح)
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('custom-themes')
        if (saved) {
          this.customThemes = JSON.parse(saved)
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل الثيمات المخصصة:', error)
    }
  }

  // تحميل الثيم المحفوظ
  loadSavedTheme() {
    try {
      // التحقق من وجود localStorage (متاح فقط في المتصفح)
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('current-theme')
        if (saved) {
          const theme = JSON.parse(saved)
          this.applyTheme(theme)
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل الثيم المحفوظ:', error)
    }
  }

  // تصدير ثيم
  exportTheme(theme: Theme): string {
    return JSON.stringify(theme, null, 2)
  }

  // استيراد ثيم
  importTheme(themeJson: string): Theme {
    return JSON.parse(themeJson)
  }
}

// إنشاء مثيل مشترك
export const themeManager = new ThemeManager()

