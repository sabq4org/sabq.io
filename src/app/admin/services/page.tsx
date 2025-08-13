'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Map, 
  Server, 
  Database, 
  Cloud, 
  Shield, 
  Zap,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Mic,
  Brain,
  Palette,
  Settings,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Cpu,
  HardDrive,
  Network,
  BarChart3,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  Square,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'

// واجهات البيانات
interface Service {
  id: string
  name: string
  nameAr: string
  description: string
  category: 'core' | 'ai' | 'media' | 'user' | 'analytics' | 'infrastructure'
  status: 'running' | 'stopped' | 'error' | 'maintenance'
  health: 'healthy' | 'warning' | 'critical'
  version: string
  uptime: number // بالثواني
  lastUpdated: Date
  dependencies: string[]
  endpoints: ServiceEndpoint[]
  metrics: ServiceMetrics
  configuration: ServiceConfig
}

interface ServiceEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  description: string
  responseTime: number // بالميلي ثانية
  requestCount: number
  errorRate: number
}

interface ServiceMetrics {
  cpuUsage: number // نسبة مئوية
  memoryUsage: number // نسبة مئوية
  diskUsage: number // نسبة مئوية
  networkIn: number // KB/s
  networkOut: number // KB/s
  requestsPerSecond: number
  errorCount: number
  responseTime: number // متوسط وقت الاستجابة
}

interface ServiceConfig {
  autoRestart: boolean
  maxMemory: string
  maxCpu: string
  replicas: number
  environment: 'development' | 'staging' | 'production'
  logLevel: 'debug' | 'info' | 'warn' | 'error'
}

// بيانات تجريبية للخدمات
const mockServices: Service[] = [
  {
    id: 'content-api',
    name: 'Content Management API',
    nameAr: 'واجهة إدارة المحتوى',
    description: 'خدمة إدارة المقالات والأخبار والمحتوى',
    category: 'core',
    status: 'running',
    health: 'healthy',
    version: '2.1.4',
    uptime: 2847392, // ~33 يوم
    lastUpdated: new Date('2024-01-15T10:30:00'),
    dependencies: ['database', 'auth-service', 'file-storage'],
    endpoints: [
      { path: '/api/articles', method: 'GET', description: 'جلب المقالات', responseTime: 45, requestCount: 15420, errorRate: 0.02 },
      { path: '/api/articles', method: 'POST', description: 'إنشاء مقال جديد', responseTime: 120, requestCount: 890, errorRate: 0.01 },
      { path: '/api/categories', method: 'GET', description: 'جلب التصنيفات', responseTime: 25, requestCount: 5670, errorRate: 0.00 }
    ],
    metrics: {
      cpuUsage: 23.5,
      memoryUsage: 67.2,
      diskUsage: 45.8,
      networkIn: 125.4,
      networkOut: 89.7,
      requestsPerSecond: 12.3,
      errorCount: 3,
      responseTime: 67
    },
    configuration: {
      autoRestart: true,
      maxMemory: '2GB',
      maxCpu: '1000m',
      replicas: 3,
      environment: 'production',
      logLevel: 'info'
    }
  },
  {
    id: 'ai-service',
    name: 'AI Processing Service',
    nameAr: 'خدمة الذكاء الاصطناعي',
    description: 'معالجة النصوص والتحليل بالذكاء الاصطناعي',
    category: 'ai',
    status: 'running',
    health: 'healthy',
    version: '1.8.2',
    uptime: 1847392,
    lastUpdated: new Date('2024-01-15T09:15:00'),
    dependencies: ['openai-api', 'content-api'],
    endpoints: [
      { path: '/api/ai/analyze', method: 'POST', description: 'تحليل النص', responseTime: 850, requestCount: 2340, errorRate: 0.05 },
      { path: '/api/ai/summarize', method: 'POST', description: 'تلخيص المحتوى', responseTime: 1200, requestCount: 1560, errorRate: 0.03 },
      { path: '/api/ai/generate', method: 'POST', description: 'توليد المحتوى', responseTime: 2100, requestCount: 780, errorRate: 0.08 }
    ],
    metrics: {
      cpuUsage: 78.9,
      memoryUsage: 89.3,
      diskUsage: 34.2,
      networkIn: 67.8,
      networkOut: 45.2,
      requestsPerSecond: 3.7,
      errorCount: 12,
      responseTime: 1387
    },
    configuration: {
      autoRestart: true,
      maxMemory: '4GB',
      maxCpu: '2000m',
      replicas: 2,
      environment: 'production',
      logLevel: 'info'
    }
  },
  {
    id: 'podcast-service',
    name: 'Podcast Processing Service',
    nameAr: 'خدمة معالجة البودكاست',
    description: 'معالجة وتحرير ملفات البودكاست الصوتية',
    category: 'media',
    status: 'running',
    health: 'warning',
    version: '1.3.1',
    uptime: 947392,
    lastUpdated: new Date('2024-01-15T08:45:00'),
    dependencies: ['file-storage', 'transcription-api'],
    endpoints: [
      { path: '/api/podcast/upload', method: 'POST', description: 'رفع ملف صوتي', responseTime: 3400, requestCount: 234, errorRate: 0.12 },
      { path: '/api/podcast/transcribe', method: 'POST', description: 'تحويل الكلام لنص', responseTime: 15600, requestCount: 156, errorRate: 0.08 },
      { path: '/api/podcast/process', method: 'POST', description: 'معالجة الصوت', responseTime: 8900, requestCount: 89, errorRate: 0.15 }
    ],
    metrics: {
      cpuUsage: 45.7,
      memoryUsage: 72.1,
      diskUsage: 89.4,
      networkIn: 234.5,
      networkOut: 156.8,
      requestsPerSecond: 0.8,
      errorCount: 8,
      responseTime: 9300
    },
    configuration: {
      autoRestart: true,
      maxMemory: '8GB',
      maxCpu: '3000m',
      replicas: 1,
      environment: 'production',
      logLevel: 'debug'
    }
  },
  {
    id: 'recommendation-engine',
    name: 'Recommendation Engine',
    nameAr: 'محرك التوصيات',
    description: 'نظام التوصيات الذكي والتعلم الآلي',
    category: 'ai',
    status: 'running',
    health: 'healthy',
    version: '2.0.1',
    uptime: 3247392,
    lastUpdated: new Date('2024-01-15T11:20:00'),
    dependencies: ['user-service', 'content-api', 'analytics-service'],
    endpoints: [
      { path: '/api/recommendations/personal', method: 'GET', description: 'توصيات شخصية', responseTime: 180, requestCount: 8940, errorRate: 0.01 },
      { path: '/api/recommendations/trending', method: 'GET', description: 'المحتوى الرائج', responseTime: 95, requestCount: 12340, errorRate: 0.00 },
      { path: '/api/recommendations/similar', method: 'GET', description: 'محتوى مشابه', responseTime: 145, requestCount: 5670, errorRate: 0.02 }
    ],
    metrics: {
      cpuUsage: 34.2,
      memoryUsage: 56.8,
      diskUsage: 23.1,
      networkIn: 89.3,
      networkOut: 67.4,
      requestsPerSecond: 8.9,
      errorCount: 2,
      responseTime: 140
    },
    configuration: {
      autoRestart: true,
      maxMemory: '3GB',
      maxCpu: '1500m',
      replicas: 2,
      environment: 'production',
      logLevel: 'info'
    }
  },
  {
    id: 'user-service',
    name: 'User Management Service',
    nameAr: 'خدمة إدارة المستخدمين',
    description: 'إدارة المستخدمين والمصادقة والأدوار',
    category: 'user',
    status: 'running',
    health: 'healthy',
    version: '1.9.3',
    uptime: 4147392,
    lastUpdated: new Date('2024-01-15T07:30:00'),
    dependencies: ['database', 'auth-provider'],
    endpoints: [
      { path: '/api/users/profile', method: 'GET', description: 'ملف المستخدم', responseTime: 35, requestCount: 23450, errorRate: 0.00 },
      { path: '/api/users/login', method: 'POST', description: 'تسجيل الدخول', responseTime: 120, requestCount: 3450, errorRate: 0.03 },
      { path: '/api/users/register', method: 'POST', description: 'تسجيل جديد', responseTime: 180, requestCount: 890, errorRate: 0.01 }
    ],
    metrics: {
      cpuUsage: 18.4,
      memoryUsage: 42.7,
      diskUsage: 15.3,
      networkIn: 45.2,
      networkOut: 38.9,
      requestsPerSecond: 15.7,
      errorCount: 1,
      responseTime: 78
    },
    configuration: {
      autoRestart: true,
      maxMemory: '1GB',
      maxCpu: '500m',
      replicas: 3,
      environment: 'production',
      logLevel: 'warn'
    }
  },
  {
    id: 'analytics-service',
    name: 'Analytics Service',
    nameAr: 'خدمة التحليلات',
    description: 'جمع وتحليل البيانات والإحصائيات',
    category: 'analytics',
    status: 'running',
    health: 'healthy',
    version: '1.5.7',
    uptime: 2647392,
    lastUpdated: new Date('2024-01-15T12:00:00'),
    dependencies: ['database', 'content-api', 'user-service'],
    endpoints: [
      { path: '/api/analytics/events', method: 'POST', description: 'تسجيل الأحداث', responseTime: 25, requestCount: 45670, errorRate: 0.00 },
      { path: '/api/analytics/reports', method: 'GET', description: 'التقارير', responseTime: 340, requestCount: 1230, errorRate: 0.01 },
      { path: '/api/analytics/dashboard', method: 'GET', description: 'لوحة المعلومات', responseTime: 180, requestCount: 2340, errorRate: 0.00 }
    ],
    metrics: {
      cpuUsage: 28.7,
      memoryUsage: 51.3,
      diskUsage: 67.8,
      networkIn: 156.7,
      networkOut: 89.4,
      requestsPerSecond: 18.9,
      errorCount: 0,
      responseTime: 182
    },
    configuration: {
      autoRestart: true,
      maxMemory: '2GB',
      maxCpu: '1000m',
      replicas: 2,
      environment: 'production',
      logLevel: 'info'
    }
  }
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // تصفية الخدمات
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesSearch = service.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // الحصول على إحصائيات عامة
  const totalServices = services.length
  const runningServices = services.filter(s => s.status === 'running').length
  const healthyServices = services.filter(s => s.health === 'healthy').length
  const avgCpuUsage = services.reduce((sum, s) => sum + s.metrics.cpuUsage, 0) / services.length
  const avgMemoryUsage = services.reduce((sum, s) => sum + s.metrics.memoryUsage, 0) / services.length

  // تحديث البيانات
  const refreshData = async () => {
    setIsRefreshing(true)
    // محاكاة تحديث البيانات
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // تحديث المقاييس بقيم عشوائية
    setServices(prev => prev.map(service => ({
      ...service,
      metrics: {
        ...service.metrics,
        cpuUsage: Math.max(0, Math.min(100, service.metrics.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, service.metrics.memoryUsage + (Math.random() - 0.5) * 5)),
        requestsPerSecond: Math.max(0, service.metrics.requestsPerSecond + (Math.random() - 0.5) * 2)
      },
      lastUpdated: new Date()
    })))
    
    setIsRefreshing(false)
    toast.success('تم تحديث البيانات')
  }

  // تشغيل/إيقاف خدمة
  const toggleService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            status: service.status === 'running' ? 'stopped' : 'running',
            lastUpdated: new Date()
          }
        : service
    ))
    
    const service = services.find(s => s.id === serviceId)
    const action = service?.status === 'running' ? 'إيقاف' : 'تشغيل'
    toast.success(`تم ${action} الخدمة`)
  }

  // إعادة تشغيل خدمة
  const restartService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { 
            ...service, 
            status: 'running',
            uptime: 0,
            lastUpdated: new Date()
          }
        : service
    ))
    toast.success('تم إعادة تشغيل الخدمة')
  }

  // تنسيق الوقت
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}د ${hours}س`
    if (hours > 0) return `${hours}س ${minutes}د`
    return `${minutes}د`
  }

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'stopped': return 'bg-red-100 text-red-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // الحصول على لون الصحة
  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // الحصول على أيقونة التصنيف
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return <Server className="w-4 h-4" />
      case 'ai': return <Brain className="w-4 h-4" />
      case 'media': return <Mic className="w-4 h-4" />
      case 'user': return <Users className="w-4 h-4" />
      case 'analytics': return <BarChart3 className="w-4 h-4" />
      case 'infrastructure': return <Database className="w-4 h-4" />
      default: return <Server className="w-4 h-4" />
    }
  }

  const categories = [
    { id: 'all', name: 'جميع الخدمات', count: services.length },
    { id: 'core', name: 'الخدمات الأساسية', count: services.filter(s => s.category === 'core').length },
    { id: 'ai', name: 'الذكاء الاصطناعي', count: services.filter(s => s.category === 'ai').length },
    { id: 'media', name: 'الوسائط', count: services.filter(s => s.category === 'media').length },
    { id: 'user', name: 'المستخدمين', count: services.filter(s => s.category === 'user').length },
    { id: 'analytics', name: 'التحليلات', count: services.filter(s => s.category === 'analytics').length },
    { id: 'infrastructure', name: 'البنية التحتية', count: services.filter(s => s.category === 'infrastructure').length }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <Map className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">خريطة الخدمات</h1>
            <p className="text-gray-600">مراقبة وإدارة جميع خدمات النظام</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'جاري التحديث...' : 'تحديث'}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            إضافة خدمة
          </Button>
        </div>
      </div>

      {/* الإحصائيات العامة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الخدمات</p>
                <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Server className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الخدمات النشطة</p>
                <p className="text-2xl font-bold text-green-600">{runningServices}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الخدمات السليمة</p>
                <p className="text-2xl font-bold text-green-600">{healthyServices}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط استخدام المعالج</p>
                <p className="text-2xl font-bold text-gray-900">{avgCpuUsage.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Cpu className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط استخدام الذاكرة</p>
                <p className="text-2xl font-bold text-gray-900">{avgMemoryUsage.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أدوات البحث والتصفية */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في الخدمات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الخدمات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getCategoryIcon(service.category)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.nameAr}</CardTitle>
                    <CardDescription className="text-sm">{service.name}</CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Badge className={getStatusColor(service.status)}>
                    {service.status === 'running' ? 'نشط' : 
                     service.status === 'stopped' ? 'متوقف' : 
                     service.status === 'error' ? 'خطأ' : 'صيانة'}
                  </Badge>
                  
                  {service.health === 'healthy' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : service.health === 'warning' ? (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{service.description}</p>
              
              {/* معلومات أساسية */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الإصدار:</span>
                  <span className="font-medium mr-2">{service.version}</span>
                </div>
                <div>
                  <span className="text-gray-600">وقت التشغيل:</span>
                  <span className="font-medium mr-2">{formatUptime(service.uptime)}</span>
                </div>
                <div>
                  <span className="text-gray-600">النسخ:</span>
                  <span className="font-medium mr-2">{service.configuration.replicas}</span>
                </div>
                <div>
                  <span className="text-gray-600">البيئة:</span>
                  <span className="font-medium mr-2">
                    {service.configuration.environment === 'production' ? 'إنتاج' : 
                     service.configuration.environment === 'staging' ? 'اختبار' : 'تطوير'}
                  </span>
                </div>
              </div>
              
              {/* مقاييس الأداء */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>استخدام المعالج</span>
                    <span>{service.metrics.cpuUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={service.metrics.cpuUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>استخدام الذاكرة</span>
                    <span>{service.metrics.memoryUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={service.metrics.memoryUsage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">الطلبات/ثانية:</span>
                    <span className="font-medium mr-2">{service.metrics.requestsPerSecond.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">وقت الاستجابة:</span>
                    <span className="font-medium mr-2">{service.metrics.responseTime}ms</span>
                  </div>
                </div>
              </div>
              
              {/* أزرار التحكم */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleService(service.id)}
                  >
                    {service.status === 'running' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => restartService(service.id)}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedService(service.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button size="sm" variant="outline">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد خدمات</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'لا توجد خدمات تطابق معايير البحث'
                : 'لم يتم العثور على أي خدمات'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

