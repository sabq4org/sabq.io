'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Layout from '@/components/layout/Layout'
import { 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// بيانات تجريبية للإحصائيات
const stats = [
  {
    title: 'إجمالي المقالات',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'المستخدمين النشطين',
    value: '5,678',
    change: '+8%',
    changeType: 'positive',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'التعليقات',
    value: '2,345',
    change: '+15%',
    changeType: 'positive',
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    title: 'المشاهدات اليومية',
    value: '45,678',
    change: '+23%',
    changeType: 'positive',
    icon: BarChart3,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }
]

// بيانات تجريبية للمقالات الأخيرة
const recentPosts = [
  {
    id: '1',
    title: 'المملكة تطلق مشروع نيوم الجديد للمدن الذكية',
    author: 'محرر سبق',
    status: 'published',
    publishedAt: '2024-01-15T10:30:00Z',
    views: 1250,
    comments: 23
  },
  {
    id: '2',
    title: 'الذكاء الاصطناعي يغير وجه الصحافة العربية',
    author: 'أحمد التقني',
    status: 'published',
    publishedAt: '2024-01-14T15:45:00Z',
    views: 2100,
    comments: 42
  },
  {
    id: '3',
    title: 'نمو الاقتصاد السعودي يتجاوز التوقعات',
    author: 'سارة الاقتصادية',
    status: 'draft',
    publishedAt: null,
    views: 0,
    comments: 0
  }
]

const statusColors = {
  published: 'bg-green-100 text-green-800',
  draft: 'bg-yellow-100 text-yellow-800',
  archived: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  published: 'منشور',
  draft: 'مسودة',
  archived: 'مؤرشف'
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user?.role !== 'SYSTEM_ADMIN' && session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    setIsLoading(false)
  }, [session, status, router])

  if (isLoading || status === 'loading') {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم الإدارية</h1>
                <p className="text-gray-600">مرحباً بك، {session?.user?.name}</p>
              </div>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  مقال جديد
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  الإعدادات
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">{stat.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* المقالات الأخيرة */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    المقالات الأخيرة
                  </CardTitle>
                  <CardDescription>
                    آخر المقالات المنشورة والمسودات
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                          <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                            <span>بواسطة {post.author}</span>
                            {post.publishedAt && (
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(post.publishedAt).toLocaleDateString('ar-SA')}
                              </span>
                            )}
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {post.views}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              {post.comments}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Badge className={statusColors[post.status as keyof typeof statusColors]}>
                            {statusLabels[post.status as keyof typeof statusLabels]}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline">عرض جميع المقالات</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الإجراءات السريعة */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>الإجراءات السريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    إنشاء مقال جديد
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    إدارة المستخدمين
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    مراجعة التعليقات
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    التقارير والإحصائيات
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    إعدادات النظام
                  </Button>
                </CardContent>
              </Card>

              {/* حالة النظام */}
              <Card>
                <CardHeader>
                  <CardTitle>حالة النظام</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">قاعدة البيانات</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">متصلة</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">الخادم</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">يعمل</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">التخزين</span>
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
                      <span className="text-sm text-yellow-600">75% مستخدم</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

