import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Layout from '@/components/layout/Layout'
import ArticleCard from '@/components/ui/article-card'
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Globe, 
  Newspaper,
  BarChart3,
  Users,
  MessageSquare
} from 'lucide-react'

// بيانات تجريبية مؤقتة حتى يتم ربط قاعدة البيانات
const featuredArticles = [
  {
    id: '1',
    title: 'المملكة تطلق مشروع نيوم الجديد للمدن الذكية',
    excerpt: 'أعلنت المملكة العربية السعودية عن إطلاق مشروع نيوم الجديد للمدن الذكية ضمن رؤية 2030',
    featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    category: {
      name: 'Local News',
      nameAr: 'الأخبار المحلية',
      slug: 'local',
      color: '#0ea5e9'
    },
    author: {
      name: 'محرر سبق',
      avatar: undefined
    },
    publishedAt: new Date(),
    readingTime: 3,
    viewsCount: 1250,
    likesCount: 89,
    commentsCount: 23
  },
  {
    id: '2',
    title: 'الذكاء الاصطناعي يغير وجه الصحافة العربية',
    excerpt: 'كيف تستخدم وسائل الإعلام العربية الذكاء الاصطناعي لتطوير المحتوى وتحسين تجربة القراء',
    featuredImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    category: {
      name: 'Technology',
      nameAr: 'تقنية',
      slug: 'technology',
      color: '#8b5cf6'
    },
    author: {
      name: 'أحمد التقني',
      avatar: undefined
    },
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    readingTime: 4,
    viewsCount: 2100,
    likesCount: 156,
    commentsCount: 42
  }
]

const latestNews = [
  {
    id: '3',
    title: 'نمو الاقتصاد السعودي يتجاوز التوقعات في الربع الثالث',
    excerpt: 'تشير البيانات الأولية إلى نمو الاقتصاد السعودي بنسبة تفوق التوقعات',
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop',
    category: {
      name: 'Economy',
      nameAr: 'اقتصاد',
      slug: 'economy',
      color: '#f59e0b'
    },
    author: {
      name: 'سارة الاقتصادية',
      avatar: undefined
    },
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    readingTime: 3,
    viewsCount: 890,
    likesCount: 67,
    commentsCount: 15
  },
  {
    id: '4',
    title: 'الهلال يتأهل لنهائي دوري أبطال آسيا',
    excerpt: 'فريق الهلال السعودي يحقق إنجازاً تاريخياً بالتأهل لنهائي دوري أبطال آسيا',
    featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    category: {
      name: 'Sports',
      nameAr: 'رياضة',
      slug: 'sports',
      color: '#ef4444'
    },
    author: {
      name: 'خالد الرياضي',
      avatar: undefined
    },
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    readingTime: 2,
    viewsCount: 3200,
    likesCount: 245,
    commentsCount: 78
  }
]

const stats = [
  {
    title: 'المقالات المنشورة',
    value: '15,420',
    change: '+12%',
    icon: Newspaper,
    color: 'text-blue-600'
  },
  {
    title: 'القراء النشطون',
    value: '89,650',
    change: '+8%',
    icon: Users,
    color: 'text-green-600'
  },
  {
    title: 'التفاعلات',
    value: '142,500',
    change: '+15%',
    icon: MessageSquare,
    color: 'text-purple-600'
  },
  {
    title: 'المشاهدات',
    value: '2.3M',
    change: '+23%',
    icon: BarChart3,
    color: 'text-orange-600'
  }
]

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              مرحباً بك في <span className="text-yellow-300">سبق الذكية</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-blue-100">
              بوابة الأخبار العربية الذكية المدعومة بالذكاء الاصطناعي
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Zap className="w-5 h-5 mr-2" />
                استكشف الأخبار الذكية
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Globe className="w-5 h-5 mr-2" />
                تصفح الأقسام
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                  <Badge variant="secondary" className="text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">الأخبار المميزة</h2>
            <Button variant="outline" asChild>
              <Link href="/news">عرض المزيد</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <Clock className="w-8 h-8 mr-3 text-blue-600" />
              آخر الأخبار
            </h2>
            <Button variant="outline" asChild>
              <Link href="/moment-by-moment">لحظة بلحظة</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
              />
            ))}
            
            {/* بطاقة دعوة للعمل */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">المزيد من الأخبار</h3>
                <p className="text-gray-600 text-sm mb-4">
                  اكتشف المزيد من الأخبار والمقالات في جميع الأقسام
                </p>
                <Button asChild>
                  <Link href="/news">تصفح الأخبار</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              مميزات الذكاء الاصطناعي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم تجربة إخبارية متطورة ومخصصة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>التلخيص الذكي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  تلخيص تلقائي للأخبار الطويلة لتوفير وقتك والحصول على المعلومات الأساسية بسرعة
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>التوصيات المخصصة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  محتوى مخصص بناءً على اهتماماتك وتفضيلاتك في القراءة لتجربة شخصية فريدة
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>التحليل الذكي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  تحليل الاتجاهات والأنماط في الأخبار لفهم أعمق للأحداث الجارية والتطورات المستقبلية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  )
}
