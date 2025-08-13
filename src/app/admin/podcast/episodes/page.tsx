'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Clock,
  Calendar,
  Mic,
  Users,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'

interface PodcastEpisode {
  id: string
  title: string
  description: string
  duration: number
  publishDate: Date
  status: 'draft' | 'processing' | 'published' | 'archived'
  plays: number
  downloads: number
  category: string
  author: string
  thumbnail?: string
}

// بيانات تجريبية
const mockEpisodes: PodcastEpisode[] = [
  {
    id: '1',
    title: 'مستقبل الذكاء الاصطناعي في الإعلام',
    description: 'نناقش في هذه الحلقة كيف يؤثر الذكاء الاصطناعي على صناعة الإعلام والصحافة',
    duration: 2847, // 47:27
    publishDate: new Date('2024-01-15'),
    status: 'published',
    plays: 15420,
    downloads: 3240,
    category: 'تقنية',
    author: 'أحمد محمد'
  },
  {
    id: '2',
    title: 'التحول الرقمي في المملكة العربية السعودية',
    description: 'استعراض شامل لمبادرات التحول الرقمي ورؤية 2030',
    duration: 3156, // 52:36
    publishDate: new Date('2024-01-10'),
    status: 'published',
    plays: 12890,
    downloads: 2780,
    category: 'أعمال',
    author: 'فاطمة الزهراني'
  },
  {
    id: '3',
    title: 'الأمن السيبراني: التحديات والحلول',
    description: 'حلقة خاصة عن أهمية الأمن السيبراني في العصر الرقمي',
    duration: 2234, // 37:14
    publishDate: new Date('2024-01-08'),
    status: 'draft',
    plays: 0,
    downloads: 0,
    category: 'تقنية',
    author: 'خالد العتيبي'
  },
  {
    id: '4',
    title: 'ريادة الأعمال في المنطقة العربية',
    description: 'لقاء مع رواد أعمال ناجحين ونصائح للمبتدئين',
    duration: 4125, // 68:45
    publishDate: new Date('2024-01-05'),
    status: 'published',
    plays: 8750,
    downloads: 1920,
    category: 'أعمال',
    author: 'سارة القحطاني'
  }
]

export default function PodcastEpisodesPage() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(mockEpisodes)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  // تصفية الحلقات
  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         episode.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || episode.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || episode.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // الحصول على التصنيفات الفريدة
  const categories = Array.from(new Set(episodes.map(ep => ep.category)))
  const statuses = Array.from(new Set(episodes.map(ep => ep.status)))

  // تشغيل/إيقاف الحلقة
  const togglePlayback = (episodeId: string) => {
    if (currentlyPlaying === episodeId) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(episodeId)
    }
  }

  // حذف حلقة
  const deleteEpisode = (episodeId: string) => {
    setEpisodes(prev => prev.filter(ep => ep.id !== episodeId))
    toast.success('تم حذف الحلقة')
  }

  // تغيير حالة الحلقة
  const changeStatus = (episodeId: string, newStatus: PodcastEpisode['status']) => {
    setEpisodes(prev => prev.map(ep => 
      ep.id === episodeId ? { ...ep, status: newStatus } : ep
    ))
    toast.success('تم تحديث حالة الحلقة')
  }

  // تنسيق المدة
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // تنسيق التاريخ
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
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

  // الحصول على لون الحالة
  const getStatusColor = (status: PodcastEpisode['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // الحصول على نص الحالة
  const getStatusText = (status: PodcastEpisode['status']) => {
    switch (status) {
      case 'published': return 'منشور'
      case 'draft': return 'مسودة'
      case 'processing': return 'قيد المعالجة'
      case 'archived': return 'مؤرشف'
      default: return status
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة حلقات البودكاست</h1>
            <p className="text-gray-600">إدارة ومتابعة جميع حلقات البودكاست</p>
          </div>
        </div>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          حلقة جديدة
        </Button>
      </div>

      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الحلقات</p>
                <p className="text-2xl font-bold text-gray-900">{episodes.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المشاهدات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(episodes.reduce((sum, ep) => sum + ep.plays, 0))}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Play className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التحميلات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(episodes.reduce((sum, ep) => sum + ep.downloads, 0))}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الحلقات المنشورة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {episodes.filter(ep => ep.status === 'published').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
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
                  placeholder="البحث في الحلقات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">جميع التصنيفات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">جميع الحالات</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{getStatusText(status)}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الحلقات */}
      <div className="space-y-4">
        {filteredEpisodes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد حلقات</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' 
                  ? 'لا توجد حلقات تطابق معايير البحث'
                  : 'لم يتم إنشاء أي حلقات بعد'
                }
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                إنشاء حلقة جديدة
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredEpisodes.map((episode) => (
            <Card key={episode.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 rtl:space-x-reverse">
                      {/* صورة مصغرة أو أيقونة */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* معلومات الحلقة */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {episode.title}
                          </h3>
                          <Badge className={getStatusColor(episode.status)}>
                            {getStatusText(episode.status)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {episode.description}
                        </p>
                        
                        <div className="flex items-center space-x-6 rtl:space-x-reverse text-sm text-gray-500">
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(episode.duration)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(episode.publishDate)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <Users className="w-4 h-4" />
                            <span>{episode.author}</span>
                          </div>
                          
                          <Badge variant="outline">{episode.category}</Badge>
                        </div>
                        
                        {/* إحصائيات */}
                        {episode.status === 'published' && (
                          <div className="flex items-center space-x-4 rtl:space-x-reverse mt-3 text-sm">
                            <div className="flex items-center space-x-1 rtl:space-x-reverse text-green-600">
                              <Play className="w-4 h-4" />
                              <span>{formatNumber(episode.plays)} مشاهدة</span>
                            </div>
                            <div className="flex items-center space-x-1 rtl:space-x-reverse text-blue-600">
                              <Download className="w-4 h-4" />
                              <span>{formatNumber(episode.downloads)} تحميل</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {episode.status === 'published' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePlayback(episode.id)}
                      >
                        {currentlyPlaying === episode.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {episode.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => changeStatus(episode.id, 'published')}
                      >
                        نشر
                      </Button>
                    )}
                    
                    {episode.status === 'published' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => changeStatus(episode.id, 'archived')}
                      >
                        أرشفة
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteEpisode(episode.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

