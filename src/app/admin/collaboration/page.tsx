'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Avatar } from '@/components/ui/avatar'
import { 
  Users, 
  Edit3, 
  MessageCircle, 
  Clock, 
  Eye, 
  Share2,
  Plus,
  Settings,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  FileText,
  Zap,
  Activity,
  Save,
  History,
  MessageSquare,
  Palette,
  MousePointer
} from 'lucide-react'
import { toast } from 'sonner'

// واجهات البيانات
interface CollaborativeSession {
  id: string
  title: string
  documentId: string
  createdBy: string
  createdAt: Date
  lastModified: Date
  status: 'active' | 'paused' | 'completed'
  participantCount: number
  activeUsers: number
  totalChanges: number
  totalComments: number
}

interface SessionParticipant {
  userId: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'reviewer' | 'viewer'
  isOnline: boolean
  lastSeen: Date
  color: string
  cursor?: { line: number; column: number }
}

interface DocumentChange {
  id: string
  userId: string
  userName: string
  type: 'insert' | 'delete' | 'replace' | 'format'
  timestamp: Date
  content: string
  position: { line: number; column: number }
  approved: boolean
}

interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  resolved: boolean
  position: { line: number; column: number }
  replies: number
}

// بيانات تجريبية
const mockSessions: CollaborativeSession[] = [
  {
    id: 'session1',
    title: 'تقرير التقنية الشهري - يناير 2024',
    documentId: 'doc1',
    createdBy: 'أحمد محمد',
    createdAt: new Date('2024-01-15T09:00:00'),
    lastModified: new Date('2024-01-15T14:30:00'),
    status: 'active',
    participantCount: 5,
    activeUsers: 3,
    totalChanges: 127,
    totalComments: 23
  },
  {
    id: 'session2',
    title: 'مقال: مستقبل الذكاء الاصطناعي',
    documentId: 'doc2',
    createdBy: 'فاطمة الزهراني',
    createdAt: new Date('2024-01-14T11:00:00'),
    lastModified: new Date('2024-01-15T16:45:00'),
    status: 'active',
    participantCount: 3,
    activeUsers: 2,
    totalChanges: 89,
    totalComments: 15
  },
  {
    id: 'session3',
    title: 'تحقيق: التحول الرقمي في المملكة',
    documentId: 'doc3',
    createdBy: 'خالد العتيبي',
    createdAt: new Date('2024-01-13T08:30:00'),
    lastModified: new Date('2024-01-15T12:20:00'),
    status: 'completed',
    participantCount: 7,
    activeUsers: 0,
    totalChanges: 234,
    totalComments: 45
  }
]

const mockParticipants: SessionParticipant[] = [
  {
    userId: 'user1',
    name: 'أحمد محمد',
    email: 'ahmed@sabq.org',
    role: 'owner',
    isOnline: true,
    lastSeen: new Date(),
    color: '#FF6B6B',
    cursor: { line: 15, column: 23 }
  },
  {
    userId: 'user2',
    name: 'سارة القحطاني',
    email: 'sara@sabq.org',
    role: 'editor',
    isOnline: true,
    lastSeen: new Date(),
    color: '#4ECDC4',
    cursor: { line: 8, column: 12 }
  },
  {
    userId: 'user3',
    name: 'محمد الأحمد',
    email: 'mohammed@sabq.org',
    role: 'reviewer',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 دقيقة مضت
    color: '#45B7D1'
  }
]

const mockChanges: DocumentChange[] = [
  {
    id: 'change1',
    userId: 'user1',
    userName: 'أحمد محمد',
    type: 'insert',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    content: 'تشهد المملكة العربية السعودية تطوراً مستمراً في مجال التقنية',
    position: { line: 1, column: 0 },
    approved: true
  },
  {
    id: 'change2',
    userId: 'user2',
    userName: 'سارة القحطاني',
    type: 'replace',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    content: 'نمواً متسارعاً',
    position: { line: 1, column: 45 },
    approved: false
  },
  {
    id: 'change3',
    userId: 'user3',
    userName: 'محمد الأحمد',
    type: 'insert',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    content: 'وفقاً لرؤية 2030',
    position: { line: 2, column: 0 },
    approved: false
  }
]

const mockComments: Comment[] = [
  {
    id: 'comment1',
    userId: 'user2',
    userName: 'سارة القحطاني',
    content: 'يمكن إضافة إحصائيات أكثر تفصيلاً هنا',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    resolved: false,
    position: { line: 5, column: 15 },
    replies: 2
  },
  {
    id: 'comment2',
    userId: 'user3',
    userName: 'محمد الأحمد',
    content: 'ممتاز! هذا القسم يحتاج مراجعة لغوية',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    resolved: true,
    position: { line: 12, column: 8 },
    replies: 1
  }
]

export default function CollaborationPage() {
  const [sessions, setSessions] = useState<CollaborativeSession[]>(mockSessions)
  const [selectedSession, setSelectedSession] = useState<string>('session1')
  const [participants, setParticipants] = useState<SessionParticipant[]>(mockParticipants)
  const [changes, setChanges] = useState<DocumentChange[]>(mockChanges)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [documentContent, setDocumentContent] = useState('')

  const editorRef = useRef<HTMLTextAreaElement>(null)

  // إنشاء جلسة جديدة
  const createNewSession = () => {
    const newSession: CollaborativeSession = {
      id: `session${Date.now()}`,
      title: 'مستند جديد',
      documentId: `doc${Date.now()}`,
      createdBy: 'المستخدم الحالي',
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active',
      participantCount: 1,
      activeUsers: 1,
      totalChanges: 0,
      totalComments: 0
    }
    
    setSessions(prev => [newSession, ...prev])
    setSelectedSession(newSession.id)
    toast.success('تم إنشاء جلسة تحرير جديدة')
  }

  // دعوة مستخدم جديد
  const inviteUser = () => {
    // في التطبيق الحقيقي، سيتم فتح نموذج دعوة
    toast.success('تم إرسال دعوة للمستخدم')
  }

  // إضافة تعليق
  const addComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `comment${Date.now()}`,
      userId: 'current_user',
      userName: 'المستخدم الحالي',
      content: newComment,
      timestamp: new Date(),
      resolved: false,
      position: { line: 1, column: 0 },
      replies: 0
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
    toast.success('تم إضافة التعليق')
  }

  // حل تعليق
  const resolveComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ))
    toast.success('تم حل التعليق')
  }

  // الموافقة على تغيير
  const approveChange = (changeId: string) => {
    setChanges(prev => prev.map(change => 
      change.id === changeId ? { ...change, approved: true } : change
    ))
    toast.success('تم الموافقة على التغيير')
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

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // الحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'paused': return 'متوقف'
      case 'completed': return 'مكتمل'
      default: return status
    }
  }

  // الحصول على لون الدور
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'editor': return 'bg-blue-100 text-blue-800'
      case 'reviewer': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // الحصول على نص الدور
  const getRoleText = (role: string) => {
    switch (role) {
      case 'owner': return 'مالك'
      case 'editor': return 'محرر'
      case 'reviewer': return 'مراجع'
      case 'viewer': return 'مشاهد'
      default: return role
    }
  }

  const currentSession = sessions.find(s => s.id === selectedSession)

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">التحرير التعاوني</h1>
            <p className="text-gray-600">إدارة جلسات التحرير التعاوني والمراجعة</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={inviteUser}>
            <UserPlus className="w-4 h-4 mr-2" />
            دعوة مستخدم
          </Button>
          <Button onClick={createNewSession}>
            <Plus className="w-4 h-4 mr-2" />
            جلسة جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* قائمة الجلسات */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>الجلسات النشطة</CardTitle>
              <CardDescription>
                {sessions.filter(s => s.status === 'active').length} جلسة نشطة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedSession === session.id 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedSession(session.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-2">{session.title}</h4>
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusText(session.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-600">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Users className="w-3 h-3" />
                        <span>{session.activeUsers}/{session.participantCount}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Edit3 className="w-3 h-3" />
                        <span>{session.totalChanges}</span>
                      </div>
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <MessageCircle className="w-3 h-3" />
                        <span>{session.totalComments}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      آخر تحديث: {formatTime(session.lastModified)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="lg:col-span-3">
          {currentSession && (
            <Tabs defaultValue="editor" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                  <TabsTrigger value="editor">المحرر</TabsTrigger>
                  <TabsTrigger value="participants">المشاركون</TabsTrigger>
                  <TabsTrigger value="changes">التغييرات</TabsTrigger>
                  <TabsTrigger value="comments">التعليقات</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-2" />
                    الإصدارات
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    الإعدادات
                  </Button>
                  <Button size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                </div>
              </div>

              {/* المحرر التعاوني */}
              <TabsContent value="editor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{currentSession.title}</CardTitle>
                        <CardDescription>
                          آخر تحديث: {formatTime(currentSession.lastModified)}
                        </CardDescription>
                      </div>
                      
                      {/* المشاركون النشطون */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm text-gray-600">المتصلون الآن:</span>
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                          {participants.filter(p => p.isOnline).map((participant) => (
                            <div
                              key={participant.userId}
                              className="relative"
                              title={participant.name}
                            >
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                style={{ backgroundColor: participant.color }}
                              >
                                {participant.name.charAt(0)}
                              </div>
                              {participant.cursor && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white">
                                  <MousePointer className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* شريط الأدوات */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse p-2 bg-gray-50 rounded-lg">
                        <Button variant="outline" size="sm">
                          <strong>B</strong>
                        </Button>
                        <Button variant="outline" size="sm">
                          <em>I</em>
                        </Button>
                        <Button variant="outline" size="sm">
                          <u>U</u>
                        </Button>
                        <div className="w-px h-6 bg-gray-300" />
                        <Button variant="outline" size="sm">
                          <Palette className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* منطقة التحرير */}
                      <div className="relative">
                        <Textarea
                          ref={editorRef}
                          value={documentContent}
                          onChange={(e) => setDocumentContent(e.target.value)}
                          placeholder="ابدأ الكتابة هنا..."
                          className="min-h-96 font-mono text-sm leading-relaxed"
                          dir="rtl"
                        />
                        
                        {/* مؤشرات المستخدمين الآخرين */}
                        {participants.filter(p => p.isOnline && p.cursor).map((participant) => (
                          <div
                            key={participant.userId}
                            className="absolute pointer-events-none"
                            style={{
                              top: `${participant.cursor!.line * 1.5}rem`,
                              right: `${participant.cursor!.column * 0.6}rem`,
                            }}
                          >
                            <div 
                              className="w-0.5 h-5 animate-pulse"
                              style={{ backgroundColor: participant.color }}
                            />
                            <div 
                              className="absolute -top-6 right-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
                              style={{ backgroundColor: participant.color }}
                            >
                              {participant.name}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* شريط الحالة */}
                      <div className="flex items-center justify-between text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <span>السطر: 1</span>
                          <span>العمود: 1</span>
                          <span>الكلمات: {documentContent.split(' ').filter(w => w).length}</span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Activity className="w-4 h-4 text-green-500" />
                          <span>محفوظ تلقائياً</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* المشاركون */}
              <TabsContent value="participants" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>المشاركون في الجلسة</CardTitle>
                    <CardDescription>
                      {participants.length} مشارك - {participants.filter(p => p.isOnline).length} متصل الآن
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {participants.map((participant) => (
                        <div key={participant.userId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                              style={{ backgroundColor: participant.color }}
                            >
                              {participant.name.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <h4 className="font-medium">{participant.name}</h4>
                                {participant.isOnline && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{participant.email}</p>
                              <p className="text-xs text-gray-500">
                                آخر ظهور: {formatTime(participant.lastSeen)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Badge className={getRoleColor(participant.role)}>
                              {getRoleText(participant.role)}
                            </Badge>
                            {participant.cursor && (
                              <Badge variant="outline">
                                <MousePointer className="w-3 h-3 mr-1" />
                                السطر {participant.cursor.line}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* التغييرات */}
              <TabsContent value="changes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>سجل التغييرات</CardTitle>
                    <CardDescription>
                      {changes.length} تغيير - {changes.filter(c => !c.approved).length} في انتظار الموافقة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {changes.map((change) => (
                        <div key={change.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                                <Badge variant="outline">{change.type}</Badge>
                                <span className="text-sm font-medium">{change.userName}</span>
                                <span className="text-xs text-gray-500">
                                  {formatTime(change.timestamp)}
                                </span>
                                {change.approved ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded text-sm font-mono mb-2">
                                {change.content}
                              </div>
                              
                              <p className="text-xs text-gray-600">
                                الموضع: السطر {change.position.line}, العمود {change.position.column}
                              </p>
                            </div>
                            
                            {!change.approved && (
                              <Button 
                                size="sm" 
                                onClick={() => approveChange(change.id)}
                              >
                                موافقة
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* التعليقات */}
              <TabsContent value="comments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>التعليقات والمراجعات</CardTitle>
                    <CardDescription>
                      {comments.length} تعليق - {comments.filter(c => !c.resolved).length} غير محلول
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* إضافة تعليق جديد */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="أضف تعليقاً..."
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button onClick={addComment} disabled={!newComment.trim()}>
                            إضافة تعليق
                          </Button>
                        </div>
                      </div>
                      
                      {/* قائمة التعليقات */}
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <span className="font-medium">{comment.userName}</span>
                              <span className="text-xs text-gray-500">
                                {formatTime(comment.timestamp)}
                              </span>
                              {comment.resolved && (
                                <Badge variant="outline" className="text-green-600">
                                  محلول
                                </Badge>
                              )}
                            </div>
                            
                            {!comment.resolved && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => resolveComment(comment.id)}
                              >
                                حل
                              </Button>
                            )}
                          </div>
                          
                          <p className="text-sm mb-2">{comment.content}</p>
                          
                          <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs text-gray-600">
                            <span>السطر {comment.position.line}, العمود {comment.position.column}</span>
                            {comment.replies > 0 && (
                              <span>{comment.replies} رد</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  )
}

