'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, Lightbulb, FileText, Zap, Target, TrendingUp, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface AIResult {
  titles?: string[]
  summary?: string
  improvedContent?: string
  analysis?: any
  suggestions?: any[]
}

export default function AIAssistantPage() {
  const [content, setContent] = useState('')
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('')
  const [targetTone, setTargetTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AIResult>({})

  // توليد العناوين الذكية
  const generateTitles = async () => {
    if (!content.trim()) {
      toast.error('يرجى إدخال المحتوى أولاً')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, count: 5 })
      })

      const data = await response.json()
      if (data.success) {
        setResults(prev => ({ ...prev, titles: data.titles }))
        toast.success('تم توليد العناوين بنجاح!')
      } else {
        toast.error('فشل في توليد العناوين')
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  // تلخيص المحتوى
  const summarizeContent = async () => {
    if (!content.trim()) {
      toast.error('يرجى إدخال المحتوى أولاً')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      const data = await response.json()
      if (data.success) {
        setResults(prev => ({ ...prev, summary: data.summary }))
        toast.success('تم تلخيص المحتوى بنجاح!')
      } else {
        toast.error('فشل في تلخيص المحتوى')
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  // تحسين النبرة
  const improveTone = async () => {
    if (!content.trim()) {
      toast.error('يرجى إدخال المحتوى أولاً')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/improve-tone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, targetTone })
      })

      const data = await response.json()
      if (data.success) {
        setResults(prev => ({ ...prev, improvedContent: data.improvedContent }))
        toast.success('تم تحسين النبرة بنجاح!')
      } else {
        toast.error('فشل في تحسين النبرة')
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  // تحليل المحتوى
  const analyzeContent = async () => {
    if (!content.trim()) {
      toast.error('يرجى إدخال المحتوى أولاً')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })

      const data = await response.json()
      if (data.success) {
        setResults(prev => ({ ...prev, analysis: data.analysis }))
        toast.success('تم تحليل المحتوى بنجاح!')
      } else {
        toast.error('فشل في تحليل المحتوى')
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  // توليد اقتراحات المحتوى
  const generateSuggestions = async () => {
    if (!topic.trim() || !category.trim()) {
      toast.error('يرجى إدخال الموضوع والتصنيف')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category })
      })

      const data = await response.json()
      if (data.success) {
        setResults(prev => ({ ...prev, suggestions: data.suggestions }))
        toast.success('تم توليد الاقتراحات بنجاح!')
      } else {
        toast.error('فشل في توليد الاقتراحات')
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">مساعد الذكاء الاصطناعي</h1>
          <p className="text-gray-600">أدوات ذكية لتحسين وتطوير المحتوى</p>
        </div>
      </div>

      <Tabs defaultValue="content-tools" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content-tools">أدوات المحتوى</TabsTrigger>
          <TabsTrigger value="analysis">التحليل الذكي</TabsTrigger>
          <TabsTrigger value="suggestions">اقتراحات المحتوى</TabsTrigger>
        </TabsList>

        {/* أدوات المحتوى */}
        <TabsContent value="content-tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <FileText className="w-5 h-5" />
                <span>إدخال المحتوى</span>
              </CardTitle>
              <CardDescription>
                أدخل المحتوى الذي تريد تحسينه أو تحليله
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="اكتب أو الصق المحتوى هنا..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={generateTitles} 
                  disabled={loading}
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>توليد عناوين</span>
                </Button>
                
                <Button 
                  onClick={summarizeContent} 
                  disabled={loading}
                  variant="outline"
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Target className="w-4 h-4" />
                  <span>تلخيص المحتوى</span>
                </Button>
                
                <div className="space-y-2">
                  <Select value={targetTone} onValueChange={setTargetTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النبرة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">رسمي</SelectItem>
                      <SelectItem value="casual">ودود</SelectItem>
                      <SelectItem value="professional">احترافي</SelectItem>
                      <SelectItem value="engaging">جذاب</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={improveTone} 
                    disabled={loading}
                    variant="outline"
                    className="w-full flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <Zap className="w-4 h-4" />
                    <span>تحسين النبرة</span>
                  </Button>
                </div>
                
                <Button 
                  onClick={analyzeContent} 
                  disabled={loading}
                  variant="outline"
                  className="flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>تحليل المحتوى</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* النتائج */}
          {(results.titles || results.summary || results.improvedContent) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* العناوين المقترحة */}
              {results.titles && (
                <Card>
                  <CardHeader>
                    <CardTitle>العناوين المقترحة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.titles.map((title, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <p className="font-medium">{title}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* الملخص */}
              {results.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>الملخص الذكي</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{results.summary}</p>
                  </CardContent>
                </Card>
              )}

              {/* المحتوى المحسن */}
              {results.improvedContent && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>المحتوى المحسن</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {results.improvedContent}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* التحليل الذكي */}
        <TabsContent value="analysis" className="space-y-6">
          {results.analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* المشاعر */}
              <Card>
                <CardHeader>
                  <CardTitle>تحليل المشاعر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Badge 
                      variant={
                        results.analysis.sentiment === 'positive' ? 'default' :
                        results.analysis.sentiment === 'negative' ? 'destructive' : 'secondary'
                      }
                      className="text-lg px-4 py-2"
                    >
                      {results.analysis.sentiment === 'positive' ? 'إيجابي' :
                       results.analysis.sentiment === 'negative' ? 'سلبي' : 'محايد'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* درجة القابلية للقراءة */}
              <Card>
                <CardHeader>
                  <CardTitle>قابلية القراءة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {results.analysis.readabilityScore}/10
                    </div>
                    <p className="text-sm text-gray-600 mt-2">درجة سهولة القراءة</p>
                  </div>
                </CardContent>
              </Card>

              {/* وقت القراءة المتوقع */}
              <Card>
                <CardHeader>
                  <CardTitle>وقت القراءة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {results.analysis.estimatedReadTime}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">دقيقة</p>
                  </div>
                </CardContent>
              </Card>

              {/* الكلمات المفتاحية */}
              {results.analysis.keywords && results.analysis.keywords.length > 0 && (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>الكلمات المفتاحية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.analysis.keywords.map((keyword: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* العلامات المقترحة */}
              {results.analysis.suggestedTags && results.analysis.suggestedTags.length > 0 && (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>العلامات المقترحة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {results.analysis.suggestedTags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* اقتراحات المحتوى */}
        <TabsContent value="suggestions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Sparkles className="w-5 h-5" />
                <span>توليد اقتراحات المحتوى</span>
              </CardTitle>
              <CardDescription>
                احصل على اقتراحات ذكية لمقالات جديدة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">الموضوع</Label>
                  <Input
                    id="topic"
                    placeholder="مثال: التقنية الحديثة"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Input
                    id="category"
                    placeholder="مثال: تقنية"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                onClick={generateSuggestions} 
                disabled={loading}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Sparkles className="w-4 h-4" />
                <span>توليد الاقتراحات</span>
              </Button>
            </CardContent>
          </Card>

          {/* الاقتراحات */}
          {results.suggestions && results.suggestions.length > 0 && (
            <div className="space-y-6">
              {results.suggestions.map((suggestion: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{suggestion.title}</CardTitle>
                    <CardDescription>{suggestion.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        {suggestion.content}
                      </p>
                      
                      {suggestion.tags && suggestion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {suggestion.tags.map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4 border-t">
                        <Badge>{suggestion.category}</Badge>
                        <Button size="sm">استخدام هذا المقال</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

