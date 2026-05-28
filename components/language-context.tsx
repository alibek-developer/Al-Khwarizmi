'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

type Language = 'en' | 'uz'

type LanguageContextValue = {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
)

const STORAGE_KEY = 'itpark_language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Language
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // ignore
    }
  }, [locale])

  const setLanguage = (lang: Language) => {
    if (lang === locale) return // same language → no-op
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, lang)
      } catch {
        // ignore
      }
    }
    const cleanPath = pathname.replace(/^\/(en|uz)(\/|$)/, '/') || '/'
    router.replace(cleanPath, { locale: lang })
  }

  if (!mounted) {
    return (
      <LanguageContext.Provider
        value={{ language: locale, setLanguage }}
      >
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language: locale, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

export function useIsUzbek() {
  const { language } = useLanguage()
  return language === 'uz'
}
