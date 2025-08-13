// نظام التحرير التعاوني المتقدم
export interface CollaborativeSession {
  id: string
  documentId: string
  title: string
  createdBy: string
  createdAt: Date
  lastModified: Date
  status: 'active' | 'paused' | 'completed' | 'archived'
  participants: SessionParticipant[]
  permissions: SessionPermissions
  settings: SessionSettings
}

export interface SessionParticipant {
  userId: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'reviewer' | 'viewer'
  joinedAt: Date
  lastSeen: Date
  isOnline: boolean
  cursor?: CursorPosition
  selection?: TextSelection
  color: string // لون المؤشر والتحديد
}

export interface CursorPosition {
  line: number
  column: number
  timestamp: Date
}

export interface TextSelection {
  start: CursorPosition
  end: CursorPosition
  timestamp: Date
}

export interface SessionPermissions {
  canEdit: string[] // معرفات المستخدمين
  canComment: string[]
  canReview: string[]
  canManageUsers: string[]
  canExport: string[]
}

export interface SessionSettings {
  autoSave: boolean
  autoSaveInterval: number // بالثواني
  trackChanges: boolean
  allowComments: boolean
  allowSuggestions: boolean
  requireApproval: boolean
  notifyOnChanges: boolean
}

export interface DocumentChange {
  id: string
  sessionId: string
  userId: string
  timestamp: Date
  type: 'insert' | 'delete' | 'replace' | 'format'
  position: CursorPosition
  content?: string
  length?: number
  metadata?: {
    formatting?: TextFormatting
    suggestion?: boolean
    approved?: boolean
    reviewerId?: string
  }
}

export interface TextFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  fontSize?: number
  fontFamily?: string
  color?: string
  backgroundColor?: string
  alignment?: 'left' | 'center' | 'right' | 'justify'
}

export interface Comment {
  id: string
  sessionId: string
  userId: string
  userName: string
  content: string
  position: CursorPosition
  timestamp: Date
  resolved: boolean
  replies: CommentReply[]
  mentions: string[] // معرفات المستخدمين المذكورين
}

export interface CommentReply {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
}

export interface DocumentVersion {
  id: string
  sessionId: string
  version: number
  content: string
  createdBy: string
  createdAt: Date
  changes: DocumentChange[]
  description?: string
  tags: string[]
}

export interface ConflictResolution {
  conflictId: string
  type: 'concurrent_edit' | 'version_mismatch' | 'permission_denied'
  description: string
  options: ResolutionOption[]
  resolvedBy?: string
  resolvedAt?: Date
  resolution?: string
}

export interface ResolutionOption {
  id: string
  description: string
  action: 'accept_local' | 'accept_remote' | 'merge' | 'manual'
  preview?: string
}

// فئة إدارة التحرير التعاوني
export class CollaborativeEditor {
  private sessions: Map<string, CollaborativeSession> = new Map()
  private activeConnections: Map<string, WebSocket[]> = new Map()
  private documentVersions: Map<string, DocumentVersion[]> = new Map()
  private pendingChanges: Map<string, DocumentChange[]> = new Map()
  private comments: Map<string, Comment[]> = new Map()
  private conflicts: Map<string, ConflictResolution[]> = new Map()

  // إنشاء جلسة تحرير جديدة
  createSession(
    documentId: string,
    title: string,
    createdBy: string,
    settings?: Partial<SessionSettings>
  ): CollaborativeSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const defaultSettings: SessionSettings = {
      autoSave: true,
      autoSaveInterval: 30,
      trackChanges: true,
      allowComments: true,
      allowSuggestions: true,
      requireApproval: false,
      notifyOnChanges: true,
      ...settings
    }

    const session: CollaborativeSession = {
      id: sessionId,
      documentId,
      title,
      createdBy,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active',
      participants: [{
        userId: createdBy,
        name: 'المنشئ',
        email: '',
        role: 'owner',
        joinedAt: new Date(),
        lastSeen: new Date(),
        isOnline: true,
        color: this.generateUserColor()
      }],
      permissions: {
        canEdit: [createdBy],
        canComment: [createdBy],
        canReview: [createdBy],
        canManageUsers: [createdBy],
        canExport: [createdBy]
      },
      settings: defaultSettings
    }

    this.sessions.set(sessionId, session)
    this.activeConnections.set(sessionId, [])
    this.pendingChanges.set(sessionId, [])
    this.comments.set(sessionId, [])
    this.conflicts.set(sessionId, [])

    return session
  }

  // انضمام مستخدم للجلسة
  joinSession(sessionId: string, userId: string, userName: string, userEmail: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    // التحقق من وجود المستخدم مسبقاً
    const existingParticipant = session.participants.find(p => p.userId === userId)
    
    if (existingParticipant) {
      // تحديث حالة الاتصال
      existingParticipant.isOnline = true
      existingParticipant.lastSeen = new Date()
    } else {
      // إضافة مشارك جديد
      const newParticipant: SessionParticipant = {
        userId,
        name: userName,
        email: userEmail,
        role: 'viewer', // الدور الافتراضي
        joinedAt: new Date(),
        lastSeen: new Date(),
        isOnline: true,
        color: this.generateUserColor()
      }
      
      session.participants.push(newParticipant)
    }

    session.lastModified = new Date()
    this.sessions.set(sessionId, session)

    // إشعار المشاركين الآخرين
    this.broadcastToSession(sessionId, {
      type: 'user_joined',
      userId,
      userName,
      timestamp: new Date()
    })

    return true
  }

  // مغادرة المستخدم للجلسة
  leaveSession(sessionId: string, userId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const participant = session.participants.find(p => p.userId === userId)
    if (participant) {
      participant.isOnline = false
      participant.lastSeen = new Date()
      
      // إزالة المؤشر والتحديد
      delete participant.cursor
      delete participant.selection
    }

    session.lastModified = new Date()
    this.sessions.set(sessionId, session)

    // إشعار المشاركين الآخرين
    this.broadcastToSession(sessionId, {
      type: 'user_left',
      userId,
      timestamp: new Date()
    })

    return true
  }

  // تطبيق تغيير على المستند
  applyChange(sessionId: string, change: Omit<DocumentChange, 'id' | 'timestamp'>): DocumentChange | null {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // التحقق من الصلاحيات
    if (!this.hasPermission(sessionId, change.userId, 'edit')) {
      return null
    }

    const fullChange: DocumentChange = {
      ...change,
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId
    }

    // إضافة التغيير للقائمة المعلقة
    const pendingChanges = this.pendingChanges.get(sessionId) || []
    pendingChanges.push(fullChange)
    this.pendingChanges.set(sessionId, pendingChanges)

    // تحديث وقت آخر تعديل
    session.lastModified = new Date()
    this.sessions.set(sessionId, session)

    // بث التغيير للمشاركين الآخرين
    this.broadcastToSession(sessionId, {
      type: 'document_change',
      change: fullChange
    }, change.userId)

    // الحفظ التلقائي إذا كان مفعلاً
    if (session.settings.autoSave) {
      this.scheduleAutoSave(sessionId)
    }

    return fullChange
  }

  // تحديث موضع المؤشر
  updateCursor(sessionId: string, userId: string, position: CursorPosition): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const participant = session.participants.find(p => p.userId === userId)
    if (!participant) return false

    participant.cursor = position
    participant.lastSeen = new Date()

    // بث موضع المؤشر للآخرين
    this.broadcastToSession(sessionId, {
      type: 'cursor_update',
      userId,
      position
    }, userId)

    return true
  }

  // تحديث التحديد النصي
  updateSelection(sessionId: string, userId: string, selection: TextSelection | null): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const participant = session.participants.find(p => p.userId === userId)
    if (!participant) return false

    participant.selection = selection || undefined
    participant.lastSeen = new Date()

    // بث التحديد للآخرين
    this.broadcastToSession(sessionId, {
      type: 'selection_update',
      userId,
      selection
    }, userId)

    return true
  }

  // إضافة تعليق
  addComment(
    sessionId: string,
    userId: string,
    userName: string,
    content: string,
    position: CursorPosition,
    mentions: string[] = []
  ): Comment | null {
    const session = this.sessions.get(sessionId)
    if (!session || !session.settings.allowComments) return null

    if (!this.hasPermission(sessionId, userId, 'comment')) {
      return null
    }

    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      userId,
      userName,
      content,
      position,
      timestamp: new Date(),
      resolved: false,
      replies: [],
      mentions
    }

    const comments = this.comments.get(sessionId) || []
    comments.push(comment)
    this.comments.set(sessionId, comments)

    // بث التعليق للمشاركين
    this.broadcastToSession(sessionId, {
      type: 'comment_added',
      comment
    })

    // إشعار المستخدمين المذكورين
    if (mentions.length > 0) {
      this.notifyMentionedUsers(sessionId, mentions, comment)
    }

    return comment
  }

  // الرد على تعليق
  replyToComment(
    sessionId: string,
    commentId: string,
    userId: string,
    userName: string,
    content: string
  ): CommentReply | null {
    const comments = this.comments.get(sessionId) || []
    const comment = comments.find(c => c.id === commentId)
    
    if (!comment) return null

    const reply: CommentReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      content,
      timestamp: new Date()
    }

    comment.replies.push(reply)
    this.comments.set(sessionId, comments)

    // بث الرد للمشاركين
    this.broadcastToSession(sessionId, {
      type: 'comment_reply',
      commentId,
      reply
    })

    return reply
  }

  // حل تعليق
  resolveComment(sessionId: string, commentId: string, userId: string): boolean {
    const comments = this.comments.get(sessionId) || []
    const comment = comments.find(c => c.id === commentId)
    
    if (!comment) return false

    // التحقق من الصلاحيات (صاحب التعليق أو المحرر)
    if (comment.userId !== userId && !this.hasPermission(sessionId, userId, 'review')) {
      return false
    }

    comment.resolved = true
    this.comments.set(sessionId, comments)

    // بث حل التعليق
    this.broadcastToSession(sessionId, {
      type: 'comment_resolved',
      commentId,
      resolvedBy: userId
    })

    return true
  }

  // إنشاء نسخة من المستند
  createVersion(
    sessionId: string,
    content: string,
    createdBy: string,
    description?: string,
    tags: string[] = []
  ): DocumentVersion | null {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const versions = this.documentVersions.get(sessionId) || []
    const versionNumber = versions.length + 1

    const version: DocumentVersion = {
      id: `version_${sessionId}_${versionNumber}`,
      sessionId,
      version: versionNumber,
      content,
      createdBy,
      createdAt: new Date(),
      changes: [...(this.pendingChanges.get(sessionId) || [])],
      description,
      tags
    }

    versions.push(version)
    this.documentVersions.set(sessionId, versions)

    // مسح التغييرات المعلقة بعد إنشاء النسخة
    this.pendingChanges.set(sessionId, [])

    // بث إنشاء النسخة
    this.broadcastToSession(sessionId, {
      type: 'version_created',
      version: {
        id: version.id,
        version: version.version,
        createdBy: version.createdBy,
        createdAt: version.createdAt,
        description: version.description,
        tags: version.tags
      }
    })

    return version
  }

  // كشف وحل التعارضات
  detectConflicts(sessionId: string, changes: DocumentChange[]): ConflictResolution[] {
    const detectedConflicts: ConflictResolution[] = []
    
    // فحص التغييرات المتزامنة
    for (let i = 0; i < changes.length; i++) {
      for (let j = i + 1; j < changes.length; j++) {
        const change1 = changes[i]
        const change2 = changes[j]
        
        // فحص التداخل في المواضع
        if (this.changesOverlap(change1, change2)) {
          const conflict: ConflictResolution = {
            conflictId: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'concurrent_edit',
            description: `تعديل متزامن في نفس الموضع من قبل مستخدمين مختلفين`,
            options: [
              {
                id: 'accept_first',
                description: 'قبول التغيير الأول',
                action: 'accept_local',
                preview: change1.content || ''
              },
              {
                id: 'accept_second',
                description: 'قبول التغيير الثاني',
                action: 'accept_remote',
                preview: change2.content || ''
              },
              {
                id: 'merge_both',
                description: 'دمج التغييرين',
                action: 'merge',
                preview: `${change1.content || ''} ${change2.content || ''}`
              }
            ]
          }
          
          detectedConflicts.push(conflict)
        }
      }
    }

    // حفظ التعارضات
    const existingConflicts = this.conflicts.get(sessionId) || []
    existingConflicts.push(...detectedConflicts)
    this.conflicts.set(sessionId, existingConflicts)

    return detectedConflicts
  }

  // فحص تداخل التغييرات
  private changesOverlap(change1: DocumentChange, change2: DocumentChange): boolean {
    // فحص بسيط للتداخل بناءً على الموضع
    const pos1 = change1.position
    const pos2 = change2.position
    
    // إذا كانت في نفس السطر
    if (pos1.line === pos2.line) {
      // فحص تداخل الأعمدة
      const end1 = pos1.column + (change1.length || 0)
      const end2 = pos2.column + (change2.length || 0)
      
      return !(end1 <= pos2.column || end2 <= pos1.column)
    }
    
    return false
  }

  // التحقق من الصلاحيات
  private hasPermission(sessionId: string, userId: string, action: 'edit' | 'comment' | 'review'): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const participant = session.participants.find(p => p.userId === userId)
    if (!participant) return false

    switch (action) {
      case 'edit':
        return session.permissions.canEdit.includes(userId) || participant.role === 'owner'
      case 'comment':
        return session.permissions.canComment.includes(userId) || participant.role !== 'viewer'
      case 'review':
        return session.permissions.canReview.includes(userId) || participant.role === 'owner'
      default:
        return false
    }
  }

  // بث رسالة لجميع المشاركين في الجلسة
  private broadcastToSession(sessionId: string, message: any, excludeUserId?: string) {
    const connections = this.activeConnections.get(sessionId) || []
    const session = this.sessions.get(sessionId)
    
    if (!session) return

    // إرسال الرسالة لجميع المشاركين المتصلين
    session.participants
      .filter(p => p.isOnline && p.userId !== excludeUserId)
      .forEach(participant => {
        // في التطبيق الحقيقي، سيتم إرسال الرسالة عبر WebSocket
        console.log(`Broadcasting to ${participant.userId}:`, message)
      })
  }

  // توليد لون فريد للمستخدم
  private generateUserColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // جدولة الحفظ التلقائي
  private scheduleAutoSave(sessionId: string) {
    const session = this.sessions.get(sessionId)
    if (!session || !session.settings.autoSave) return

    // في التطبيق الحقيقي، سيتم استخدام setTimeout أو نظام جدولة
    setTimeout(() => {
      this.autoSave(sessionId)
    }, session.settings.autoSaveInterval * 1000)
  }

  // الحفظ التلقائي
  private autoSave(sessionId: string) {
    const session = this.sessions.get(sessionId)
    const pendingChanges = this.pendingChanges.get(sessionId)
    
    if (!session || !pendingChanges || pendingChanges.length === 0) return

    // في التطبيق الحقيقي، سيتم حفظ التغييرات في قاعدة البيانات
    console.log(`Auto-saving session ${sessionId} with ${pendingChanges.length} changes`)

    // بث إشعار الحفظ التلقائي
    this.broadcastToSession(sessionId, {
      type: 'auto_saved',
      timestamp: new Date(),
      changesCount: pendingChanges.length
    })
  }

  // إشعار المستخدمين المذكورين
  private notifyMentionedUsers(sessionId: string, mentions: string[], comment: Comment) {
    mentions.forEach(userId => {
      // في التطبيق الحقيقي، سيتم إرسال إشعار
      console.log(`Notifying user ${userId} about mention in comment ${comment.id}`)
    })
  }

  // الحصول على معلومات الجلسة
  getSession(sessionId: string): CollaborativeSession | null {
    return this.sessions.get(sessionId) || null
  }

  // الحصول على التعليقات
  getComments(sessionId: string): Comment[] {
    return this.comments.get(sessionId) || []
  }

  // الحصول على النسخ
  getVersions(sessionId: string): DocumentVersion[] {
    return this.documentVersions.get(sessionId) || []
  }

  // الحصول على التعارضات
  getConflicts(sessionId: string): ConflictResolution[] {
    return this.conflicts.get(sessionId) || []
  }
}

// إنشاء مثيل مشترك
export const collaborativeEditor = new CollaborativeEditor()

