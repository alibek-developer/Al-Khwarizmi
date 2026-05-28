'use client'

import { useLanguage } from '@/components/language-context'
import {
	BookOpen,
	ChevronDown,
	Globe,
	GraduationCap,
	Info,
	Menu,
	Moon,
	Phone,
	Sun,
	Users,
	X,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const navLinks = [
	{ href: '/', label: 'Home', labelUz: 'Bosh sahifa' },
	{
		href: '/courses',
		label: 'Courses',
		labelUz: 'Kurslar',
		icon: BookOpen,
		dropdown: [
			{
				href: '/courses/web',
				label: 'Web Development',
				labelUz: 'Veb Dasturlash',
				badge: 'Hot',
			},
			{
				href: '/courses/data-science',
				label: 'Data Science',
				labelUz: "Ma'lumotlar Fani",
				badge: '',
			},
			{
				href: '/courses/ai-ml',
				label: 'AI & ML',
				labelUz: "Sun'iy Intellekt",
				badge: 'New',
			},
			{
				href: '/courses/english',
				label: 'English',
				labelUz: 'Ingliz tili',
				badge: '',
			},
		],
	},
	{
		href: '/teachers',
		label: 'Teachers',
		labelUz: "O'qituvchilar",
		icon: Users,
	},
	{ href: '/about', label: 'About', labelUz: 'Biz haqimizda', icon: Info },
	{ href: '/contact', label: 'Contact', labelUz: 'Aloqa', icon: Phone },
]

// Context 'en' | 'uz' ishlatadi — RU yo'q, shuning uchun EN va UZ
const languages = [
	{ code: 'en' as const, label: 'English', short: 'EN' },
	{ code: 'uz' as const, label: "O'zbek", short: 'UZ' },
]

export function Header() {
	const { theme, setTheme } = useTheme()
	const pathname = usePathname()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [langOpen, setLangOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [mounted, setMounted] = useState(false)

	// Til dropdown'ni to'g'ri yopish uchun Ref
	const langRef = useRef<HTMLDivElement>(null)

	// ── Context dan til olinadi — localStorage ga ham yoziladi (context ichida)
	const { language, setLanguage } = useLanguage()
	const isUzbek = language === 'uz'

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12)
		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	// TO'G'RI CLICK OUTSIDE: Menyu tashqarisini bosganda yopilishi uchun
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (langRef.current && !langRef.current.contains(event.target as Node)) {
				setLangOpen(false)
			}
		}

		if (langOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [langOpen])

	const t = (en: string, uz: string) => (isUzbek ? uz : en)

	// Hydration xatosining oldini olish uchun
	if (!mounted) {
		return <div className='h-[68px]' /> // Placeholder
	}

	return (
		<header
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-sm shadow-slate-200/50 dark:shadow-black/20 border-b border-slate-200/80 dark:border-slate-800/80'
					: 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60'
			}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-[68px]'>
					{/* ── LOGO ── */}
					<Link href='/' className='flex items-center gap-2.5 shrink-0 group'>
						<div className='w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform'>
							<GraduationCap className='w-5 h-5 text-white' />
						</div>
						<div className='leading-none'>
							<span className='text-[15px] font-black text-slate-900 dark:text-white tracking-tight'>
								IT-Park
							</span>
							<span className='text-[15px] font-black text-blue-600 tracking-tight'>
								{' '}
								&{' '}
							</span>
							<span className='text-[15px] font-black text-slate-900 dark:text-white tracking-tight'>
								Khorazmi
							</span>
						</div>
					</Link>

					{/* ── CENTER NAV ── */}
					<nav className='hidden md:flex items-center gap-1'>
						{navLinks.map(link => {
							const isActive =
								pathname === link.href || pathname?.startsWith(link.href + '/')
							const hasDropdown = !!link.dropdown
							const label = t(link.label, link.labelUz)

							return (
								<div key={link.href} className='relative group'>
									{hasDropdown ? (
										<>
											<Link
												href={link.href}
												className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
													isActive
														? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
														: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
												}`}
											>
												{label}
												<ChevronDown className='w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180' />
											</Link>

											<div className='absolute top-full left-0 pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50'>
												<div className='w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 border border-slate-100 dark:border-slate-800 overflow-hidden py-1.5'>
													{link.dropdown!.map(item => (
														<Link
															key={item.href}
															href={item.href}
															className='flex items-center justify-between px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium'
														>
															<span>{t(item.label, item.labelUz)}</span>
															<div className='flex items-center gap-1.5'>
																<span className='text-xs text-slate-400 dark:text-slate-500 font-normal'>
																	{t(item.labelUz, item.label)}
																</span>
																{item.badge && (
																	<span
																		className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
																			item.badge === 'New'
																				? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
																				: item.badge === 'Hot'
																					? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
																					: ''
																		}`}
																	>
																		{item.badge}
																	</span>
																)}
															</div>
														</Link>
													))}
													<div className='mx-4 mt-1.5 pt-2 border-t border-slate-100 dark:border-slate-800'>
														<Link
															href='/courses'
															className='flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors pb-1.5'
														>
															{t('View all courses →', 'Barcha kurslar →')}
														</Link>
													</div>
												</div>
											</div>
										</>
									) : (
										<Link
											href={link.href}
											className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
												isActive
													? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
													: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
											}`}
										>
											{label}
											{isActive && (
												<span className='ml-1.5 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400' />
											)}
										</Link>
									)}
								</div>
							)
						})}
					</nav>

					{/* ── RIGHT CONTROLS ── */}
					<div className='flex items-center gap-2'>
						{/* Desktop Language toggle */}
						<div className='relative hidden sm:block' ref={langRef}>
							<button
								onClick={e => {
									e.stopPropagation()
									setLangOpen(!langOpen)
								}}
								className='flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all text-sm font-semibold'
							>
								<Globe className='w-3.5 h-3.5 text-blue-600' />
								{language?.toUpperCase()}
								<ChevronDown
									className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
								/>
							</button>

							{langOpen && (
								<div
									className='absolute top-full right-0 mt-2 w-36 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden py-1 z-[100]'
									onClick={e => e.stopPropagation()} // Menyu ichini bosganda yopilmasligi uchun
								>
									{languages.map(l => (
										<button
											key={l.code}
											onClick={() => {
												setLanguage(l.code)
												setLangOpen(false) // Til tanlanganda menyuni yopish
											}}
											className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
												language === l.code
													? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-semibold'
													: 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
											}`}
										>
											{l.label}
											{language === l.code && (
												<span className='w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400' />
											)}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Theme toggle */}
						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className='h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center'
						>
							{theme === 'dark' ? (
								<Sun className='w-4 h-4 text-yellow-500' />
							) : (
								<Moon className='w-4 h-4 text-slate-500' />
							)}
						</button>

						{/* CTA */}
						<Link
							href='/courses'
							className='hidden sm:flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all hover:scale-[1.03] shadow-md shadow-blue-500/20 active:scale-95'
						>
							{t('Enroll Now', "Ro'yxatdan o'tish")}
						</Link>

						{/* Mobile menu button */}
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className='md:hidden h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center'
						>
							{mobileOpen ? (
								<X className='w-4 h-4' />
							) : (
								<Menu className='w-4 h-4' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* ── MOBILE MENU ── */}
			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
			>
				<div className='border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1'>
					{navLinks.map(link => {
						const isActive = pathname === link.href
						const label = t(link.label, link.labelUz)
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
									{link.icon && <link.icon className='w-4 h-4' />}
									<span>{label}</span>
									<span className='text-xs text-slate-400 font-normal ml-auto'>
										{t(link.labelUz, link.label)}
									</span>
								</Link>
								{link.dropdown && (
									<div className='ml-4 mt-0.5 space-y-0.5 border-l-2 border-blue-100 dark:border-blue-900/40 pl-2'>
										{link.dropdown.map(item => (
											<Link
												key={item.href}
												href={item.href}
												onClick={() => setMobileOpen(false)}
												className='flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 dark:hover:text-blue-400 transition-colors'
											>
												<span className='font-medium'>
													{t(item.label, item.labelUz)}
												</span>
												<div className='flex items-center gap-1.5'>
													<span className='text-[10px] text-slate-400'>
														{t(item.labelUz, item.label)}
													</span>
													{item.badge && (
														<span
															className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${item.badge === 'New' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}
														>
															{item.badge}
														</span>
													)}
												</div>
											</Link>
										))}
									</div>
								)}
							</div>
						)
					})}

					{/* Mobile — til va enroll */}
					<div className='pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2'>
						<div className='flex items-center gap-1 flex-1'>
							{languages.map(l => (
								<button
									key={l.code}
									onClick={() => {
										setLanguage(l.code)
										setMobileOpen(false) // Mobil menyuni til tanlaganda ham yopish (ixtiyoriy, olib tashlash mumkin)
									}}
									className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
										language === l.code
											? 'bg-blue-600 text-white'
											: 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'
									}`}
								>
									{l.short}
								</button>
							))}
						</div>
						<Link
							href='/courses'
							onClick={() => setMobileOpen(false)}
							className='px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors'
						>
							{t('Enroll', "Ro'yxat")}
						</Link>
					</div>
				</div>
			</div>
		</header>
	)
}
