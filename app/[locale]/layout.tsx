import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { LanguageProvider } from '@/components/language-context'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LanguageProvider>{children}</LanguageProvider>
    </NextIntlClientProvider>
  )
}
