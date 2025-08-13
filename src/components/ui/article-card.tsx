import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Eye, MessageCircle, Heart } from 'lucide-react'

interface ArticleCardProps {
  id: string
  title: string
  excerpt?: string
  featuredImage?: string
  category: {
    name: string
    nameAr: string
    slug: string
    color: string
  }
  author: {
    name: string
    avatar?: string
  }
  publishedAt: Date
  readingTime?: number
  viewsCount: number
  likesCount: number
  commentsCount: number
  variant?: 'default' | 'featured' | 'compact'
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  featuredImage,
  category,
  author,
  publishedAt,
  readingTime,
  viewsCount,
  likesCount,
  commentsCount,
  variant = 'default'
}: ArticleCardProps) {
  const articleUrl = `/article/${id}`
  
  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="relative">
          {featuredImage && (
            <div className="relative h-64 sm:h-80">
              <Image
                src={featuredImage}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}
          
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Badge 
              className="mb-2" 
              style={{ backgroundColor: category.color }}
            >
              {category.nameAr}
            </Badge>
            <Link href={articleUrl}>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 hover:text-blue-200 transition-colors line-clamp-2">
                {title}
              </h2>
            </Link>
            {excerpt && (
              <p className="text-gray-200 text-sm line-clamp-2 mb-2">
                {excerpt}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <span>{author.name}</span>
                <span>
                  {formatDistanceToNow(publishedAt, { addSuffix: true, locale: ar })}
                </span>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {readingTime && (
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Clock className="w-3 h-3" />
                    <span>{readingTime} د</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <Eye className="w-3 h-3" />
                  <span>{viewsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex space-x-4 rtl:space-x-reverse">
            {featuredImage && (
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={featuredImage}
                  alt={title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Badge 
                className="mb-1 text-xs" 
                style={{ backgroundColor: category.color }}
              >
                {category.nameAr}
              </Badge>
              <Link href={articleUrl}>
                <h3 className="font-semibold text-sm hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                  {title}
                </h3>
              </Link>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {formatDistanceToNow(publishedAt, { addSuffix: true, locale: ar })}
                </span>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <Eye className="w-3 h-3" />
                    <span>{viewsCount}</span>
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <MessageCircle className="w-3 h-3" />
                    <span>{commentsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      {featuredImage && (
        <div className="relative h-48">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="p-4">
        <Badge 
          className="mb-2" 
          style={{ backgroundColor: category.color }}
        >
          {category.nameAr}
        </Badge>
        
        <Link href={articleUrl}>
          <h3 className="font-bold text-lg hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
        </Link>
        
        {excerpt && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <span>{author.name}</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(publishedAt, { addSuffix: true, locale: ar })}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {readingTime && (
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <Clock className="w-3 h-3" />
                <span>{readingTime} د</span>
              </div>
            )}
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Eye className="w-3 h-3" />
              <span>{viewsCount}</span>
            </div>
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <Heart className="w-3 h-3" />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <MessageCircle className="w-3 h-3" />
              <span>{commentsCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

