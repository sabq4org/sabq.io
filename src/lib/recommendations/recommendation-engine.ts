// محرك التوصيات الذكي والتعلم الآلي
export interface UserProfile {
  id: string
  preferences: {
    categories: string[]
    authors: string[]
    readingTime: 'short' | 'medium' | 'long' | 'any'
    contentTypes: ('article' | 'podcast' | 'video')[]
    topics: string[]
  }
  behavior: {
    readArticles: string[]
    likedArticles: string[]
    sharedArticles: string[]
    searchHistory: string[]
    timeSpentReading: { [articleId: string]: number }
    readingTimes: number[] // أوقات القراءة المفضلة (ساعات)
    deviceTypes: ('mobile' | 'desktop' | 'tablet')[]
  }
  demographics: {
    ageGroup?: 'young' | 'adult' | 'senior'
    location?: string
    language: 'ar' | 'en'
  }
}

export interface ContentItem {
  id: string
  title: string
  content: string
  category: string
  author: string
  publishDate: Date
  tags: string[]
  readingTime: number // بالدقائق
  type: 'article' | 'podcast' | 'video'
  engagement: {
    views: number
    likes: number
    shares: number
    comments: number
    avgTimeSpent: number
  }
  metadata: {
    difficulty: 'easy' | 'medium' | 'hard'
    trending: boolean
    breaking: boolean
    featured: boolean
  }
}

export interface RecommendationResult {
  item: ContentItem
  score: number
  reasons: string[]
  type: 'trending' | 'personalized' | 'similar' | 'collaborative' | 'editorial'
}

export interface RecommendationRequest {
  userId: string
  count: number
  excludeIds?: string[]
  categories?: string[]
  contentTypes?: ('article' | 'podcast' | 'video')[]
  includeBreaking?: boolean
  includeTrending?: boolean
}

// خوارزميات التوصية المختلفة
export class RecommendationEngine {
  private userProfiles: Map<string, UserProfile> = new Map()
  private contentItems: Map<string, ContentItem> = new Map()
  private userSimilarities: Map<string, Map<string, number>> = new Map()
  private contentSimilarities: Map<string, Map<string, number>> = new Map()

  // تحديث ملف المستخدم
  updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const existing = this.userProfiles.get(userId) || this.createDefaultProfile(userId)
    const updated = { ...existing, ...updates }
    this.userProfiles.set(userId, updated)
    
    // إعادة حساب التشابهات
    this.calculateUserSimilarities(userId)
  }

  // إنشاء ملف افتراضي للمستخدم
  private createDefaultProfile(userId: string): UserProfile {
    return {
      id: userId,
      preferences: {
        categories: [],
        authors: [],
        readingTime: 'any',
        contentTypes: ['article', 'podcast', 'video'],
        topics: []
      },
      behavior: {
        readArticles: [],
        likedArticles: [],
        sharedArticles: [],
        searchHistory: [],
        timeSpentReading: {},
        readingTimes: [],
        deviceTypes: ['mobile']
      },
      demographics: {
        language: 'ar'
      }
    }
  }

  // تسجيل تفاعل المستخدم
  recordUserInteraction(
    userId: string, 
    itemId: string, 
    interaction: 'view' | 'like' | 'share' | 'read' | 'search',
    metadata?: { timeSpent?: number; searchQuery?: string }
  ) {
    const profile = this.userProfiles.get(userId) || this.createDefaultProfile(userId)
    
    switch (interaction) {
      case 'view':
        if (!profile.behavior.readArticles.includes(itemId)) {
          profile.behavior.readArticles.push(itemId)
        }
        break
      
      case 'like':
        if (!profile.behavior.likedArticles.includes(itemId)) {
          profile.behavior.likedArticles.push(itemId)
        }
        break
      
      case 'share':
        if (!profile.behavior.sharedArticles.includes(itemId)) {
          profile.behavior.sharedArticles.push(itemId)
        }
        break
      
      case 'read':
        if (metadata?.timeSpent) {
          profile.behavior.timeSpentReading[itemId] = metadata.timeSpent
        }
        break
      
      case 'search':
        if (metadata?.searchQuery) {
          profile.behavior.searchHistory.push(metadata.searchQuery)
          // الاحتفاظ بآخر 100 بحث فقط
          if (profile.behavior.searchHistory.length > 100) {
            profile.behavior.searchHistory = profile.behavior.searchHistory.slice(-100)
          }
        }
        break
    }
    
    this.userProfiles.set(userId, profile)
    this.updateUserPreferences(userId)
  }

  // تحديث تفضيلات المستخدم بناءً على السلوك
  private updateUserPreferences(userId: string) {
    const profile = this.userProfiles.get(userId)
    if (!profile) return

    // تحليل التصنيفات المفضلة
    const categoryCount: { [key: string]: number } = {}
    const authorCount: { [key: string]: number } = {}
    const topicCount: { [key: string]: number } = {}

    // تحليل المقالات المقروءة والمعجب بها
    const relevantItems = [
      ...profile.behavior.readArticles,
      ...profile.behavior.likedArticles.map(id => ({ id, weight: 2 })), // وزن أكبر للإعجاب
      ...profile.behavior.sharedArticles.map(id => ({ id, weight: 3 })) // وزن أكبر للمشاركة
    ]

    relevantItems.forEach(item => {
      const itemId = typeof item === 'string' ? item : item.id
      const weight = typeof item === 'string' ? 1 : item.weight
      const contentItem = this.contentItems.get(itemId)
      
      if (contentItem) {
        // عد التصنيفات
        categoryCount[contentItem.category] = (categoryCount[contentItem.category] || 0) + weight
        
        // عد المؤلفين
        authorCount[contentItem.author] = (authorCount[contentItem.author] || 0) + weight
        
        // عد المواضيع من العلامات
        contentItem.tags.forEach(tag => {
          topicCount[tag] = (topicCount[tag] || 0) + weight
        })
      }
    })

    // تحديث التفضيلات
    profile.preferences.categories = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category)

    profile.preferences.authors = Object.entries(authorCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([author]) => author)

    profile.preferences.topics = Object.entries(topicCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15)
      .map(([topic]) => topic)

    // تحديد وقت القراءة المفضل
    const readingTimes = Object.values(profile.behavior.timeSpentReading)
    if (readingTimes.length > 0) {
      const avgTime = readingTimes.reduce((sum, time) => sum + time, 0) / readingTimes.length
      if (avgTime < 2) profile.preferences.readingTime = 'short'
      else if (avgTime < 5) profile.preferences.readingTime = 'medium'
      else profile.preferences.readingTime = 'long'
    }

    this.userProfiles.set(userId, profile)
  }

  // حساب التشابه بين المستخدمين
  private calculateUserSimilarities(userId: string) {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) return

    const similarities = new Map<string, number>()

    for (const [otherUserId, otherProfile] of this.userProfiles) {
      if (otherUserId === userId) continue

      const similarity = this.calculateUserSimilarity(userProfile, otherProfile)
      if (similarity > 0.1) { // حد أدنى للتشابه
        similarities.set(otherUserId, similarity)
      }
    }

    this.userSimilarities.set(userId, similarities)
  }

  // حساب التشابه بين مستخدمين
  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): number {
    let similarity = 0
    let factors = 0

    // تشابه التصنيفات
    const categoryOverlap = this.calculateArrayOverlap(
      user1.preferences.categories, 
      user2.preferences.categories
    )
    similarity += categoryOverlap * 0.3
    factors += 0.3

    // تشابه المؤلفين
    const authorOverlap = this.calculateArrayOverlap(
      user1.preferences.authors, 
      user2.preferences.authors
    )
    similarity += authorOverlap * 0.2
    factors += 0.2

    // تشابه المواضيع
    const topicOverlap = this.calculateArrayOverlap(
      user1.preferences.topics, 
      user2.preferences.topics
    )
    similarity += topicOverlap * 0.2
    factors += 0.2

    // تشابه المقالات المقروءة
    const readOverlap = this.calculateArrayOverlap(
      user1.behavior.readArticles, 
      user2.behavior.readArticles
    )
    similarity += readOverlap * 0.3
    factors += 0.3

    return factors > 0 ? similarity / factors : 0
  }

  // حساب التداخل بين مصفوفتين
  private calculateArrayOverlap(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 || arr2.length === 0) return 0
    
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  // حساب التشابه بين المحتوى
  calculateContentSimilarity(item1: ContentItem, item2: ContentItem): number {
    let similarity = 0
    let factors = 0

    // تشابه التصنيف
    if (item1.category === item2.category) {
      similarity += 0.3
    }
    factors += 0.3

    // تشابه المؤلف
    if (item1.author === item2.author) {
      similarity += 0.2
    }
    factors += 0.2

    // تشابه العلامات
    const tagOverlap = this.calculateArrayOverlap(item1.tags, item2.tags)
    similarity += tagOverlap * 0.3
    factors += 0.3

    // تشابه وقت القراءة
    const timeDiff = Math.abs(item1.readingTime - item2.readingTime)
    const timeScore = Math.max(0, 1 - timeDiff / 10) // تقليل النقاط كلما زاد الفرق
    similarity += timeScore * 0.2
    factors += 0.2

    return factors > 0 ? similarity / factors : 0
  }

  // الحصول على توصيات شخصية
  async getPersonalizedRecommendations(request: RecommendationRequest): Promise<RecommendationResult[]> {
    const userProfile = this.userProfiles.get(request.userId)
    if (!userProfile) {
      return this.getFallbackRecommendations(request)
    }

    const recommendations: RecommendationResult[] = []
    const excludeSet = new Set(request.excludeIds || [])
    
    // إضافة المقالات المقروءة للاستبعاد
    userProfile.behavior.readArticles.forEach(id => excludeSet.add(id))

    // 1. توصيات بناءً على التفضيلات الشخصية
    const personalizedItems = this.getPreferenceBasedRecommendations(userProfile, excludeSet, request)
    recommendations.push(...personalizedItems.slice(0, Math.ceil(request.count * 0.4)))

    // 2. توصيات تعاونية (بناءً على مستخدمين مشابهين)
    const collaborativeItems = this.getCollaborativeRecommendations(request.userId, excludeSet, request)
    recommendations.push(...collaborativeItems.slice(0, Math.ceil(request.count * 0.3)))

    // 3. محتوى مشابه للمقالات المعجب بها
    const similarItems = this.getSimilarContentRecommendations(userProfile, excludeSet, request)
    recommendations.push(...similarItems.slice(0, Math.ceil(request.count * 0.2)))

    // 4. محتوى رائج أو عاجل
    if (request.includeTrending || request.includeBreaking) {
      const trendingItems = this.getTrendingRecommendations(excludeSet, request)
      recommendations.push(...trendingItems.slice(0, Math.ceil(request.count * 0.1)))
    }

    // ترتيب النتائج حسب النقاط وإزالة التكرار
    const uniqueRecommendations = this.deduplicateRecommendations(recommendations)
    return uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, request.count)
  }

  // توصيات بناءً على التفضيلات
  private getPreferenceBasedRecommendations(
    userProfile: UserProfile, 
    excludeSet: Set<string>, 
    request: RecommendationRequest
  ): RecommendationResult[] {
    const recommendations: RecommendationResult[] = []

    for (const [itemId, item] of this.contentItems) {
      if (excludeSet.has(itemId)) continue
      
      // تصفية حسب نوع المحتوى
      if (request.contentTypes && !request.contentTypes.includes(item.type)) continue
      
      // تصفية حسب التصنيف
      if (request.categories && !request.categories.includes(item.category)) continue

      let score = 0
      const reasons: string[] = []

      // نقاط التصنيف المفضل
      const categoryIndex = userProfile.preferences.categories.indexOf(item.category)
      if (categoryIndex >= 0) {
        const categoryScore = (5 - categoryIndex) / 5 * 0.3
        score += categoryScore
        reasons.push(`تصنيف مفضل: ${item.category}`)
      }

      // نقاط المؤلف المفضل
      const authorIndex = userProfile.preferences.authors.indexOf(item.author)
      if (authorIndex >= 0) {
        const authorScore = (10 - authorIndex) / 10 * 0.2
        score += authorScore
        reasons.push(`مؤلف مفضل: ${item.author}`)
      }

      // نقاط المواضيع المفضلة
      const topicMatches = item.tags.filter(tag => userProfile.preferences.topics.includes(tag))
      if (topicMatches.length > 0) {
        const topicScore = Math.min(topicMatches.length / item.tags.length, 1) * 0.25
        score += topicScore
        reasons.push(`مواضيع مفضلة: ${topicMatches.join(', ')}`)
      }

      // نقاط وقت القراءة المناسب
      const readingTimeScore = this.getReadingTimeScore(userProfile.preferences.readingTime, item.readingTime)
      score += readingTimeScore * 0.15
      if (readingTimeScore > 0.5) {
        reasons.push('وقت قراءة مناسب')
      }

      // نقاط الجودة والتفاعل
      const qualityScore = this.calculateQualityScore(item)
      score += qualityScore * 0.1
      if (qualityScore > 0.7) {
        reasons.push('محتوى عالي الجودة')
      }

      if (score > 0.1) {
        recommendations.push({
          item,
          score,
          reasons,
          type: 'personalized'
        })
      }
    }

    return recommendations
  }

  // توصيات تعاونية
  private getCollaborativeRecommendations(
    userId: string, 
    excludeSet: Set<string>, 
    request: RecommendationRequest
  ): RecommendationResult[] {
    const recommendations: RecommendationResult[] = []
    const userSimilarities = this.userSimilarities.get(userId)
    
    if (!userSimilarities) return recommendations

    // الحصول على أكثر المستخدمين تشابهاً
    const similarUsers = Array.from(userSimilarities.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    const itemScores = new Map<string, { score: number; reasons: string[] }>()

    for (const [similarUserId, similarity] of similarUsers) {
      const similarUserProfile = this.userProfiles.get(similarUserId)
      if (!similarUserProfile) continue

      // المقالات التي أعجب بها المستخدم المشابه
      for (const likedItemId of similarUserProfile.behavior.likedArticles) {
        if (excludeSet.has(likedItemId)) continue
        
        const item = this.contentItems.get(likedItemId)
        if (!item) continue

        // تصفية حسب المعايير
        if (request.contentTypes && !request.contentTypes.includes(item.type)) continue
        if (request.categories && !request.categories.includes(item.category)) continue

        const currentScore = itemScores.get(likedItemId)?.score || 0
        const newScore = currentScore + similarity * 0.8 // وزن الإعجاب
        
        const reasons = itemScores.get(likedItemId)?.reasons || []
        reasons.push(`أعجب به مستخدم مشابه`)

        itemScores.set(likedItemId, { score: newScore, reasons })
      }

      // المقالات التي شاركها المستخدم المشابه
      for (const sharedItemId of similarUserProfile.behavior.sharedArticles) {
        if (excludeSet.has(sharedItemId)) continue
        
        const item = this.contentItems.get(sharedItemId)
        if (!item) continue

        if (request.contentTypes && !request.contentTypes.includes(item.type)) continue
        if (request.categories && !request.categories.includes(item.category)) continue

        const currentScore = itemScores.get(sharedItemId)?.score || 0
        const newScore = currentScore + similarity * 1.0 // وزن أكبر للمشاركة
        
        const reasons = itemScores.get(sharedItemId)?.reasons || []
        reasons.push(`شاركه مستخدم مشابه`)

        itemScores.set(sharedItemId, { score: newScore, reasons })
      }
    }

    // تحويل إلى توصيات
    for (const [itemId, { score, reasons }] of itemScores) {
      const item = this.contentItems.get(itemId)
      if (item) {
        recommendations.push({
          item,
          score,
          reasons,
          type: 'collaborative'
        })
      }
    }

    return recommendations
  }

  // توصيات المحتوى المشابه
  private getSimilarContentRecommendations(
    userProfile: UserProfile, 
    excludeSet: Set<string>, 
    request: RecommendationRequest
  ): RecommendationResult[] {
    const recommendations: RecommendationResult[] = []
    
    // الحصول على المقالات المعجب بها مؤخراً
    const recentLiked = userProfile.behavior.likedArticles.slice(-5)
    
    for (const likedItemId of recentLiked) {
      const likedItem = this.contentItems.get(likedItemId)
      if (!likedItem) continue

      // البحث عن محتوى مشابه
      for (const [itemId, item] of this.contentItems) {
        if (excludeSet.has(itemId) || itemId === likedItemId) continue
        
        if (request.contentTypes && !request.contentTypes.includes(item.type)) continue
        if (request.categories && !request.categories.includes(item.category)) continue

        const similarity = this.calculateContentSimilarity(likedItem, item)
        
        if (similarity > 0.3) {
          recommendations.push({
            item,
            score: similarity,
            reasons: [`مشابه لـ: ${likedItem.title}`],
            type: 'similar'
          })
        }
      }
    }

    return recommendations
  }

  // توصيات المحتوى الرائج
  private getTrendingRecommendations(
    excludeSet: Set<string>, 
    request: RecommendationRequest
  ): RecommendationResult[] {
    const recommendations: RecommendationResult[] = []
    
    for (const [itemId, item] of this.contentItems) {
      if (excludeSet.has(itemId)) continue
      
      if (request.contentTypes && !request.contentTypes.includes(item.type)) continue
      if (request.categories && !request.categories.includes(item.category)) continue

      const reasons: string[] = []
      let score = 0

      // محتوى عاجل
      if (request.includeBreaking && item.metadata.breaking) {
        score += 0.8
        reasons.push('خبر عاجل')
      }

      // محتوى رائج
      if (request.includeTrending && item.metadata.trending) {
        score += 0.6
        reasons.push('محتوى رائج')
      }

      // محتوى مميز
      if (item.metadata.featured) {
        score += 0.4
        reasons.push('محتوى مميز')
      }

      // نقاط التفاعل
      const engagementScore = this.calculateEngagementScore(item)
      score += engagementScore * 0.3
      if (engagementScore > 0.7) {
        reasons.push('تفاعل عالي')
      }

      if (score > 0.2) {
        recommendations.push({
          item,
          score,
          reasons,
          type: 'trending'
        })
      }
    }

    return recommendations
  }

  // توصيات احتياطية
  private getFallbackRecommendations(request: RecommendationRequest): RecommendationResult[] {
    const recommendations: RecommendationResult[] = []
    const excludeSet = new Set(request.excludeIds || [])

    // أحدث المحتوى عالي الجودة
    const sortedItems = Array.from(this.contentItems.values())
      .filter(item => !excludeSet.has(item.id))
      .filter(item => !request.contentTypes || request.contentTypes.includes(item.type))
      .filter(item => !request.categories || request.categories.includes(item.category))
      .sort((a, b) => {
        const scoreA = this.calculateQualityScore(a) + this.calculateEngagementScore(a)
        const scoreB = this.calculateQualityScore(b) + this.calculateEngagementScore(b)
        return scoreB - scoreA
      })

    for (const item of sortedItems.slice(0, request.count)) {
      recommendations.push({
        item,
        score: this.calculateQualityScore(item),
        reasons: ['محتوى عالي الجودة'],
        type: 'editorial'
      })
    }

    return recommendations
  }

  // حساب نقاط وقت القراءة
  private getReadingTimeScore(preference: string, actualTime: number): number {
    switch (preference) {
      case 'short':
        return actualTime <= 3 ? 1 : Math.max(0, 1 - (actualTime - 3) / 5)
      case 'medium':
        return actualTime >= 3 && actualTime <= 8 ? 1 : Math.max(0, 1 - Math.abs(actualTime - 5.5) / 5)
      case 'long':
        return actualTime >= 8 ? 1 : Math.max(0, 1 - (8 - actualTime) / 5)
      default:
        return 0.5
    }
  }

  // حساب نقاط الجودة
  private calculateQualityScore(item: ContentItem): number {
    let score = 0
    
    // طول المحتوى المناسب
    const contentLength = item.content.length
    if (contentLength > 500 && contentLength < 5000) {
      score += 0.3
    }
    
    // وجود علامات
    if (item.tags.length > 0) {
      score += 0.2
    }
    
    // حداثة المحتوى
    const daysSincePublish = (Date.now() - item.publishDate.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSincePublish < 7) {
      score += 0.3
    } else if (daysSincePublish < 30) {
      score += 0.2
    }
    
    // صعوبة مناسبة
    if (item.metadata.difficulty === 'medium') {
      score += 0.2
    }
    
    return Math.min(score, 1)
  }

  // حساب نقاط التفاعل
  private calculateEngagementScore(item: ContentItem): number {
    const { views, likes, shares, comments } = item.engagement
    
    if (views === 0) return 0
    
    const likeRate = likes / views
    const shareRate = shares / views
    const commentRate = comments / views
    
    return Math.min(likeRate * 0.4 + shareRate * 0.4 + commentRate * 0.2, 1)
  }

  // إزالة التكرار من التوصيات
  private deduplicateRecommendations(recommendations: RecommendationResult[]): RecommendationResult[] {
    const seen = new Set<string>()
    const unique: RecommendationResult[] = []
    
    for (const rec of recommendations) {
      if (!seen.has(rec.item.id)) {
        seen.add(rec.item.id)
        unique.push(rec)
      }
    }
    
    return unique
  }

  // إضافة محتوى جديد
  addContent(item: ContentItem) {
    this.contentItems.set(item.id, item)
    
    // حساب التشابهات مع المحتوى الموجود
    const similarities = new Map<string, number>()
    for (const [otherId, otherItem] of this.contentItems) {
      if (otherId !== item.id) {
        const similarity = this.calculateContentSimilarity(item, otherItem)
        if (similarity > 0.1) {
          similarities.set(otherId, similarity)
        }
      }
    }
    this.contentSimilarities.set(item.id, similarities)
  }

  // الحصول على إحصائيات التوصيات
  getRecommendationStats(userId: string): {
    profileCompleteness: number
    totalInteractions: number
    preferredCategories: string[]
    similarUsers: number
  } {
    const profile = this.userProfiles.get(userId)
    if (!profile) {
      return {
        profileCompleteness: 0,
        totalInteractions: 0,
        preferredCategories: [],
        similarUsers: 0
      }
    }

    // حساب اكتمال الملف الشخصي
    let completeness = 0
    if (profile.preferences.categories.length > 0) completeness += 0.3
    if (profile.preferences.authors.length > 0) completeness += 0.2
    if (profile.preferences.topics.length > 0) completeness += 0.2
    if (profile.behavior.readArticles.length > 0) completeness += 0.3

    const totalInteractions = 
      profile.behavior.readArticles.length +
      profile.behavior.likedArticles.length +
      profile.behavior.sharedArticles.length

    const similarUsers = this.userSimilarities.get(userId)?.size || 0

    return {
      profileCompleteness: completeness,
      totalInteractions,
      preferredCategories: profile.preferences.categories,
      similarUsers
    }
  }
}

// إنشاء مثيل مشترك
export const recommendationEngine = new RecommendationEngine()

