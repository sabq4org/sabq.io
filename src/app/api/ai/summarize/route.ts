import { NextRequest, NextResponse } from 'next/server'
import { aiAssistant } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const { content, maxLength = 150 } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب' },
        { status: 400 }
      )
    }

    const summary = await aiAssistant.summarizeArticle(content, maxLength)

    return NextResponse.json({
      success: true,
      summary
    })
  } catch (error) {
    console.error('خطأ في تلخيص المحتوى:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تلخيص المحتوى' },
      { status: 500 }
    )
  }
}

