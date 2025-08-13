import { Theme, themeManager } from './theme-system'

export interface ThemeSchedule {
  id: string
  name: string
  morningTime: string // HH:MM format
  eveningTime: string // HH:MM format
  morningTheme: string // theme id
  eveningTheme: string // theme id
  activeDays: number[] // 0-6 (Sunday-Saturday)
  transitionType: 'instant' | 'gradual'
  transitionDuration: number // minutes for gradual transition
  isActive: boolean
}

export interface ScheduleStatus {
  isActive: boolean
  activeSchedules: number
  nextChange?: {
    time: string
    theme: string
    schedule: string
  }
}

// الثيمات المتاحة للجدولة
export const schedulableThemes = [
  { id: 'sabq-editorial', name: 'سبق النهاري', description: 'ثيم مشرق للعمل النهاري' },
  { id: 'professional-dark', name: 'سبق الليلي', description: 'ثيم داكن مريح للعينين' },
  { id: 'warm-earth', name: 'سبق الدافئ', description: 'ألوان دافئة للقراءة المريحة' },
  { id: 'ocean-blue', name: 'سبق البارد', description: 'ثيم بارد للتركيز العميق' }
]

export class ThemeScheduler {
  private schedules: ThemeSchedule[] = []
  private checkInterval: NodeJS.Timeout | null = null
  private isRunning = false

  constructor() {
    this.loadSchedules()
  }

  // إنشاء جدولة جديدة
  createSchedule(schedule: Omit<ThemeSchedule, 'id'>): ThemeSchedule {
    const newSchedule: ThemeSchedule = {
      ...schedule,
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    this.schedules.push(newSchedule)
    this.saveSchedules()
    
    if (newSchedule.isActive) {
      this.startScheduler()
    }
    
    return newSchedule
  }

  // تحديث جدولة
  updateSchedule(id: string, updates: Partial<ThemeSchedule>): boolean {
    const index = this.schedules.findIndex(s => s.id === id)
    if (index === -1) return false
    
    this.schedules[index] = { ...this.schedules[index], ...updates }
    this.saveSchedules()
    
    // إعادة تشغيل المجدول إذا كان هناك جدولات نشطة
    if (this.hasActiveSchedules()) {
      this.startScheduler()
    } else {
      this.stopScheduler()
    }
    
    return true
  }

  // حذف جدولة
  deleteSchedule(id: string): boolean {
    const initialLength = this.schedules.length
    this.schedules = this.schedules.filter(s => s.id !== id)
    
    if (this.schedules.length !== initialLength) {
      this.saveSchedules()
      
      if (!this.hasActiveSchedules()) {
        this.stopScheduler()
      }
      
      return true
    }
    
    return false
  }

  // الحصول على جميع الجدولات
  getSchedules(): ThemeSchedule[] {
    return [...this.schedules]
  }

  // الحصول على جدولة بالمعرف
  getSchedule(id: string): ThemeSchedule | undefined {
    return this.schedules.find(s => s.id === id)
  }

  // تفعيل/إلغاء جدولة
  toggleSchedule(id: string): boolean {
    const schedule = this.schedules.find(s => s.id === id)
    if (!schedule) return false
    
    schedule.isActive = !schedule.isActive
    this.saveSchedules()
    
    if (this.hasActiveSchedules()) {
      this.startScheduler()
    } else {
      this.stopScheduler()
    }
    
    return true
  }

  // بدء المجدول
  startScheduler() {
    if (this.isRunning) {
      this.stopScheduler()
    }
    
    this.isRunning = true
    this.checkSchedules() // فحص فوري
    
    // فحص كل دقيقة
    this.checkInterval = setInterval(() => {
      this.checkSchedules()
    }, 60000)
  }

  // إيقاف المجدول
  stopScheduler() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isRunning = false
  }

  // فحص الجدولات وتطبيق الثيمات
  private checkSchedules() {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const currentDay = now.getDay()
    
    for (const schedule of this.schedules) {
      if (!schedule.isActive || !schedule.activeDays.includes(currentDay)) {
        continue
      }
      
      let targetThemeId: string | null = null
      
      // تحديد الثيم المطلوب حسب الوقت
      if (currentTime === schedule.morningTime) {
        targetThemeId = schedule.morningTheme
      } else if (currentTime === schedule.eveningTime) {
        targetThemeId = schedule.eveningTheme
      }
      
      if (targetThemeId) {
        this.applyScheduledTheme(targetThemeId, schedule)
      }
    }
  }

  // تطبيق ثيم مجدول
  private applyScheduledTheme(themeId: string, schedule: ThemeSchedule) {
    const themes = themeManager.getAllThemes()
    const theme = themes.find(t => t.id === themeId)
    
    if (!theme) {
      console.error(`الثيم غير موجود: ${themeId}`)
      return
    }
    
    if (schedule.transitionType === 'instant') {
      themeManager.applyTheme(theme)
      this.notifyThemeChange(theme, schedule)
    } else {
      this.applyGradualTransition(theme, schedule)
    }
  }

  // تطبيق انتقال تدريجي
  private applyGradualTransition(targetTheme: Theme, schedule: ThemeSchedule) {
    // للبساطة، سنطبق الثيم مباشرة
    // يمكن تطوير انتقال تدريجي حقيقي لاحقاً
    themeManager.applyTheme(targetTheme)
    this.notifyThemeChange(targetTheme, schedule)
  }

  // إشعار تغيير الثيم
  private notifyThemeChange(theme: Theme, schedule: ThemeSchedule) {
    // يمكن إضافة نظام إشعارات هنا
    console.log(`تم تطبيق الثيم: ${theme.nameAr} من الجدولة: ${schedule.name}`)
  }

  // فحص وجود جدولات نشطة
  private hasActiveSchedules(): boolean {
    return this.schedules.some(s => s.isActive)
  }

  // الحصول على حالة المجدول
  getSchedulerStatus(): ScheduleStatus {
    const activeSchedules = this.schedules.filter(s => s.isActive).length
    const nextChange = this.getNextScheduledChange()
    
    return {
      isActive: this.isRunning,
      activeSchedules,
      nextChange
    }
  }

  // الحصول على التغيير المجدول التالي
  private getNextScheduledChange() {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const currentDay = now.getDay()
    
    let nextChange: { time: string; theme: string; schedule: string } | undefined
    let minTimeDiff = Infinity
    
    for (const schedule of this.schedules) {
      if (!schedule.isActive) continue
      
      // فحص أوقات اليوم الحالي
      for (const day of schedule.activeDays) {
        if (day !== currentDay) continue
        
        const morningMinutes = this.timeToMinutes(schedule.morningTime)
        const eveningMinutes = this.timeToMinutes(schedule.eveningTime)
        
        // فحص وقت الصباح
        if (morningMinutes > currentTime) {
          const diff = morningMinutes - currentTime
          if (diff < minTimeDiff) {
            minTimeDiff = diff
            const theme = themeManager.getAllThemes().find(t => t.id === schedule.morningTheme)
            nextChange = {
              time: schedule.morningTime,
              theme: theme?.nameAr || schedule.morningTheme,
              schedule: schedule.name
            }
          }
        }
        
        // فحص وقت المساء
        if (eveningMinutes > currentTime) {
          const diff = eveningMinutes - currentTime
          if (diff < minTimeDiff) {
            minTimeDiff = diff
            const theme = themeManager.getAllThemes().find(t => t.id === schedule.eveningTheme)
            nextChange = {
              time: schedule.eveningTime,
              theme: theme?.nameAr || schedule.eveningTheme,
              schedule: schedule.name
            }
          }
        }
      }
    }
    
    return nextChange
  }

  // تحويل وقت إلى دقائق
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  // اختبار جدولة (تطبيق الثيم المناسب للوقت الحالي)
  testSchedule(scheduleId: string): boolean {
    const schedule = this.schedules.find(s => s.id === scheduleId)
    if (!schedule) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const morningMinutes = this.timeToMinutes(schedule.morningTime)
    const eveningMinutes = this.timeToMinutes(schedule.eveningTime)
    
    let targetThemeId: string
    
    // تحديد الثيم المناسب للوقت الحالي
    if (currentTime < morningMinutes || currentTime >= eveningMinutes) {
      targetThemeId = schedule.eveningTheme
    } else {
      targetThemeId = schedule.morningTheme
    }
    
    this.applyScheduledTheme(targetThemeId, schedule)
    return true
  }

  // حفظ الجدولات
  private saveSchedules() {
    try {
      typeof window !== "undefined" && window.localStorage && localStorage.setItem('theme-schedules', JSON.stringify(this.schedules))
    } catch (error) {
      console.error('خطأ في حفظ الجدولات:', error)
    }
  }

  // تحميل الجدولات
  private loadSchedules() {
    try {
      const saved = typeof window !== "undefined" && window.localStorage && localStorage.getItem('theme-schedules')
      if (saved) {
        this.schedules = JSON.parse(saved)
        
        // بدء المجدول إذا كان هناك جدولات نشطة
        if (this.hasActiveSchedules()) {
          this.startScheduler()
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل الجدولات:', error)
    }
  }

  // تفعيل/إلغاء النظام بالكامل
  toggleSystem(): boolean {
    const wasActive = typeof window !== "undefined" && window.localStorage && localStorage.getItem('theme-scheduler-active') === 'true'
    const newState = !wasActive
    
    typeof window !== "undefined" && window.localStorage && localStorage.setItem('theme-scheduler-active', newState.toString())
    
    if (newState && this.hasActiveSchedules()) {
      this.startScheduler()
    } else {
      this.stopScheduler()
    }
    
    return newState
  }

  // فحص حالة النظام
  isSystemActive(): boolean {
    return typeof window !== "undefined" && window.localStorage && localStorage.getItem('theme-scheduler-active') === 'true'
  }
}

// إنشاء مثيل مشترك
export const themeScheduler = new ThemeScheduler()

