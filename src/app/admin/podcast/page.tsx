'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Mic, 
  Upload, 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Scissors, 
  Waveform,
  FileAudio,
  Download,
  Settings,
  Zap,
  Eye,
  Clock,
  Users,
  BookOpen,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  AudioProcessor, 
  AudioSegment, 
  AudioMetadata, 
  PodcastEpisode, 
  Chapter,
  audioProcessor 
} from '@/lib/podcast/audio-processor'

export default function PodcastEditorPage() {
  const [currentEpisode, setCurrentEpisode] = useState<Partial<PodcastEpisode>>({
    title: '',
    description: '',
    status: 'draft',
    tags: [],
    category: 'عام',
    author: 'المحرر'
  })
  
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(null)
  const [segments, setSegments] = useState<AudioSegment[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [transcript, setTranscript] = useState('')
  
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [processingProgress, setProcessingProgress] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  // رفع ملف صوتي
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      toast.error('يرجى اختيار ملف صوتي صحيح')
      return
    }

    setAudioFile(file)
    setProcessing(true)
    setProcessingStep('تحليل الملف الصوتي...')
    setProcessingProgress(20)

    try {
      // تحليل الملف
      const metadata = await audioProcessor.analyzeAudio(file)
      setAudioMetadata(metadata)
      setDuration(metadata.duration)
      
      setProcessingStep('كشف مقاطع الكلام...')
      setProcessingProgress(40)
      
      // كشف الكلام
      const detectedSegments = await audioProcessor.detectSpeech(file)
      setSegments(detectedSegments)
      
      setProcessingStep('تحويل الكلام إلى نص...')
      setProcessingProgress(60)
      
      // تحويل إلى نص
      const transcriptText = await audioProcessor.transcribeAudio(file)
      setTranscript(transcriptText)
      
      setProcessingStep('توليد الفصول...')
      setProcessingProgress(80)
      
      // توليد الفصول
      const generatedChapters = await audioProcessor.generateChapters(detectedSegments)
      setChapters(generatedChapters)
      
      setProcessingProgress(100)
      setProcessingStep('تم الانتهاء!')
      
      // إعداد مشغل الصوت
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file)
      }
      
      toast.success('تم تحليل الملف الصوتي بنجاح')
    } catch (error) {
      console.error('خطأ في معالجة الملف:', error)
      toast.error('فشل في معالجة الملف الصوتي')
    } finally {
      setProcessing(false)
      setTimeout(() => {
        setProcessingStep('')
        setProcessingProgress(0)
      }, 2000)
    }
  }

  // بدء التسجيل
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/wav' })
        const file = new File([blob], 'recording.wav', { type: 'audio/wav' })
        setAudioFile(file)
        
        // معالجة التسجيل
        handleFileUpload({ target: { files: [file] } } as any)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      toast.success('بدأ التسجيل')
    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error)
      toast.error('فشل في بدء التسجيل')
    }
  }

  // إيقاف التسجيل
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
      toast.success('تم إيقاف التسجيل')
    }
  }

  // تشغيل/إيقاف الصوت
  const togglePlayback = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // تحديث الوقت الحالي
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // تغيير مستوى الصوت
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  // القفز إلى وقت محدد
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // تحديث معلومات الحلقة
  const updateEpisodeInfo = (field: string, value: any) => {
    setCurrentEpisode(prev => ({ ...prev, [field]: value }))
  }

  // إضافة علامة
  const addTag = (tag: string) => {
    if (tag.trim() && !currentEpisode.tags?.includes(tag.trim())) {
      updateEpisodeInfo('tags', [...(currentEpisode.tags || []), tag.trim()])
    }
  }

  // حذف علامة
  const removeTag = (tag: string) => {
    updateEpisodeInfo('tags', currentEpisode.tags?.filter(t => t !== tag) || [])
  }

  // حفظ الحلقة
  const saveEpisode = async () => {
    if (!currentEpisode.title?.trim()) {
      toast.error('يرجى إدخال عنوان الحلقة')
      return
    }

    if (!audioFile) {
      toast.error('يرجى رفع ملف صوتي')
      return
    }

    try {
      // في التطبيق الحقيقي، سيتم رفع الملف وحفظ البيانات
      const episode: PodcastEpisode = {
        id: `episode_${Date.now()}`,
        title: currentEpisode.title,
        description: currentEpisode.description || '',
        audioUrl: URL.createObjectURL(audioFile),
        duration: duration,
        publishDate: new Date(),
        status: currentEpisode.status as any || 'draft',
        metadata: audioMetadata!,
        segments: segments,
        transcript: transcript,
        chapters: chapters,
        tags: currentEpisode.tags || [],
        category: currentEpisode.category || 'عام',
        author: currentEpisode.author || 'المحرر'
      }

      console.log('حفظ الحلقة:', episode)
      toast.success('تم حفظ الحلقة بنجاح')
    } catch (error) {
      console.error('خطأ في حفظ الحلقة:', error)
      toast.error('فشل في حفظ الحلقة')
    }
  }

  // تنسيق الوقت
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">محرر البودكاست المتقدم</h1>
            <p className="text-gray-600">إنشاء وتحرير حلقات البودكاست بالذكاء الاصطناعي</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            رفع ملف صوتي
          </Button>
          <Button 
            variant="outline" 
            onClick={isRecording ? stopRecording : startRecording}
            className={isRecording ? 'bg-red-50 border-red-200' : ''}
          >
            {isRecording ? <Square className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
          </Button>
          <Button onClick={saveEpisode} disabled={!audioFile}>
            حفظ الحلقة
          </Button>
        </div>
      </div>

      {/* شريط المعالجة */}
      {processing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{processingStep}</span>
                <span className="text-sm text-gray-600">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="editor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="editor">المحرر</TabsTrigger>
          <TabsTrigger value="transcript">النص المكتوب</TabsTrigger>
          <TabsTrigger value="chapters">الفصول</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          <TabsTrigger value="export">التصدير</TabsTrigger>
        </TabsList>

        {/* المحرر الرئيسي */}
        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* معلومات الحلقة */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الحلقة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="episode-title">عنوان الحلقة</Label>
                    <Input
                      id="episode-title"
                      placeholder="أدخل عنوان الحلقة"
                      value={currentEpisode.title || ''}
                      onChange={(e) => updateEpisodeInfo('title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="episode-description">وصف الحلقة</Label>
                    <Textarea
                      id="episode-description"
                      placeholder="أدخل وصف الحلقة"
                      value={currentEpisode.description || ''}
                      onChange={(e) => updateEpisodeInfo('description', e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="episode-category">التصنيف</Label>
                    <Input
                      id="episode-category"
                      placeholder="مثال: تقنية، أخبار، ثقافة"
                      value={currentEpisode.category || ''}
                      onChange={(e) => updateEpisodeInfo('category', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>العلامات</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {currentEpisode.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="أضف علامة واضغط Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* معلومات الملف */}
              {audioMetadata && (
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الملف الصوتي</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">المدة:</span>
                      <span className="text-sm font-medium">{formatTime(audioMetadata.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الحجم:</span>
                      <span className="text-sm font-medium">{(audioMetadata.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">معدل البت:</span>
                      <span className="text-sm font-medium">{audioMetadata.bitrate} kbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">التردد:</span>
                      <span className="text-sm font-medium">{audioMetadata.sampleRate} Hz</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* مشغل الصوت والتحكم */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>مشغل الصوت</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* أزرار التحكم */}
                  <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse">
                    <Button
                      size="lg"
                      onClick={togglePlayback}
                      disabled={!audioFile}
                      className="rounded-full w-16 h-16"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                  </div>

                  {/* شريط التقدم */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <div 
                      className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const percentage = x / rect.width
                        seekTo(percentage * duration)
                      }}
                    >
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* مستوى الصوت */}
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Volume2 className="w-4 h-4" />
                    <Slider
                      value={[volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-12">{volume}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* مقاطع الكلام */}
              {segments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>مقاطع الكلام المكتشفة</CardTitle>
                    <CardDescription>
                      تم اكتشاف {segments.length} مقطع كلام
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {segments.map((segment, index) => (
                        <div 
                          key={segment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => seekTo(segment.start)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Badge variant="outline">{index + 1}</Badge>
                              <span className="text-sm font-medium">{segment.text}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatTime(segment.start)} - {formatTime(segment.end)}
                            </div>
                          </div>
                          {segment.confidence && (
                            <Badge variant="secondary">
                              {Math.round(segment.confidence * 100)}%
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* النص المكتوب */}
        <TabsContent value="transcript" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>النص المكتوب للحلقة</CardTitle>
              <CardDescription>
                تم تحويل الكلام إلى نص تلقائياً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="سيظهر النص المحول هنا..."
                rows={15}
                className="font-mono"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* الفصول */}
        <TabsContent value="chapters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>فصول الحلقة</CardTitle>
              <CardDescription>
                تم توليد {chapters.length} فصل تلقائياً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div key={chapter.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{chapter.title}</h4>
                      <Badge variant="outline">
                        {formatTime(chapter.start)} - {formatTime(chapter.end)}
                      </Badge>
                    </div>
                    {chapter.description && (
                      <p className="text-sm text-gray-600">{chapter.description}</p>
                    )}
                  </div>
                ))}
                
                {chapters.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>لا توجد فصول متاحة</p>
                    <p className="text-sm">سيتم توليد الفصول تلقائياً عند رفع ملف صوتي</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الإعدادات */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات المعالجة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">إعدادات التحويل</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-transcribe">تحويل تلقائي للكلام</Label>
                    <Switch id="auto-transcribe" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="speaker-detection">كشف المتحدثين</Label>
                    <Switch id="speaker-detection" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-chapters">توليد فصول تلقائي</Label>
                    <Switch id="auto-chapters" defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">إعدادات الصوت</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="noise-reduction">تقليل الضوضاء</Label>
                    <Switch id="noise-reduction" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume-normalize">تطبيع مستوى الصوت</Label>
                    <Switch id="volume-normalize" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="voice-enhance">تحسين الصوت</Label>
                    <Switch id="voice-enhance" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* التصدير */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تصدير الحلقة</CardTitle>
              <CardDescription>
                تصدير الحلقة بصيغ مختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" disabled={!audioFile}>
                  <Download className="w-4 h-4 mr-2" />
                  تصدير MP3
                </Button>
                <Button variant="outline" disabled={!audioFile}>
                  <Download className="w-4 h-4 mr-2" />
                  تصدير WAV
                </Button>
                <Button variant="outline" disabled={!transcript}>
                  <Download className="w-4 h-4 mr-2" />
                  تصدير النص
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* مدخلات مخفية */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration)
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  )
}

