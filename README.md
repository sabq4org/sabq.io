# سبق الذكية | Sabq Smart News

<div align="center">
  <img src="https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=سبق+الذكية" alt="سبق الذكية" />
  
  **بوابة الأخبار العربية الذكية المتكاملة**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
</div>

## 🌟 نظرة عامة

**سبق الذكية** هي بوابة أخبار عربية متطورة تجمع بين التصميم العصري والتقنيات المتقدمة لتقديم تجربة إخبارية فريدة. تم تطوير المنصة باستخدام أحدث التقنيات مع التركيز على الأداء والأمان وسهولة الاستخدام.

### ✨ المميزات الرئيسية

- 🧠 **نظام الذكاء الاصطناعي المتكامل** - مساعد المحتوى وتوليد العناوين والتحليل الذكي
- 🎨 **نظام الثيمات المتقدم** - 6 ثيمات احترافية مع جدولة تلقائية
- 🎙️ **محرر البودكاست المتطور** - تسجيل ومعالجة وإدارة المحتوى الصوتي
- 🤖 **محرك التوصيات الذكي** - توصيات مخصصة بناءً على سلوك المستخدم
- 👥 **التحرير التعاوني** - تحرير متعدد المستخدمين في الوقت الفعلي
- 📊 **لوحة تحكم متقدمة** - مراقبة شاملة للنظام والخدمات
- 🔐 **نظام مصادقة آمن** - NextAuth.js مع أدوار متعددة
- 📱 **تصميم متجاوب** - يعمل بشكل مثالي على جميع الأجهزة
- 🌐 **دعم RTL كامل** - مصمم خصيصاً للغة العربية

## 🚀 التقنيات المستخدمة

### Frontend
- **Next.js 15** - إطار عمل React متقدم
- **TypeScript** - لغة برمجة مطورة مع أنواع البيانات
- **Tailwind CSS 4.0** - إطار عمل CSS حديث
- **Shadcn/UI** - مكتبة مكونات UI متقدمة
- **Framer Motion** - مكتبة الحركة والانتقالات
- **Recharts** - مكتبة الرسوم البيانية

### Backend
- **Prisma ORM** - أداة إدارة قاعدة البيانات
- **PostgreSQL** - قاعدة بيانات متقدمة
- **NextAuth.js** - نظام المصادقة
- **OpenAI API** - خدمات الذكاء الاصطناعي

### DevOps & Tools
- **ESLint** - فحص جودة الكود
- **Prettier** - تنسيق الكود
- **Husky** - Git hooks
- **TypeScript** - فحص الأنواع

## 📦 التثبيت والإعداد

### المتطلبات الأساسية

- Node.js 18.0 أو أحدث
- npm أو yarn أو pnpm
- PostgreSQL 14 أو أحدث
- Git

### خطوات التثبيت

1. **استنساخ المستودع**
```bash
git clone https://github.com/sabq4org/sabq.io.git
cd sabq.io
```

2. **تثبيت التبعيات**
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

3. **إعداد متغيرات البيئة**
```bash
cp .env.example .env.local
```

قم بتحديث الملف `.env.local` بالقيم المناسبة:

```env
# قاعدة البيانات
DATABASE_URL="postgresql://username:password@localhost:5432/sabq_smart_news"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"
OPENAI_API_BASE="https://api.openai.com/v1"

# Cloudinary (اختياري)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. **إعداد قاعدة البيانات**
```bash
# إنشاء وتطبيق المخططات
npx prisma migrate dev --name init

# إضافة البيانات التجريبية
npx prisma db seed
```

5. **تشغيل المشروع**
```bash
npm run dev
# أو
yarn dev
# أو
pnpm dev
```

المشروع سيكون متاحاً على: `http://localhost:3000`

## 🔧 الأوامر المتاحة

```bash
# تطوير
npm run dev          # تشغيل خادم التطوير
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل المشروع المبني
npm run lint         # فحص جودة الكود
npm run type-check   # فحص أنواع TypeScript

# قاعدة البيانات
npx prisma studio    # واجهة إدارة قاعدة البيانات
npx prisma migrate   # تطبيق التغييرات على قاعدة البيانات
npx prisma generate  # توليد عميل Prisma
npx prisma db seed   # إضافة البيانات التجريبية
```

## 📁 هيكل المشروع

```
sabq-smart-news/
├── prisma/                 # مخططات قاعدة البيانات
│   ├── schema.prisma      # تعريف النماذج
│   └── seed.ts           # البيانات التجريبية
├── public/                # الملفات العامة
├── src/
│   ├── app/              # صفحات Next.js App Router
│   │   ├── admin/        # لوحة التحكم الإدارية
│   │   ├── api/          # API Routes
│   │   └── auth/         # صفحات المصادقة
│   ├── components/       # مكونات React
│   │   ├── ui/           # مكونات UI الأساسية
│   │   ├── layout/       # مكونات التخطيط
│   │   └── admin/        # مكونات إدارية
│   ├── lib/              # مكتبات ووظائف مساعدة
│   │   ├── ai/           # خدمات الذكاء الاصطناعي
│   │   ├── themes/       # نظام الثيمات
│   │   ├── podcast/      # معالجة البودكاست
│   │   └── recommendations/ # محرك التوصيات
│   └── types/            # تعريفات الأنواع
├── .env.example          # مثال متغيرات البيئة
├── next.config.js        # إعدادات Next.js
├── tailwind.config.js    # إعدادات Tailwind
└── tsconfig.json         # إعدادات TypeScript
```

## 🎯 الوظائف الرئيسية

### 1. نظام إدارة المحتوى
- إنشاء وتحرير المقالات والأخبار
- نظام التصنيفات والوسوم
- إدارة الصور والوسائط
- جدولة النشر

### 2. نظام المستخدمين والأدوار
- تسجيل الدخول الآمن
- أدوار متعددة (مدير، محرر، كاتب، قارئ)
- إدارة الصلاحيات
- ملفات المستخدمين

### 3. الذكاء الاصطناعي
- توليد العناوين الذكية
- تلخيص المقالات
- تحليل المحتوى والمشاعر
- اقتراحات المحتوى
- تحسين النبرة والأسلوب

### 4. نظام الثيمات
- 6 ثيمات احترافية جاهزة
- محرر ثيمات مخصص
- جدولة تلقائية للثيمات
- نظام ألوان OKLCH متقدم

### 5. البودكاست والوسائط
- تسجيل صوتي مباشر
- معالجة الملفات الصوتية
- تحويل الكلام إلى نص
- إدارة الحلقات والمحتوى

### 6. التحليلات والإحصائيات
- إحصائيات المحتوى والمستخدمين
- تتبع الأداء
- تقارير مفصلة
- رسوم بيانية تفاعلية

## 🔐 الأمان

- تشفير كلمات المرور باستخدام bcrypt
- حماية CSRF
- تحقق من صحة البيانات
- حماية API endpoints
- جلسات آمنة مع NextAuth.js

## 🌐 النشر

### Vercel (موصى به)
```bash
# ربط المشروع بـ Vercel
vercel

# نشر للإنتاج
vercel --prod
```

### Docker
```bash
# بناء الصورة
docker build -t sabq-smart-news .

# تشغيل الحاوية
docker run -p 3000:3000 sabq-smart-news
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل والدعم

- **الموقع الرسمي:** [sabq.io](https://sabq.io)
- **البريد الإلكتروني:** support@sabq.org
- **تويتر:** [@SabqNews](https://twitter.com/SabqNews)

## 🙏 شكر وتقدير

- فريق Next.js لإطار العمل الرائع
- مجتمع Tailwind CSS للتصميم المتقدم
- مطوري Prisma لأداة ORM المتميزة
- جميع المساهمين في المشروع

---

<div align="center">
  <p>صُنع بـ ❤️ في المملكة العربية السعودية</p>
  <p>© 2025 سبق الذكية. جميع الحقوق محفوظة.</p>
</div>
