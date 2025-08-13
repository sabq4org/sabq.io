import { PrismaClient, Role, PostType, PostStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إضافة البيانات التجريبية...')

  // إنشاء مستخدم المدير الأساسي
  const hashedPassword = await bcrypt.hash('admin123456', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sabq.org' },
    update: {},
    create: {
      email: 'admin@sabq.org',
      username: 'admin',
      name: 'مدير النظام',
      password: hashedPassword,
      role: Role.SYSTEM_ADMIN,
      isVerified: true,
      isActive: true,
    },
  })

  console.log('✅ تم إنشاء مستخدم المدير:', adminUser.email)

  // إنشاء محرر
  const editorPassword = await bcrypt.hash('editor123456', 12)
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@sabq.org' },
    update: {},
    create: {
      email: 'editor@sabq.org',
      username: 'editor',
      name: 'محرر سبق',
      password: editorPassword,
      role: Role.EDITOR,
      isVerified: true,
      isActive: true,
    },
  })

  console.log('✅ تم إنشاء المحرر:', editorUser.email)

  // إنشاء التصنيفات
  const categories = [
    {
      name: 'Local News',
      nameAr: 'الأخبار المحلية',
      slug: 'local',
      description: 'أخبار المملكة العربية السعودية',
      color: '#0ea5e9',
      icon: '🏠',
      displayOrder: 1,
    },
    {
      name: 'International',
      nameAr: 'دولي',
      slug: 'international',
      description: 'الأخبار العالمية والدولية',
      color: '#10b981',
      icon: '🌍',
      displayOrder: 2,
    },
    {
      name: 'Economy',
      nameAr: 'اقتصاد',
      slug: 'economy',
      description: 'الأخبار الاقتصادية والمالية',
      color: '#f59e0b',
      icon: '💰',
      displayOrder: 3,
    },
    {
      name: 'Sports',
      nameAr: 'رياضة',
      slug: 'sports',
      description: 'الأخبار الرياضية',
      color: '#ef4444',
      icon: '⚽',
      displayOrder: 4,
    },
    {
      name: 'Technology',
      nameAr: 'تقنية',
      slug: 'technology',
      description: 'أخبار التقنية والتكنولوجيا',
      color: '#8b5cf6',
      icon: '💻',
      displayOrder: 5,
    },
    {
      name: 'Health',
      nameAr: 'صحة',
      slug: 'health',
      description: 'الأخبار الصحية والطبية',
      color: '#06b6d4',
      icon: '🏥',
      displayOrder: 6,
    },
  ]

  const createdCategories = []
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories.push(createdCategory)
  }

  console.log('✅ تم إنشاء التصنيفات:', createdCategories.length)

  // إنشاء مقالات تجريبية
  const samplePosts = [
    {
      title: 'المملكة تطلق مشروع نيوم الجديد للمدن الذكية',
      slug: 'neom-smart-cities-project',
      excerpt: 'أعلنت المملكة العربية السعودية عن إطلاق مشروع نيوم الجديد للمدن الذكية ضمن رؤية 2030',
      content: `
        <h2>مشروع نيوم: نقلة نوعية في المدن الذكية</h2>
        <p>أعلنت المملكة العربية السعودية عن إطلاق مشروع نيوم الجديد للمدن الذكية، والذي يعد جزءاً من رؤية المملكة 2030 الطموحة لتنويع الاقتصاد وبناء مستقبل مستدام.</p>
        
        <h3>أهداف المشروع</h3>
        <p>يهدف مشروع نيوم إلى:</p>
        <ul>
          <li>إنشاء مدينة ذكية متطورة تعتمد على التقنيات الحديثة</li>
          <li>توفير فرص عمل جديدة للشباب السعودي</li>
          <li>جذب الاستثمارات الأجنبية</li>
          <li>تطوير قطاعات جديدة في الاقتصاد السعودي</li>
        </ul>
        
        <h3>التقنيات المستخدمة</h3>
        <p>سيعتمد المشروع على أحدث التقنيات مثل الذكاء الاصطناعي، إنترنت الأشياء، والطاقة المتجددة لإنشاء بيئة حضرية مستدامة ومتطورة.</p>
        
        <p>من المتوقع أن يساهم هذا المشروع في تحقيق أهداف رؤية 2030 وتعزيز مكانة المملكة كمركز عالمي للابتكار والتقنية.</p>
      `,
      type: PostType.NEWS,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      readingTime: 3,
      tags: ['نيوم', 'رؤية 2030', 'المدن الذكية', 'التقنية'],
      categoryId: createdCategories[0].id, // محلي
      authorId: adminUser.id,
    },
    {
      title: 'الذكاء الاصطناعي يغير وجه الصحافة العربية',
      slug: 'ai-transforming-arabic-journalism',
      excerpt: 'كيف تستخدم وسائل الإعلام العربية الذكاء الاصطناعي لتطوير المحتوى وتحسين تجربة القراء',
      content: `
        <h2>ثورة الذكاء الاصطناعي في الإعلام العربي</h2>
        <p>تشهد وسائل الإعلام العربية تطوراً كبيراً في استخدام تقنيات الذكاء الاصطناعي لتحسين جودة المحتوى وتطوير تجربة القراء.</p>
        
        <h3>التطبيقات الحالية</h3>
        <p>تشمل التطبيقات الحالية للذكاء الاصطناعي في الإعلام العربي:</p>
        <ul>
          <li>التلخيص التلقائي للأخبار</li>
          <li>ترجمة المحتوى بين اللغات</li>
          <li>تحليل المشاعر والآراء</li>
          <li>إنتاج المحتوى المرئي والصوتي</li>
        </ul>
        
        <h3>التحديات والفرص</h3>
        <p>رغم الفوائد الكبيرة، تواجه وسائل الإعلام العربية تحديات في تطبيق هذه التقنيات، مثل الحاجة إلى تدريب الكوادر وتطوير النماذج المتخصصة في اللغة العربية.</p>
        
        <p>مع ذلك، تفتح هذه التقنيات آفاقاً جديدة لتطوير الإعلام العربي وجعله أكثر تفاعلاً وفعالية في خدمة الجمهور.</p>
      `,
      type: PostType.ARTICLE,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // أمس
      readingTime: 4,
      tags: ['الذكاء الاصطناعي', 'الإعلام', 'التقنية', 'الصحافة'],
      categoryId: createdCategories[4].id, // تقنية
      authorId: editorUser.id,
    },
    {
      title: 'نمو الاقتصاد السعودي يتجاوز التوقعات في الربع الثالث',
      slug: 'saudi-economy-growth-q3',
      excerpt: 'تشير البيانات الأولية إلى نمو الاقتصاد السعودي بنسبة تفوق التوقعات خلال الربع الثالث من العام',
      content: `
        <h2>الاقتصاد السعودي يحقق نمواً قوياً</h2>
        <p>أظهرت البيانات الأولية الصادرة عن الهيئة العامة للإحصاء نمو الاقتصاد السعودي بوتيرة أسرع من المتوقع خلال الربع الثالث من العام الحالي.</p>
        
        <h3>القطاعات الرائدة</h3>
        <p>ساهمت عدة قطاعات في هذا النمو المتميز:</p>
        <ul>
          <li>القطاع غير النفطي: نمو بنسبة 4.3%</li>
          <li>قطاع الخدمات: زيادة 5.1%</li>
          <li>القطاع الصناعي: نمو 3.8%</li>
          <li>قطاع السياحة: زيادة 12.5%</li>
        </ul>
        
        <h3>العوامل المؤثرة</h3>
        <p>يعزى هذا النمو إلى عدة عوامل منها تنفيذ مشاريع رؤية 2030، وزيادة الاستثمارات في القطاعات الجديدة، وتحسن الأوضاع الاقتصادية العالمية.</p>
        
        <p>من المتوقع أن يستمر هذا النمو الإيجابي في الأرباع القادمة مع استمرار تنفيذ الإصلاحات الاقتصادية والاستثمار في القطاعات الواعدة.</p>
      `,
      type: PostType.NEWS,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // قبل يومين
      readingTime: 3,
      tags: ['الاقتصاد', 'النمو', 'رؤية 2030', 'الإحصاء'],
      categoryId: createdCategories[2].id, // اقتصاد
      authorId: adminUser.id,
    },
    {
      title: 'الهلال يتأهل لنهائي دوري أبطال آسيا',
      slug: 'al-hilal-asia-champions-league-final',
      excerpt: 'فريق الهلال السعودي يحقق إنجازاً تاريخياً بالتأهل لنهائي دوري أبطال آسيا للمرة الخامسة في تاريخه',
      content: `
        <h2>الهلال يصنع التاريخ مجدداً</h2>
        <p>حقق فريق الهلال السعودي إنجازاً تاريخياً جديداً بتأهله لنهائي دوري أبطال آسيا للمرة الخامسة في تاريخه، بعد فوزه في مباراة الإياب أمس.</p>
        
        <h3>مسيرة التأهل</h3>
        <p>خاض الهلال مسيرة رائعة في البطولة:</p>
        <ul>
          <li>دور المجموعات: الصدارة بـ 16 نقطة</li>
          <li>دور الـ16: فوز مقنع على فريق قطري</li>
          <li>ربع النهائي: تأهل درامي بركلات الترجيح</li>
          <li>نصف النهائي: فوز مستحق بمجموع المباراتين</li>
        </ul>
        
        <h3>النهائي المرتقب</h3>
        <p>سيواجه الهلال في النهائي فريقاً قوياً، وسيسعى لإضافة اللقب الخامس لخزائنه في هذه البطولة المرموقة.</p>
        
        <p>يأمل جماهير الهلال في تحقيق حلم اللقب الآسيوي الجديد، خاصة مع الأداء المميز الذي يقدمه الفريق هذا الموسم.</p>
      `,
      type: PostType.NEWS,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // قبل 3 ساعات
      readingTime: 2,
      tags: ['الهلال', 'دوري أبطال آسيا', 'كرة القدم', 'الرياضة السعودية'],
      categoryId: createdCategories[3].id, // رياضة
      authorId: editorUser.id,
    },
    {
      title: 'دراسة جديدة تكشف فوائد الصيام المتقطع للصحة',
      slug: 'intermittent-fasting-health-benefits-study',
      excerpt: 'بحث علمي حديث يؤكد الفوائد الصحية المتعددة للصيام المتقطع في الوقاية من الأمراض المزمنة',
      content: `
        <h2>الصيام المتقطع: فوائد علمية مثبتة</h2>
        <p>كشفت دراسة علمية حديثة نشرت في مجلة طبية مرموقة عن الفوائد الصحية المتعددة للصيام المتقطع في الوقاية من الأمراض المزمنة وتحسين الصحة العامة.</p>
        
        <h3>نتائج الدراسة</h3>
        <p>أظهرت الدراسة التي شملت أكثر من 1000 مشارك النتائج التالية:</p>
        <ul>
          <li>تحسن في مستويات السكر في الدم بنسبة 15%</li>
          <li>انخفاض في ضغط الدم بمعدل 10 نقاط</li>
          <li>تحسن في وظائف القلب والأوعية الدموية</li>
          <li>زيادة في مستويات الطاقة والتركيز</li>
        </ul>
        
        <h3>آلية العمل</h3>
        <p>يعمل الصيام المتقطع على تحفيز عمليات الإصلاح الخلوي وتحسين حساسية الأنسولين، مما يساعد الجسم على التعامل بشكل أفضل مع الطعام والطاقة.</p>
        
        <h3>توصيات الخبراء</h3>
        <p>ينصح الخبراء بضرورة استشارة الطبيب قبل البدء في أي نظام صيام، خاصة للأشخاص الذين يعانون من حالات صحية مزمنة.</p>
      `,
      type: PostType.ARTICLE,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // قبل 6 ساعات
      readingTime: 4,
      tags: ['الصحة', 'الصيام المتقطع', 'الطب', 'التغذية'],
      categoryId: createdCategories[5].id, // صحة
      authorId: adminUser.id,
    },
  ]

  const createdPosts = []
  for (const post of samplePosts) {
    const createdPost = await prisma.post.create({
      data: post,
    })
    createdPosts.push(createdPost)
  }

  console.log('✅ تم إنشاء المقالات التجريبية:', createdPosts.length)

  // إنشاء بعض التعليقات التجريبية
  const sampleComments = [
    {
      content: 'مقال رائع ومفيد جداً، شكراً لكم على هذه المعلومات القيمة',
      postId: createdPosts[0].id,
      authorId: editorUser.id,
      isApproved: true,
    },
    {
      content: 'هل يمكن توضيح المزيد حول التقنيات المستخدمة في المشروع؟',
      postId: createdPosts[0].id,
      authorId: adminUser.id,
      isApproved: true,
    },
    {
      content: 'موضوع مهم جداً، خاصة مع التطور السريع في مجال الذكاء الاصطناعي',
      postId: createdPosts[1].id,
      authorId: adminUser.id,
      isApproved: true,
    },
  ]

  for (const comment of sampleComments) {
    await prisma.comment.create({
      data: comment,
    })
  }

  console.log('✅ تم إنشاء التعليقات التجريبية')

  // إنشاء إعدادات النظام
  const settings = [
    { key: 'site_name', value: 'سبق الذكية', category: 'general' },
    { key: 'site_description', value: 'بوابة الأخبار العربية الذكية', category: 'general' },
    { key: 'posts_per_page', value: '20', type: 'number', category: 'content' },
    { key: 'enable_comments', value: 'true', type: 'boolean', category: 'content' },
    { key: 'enable_ai_features', value: 'true', type: 'boolean', category: 'ai' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }

  console.log('✅ تم إنشاء إعدادات النظام')

  console.log('🎉 تم الانتهاء من إضافة البيانات التجريبية بنجاح!')
  console.log('📧 بيانات تسجيل الدخول:')
  console.log('   المدير: admin@sabq.org / admin123456')
  console.log('   المحرر: editor@sabq.org / editor123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

