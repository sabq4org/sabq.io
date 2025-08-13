'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Palette, 
  Download, 
  Upload, 
  Eye, 
  Settings, 
  Sparkles, 
  Sun, 
  Moon,
  Check,
  AlertTriangle,
  Copy
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  Theme, 
  ThemeColors, 
  ThemeSettings, 
  OKLCHColor,
  themeManager, 
  builtInThemes,
  oklchToCSS,
  themeToCSS,
  generatePaletteFromPrimary,
  checkContrast
} from '@/lib/themes/theme-system'

export default function ThemeSettingsPage() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(builtInThemes[0])
  const [customColors, setCustomColors] = useState<ThemeColors>(builtInThemes[0].colors)
  const [customSettings, setCustomSettings] = useState<ThemeSettings>(builtInThemes[0].settings)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    // تحميل الثيم الحالي
    const current = themeManager.getCurrentTheme()
    setCurrentTheme(current)
    setCustomColors(current.colors)
    setCustomSettings(current.settings)
  }, [])

  // تطبيق ثيم جاهز
  const applyBuiltInTheme = (theme: Theme) => {
    themeManager.applyTheme(theme)
    setCurrentTheme(theme)
    setCustomColors(theme.colors)
    setCustomSettings(theme.settings)
    toast.success(`تم تطبيق ثيم: ${theme.nameAr}`)
  }

  // تحديث لون مخصص
  const updateCustomColor = (colorKey: keyof ThemeColors, color: OKLCHColor) => {
    const newColors = { ...customColors, [colorKey]: color }
    setCustomColors(newColors)
    
    if (previewMode) {
      const previewTheme: Theme = {
        ...currentTheme,
        id: 'preview',
        name: 'Preview',
        nameAr: 'معاينة',
        colors: newColors,
        settings: customSettings
      }
      themeManager.applyTheme(previewTheme)
    }
  }

  // تحديث إعدادات مخصصة
  const updateCustomSettings = (settings: ThemeSettings) => {
    setCustomSettings(settings)
    
    if (previewMode) {
      const previewTheme: Theme = {
        ...currentTheme,
        id: 'preview',
        name: 'Preview',
        nameAr: 'معاينة',
        colors: customColors,
        settings
      }
      themeManager.applyTheme(previewTheme)
    }
  }

  // توليد لوحة من اللون الأساسي
  const generateFromPrimary = () => {
    const generated = generatePaletteFromPrimary(customColors.primary)
    const newColors = { ...customColors, ...generated }
    setCustomColors(newColors)
    toast.success('تم توليد لوحة الألوان من اللون الأساسي')
  }

  // حفظ ثيم مخصص
  const saveCustomTheme = () => {
    const customTheme: Theme = {
      id: `custom_${Date.now()}`,
      name: 'Custom Theme',
      nameAr: 'ثيم مخصص',
      description: 'ثيم مخصص من إنشاء المستخدم',
      colors: customColors,
      settings: customSettings,
      isBuiltIn: false
    }
    
    themeManager.saveCustomTheme(customTheme)
    themeManager.applyTheme(customTheme)
    setCurrentTheme(customTheme)
    toast.success('تم حفظ الثيم المخصص')
  }

  // تصدير الثيم
  const exportTheme = () => {
    const themeJson = themeManager.exportTheme(currentTheme)
    const blob = new Blob([themeJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentTheme.id}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('تم تصدير الثيم')
  }

  // تصدير CSS
  const exportCSS = () => {
    const css = themeToCSS(currentTheme)
    navigator.clipboard.writeText(css)
    toast.success('تم نسخ كود CSS إلى الحافظة')
  }

  // فحص إمكانية الوصول
  const checkAccessibility = () => {
    const issues: string[] = []
    
    // فحص التباين بين النص والخلفية
    const textBgContrast = checkContrast(customColors.foreground, customColors.background)
    if (textBgContrast.level === 'FAIL') {
      issues.push('تباين ضعيف بين النص والخلفية')
    }
    
    // فحص التباين بين النص والبطاقات
    const cardTextContrast = checkContrast(customColors.cardForeground, customColors.card)
    if (cardTextContrast.level === 'FAIL') {
      issues.push('تباين ضعيف بين نص البطاقة وخلفيتها')
    }
    
    if (issues.length === 0) {
      toast.success('جميع فحوصات إمكانية الوصول مرت بنجاح!')
    } else {
      toast.error(`مشاكل في إمكانية الوصول: ${issues.join(', ')}`)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إعدادات الثيم والألوان</h1>
            <p className="text-gray-600">تخصيص الهوية البصرية للمنصة</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={exportTheme}>
            <Download className="w-4 h-4 mr-2" />
            تصدير الثيم
          </Button>
          <Button variant="outline" onClick={exportCSS}>
            <Copy className="w-4 h-4 mr-2" />
            نسخ CSS
          </Button>
        </div>
      </div>

      <Tabs defaultValue="built-in" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="built-in">الثيمات الجاهزة</TabsTrigger>
          <TabsTrigger value="customize">تخصيص الألوان</TabsTrigger>
          <TabsTrigger value="settings">إعدادات التصميم</TabsTrigger>
          <TabsTrigger value="preview">معاينة</TabsTrigger>
        </TabsList>

        {/* الثيمات الجاهزة */}
        <TabsContent value="built-in" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الثيمات الجاهزة</CardTitle>
              <CardDescription>
                اختر من مجموعة الثيمات المُعدّة مسبقاً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builtInThemes.map((theme) => (
                  <Card 
                    key={theme.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      currentTheme.id === theme.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => applyBuiltInTheme(theme)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{theme.nameAr}</CardTitle>
                        {currentTheme.id === theme.id && (
                          <Badge variant="default">
                            <Check className="w-3 h-3 mr-1" />
                            نشط
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {theme.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* معاينة الألوان */}
                      <div className="flex space-x-2 rtl:space-x-reverse mb-4">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: oklchToCSS(theme.colors.primary) }}
                        />
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: oklchToCSS(theme.colors.secondary) }}
                        />
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: oklchToCSS(theme.colors.accent) }}
                        />
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        variant={currentTheme.id === theme.id ? "default" : "outline"}
                      >
                        {currentTheme.id === theme.id ? 'مُطبق حالياً' : 'تطبيق هذا الثيم'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تخصيص الألوان */}
        <TabsContent value="customize" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">تخصيص الألوان</h3>
              <p className="text-sm text-gray-600">عدّل الألوان حسب تفضيلاتك</p>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Label htmlFor="preview-mode">معاينة مباشرة</Label>
              <Switch 
                id="preview-mode"
                checked={previewMode}
                onCheckedChange={setPreviewMode}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الألوان الأساسية */}
            <Card>
              <CardHeader>
                <CardTitle>الألوان الأساسية</CardTitle>
                <CardDescription>
                  الألوان الرئيسية للواجهة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(customColors).slice(0, 6).map(([key, color]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {key === 'primary' ? 'اللون الأساسي' :
                       key === 'primaryForeground' ? 'نص اللون الأساسي' :
                       key === 'secondary' ? 'اللون الثانوي' :
                       key === 'secondaryForeground' ? 'نص اللون الثانوي' :
                       key === 'accent' ? 'لون التمييز' :
                       key === 'accentForeground' ? 'نص لون التمييز' : key}
                    </Label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div 
                        className="w-10 h-10 rounded border-2 border-gray-200"
                        style={{ backgroundColor: oklchToCSS(color) }}
                      />
                      <Input
                        placeholder="oklch(0.5 0.1 180)"
                        value={`oklch(${color.l} ${color.c} ${color.h})`}
                        onChange={(e) => {
                          const match = e.target.value.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/)
                          if (match) {
                            updateCustomColor(key as keyof ThemeColors, {
                              l: parseFloat(match[1]),
                              c: parseFloat(match[2]),
                              h: parseFloat(match[3])
                            })
                          }
                        }}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
                
                <Button onClick={generateFromPrimary} className="w-full mt-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  توليد لوحة من اللون الأساسي
                </Button>
              </CardContent>
            </Card>

            {/* ألوان الواجهة */}
            <Card>
              <CardHeader>
                <CardTitle>ألوان الواجهة</CardTitle>
                <CardDescription>
                  ألوان الخلفيات والحدود
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(customColors).slice(6).map(([key, color]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {key === 'background' ? 'الخلفية' :
                       key === 'foreground' ? 'النص الأساسي' :
                       key === 'card' ? 'خلفية البطاقة' :
                       key === 'cardForeground' ? 'نص البطاقة' :
                       key === 'muted' ? 'اللون المكتوم' :
                       key === 'mutedForeground' ? 'نص اللون المكتوم' :
                       key === 'border' ? 'الحدود' :
                       key === 'input' ? 'خلفية الإدخال' :
                       key === 'ring' ? 'حلقة التركيز' :
                       key === 'destructive' ? 'لون التحذير' :
                       key === 'destructiveForeground' ? 'نص التحذير' : key}
                    </Label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div 
                        className="w-10 h-10 rounded border-2 border-gray-200"
                        style={{ backgroundColor: oklchToCSS(color) }}
                      />
                      <Input
                        placeholder="oklch(0.5 0.1 180)"
                        value={`oklch(${color.l} ${color.c} ${color.h})`}
                        onChange={(e) => {
                          const match = e.target.value.match(/oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/)
                          if (match) {
                            updateCustomColor(key as keyof ThemeColors, {
                              l: parseFloat(match[1]),
                              c: parseFloat(match[2]),
                              h: parseFloat(match[3])
                            })
                          }
                        }}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button onClick={checkAccessibility} variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              فحص إمكانية الوصول
            </Button>
            <Button onClick={saveCustomTheme}>
              حفظ كثيم مخصص
            </Button>
          </div>
        </TabsContent>

        {/* إعدادات التصميم */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات التصميم</CardTitle>
              <CardDescription>
                تخصيص الخطوط والمسافات والأشكال
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* نصف قطر الحواف */}
              <div className="space-y-3">
                <Label>نصف قطر الحواف: {customSettings.borderRadius}px</Label>
                <Slider
                  value={[customSettings.borderRadius]}
                  onValueChange={([value]) => 
                    updateCustomSettings({ ...customSettings, borderRadius: value })
                  }
                  max={20}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>حاد (0px)</span>
                  <span>دائري (20px)</span>
                </div>
              </div>

              {/* مقياس الخط */}
              <div className="space-y-3">
                <Label>مقياس الخط: {customSettings.fontSize}x</Label>
                <Slider
                  value={[customSettings.fontSize]}
                  onValueChange={([value]) => 
                    updateCustomSettings({ ...customSettings, fontSize: value })
                  }
                  max={1.5}
                  min={0.8}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>صغير (0.8x)</span>
                  <span>كبير (1.5x)</span>
                </div>
              </div>

              {/* ارتفاع السطر */}
              <div className="space-y-3">
                <Label>ارتفاع السطر: {customSettings.lineHeight}</Label>
                <Slider
                  value={[customSettings.lineHeight]}
                  onValueChange={([value]) => 
                    updateCustomSettings({ ...customSettings, lineHeight: value })
                  }
                  max={2.0}
                  min={1.2}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>مضغوط (1.2)</span>
                  <span>واسع (2.0)</span>
                </div>
              </div>

              {/* تباعد الأحرف */}
              <div className="space-y-3">
                <Label>تباعد الأحرف: {customSettings.letterSpacing}em</Label>
                <Slider
                  value={[customSettings.letterSpacing]}
                  onValueChange={([value]) => 
                    updateCustomSettings({ ...customSettings, letterSpacing: value })
                  }
                  max={0.1}
                  min={-0.05}
                  step={0.005}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>مضغوط (-0.05em)</span>
                  <span>واسع (0.1em)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* معاينة */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معاينة الثيم</CardTitle>
              <CardDescription>
                شاهد كيف يبدو الثيم على العناصر المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* عينة من البطاقات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>عنوان البطاقة</CardTitle>
                    <CardDescription>وصف البطاقة هنا</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      هذا نص تجريبي لإظهار كيف يبدو المحتوى مع الثيم الحالي.
                    </p>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button size="sm">زر أساسي</Button>
                      <Button size="sm" variant="outline">زر ثانوي</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>نموذج إدخال</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>اسم المستخدم</Label>
                      <Input placeholder="أدخل اسم المستخدم" />
                    </div>
                    <div className="space-y-2">
                      <Label>الوصف</Label>
                      <Textarea placeholder="أدخل الوصف هنا..." />
                    </div>
                    <Button className="w-full">إرسال</Button>
                  </CardContent>
                </Card>
              </div>

              {/* عينة من الألوان */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg mb-2"
                    style={{ backgroundColor: oklchToCSS(customColors.primary) }}
                  />
                  <p className="text-sm font-medium">اللون الأساسي</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg mb-2"
                    style={{ backgroundColor: oklchToCSS(customColors.secondary) }}
                  />
                  <p className="text-sm font-medium">اللون الثانوي</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg mb-2"
                    style={{ backgroundColor: oklchToCSS(customColors.accent) }}
                  />
                  <p className="text-sm font-medium">لون التمييز</p>
                </div>
                <div className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg mb-2"
                    style={{ backgroundColor: oklchToCSS(customColors.muted) }}
                  />
                  <p className="text-sm font-medium">اللون المكتوم</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

