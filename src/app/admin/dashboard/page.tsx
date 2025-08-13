'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Eye, 
  MessageCircle,
  Heart,
  Share2,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { toast } from 'sonner'

// واجهات البيانات
interface DashboardStats {
  totalArticles: number
  totalUsers: number
  totalViews: number
  totalComments: number
  articlesGrowth: number
  usersGrowth: number
  viewsGrowth: number
  commentsGrowth: number
}

interface RealtimeMetrics {
  activeUsers: number
  currentViews: number
  newArticles: number
  newComments: number
  serverLoad: number
  responseTime: number
  errorRate: number
  bandwidth: number
}

interface TopContent {
  id: string
  title: string
  category: string
  views: number
  comments: number
  likes: number
  publishedAt: Date
  author: string
  trending: boolean
}

interface UserActivity {
  id: string
  userName: string
  action: string
  target: string
  timestamp: Date
  type: 'create' | 'edit' | 'delete' | 'view' | 'comment'
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date
  resolved: boolean
}

// بيانات تجريبية
const mockStats: DashboardStats = {
  totalArticles: 15420,
  totalUsers: 89650,
  totalViews: 2340000,
  totalComments: 45670,
  articlesGrowth: 12.5,
  usersGrowth: 8.3,
  viewsGrowth: 15.7,
  commentsGrowth: 22.1
}

const mockRealtimeMetrics: RealtimeMetrics = {
  activeUsers: 1247,
  currentViews: 3456,
  newArticles: 23,
  newComments: 156,
  serverLoad: 67.8,
  responseTime: 145,
  errorRate: 0.02,
  bandwidth: 234.5
}

const mockTopContent: TopContent[] = [
  {
    id: '1',
    title: 'تطورات الذكاء الاصطناعي في المملكة العربية السعودية',
    category: 'تقنية',
    views: 45670,
    comments: 234,
    likes: 1890,
    publishedAt: new Date('2024-01-15T10:30:00'),
    author: 'أحمد محمد',
    trending: true
  },
  {
    id: '2',
    title: 'رؤية 2030: إنجازات جديدة في قطاع السياحة',
    category: 'سياحة',
    views: 38920,
    comments: 189,
    likes: 1567,
    publishedAt: new Date('2024-01-15T09:15:00'),
    author: 'فاطمة الزهراني',
    trending: true
  },
  {
    id: '3',
    title: 'نتائج الدوري السعودي: مباراة الهلال والنصر',
    category: 'رياضة',
    views: 67890,
    comments: 456,
    likes: 2340,
    publishedAt: new Date('2024-01-15T08:45:00'),
    author: 'خالد العتيبي',
    trending: false
  },
  {
    id: '4',
    title: 'اقتصاد المملكة: نمو متواصل في القطاع غير النفطي',
    category: 'أعمال',
    views: 29450,
    comments: 123,
    likes: 987,
    publishedAt: new Date('2024-01-15T07:20:00'),
    author: 'سارة القحطاني',
    trending: false
  }
]

const mockUserActivity: UserActivity[] = [
  {
    id: '1',
    userName: 'أحمد محمد',
    action: 'نشر مقال جديد',
    target: 'تطورات الذكاء الاصطناعي',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'create'
  },
  {
    id: '2',
    userName: 'سارة القحطاني',
    action: 'حرر مقال',
    target: 'اقتصاد المملكة',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    type: 'edit'
  },
  {
    id: '3',
    userName: 'محمد الأحمد',
    action: 'أضاف تعليق',
    target: 'رؤية 2030',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    type: 'comment'
  },
  {
    id: '4',
    userName: 'فاطمة الزهراني',
    action: 'حذف مقال',
    target: 'مقال قديم',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: 'delete'
  }
]

const mockAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'استخدام عالي للذاكرة',
    message: 'خدمة معالجة البودكاست تستخدم 89% من الذاكرة المتاحة',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    resolved: false
  },
  {
    id: '2',
    type: 'success',
    title: 'تحديث ناجح',
    message: 'تم تحديث نظام التوصيات إلى الإصدار 2.0.1',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    resolved: true
  },
  {
    id: '3',
    type: 'info',
    title: 'نسخة احتياطية مجدولة',
    message: 'ستبدأ النسخة الاحتياطية اليومية خلال ساعة',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    resolved: false
  }
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics>(mockRealtimeMetrics)
  const [topContent, setTopContent] = useState<TopContent[]>(mockTopContent)
  const [userActivity, setUserActivity] = useState<UserActivity[]>(mockUserActivity)
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockAlerts)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('today')

  // تحديث البيانات في الوقت الفعلي
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
        currentViews: prev.currentViews + Math.floor(Math.random() * 100 - 50),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + (Math.random() - 0.5) * 5)),
        responseTime: Math.max(50, prev.responseTime + Math.floor(Math.random() * 20 - 10))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // تحديث البيانات
  const refreshData = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // محاكاة تحديث الإحصائيات
    setStats(prev => ({
      ...prev,
      totalViews: prev.totalViews + Math.floor(Math.random() * 1000),
      totalComments: prev.totalComments + Math.floor(Math.random() * 50)
    }))
    
    setIsRefreshing(false)
    toast.success('تم تحديث البيانات')
  }

  // حل تنبيه
  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
    toast.success('تم حل التنبيه')
  }

  // تنسيق الأرقام
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}م`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}ك`
    return num.toString()
  }

  // تنسيق الوقت
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'الآن'
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `منذ ${hours} ساعة`
    
    const days = Math.floor(hours / 24)
    return `منذ ${days} يوم`
  }

  // الحصول على لون النمو
  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  // الحصول على أيقونة النمو
  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
  }

  // الحصول على لون التنبيه
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'error': return 'border-red-200 bg-red-50'
      case 'info': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  // الحصول على أيقونة النشاط
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <Plus className="w-4 h-4 text-green-600" />
      case 'edit': return <Edit className="w-4 h-4 text-blue-600" />
      case 'delete': return <Trash2 className="w-4 h-4 text-red-600" />
      case 'view': return <Eye className="w-4 h-4 text-gray-600" />
      case 'comment': return <MessageCircle className="w-4 h-4 text-purple-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم المتقدمة</h1>
            <p className="text-gray-600">نظرة شاملة على أداء النظام والمحتوى</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            اليوم
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            تصفية
          </Button>
          <Button variant="outline" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'جاري التحديث...' : 'تحديث'}
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المقالات</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalArticles)}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(stats.articlesGrowth)}`}>
                  {getGrowthIcon(stats.articlesGrowth)}
                  <span className="text-sm font-medium mr-1">{Math.abs(stats.articlesGrowth)}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(stats.usersGrowth)}`}>
                  {getGrowthIcon(stats.usersGrowth)}
                  <span className="text-sm font-medium mr-1">{Math.abs(stats.usersGrowth)}%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(stats.viewsGrowth)}`}>
                  {getGrowthIcon(stats.viewsGrowth)}
                  <span className="text-sm font-medium mr-1">{Math.abs(stats.viewsGrowth)}%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التعليقات</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalComments)}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(stats.commentsGrowth)}`}>
                  {getGrowthIcon(stats.commentsGrowth)}
                  <span className="text-sm font-medium mr-1">{Math.abs(stats.commentsGrowth)}%</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <MessageCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* المقاييس في الوقت الفعلي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            المقاييس في الوقت الفعلي
          </CardTitle>
          <CardDescription>
            البيانات المحدثة كل 5 ثوانٍ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{realtimeMetrics.activeUsers}</p>
              <p className="text-sm text-gray-600">مستخدم نشط</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{realtimeMetrics.currentViews}</p>
              <p className="text-sm text-gray-600">مشاهدة حالية</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{realtimeMetrics.newArticles}</p>
              <p className="text-sm text-gray-600">مقال جديد</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{realtimeMetrics.newComments}</p>
              <p className="text-sm text-gray-600">تعليق جديد</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{realtimeMetrics.serverLoad.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">حمل الخادم</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{realtimeMetrics.responseTime}ms</p>
              <p className="text-sm text-gray-600">وقت الاستجابة</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{(realtimeMetrics.errorRate * 100).toFixed(2)}%</p>
              <p className="text-sm text-gray-600">معدل الأخطاء</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">{realtimeMetrics.bandwidth.toFixed(1)} MB/s</p>
              <p className="text-sm text-gray-600">عرض النطاق</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* المحتوى الأكثر شعبية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              المحتوى الأكثر شعبية
            </CardTitle>
            <CardDescription>
              أفضل المقالات في آخر 24 ساعة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((content, index) => (
                <div key={content.id} className="flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {content.title}
                      </h4>
                      {content.trending && (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          رائج
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-600">
                      <span>{content.category}</span>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Eye className="w-3 h-3" />
                        <span>{formatNumber(content.views)}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <MessageCircle className="w-3 h-3" />
                        <span>{content.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Heart className="w-3 h-3" />
                        <span>{content.likes}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {content.author} • {formatTime(content.publishedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* نشاط المستخدمين */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              نشاط المستخدمين
            </CardTitle>
            <CardDescription>
              آخر الأنشطة في النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span>
                      {' '}
                      <span>{activity.action}</span>
                      {' '}
                      <span className="font-medium">"{activity.target}"</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التنبيهات النظام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            تنبيهات النظام
          </CardTitle>
          <CardDescription>
            {alerts.filter(a => !a.resolved).length} تنبيه غير محلول
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${alert.resolved ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="flex-shrink-0 mt-0.5">
                      {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                      {alert.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-600" />}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {alert.title}
                        {alert.resolved && (
                          <Badge variant="outline" className="mr-2 text-green-600 border-green-200">
                            محلول
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTime(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {!alert.resolved && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      حل
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

