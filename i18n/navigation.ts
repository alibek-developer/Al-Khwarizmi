import { createNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'uz'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export const { Link, useRouter, usePathname, redirect, getPathname } =
  createNavigation(routing)
