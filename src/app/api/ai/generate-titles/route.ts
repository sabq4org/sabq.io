import { NextRequest, NextResponse } from 'next/server'
import { aiAssistant } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const { content, count = 5 } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب' },
        { status: 400 }
      )
    }

    const titles = await aiAssistant.generateTitles(content, count)

    return NextResponse.json({
      success: true,
      titles
    })
  } catch (error) {
    console.error('خطأ في توليد العناوين:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في توليد العناوين' },
      { status: 500 }
    )
  }
}

