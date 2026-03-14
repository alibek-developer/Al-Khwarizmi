import { LanguageProvider } from '@/components/language-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

// Shriftlarni o'zgaruvchilarga yuklaymiz
const geistSans = Geist({
	subsets: ['latin'],
	variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
})

export const metadata: Metadata = {
	title: 'IT-Park & Al-Kharazmi',
	description: 'Empowering the next generation of tech leaders',
	generator: '',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			{/* className qismiga shrift o'zgaruvchilarini qo'shdik. 
          Bu Tailwind'ga globals.css orqali stillarni ulashga yordam beradi.
      */}
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
			>
				<ThemeProvider attribute='class' defaultTheme='light' enableSystem>
					<LanguageProvider>{children}</LanguageProvider>
				</ThemeProvider>
				<Analytics />
			</body>
		</html>
	)
}
