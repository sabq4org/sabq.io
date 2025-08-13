import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const officialCategories = [
  {
    name: 'محليات',
    nameAr: 'محليات',
    slug: 'local',
    description: 'أخبار المناطق والمدن السعودية',
    color: '#3B82F6',
    icon: '🗺️',
    displayOrder: 1,
    isActive: true
  },
  {
    name: 'العالم',
    nameAr: 'العالم',
    slug: 'world',
    description: 'أخبار العالم والتحليلات الدولية',
    color: '#6366F1',
    icon: '🌍',
    displayOrder: 2,
    isActive: true
  },
  {
    name: 'حياتنا',
    nameAr: 'حياتنا',
    slug: 'life',
    description: 'نمط الحياة، الصحة، الأسرة والمجتمع',
    color: '#F472B6',
    icon: '🌱',
    displayOrder: 3,
    isActive: true
  },
  {
    name: 'محطات',
    nameAr: 'محطات',
    slug: 'stations',
    description: 'تقارير خاصة وملفات متنوعة',
    color: '#FBBF24',
    icon: '🛤️',
    displayOrder: 4,
    isActive: true
  },
  {
    name: 'رياضة',
    nameAr: 'رياضة',
    slug: 'sports',
    description: 'أخبار رياضية محلية وعالمية',
    color: '#F59E0B',
    icon: '⚽',
    displayOrder: 5,
    isActive: true
  },
  {
    name: 'سياحة',
    nameAr: 'سياحة',
    slug: 'tourism',
    description: 'تقارير سياحية ومواقع مميزة',
    color: '#34D399',
    icon: '🧳',
    displayOrder: 6,
    isActive: true
  },
  {
    name: 'أعمال',
    nameAr: 'أعمال',
    slug: 'business',
    description: 'أخبار الأعمال والشركات وريادة الأعمال',
    color: '#10B981',
    icon: '💼',
    displayOrder: 7,
    isActive: true
  },
  {
    name: 'تقنية',
    nameAr: 'تقنية',
    slug: 'technology',
    description: 'أخبار وتطورات التقنية والذكاء الاصطناعي',
    color: '#8B5CF6',
    icon: '💻',
    displayOrder: 8,
    isActive: true
  },
  {
    name: 'سيارات',
    nameAr: 'سيارات',
    slug: 'cars',
    description: 'أخبار وتقارير السيارات',
    color: '#0EA5E9',
    icon: '🚗',
    displayOrder: 9,
    isActive: true
  },
  {
    name: 'ميديا',
    nameAr: 'ميديا',
    slug: 'media',
    description: 'فيديوهات وصور وإعلام رقمي',
    color: '#EAB308',
    icon: '🎬',
    displayOrder: 10,
    isActive: true
  }
]

async function updateCategories() {
  console.log('🔄 بدء تحديث التصنيفات الرسمية...')

  try {
    // حذف المقالات أولاً لتجنب قيود المفاتيح الخارجية
    await prisma.post.deleteMany({})
    console.log('🗑️ تم حذف المقالات القديمة')

    // حذف التصنيفات القديمة
    await prisma.category.deleteMany({})
    console.log('🗑️ تم حذف التصنيفات القديمة')

    // إضافة التصنيفات الرسمية الجديدة
    for (const category of officialCategories) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ تم إنشاء تصنيف: ${category.name}`)
    }

    console.log('🎉 تم تحديث جميع التصنيفات بنجاح!')
    console.log(`📊 إجمالي التصنيفات: ${officialCategories.length}`)

  } catch (error) {
    console.error('❌ خطأ في تحديث التصنيفات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCategories()

