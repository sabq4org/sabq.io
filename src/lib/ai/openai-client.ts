import OpenAI from 'openai'

// إعداد عميل OpenAI
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
})

// أنواع البيانات للذكاء الاصطناعي
export interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  keywords: string[]
  summary: string
  readabilityScore: number
  suggestedTags: string[]
  estimatedReadTime: number
}

export interface AIContentSuggestion {
  title: string
  excerpt: string
  content: string
  tags: string[]
  category: string
}

// مساعد المحتوى بالذكاء الاصطناعي
export class AIContentAssistant {
  
  // توليد عناوين ذكية
  async generateTitles(content: string, count: number = 5): Promise<string[]> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `أنت محرر أخبار عربي محترف في صحيفة سبق. مهمتك توليد عناوين جذابة ومناسبة للمحتوى العربي.
            
            المعايير:
            - العناوين يجب أن تكون باللغة العربية الفصحى
            - جذابة ومثيرة للاهتمام
            - دقيقة وتعكس المحتوى
            - مناسبة للجمهور العربي
            - طولها بين 5-12 كلمة`
          },
          {
            role: 'user',
            content: `اكتب ${count} عناوين مختلفة لهذا المحتوى:\n\n${content.substring(0, 1000)}`
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })

      const titles = response.choices[0]?.message?.content
        ?.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(title => title.length > 0) || []

      return titles.slice(0, count)
    } catch (error) {
      console.error('خطأ في توليد العناوين:', error)
      return []
    }
  }

  // تلخيص المقالات
  async summarizeArticle(content: string, maxLength: number = 150): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `أنت محرر أخبار عربي محترف. مهمتك كتابة ملخصات دقيقة وجذابة للمقالات.
            
            المعايير:
            - الملخص باللغة العربية الفصحى
            - يحتوي على النقاط الرئيسية
            - جذاب ومشوق للقراءة
            - لا يتجاوز ${maxLength} حرف
            - يحافظ على روح المقال الأصلي`
          },
          {
            role: 'user',
            content: `اكتب ملخصاً لهذا المقال:\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: Math.ceil(maxLength / 2)
      })

      return response.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      console.error('خطأ في تلخيص المقال:', error)
      return ''
    }
  }

  // تحسين النبرة والأسلوب
  async improveTone(content: string, targetTone: 'formal' | 'casual' | 'professional' | 'engaging'): Promise<string> {
    const toneDescriptions = {
      formal: 'رسمي ومهني',
      casual: 'ودود وقريب من القارئ',
      professional: 'احترافي ومتخصص',
      engaging: 'جذاب ومثير للاهتمام'
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `أنت محرر أخبار عربي محترف. مهمتك تحسين النبرة والأسلوب للمحتوى العربي.
            
            النبرة المطلوبة: ${toneDescriptions[targetTone]}
            
            المعايير:
            - الحفاظ على المعنى الأصلي
            - تحسين الأسلوب والنبرة
            - استخدام اللغة العربية الفصحى
            - جعل النص أكثر جاذبية
            - الحفاظ على الطول تقريباً`
          },
          {
            role: 'user',
            content: `حسّن نبرة وأسلوب هذا النص:\n\n${content}`
          }
        ],
        temperature: 0.6,
        max_tokens: Math.ceil(content.length * 1.2)
      })

      return response.choices[0]?.message?.content?.trim() || content
    } catch (error) {
      console.error('خطأ في تحسين النبرة:', error)
      return content
    }
  }

  // تحليل المحتوى الشامل
  async analyzeContent(content: string): Promise<AIAnalysisResult> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `أنت محلل محتوى عربي متخصص. حلل المحتوى وأعطِ النتائج بصيغة JSON.
            
            المطلوب:
            {
              "sentiment": "positive|negative|neutral",
              "keywords": ["كلمة1", "كلمة2", ...],
              "summary": "ملخص قصير",
              "readabilityScore": رقم من 1-10,
              "suggestedTags": ["تاغ1", "تاغ2", ...],
              "estimatedReadTime": عدد الدقائق
            }`
          },
          {
            role: 'user',
            content: `حلل هذا المحتوى:\n\n${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })

      const result = response.choices[0]?.message?.content?.trim()
      if (result) {
        try {
          return JSON.parse(result)
        } catch {
          // إذا فشل التحليل، أعطِ نتائج افتراضية
          return this.getDefaultAnalysis(content)
        }
      }
      
      return this.getDefaultAnalysis(content)
    } catch (error) {
      console.error('خطأ في تحليل المحتوى:', error)
      return this.getDefaultAnalysis(content)
    }
  }

  // توليد اقتراحات محتوى
  async generateContentSuggestions(topic: string, category: string): Promise<AIContentSuggestion[]> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `أنت محرر أخبار عربي محترف في صحيفة سبق. اقترح 3 مقالات حول الموضوع المطلوب.
            
            أعطِ النتائج بصيغة JSON:
            [
              {
                "title": "العنوان",
                "excerpt": "المقدمة",
                "content": "المحتوى الكامل",
                "tags": ["تاغ1", "تاغ2"],
                "category": "التصنيف"
              }
            ]`
          },
          {
            role: 'user',
            content: `اقترح مقالات حول: ${topic} في تصنيف: ${category}`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      })

      const result = response.choices[0]?.message?.content?.trim()
      if (result) {
        try {
          return JSON.parse(result)
        } catch {
          return []
        }
      }
      
      return []
    } catch (error) {
      console.error('خطأ في توليد اقتراحات المحتوى:', error)
      return []
    }
  }

  // نتائج افتراضية للتحليل
  private getDefaultAnalysis(content: string): AIAnalysisResult {
    const wordCount = content.split(' ').length
    const estimatedReadTime = Math.ceil(wordCount / 200) // 200 كلمة في الدقيقة
    
    return {
      sentiment: 'neutral',
      keywords: [],
      summary: content.substring(0, 150) + '...',
      readabilityScore: 7,
      suggestedTags: [],
      estimatedReadTime
    }
  }
}

// إنشاء مثيل مشترك
export const aiAssistant = new AIContentAssistant()

