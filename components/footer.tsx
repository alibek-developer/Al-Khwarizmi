import {
  ArrowRight,
  GraduationCap,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from 'lucide-react'
import Link from 'next/link'

const programs = [
  { label: 'Web Development', labelUz: 'Veb Dasturlash', href: '/courses/web' },
  { label: 'Data Science', labelUz: 'Ma\'lumotlar Fani', href: '/courses/data' },
  { label: 'AI & Machine Learning', labelUz: 'Sun\'iy Intellekt', href: '/courses/ai' },
  { label: 'Cybersecurity', labelUz: 'Kiberxavfsizlik', href: '/courses/cyber' },
  { label: 'Mobile Apps', labelUz: 'Mobil Ilovalar', href: '/courses/mobile' },
]

const company = [
  { label: 'About Us', labelUz: 'Biz haqimizda', href: '/about' },
  { label: 'Our Teachers', labelUz: 'O\'qituvchilar', href: '/teachers' },
  { label: 'Student Stories', labelUz: 'Talaba hikoyalari', href: '/stories' },
  { label: 'Careers', labelUz: 'Vakansiyalar', href: '/careers' },
  { label: 'Contact', labelUz: 'Aloqa', href: '/contact' },
]

const socials = [
  { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-red-500 hover:border-red-500' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-500 hover:border-pink-500' },
  { icon: Twitter, href: '#', label: 'Twitter / X', color: 'hover:bg-sky-500 hover:border-sky-500' },
  { icon: Send, href: '#', label: 'Telegram', color: 'hover:bg-blue-500 hover:border-blue-500' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">

      {/* ── TOP CTA BANNER ── */}
      <div className="border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-8 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/20">
            <div>
              <h3 className="text-white font-black text-xl md:text-2xl mb-1">
                Ready to Start Your Journey?
              </h3>
              <p className="text-blue-200 text-sm">
                Sayohatingizni boshlashga tayyormisiz? — Enroll today and transform your career.
              </p>
            </div>
            <Link
              href="/courses"
              className="shrink-0 flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-black text-sm px-6 py-3.5 rounded-xl transition-all hover:scale-105 shadow-md"
            >
              Explore All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand col */}
          <div className="md:col-span-4">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="leading-none">
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">IT-Park</span>
                <span className="text-base font-black text-blue-600 tracking-tight"> & </span>
                <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">Khorazmi</span>
              </div>
            </Link>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-2 max-w-xs">
              Empowering the next generation of tech leaders through world-class education and mentorship.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600 italic leading-relaxed mb-6 max-w-xs">
              Jahon darajasidagi ta'lim va murabbiylik orqali texnologiya sohasining kelgusi rahbarlarini shakllantiramiz.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-white transition-all duration-200 ${color}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
              Programs
            </h3>
            <ul className="space-y-3">
              {programs.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <span className="block text-xs text-slate-400 dark:text-slate-600 italic">{item.labelUz}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
              Company
            </h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <span className="block text-xs text-slate-400 dark:text-slate-600 italic">{item.labelUz}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-3 h-0.5 bg-blue-600 rounded-full" />
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contact@it-park.edu" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mb-0.5">Email</p>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium group-hover:text-blue-600 transition-colors">contact@it-park.edu</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+998901234567" className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mb-0.5">Phone / Telefon</p>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium group-hover:text-blue-600 transition-colors">+998 90 123 45 67</span>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mb-0.5">Address / Manzil</p>
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">IT-Park, Toshkent,<br />O'zbekiston</span>
                  </div>
                </div>
              </li>
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Newsletter / Yangiliklar</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center sm:text-left">
            © {year} IT-Park & Al-Kharazmi Academy. All rights reserved. / Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Safety Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-slate-400 dark:text-slate-600 hover:text-blue-600 dark:hover:text-slate-300 transition-colors whitespace-nowrap"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}