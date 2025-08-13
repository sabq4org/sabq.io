'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Users, 
  TrendingUp, 
  Target, 
  Settings, 
  BarChart3,
  Eye,
  Heart,
  Share2,
  Clock,
  Zap,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

// واجهات البيانات
interface RecommendationMetrics {
  totalUsers: number
  activeUsers: number
  totalRecommendations: number
  clickThroughRate: number
  engagementRate: number
  accuracy: number
}

interface UserSegment {
  id: string
  name: string
  description: string
  userCount: number
  avgEngagement: number
  topCategories: string[]
  characteristics: string[]
}

interface RecommendationAlgorithm {
  id: string
  name: string
  description: string
  enabled: boolean
  weight: number
  performance: {
    accuracy: number
    coverage: number
    diversity: number
    novelty: number
  }
}

interface ContentPerformance {
  itemId: string
  title: string
  category: string
  recommendationCount: number
  clickCount: number
  engagementScore: number
  ctr: number
}

// بيانات تجريبية
const mockMetrics: RecommendationMetrics = {
  totalUsers: 45230,
  activeUsers: 12890,
  totalRecommendations: 156780,
  clickThroughRate: 0.234,
  engagementRate: 0.187,
  accuracy: 0.823
}

const mockUserSegments: UserSegment[] = [
  {
    id: 'tech-enthusiasts',
    name: 'عشاق التقنية',
    description: 'مستخدمون مهتمون بأخبار التقنية والذكاء الاصطناعي',
    userCount: 8450,
    avgEngagement: 0.67,
    topCategories: ['تقنية', 'ذكاء اصطناعي', 'برمجة'],
    characteristics: ['قراءة طويلة', 'مشاركة عالية', 'تعليقات تقنية']
  },
  {
    id: 'business-readers',
    name: 'قراء الأعمال',
    description: 'مهتمون بأخبار الأعمال والاقتصاد',
    userCount: 6720,
    avgEngagement: 0.54,
    topCategories: ['أعمال', 'اقتصاد', 'استثمار'],
    characteristics: ['قراءة سريعة', 'مشاركة متوسطة', 'وقت الصباح']
  },
  {
    id: 'news-followers',
    name: 'متابعو الأخبار',
    description: 'يتابعون الأخبار العامة والمحلية',
    userCount: 15680,
    avgEngagement: 0.41,
    topCategories: ['محليات', 'عالم', 'سياسة'],
    characteristics: ['قراءة متوسطة', 'تحديث مستمر', 'أخبار عاجلة']
  },
  {
    id: 'lifestyle-readers',
    name: 'قراء نمط الحياة',
    description: 'مهتمون بالصحة والرياضة ونمط الحياة',
    userCount: 9380,
    avgEngagement: 0.72,
    topCategories: ['حياتنا', 'صحة', 'رياضة'],
    characteristics: ['قراءة تفاعلية', 'مشاركة اجتماعية', 'محتوى بصري']
  }
]

const mockAlgorithms: RecommendationAlgorithm[] = [
  {
    id: 'collaborative-filtering',
    name: 'التصفية التعاونية',
    description: 'توصيات بناءً على سلوك المستخدمين المشابهين',
    enabled: true,
    weight: 0.35,
    performance: {
      accuracy: 0.78,
      coverage: 0.85,
      diversity: 0.62,
      novelty: 0.45
    }
  },
  {
    id: 'content-based',
    name: 'المحتوى المشابه',
    description: 'توصيات بناءً على خصائص المحتوى',
    enabled: true,
    weight: 0.25,
    performance: {
      accuracy: 0.82,
      coverage: 0.92,
      diversity: 0.48,
      novelty: 0.38
    }
  },
  {
    id: 'trending-boost',
    name: 'تعزيز الرائج',
    description: 'إضافة المحتوى الرائج والعاجل',
    enabled: true,
    weight: 0.15,
    performance: {
      accuracy: 0.65,
      coverage: 0.45,
      diversity: 0.85,
      novelty: 0.92
    }
  },
  {
    id: 'editorial-picks',
    name: 'اختيارات التحرير',
    description: 'محتوى مختار من فريق التحرير',
    enabled: true,
    weight: 0.15,
    performance: {
      accuracy: 0.88,
      coverage: 0.35,
      diversity: 0.75,
      novelty: 0.68
    }
  },
  {
    id: 'ai-enhanced',
    name: 'الذكاء الاصطناعي المحسن',
    description: 'توصيات محسنة بالذكاء الاصطناعي',
    enabled: false,
    weight: 0.10,
    performance: {
      accuracy: 0.91,
      coverage: 0.78,
      diversity: 0.82,
      novelty: 0.75
    }
  }
]

const mockContentPerformance: ContentPerformance[] = [
  {
    itemId: '1',
    title: 'مستقبل الذكاء الاصطناعي في المملكة',
    category: 'تقنية',
    recommendationCount: 15420,
    clickCount: 3680,
    engagementScore: 0.78,
    ctr: 0.239
  },
  {
    itemId: '2',
    title: 'نمو الاقتصاد السعودي في 2024',
    category: 'أعمال',
    recommendationCount: 12890,
    clickCount: 2940,
    engagementScore: 0.65,
    ctr: 0.228
  },
  {
    itemId: '3',
    title: 'أحدث تطورات مشاريع نيوم',
    category: 'محليات',
    recommendationCount: 18750,
    clickCount: 4120,
    engagementScore: 0.82,
    ctr: 0.220
  }
]

export default function RecommendationsPage() {
  const [metrics, setMetrics] = useState<RecommendationMetrics>(mockMetrics)
  const [userSegments, setUserSegments] = useState<UserSegment[]>(mockUserSegments)
  const [algorithms, setAlgorithms] = useState<RecommendationAlgorithm[]>(mockAlgorithms)
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>(mockContentPerformance)
  const [selectedSegment, setSelectedSegment] = useState<string>('all')
  const [isOptimizing, setIsOptimizing] = useState(false)

  // تحديث وزن الخوارزمية
  const updateAlgorithmWeight = (algorithmId: string, newWeight: number) => {
    setAlgorithms(prev => prev.map(alg => 
      alg.id === algorithmId ? { ...alg, weight: newWeight } : alg
    ))
    toast.success('تم تحديث وزن الخوارزمية')
  }

  // تفعيل/إلغاء تفعيل الخوارزمية
  const toggleAlgorithm = (algorithmId: string) => {
    setAlgorithms(prev => prev.map(alg => 
      alg.id === algorithmId ? { ...alg, enabled: !alg.enabled } : alg
    ))
    toast.success('تم تحديث حالة الخوارزمية')
  }

  // تحسين النظام
  const optimizeSystem = async () => {
    setIsOptimizing(true)
    
    // محاكاة عملية التحسين
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // تحديث المقاييس
    setMetrics(prev => ({
      ...prev,
      accuracy: Math.min(prev.accuracy + 0.02, 1),
      clickThroughRate: Math.min(prev.clickThroughRate + 0.01, 1),
      engagementRate: Math.min(prev.engagementRate + 0.015, 1)
    }))
    
    setIsOptimizing(false)
    toast.success('تم تحسين النظام بنجاح')
  }

  // تنسيق النسب المئوية
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  // تنسيق الأرقام
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  // الحصول على لون الأداء
  const getPerformanceColor = (value: number) => {
    if (value >= 0.8) return 'text-green-600'
    if (value >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">نظام التوصيات الذكي</h1>
            <p className="text-gray-600">إدارة ومراقبة خوارزميات التوصيات والتعلم الآلي</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            الإعدادات
          </Button>
          <Button onClick={optimizeSystem} disabled={isOptimizing}>
            {isOptimizing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isOptimizing ? 'جاري التحسين...' : 'تحسين النظام'}
          </Button>
        </div>
      </div>

      {/* المقاييس الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalUsers)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المستخدمون النشطون</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.activeUsers)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التوصيات</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalRecommendations)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معدل النقر</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.clickThroughRate)}`}>
                  {formatPercentage(metrics.clickThroughRate)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معدل التفاعل</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.engagementRate)}`}>
                  {formatPercentage(metrics.engagementRate)}
                </p>
              </div>
              <div className="p-3 bg-pink-100 rounded-full">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">دقة النظام</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(metrics.accuracy)}`}>
                  {formatPercentage(metrics.accuracy)}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="algorithms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="algorithms">الخوارزميات</TabsTrigger>
          <TabsTrigger value="segments">شرائح المستخدمين</TabsTrigger>
          <TabsTrigger value="performance">أداء المحتوى</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        {/* إدارة الخوارزميات */}
        <TabsContent value="algorithms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>خوارزميات التوصية</CardTitle>
              <CardDescription>
                إدارة وتكوين خوارزميات التوصية المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {algorithms.map((algorithm) => (
                  <div key={algorithm.id} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
                          <h3 className="text-lg font-semibold">{algorithm.name}</h3>
                          <Badge variant={algorithm.enabled ? "default" : "secondary"}>
                            {algorithm.enabled ? 'مفعل' : 'معطل'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{algorithm.description}</p>
                        
                        {/* مقاييس الأداء */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">الدقة</p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Progress value={algorithm.performance.accuracy * 100} className="flex-1" />
                              <span className="text-sm font-medium">{formatPercentage(algorithm.performance.accuracy)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">التغطية</p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Progress value={algorithm.performance.coverage * 100} className="flex-1" />
                              <span className="text-sm font-medium">{formatPercentage(algorithm.performance.coverage)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">التنوع</p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Progress value={algorithm.performance.diversity * 100} className="flex-1" />
                              <span className="text-sm font-medium">{formatPercentage(algorithm.performance.diversity)}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">الحداثة</p>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Progress value={algorithm.performance.novelty * 100} className="flex-1" />
                              <span className="text-sm font-medium">{formatPercentage(algorithm.performance.novelty)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* وزن الخوارزمية */}
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <span className="text-sm font-medium">الوزن:</span>
                          <div className="flex-1 max-w-xs">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={algorithm.weight}
                              onChange={(e) => updateAlgorithmWeight(algorithm.id, parseFloat(e.target.value))}
                              className="w-full"
                              disabled={!algorithm.enabled}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{formatPercentage(algorithm.weight)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAlgorithm(algorithm.id)}
                        >
                          {algorithm.enabled ? 'تعطيل' : 'تفعيل'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* شرائح المستخدمين */}
        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>شرائح المستخدمين</CardTitle>
              <CardDescription>
                تحليل سلوك المستخدمين وتقسيمهم إلى شرائح
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userSegments.map((segment) => (
                  <div key={segment.id} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{segment.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{segment.description}</p>
                      </div>
                      <Badge variant="outline">{formatNumber(segment.userCount)} مستخدم</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">معدل التفاعل</p>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Progress value={segment.avgEngagement * 100} className="flex-1" />
                          <span className="text-sm font-medium">{formatPercentage(segment.avgEngagement)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">التصنيفات المفضلة</p>
                        <div className="flex flex-wrap gap-1">
                          {segment.topCategories.map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">الخصائص</p>
                        <div className="flex flex-wrap gap-1">
                          {segment.characteristics.map((char, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* أداء المحتوى */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>أداء المحتوى في التوصيات</CardTitle>
              <CardDescription>
                تحليل أداء المحتوى المختلف في نظام التوصيات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance.map((item) => (
                  <div key={item.itemId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600 mb-3">
                          <Badge variant="outline">{item.category}</Badge>
                          <span>{formatNumber(item.recommendationCount)} توصية</span>
                          <span>{formatNumber(item.clickCount)} نقرة</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">معدل النقر</p>
                            <p className={`text-sm font-medium ${getPerformanceColor(item.ctr)}`}>
                              {formatPercentage(item.ctr)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">نقاط التفاعل</p>
                            <p className={`text-sm font-medium ${getPerformanceColor(item.engagementScore)}`}>
                              {formatPercentage(item.engagementScore)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">الأداء العام</p>
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                              {item.ctr > 0.2 ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : item.ctr > 0.15 ? (
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                              ) : (
                                <Info className="w-4 h-4 text-red-500" />
                              )}
                              <span className="text-xs">
                                {item.ctr > 0.2 ? 'ممتاز' : item.ctr > 0.15 ? 'جيد' : 'يحتاج تحسين'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التحليلات */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>اتجاهات الأداء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">دقة التوصيات</span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">+2.3%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">معدل النقر</span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">+1.8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">تنوع التوصيات</span>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">+0.9%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">متوسط التوصيات لكل مستخدم</span>
                    <span className="text-sm font-medium">12.2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">وقت الاستجابة</span>
                    <span className="text-sm font-medium">45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">معدل التحديث</span>
                    <span className="text-sm font-medium">كل 15 دقيقة</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

