import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - جلب المقالات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (category) {
      where.categoryId = category
    }

    if (status) {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('خطأ في جلب المقالات:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المقالات' },
      { status: 500 }
    )
  }
}

// POST - إنشاء مقال جديد
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      categoryId,
      featuredImage,
      tags,
      status = 'DRAFT',
      publishedAt
    } = body

    // التحقق من الصلاحيات
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !['ADMIN', 'EDITOR', 'SYSTEM_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لإنشاء المقالات' },
        { status: 403 }
      )
    }

    // إنشاء المقال
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const article = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        authorId: session.user.id,
        featuredImage,
        tags: tags || [],
        status,
        publishedAt: status === 'PUBLISHED' ? publishedAt || new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('خطأ في إنشاء المقال:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء المقال' },
      { status: 500 }
    )
  }
}

