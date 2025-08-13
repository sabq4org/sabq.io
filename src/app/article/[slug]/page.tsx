import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Layout from '@/components/layout/Layout'
import { 
  Clock, 
  Eye, 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark,
  User,
  Calendar,
  Tag
} from 'lucide-react'
import { prisma } from '@/lib/db'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

async function getArticle(slug: string) {
  try {
    const article = await prisma.post.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug }
        ],
        status: 'PUBLISHED'
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
            slug: true,
            color: true
          }
        },
        comments: {
          where: {
            status: 'APPROVED'
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    if (!article) {
      return null
    }

    // يمكن إضافة تحديث المشاهدات لاحقاً
    // await prisma.post.update({
    //   where: { id: article.id },
    //   data: {
    //     views: {
    //       increment: 1
    //     }
    //   }
    // })

    return article
  } catch (error) {
    console.error('خطأ في جلب المقال:', error)
    return null
  }
}

async function getRelatedArticles(categoryId: string, currentArticleId: string) {
  try {
    return await prisma.post.findMany({
      where: {
        categoryId,
        id: {
          not: currentArticleId
        },
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    })
  } catch (error) {
    console.error('خطأ في جلب المقالات ذات الصلة:', error)
    return []
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.categoryId, article.id)

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* التصنيف */}
          <div className="mb-4">
            <Link href={`/category/${article.category.slug}`}>
              <Badge 
                variant="secondary" 
                className="text-sm"
                style={{ backgroundColor: article.category.color + '20', color: article.category.color }}
              >
                {article.category.name}
              </Badge>
            </Link>
          </div>

          {/* العنوان */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* الملخص */}
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* معلومات المقال */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>بواسطة {article.author.name || 'مؤلف غير معروف'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{format(new Date(article.publishedAt!), 'dd MMMM yyyy', { locale: ar })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>5 دقائق قراءة</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              <span>0 مشاهدة</span>
            </div>
          </div>

          {/* أزرار التفاعل */}
          <div className="flex items-center gap-4 pb-6 border-b">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              إعجاب (0)
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              تعليق ({article._count.comments})
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              مشاركة
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              حفظ
            </Button>
          </div>
        </header>

        {/* الصورة المميزة */}
        {article.featuredImage && (
          <div className="mb-8">
            <Image
              src={article.featuredImage}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* محتوى المقال */}
        <div className="prose prose-lg max-w-none prose-arabic mb-12">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* الكلمات المفتاحية */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              الكلمات المفتاحية
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* معلومات الكاتب */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4 rtl:space-x-reverse">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                {article.author.avatar ? (
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name || 'المؤلف'}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {article.author.name || 'مؤلف غير معروف'}
                </h3>
                <Button variant="outline" size="sm">
                  عرض المزيد من المقالات
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* المقالات ذات الصلة */}
        {relatedArticles.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">مقالات ذات صلة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <Link href={`/article/${relatedArticle.slug}`}>
                      {relatedArticle.featuredImage && (
                        <Image
                          src={relatedArticle.featuredImage}
                          alt={relatedArticle.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          بواسطة {relatedArticle.author.name || 'مؤلف غير معروف'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(relatedArticle.publishedAt!), 'dd MMM yyyy', { locale: ar })}
                        </p>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* قسم التعليقات */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            التعليقات ({article._count.comments})
          </h2>
          
          {/* نموذج إضافة تعليق */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">إضافة تعليق</h3>
              <div className="space-y-4">
                <textarea
                  placeholder="اكتب تعليقك هنا..."
                  className="w-full p-3 border rounded-lg resize-none h-24"
                />
                <Button>نشر التعليق</Button>
              </div>
            </CardContent>
          </Card>

          {/* عرض التعليقات */}
          <div className="space-y-6">
            {article.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {comment.author.avatar ? (
                        <Image
                          src={comment.author.avatar}
                          alt={comment.author.name || 'المعلق'}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                        <h4 className="font-semibold text-gray-900">{comment.author.name || 'معلق غير معروف'}</h4>
                        <span className="text-sm text-gray-500">
                          {format(new Date(comment.createdAt), 'dd MMM yyyy', { locale: ar })}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </article>
    </Layout>
  )
}

