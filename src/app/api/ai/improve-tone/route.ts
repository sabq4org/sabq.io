import { NextRequest, NextResponse } from 'next/server'
import { aiAssistant } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const { content, targetTone = 'professional' } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'المحتوى مطلوب' },
        { status: 400 }
      )
    }

    const validTones = ['formal', 'casual', 'professional', 'engaging']
    if (!validTones.includes(targetTone)) {
      return NextResponse.json(
        { success: false, error: 'نبرة غير صحيحة' },
        { status: 400 }
      )
    }

    const improvedContent = await aiAssistant.improveTone(content, targetTone)

    return NextResponse.json({
      success: true,
      improvedContent
    })
  } catch (error) {
    console.error('خطأ في تحسين النبرة:', error)
    return NextResponse.json(
      { success: false, error: 'فشل في تحسين النبرة' },
      { status: 500 }
    )
  }
}

