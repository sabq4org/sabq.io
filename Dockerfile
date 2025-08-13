# استخدام صورة Node.js الرسمية
FROM node:18-alpine AS base

# تثبيت التبعيات المطلوبة فقط عند الحاجة
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# نسخ ملفات إدارة الحزم
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# إعادة بناء المشروع والتبعيات عند الحاجة
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تعطيل جمع البيانات التحليلية من Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# بناء المشروع
RUN npm run build

# صورة الإنتاج، نسخ جميع الملفات وتشغيل Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# إنشاء مستخدم غير جذر
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات العامة
COPY --from=builder /app/public ./public

# إنشاء مجلد .next وتعيين الصلاحيات
RUN mkdir .next
RUN chown nextjs:nodejs .next

# نسخ ملفات البناء
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# التبديل للمستخدم غير الجذر
USER nextjs

# كشف المنفذ
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# تشغيل التطبيق
CMD ["node", "server.js"]

