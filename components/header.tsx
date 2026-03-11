'use client'

import { BookOpen, ChevronDown, Globe, GraduationCap, Info, Menu, Moon, Phone, Sun, Users, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/', label: 'Home', labelUz: 'Bosh sahifa' },
  {
    href: '/courses',
    label: 'Courses',
    labelUz: 'Kurslar',
    icon: BookOpen,
    dropdown: [
      { href: '/courses/web', label: 'Web Development', labelUz: 'Veb Dasturlash', badge: 'Hot' },
      { href: '/courses/data', label: 'Data Science', labelUz: 'Ma\'lumotlar Fani', badge: '' },
      { href: '/courses/ai', label: 'AI & ML', labelUz: 'Sun\'iy Intellekt', badge: 'New' },
      { href: '/courses/mobile', label: 'Mobile Apps', labelUz: 'Mobil Ilovalar', badge: '' },
    ],
  },
  { href: '/teachers', label: 'Teachers', labelUz: 'O\'qituvchilar', icon: Users },
  { href: '/about', label: 'About', labelUz: 'Biz haqimizda', icon: Info },
  { href: '/contact', label: 'Contact', labelUz: 'Aloqa', icon: Phone },
]

const languages = [
  { code: 'EN', label: 'English' },
  { code: 'UZ', label: "O'zbek" },
  { code: 'RU', label: 'Русский' },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [activeLang, setActiveLang] = useState('EN')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const close = () => { setOpenDropdown(null); setLangOpen(false) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-sm shadow-slate-200/50 dark:shadow-black/20 border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">IT-Park</span>
              <span className="text-[15px] font-black text-blue-600 tracking-tight"> & </span>
              <span className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">Khorazmi</span>
            </div>
          </Link>

          {/* ── CENTER NAV ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
              const hasDropdown = !!link.dropdown

              return (
                <div key={link.href} className="relative" onClick={(e) => e.stopPropagation()}>
                  {hasDropdown ? (
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.href ? null : link.href)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive || openDropdown === link.href
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === link.href ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {link.label}
                      {isActive && <span className="ml-1.5 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {hasDropdown && openDropdown === link.href && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 overflow-hidden py-1.5">
                      {link.dropdown!.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                        >
                          <span>{item.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">{item.labelUz}</span>
                            {item.badge && (
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                item.badge === 'New' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                                item.badge === 'Hot' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400' : ''
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                      <div className="mx-4 mt-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Link
                          href="/courses"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors pb-1.5"
                        >
                          View all courses →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* ── RIGHT CONTROLS ── */}
          <div className="flex items-center gap-2">

            {/* Language */}
            <div className="relative hidden sm:block" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all text-sm font-semibold"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                {activeLang}
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-lg shadow-slate-200/60 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 overflow-hidden py-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setActiveLang(lang.code); setLangOpen(false) }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                        activeLang === lang.code
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                      }`}
                    >
                      {lang.label}
                      {activeLang === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-yellow-500" />
                : <Moon className="w-4 h-4 text-slate-500" />
              }
            </button>

            {/* CTA Button */}
            <Link
              href="/courses"
              className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all hover:scale-[1.03] shadow-md shadow-blue-500/20 active:scale-95"
            >
              Enroll Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <div key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                  <span className="text-xs text-slate-400 font-normal ml-auto">{link.labelUz}</span>
                </Link>
                {/* Mobile dropdown items */}
                {link.dropdown && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-slate-500 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            item.badge === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Mobile bottom row */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <div className="flex items-center gap-1 flex-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeLang === lang.code
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang.code}
                </button>
              ))}
            </div>
            <Link
              href="/courses"
              onClick={() => setMobileOpen(false)}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}