import { NextRequest, NextResponse } from 'next/server'
import { aiAssistant } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب' },
        { status: 400 }
      )
    }

    const analysis = await aiAssistant.analyzeContent(content)

    return NextResponse.json({
      success: true,
      analysis
    })
  } catch (error) {
    console.error('خطأ في تحليل المحتوى:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحليل المحتوى' },
      { status: 500 }
    )
  }
}

