'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Clock, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  TestTube,
  Calendar,
  Sun,
  Moon,
  Zap,
  Timer
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  ThemeSchedule, 
  ScheduleStatus,
  themeScheduler, 
  schedulableThemes 
} from '@/lib/themes/theme-scheduler'

export default function ThemeSchedulerPage() {
  const [schedules, setSchedules] = useState<ThemeSchedule[]>([])
  const [status, setStatus] = useState<ScheduleStatus>({ isActive: false, activeSchedules: 0 })
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    morningTime: '08:00',
    eveningTime: '18:00',
    morningTheme: 'sabq-editorial',
    eveningTheme: 'professional-dark',
    activeDays: [1, 2, 3, 4, 5], // الاثنين - الجمعة
    transitionType: 'instant' as 'instant' | 'gradual',
    transitionDuration: 5
  })

  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

  useEffect(() => {
    loadSchedules()
    updateStatus()
    
    // تحديث الحالة كل دقيقة
    const interval = setInterval(updateStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadSchedules = () => {
    const allSchedules = themeScheduler.getSchedules()
    setSchedules(allSchedules)
  }

  const updateStatus = () => {
    const currentStatus = themeScheduler.getSchedulerStatus()
    setStatus(currentStatus)
  }

  const createSchedule = () => {
    if (!newSchedule.name.trim()) {
      toast.error('يرجى إدخال اسم الجدولة')
      return
    }

    const schedule = themeScheduler.createSchedule({
      ...newSchedule,
      isActive: true
    })

    setSchedules(prev => [...prev, schedule])
    setShowCreateForm(false)
    setNewSchedule({
      name: '',
      morningTime: '08:00',
      eveningTime: '18:00',
      morningTheme: 'sabq-editorial',
      eveningTheme: 'professional-dark',
      activeDays: [1, 2, 3, 4, 5],
      transitionType: 'instant',
      transitionDuration: 5
    })
    updateStatus()
    toast.success('تم إنشاء الجدولة بنجاح')
  }

  const toggleSchedule = (id: string) => {
    themeScheduler.toggleSchedule(id)
    loadSchedules()
    updateStatus()
  }

  const deleteSchedule = (id: string) => {
    themeScheduler.deleteSchedule(id)
    loadSchedules()
    updateStatus()
    toast.success('تم حذف الجدولة')
  }

  const testSchedule = (id: string) => {
    const success = themeScheduler.testSchedule(id)
    if (success) {
      toast.success('تم تطبيق الثيم المناسب للوقت الحالي')
    } else {
      toast.error('فشل في اختبار الجدولة')
    }
  }

  const toggleSystem = () => {
    const newState = themeScheduler.toggleSystem()
    updateStatus()
    toast.success(newState ? 'تم تفعيل النظام' : 'تم إيقاف النظام')
  }

  const toggleDay = (day: number) => {
    const activeDays = newSchedule.activeDays.includes(day)
      ? newSchedule.activeDays.filter(d => d !== day)
      : [...newSchedule.activeDays, day].sort()
    
    setNewSchedule(prev => ({ ...prev, activeDays }))
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">جدولة الثيمات التلقائية</h1>
            <p className="text-gray-600">تطبيق ثيمات مختلفة حسب الوقت والأيام</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button 
            variant="outline" 
            onClick={toggleSystem}
            className={status.isActive ? 'bg-green-50 border-green-200' : ''}
          >
            {status.isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {status.isActive ? 'إيقاف النظام' : 'تفعيل النظام'}
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            إنشاء جدولة جديدة
          </Button>
        </div>
      </div>

      {/* مؤشر الحالة */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className={`w-3 h-3 rounded-full ${status.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="font-medium">
                  {status.isActive ? 'النظام نشط' : 'النظام متوقف'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {status.activeSchedules} جدولة نشطة
                </span>
              </div>
              
              {status.nextChange && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Timer className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    التغيير التالي: {status.nextChange.theme} في {status.nextChange.time}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نموذج إنشاء جدولة جديدة */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>إنشاء جدولة جديدة</CardTitle>
            <CardDescription>
              قم بإعداد جدولة تلقائية لتطبيق ثيمات مختلفة حسب الوقت
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* الإعدادات الأساسية */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-name">اسم الجدولة</Label>
                  <Input
                    id="schedule-name"
                    placeholder="مثال: جدولة المكتب"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="morning-time">وقت الصباح</Label>
                    <Input
                      id="morning-time"
                      type="time"
                      value={newSchedule.morningTime}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, morningTime: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evening-time">وقت المساء</Label>
                    <Input
                      id="evening-time"
                      type="time"
                      value={newSchedule.eveningTime}
                      onChange={(e) => setNewSchedule(prev => ({ ...prev, eveningTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>الثيم الصباحي</Label>
                    <Select 
                      value={newSchedule.morningTheme} 
                      onValueChange={(value) => setNewSchedule(prev => ({ ...prev, morningTheme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {schedulableThemes.map(theme => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>الثيم المسائي</Label>
                    <Select 
                      value={newSchedule.eveningTheme} 
                      onValueChange={(value) => setNewSchedule(prev => ({ ...prev, eveningTheme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {schedulableThemes.map(theme => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* الأيام النشطة */}
              <div className="space-y-4">
                <Label>الأيام النشطة</Label>
                <div className="grid grid-cols-2 gap-2">
                  {dayNames.map((day, index) => (
                    <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Switch
                        id={`day-${index}`}
                        checked={newSchedule.activeDays.includes(index)}
                        onCheckedChange={() => toggleDay(index)}
                      />
                      <Label htmlFor={`day-${index}`} className="text-sm">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>نوع الانتقال</Label>
                  <Select 
                    value={newSchedule.transitionType} 
                    onValueChange={(value: 'instant' | 'gradual') => 
                      setNewSchedule(prev => ({ ...prev, transitionType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">فوري</SelectItem>
                      <SelectItem value="gradual">تدريجي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newSchedule.transitionType === 'gradual' && (
                  <div className="space-y-2">
                    <Label htmlFor="transition-duration">مدة الانتقال (دقائق)</Label>
                    <Input
                      id="transition-duration"
                      type="number"
                      min="1"
                      max="60"
                      value={newSchedule.transitionDuration}
                      onChange={(e) => setNewSchedule(prev => ({ 
                        ...prev, 
                        transitionDuration: parseInt(e.target.value) || 5 
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                إلغاء
              </Button>
              <Button onClick={createSchedule}>
                إنشاء الجدولة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* قائمة الجدولات */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">الجدولات المحفوظة</h2>
        
        {schedules.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد جدولات</h3>
              <p className="text-gray-600 mb-4">
                قم بإنشاء جدولة جديدة لتطبيق الثيمات تلقائياً
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                إنشاء جدولة جديدة
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className={schedule.isActive ? 'ring-2 ring-blue-200' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span>{schedule.name}</span>
                      {schedule.isActive && (
                        <Badge variant="default" className="bg-green-500">
                          نشط
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testSchedule(schedule.id)}
                      >
                        <TestTube className="w-3 h-3" />
                      </Button>
                      <Switch
                        checked={schedule.isActive}
                        onCheckedChange={() => toggleSchedule(schedule.id)}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteSchedule(schedule.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* أوقات التطبيق */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">{schedule.morningTime}</p>
                        <p className="text-xs text-gray-500">
                          {schedulableThemes.find(t => t.id === schedule.morningTheme)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Moon className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{schedule.eveningTime}</p>
                        <p className="text-xs text-gray-500">
                          {schedulableThemes.find(t => t.id === schedule.eveningTheme)?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* الأيام النشطة */}
                  <div>
                    <p className="text-sm font-medium mb-2">الأيام النشطة:</p>
                    <div className="flex flex-wrap gap-1">
                      {schedule.activeDays.map(day => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {dayNames[day]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* نوع الانتقال */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Zap className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {schedule.transitionType === 'instant' ? 'انتقال فوري' : `انتقال تدريجي (${schedule.transitionDuration} دقائق)`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

