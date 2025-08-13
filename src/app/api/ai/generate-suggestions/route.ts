import { NextRequest, NextResponse } from 'next/server'
import { aiAssistant } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const { topic, category } = await request.json()

    if (!topic || typeof topic !== 'string' || !category || typeof category !== 'string') {
      return NextResponse.json(
        { success: false, error: 'الموضوع والتصنيف مطلوبان' },
        { status: 400 }
      )
    }

    const suggestions = await aiAssistant.generateContentSuggestions(topic, category)

    return NextResponse.json({
      success: true,
      suggestions
    })
  } catch (error) {
    console.error('خطأ في توليد اقتراحات المحتوى:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في توليد اقتراحات المحتوى' },
      { status: 500 }
    )
  }
}

