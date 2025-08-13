import type { Metadata } from 'next'
import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })
const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ['arabic'],
  variable: '--font-arabic'
})

export const metadata: Metadata = {
  title: 'سبق الذكية - بوابة الأخبار العربية الذكية',
  description: 'بوابة الأخبار العربية الذكية المدعومة بالذكاء الاصطناعي. اكتشف آخر الأخبار المحلية والعالمية مع تجربة قراءة متطورة.',
  keywords: 'أخبار, سبق, الذكاء الاصطناعي, أخبار عربية, أخبار سعودية',
  authors: [{ name: 'سبق الذكية' }],
  creator: 'سبق الذكية',
  publisher: 'سبق الذكية',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sabq.org'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/ar-SA',
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'سبق الذكية - بوابة الأخبار العربية الذكية',
    description: 'بوابة الأخبار العربية الذكية المدعومة بالذكاء الاصطناعي',
    url: 'https://sabq.org',
    siteName: 'سبق الذكية',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'سبق الذكية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سبق الذكية - بوابة الأخبار العربية الذكية',
    description: 'بوابة الأخبار العربية الذكية المدعومة بالذكاء الاصطناعي',
    images: ['/og-image.png'],
    creator: '@sabqorg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.className} ${notoSansArabic.variable}`}>
      <body className="font-arabic antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
