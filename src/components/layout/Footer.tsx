import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'من نحن', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
    { name: 'الوظائف', href: '/careers' },
    { name: 'الإعلان معنا', href: '/advertise' },
  ],
  content: [
    { name: 'الأخبار', href: '/news' },
    { name: 'الرأي', href: '/opinion' },
    { name: 'الرياضة', href: '/sports' },
    { name: 'التقنية', href: '/technology' },
  ],
  legal: [
    { name: 'سياسة الخصوصية', href: '/privacy' },
    { name: 'شروط الاستخدام', href: '/terms' },
    { name: 'سياسة الكوكيز', href: '/cookies' },
    { name: 'حقوق النشر', href: '/copyright' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/sabqorg' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/sabqorg' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/sabqorg' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/sabqorg' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* معلومات الشركة */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">س</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">سبق الذكية</h3>
                <p className="text-sm text-gray-400">بوابة الأخبار الذكية</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              صحيفة سبق الإلكترونية - أول صحيفة سعودية تأسست على الإنترنت، 
              نقدم لكم آخر الأخبار المحلية والعالمية بتقنيات الذكاء الاصطناعي.
            </p>
            
            {/* معلومات الاتصال */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@sabq.org</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+966 11 234 5678</span>
              </div>
            </div>
          </div>

          {/* روابط الشركة */}
          <div>
            <h3 className="text-lg font-semibold mb-4">الشركة</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* روابط المحتوى */}
          <div>
            <h3 className="text-lg font-semibold mb-4">المحتوى</h3>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* الروابط القانونية */}
          <div>
            <h3 className="text-lg font-semibold mb-4">قانوني</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* وسائل التواصل الاجتماعي */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-4 rtl:space-x-reverse mb-4 sm:mb-0">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} سبق الذكية. جميع الحقوق محفوظة.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                مدعوم بتقنيات الذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

