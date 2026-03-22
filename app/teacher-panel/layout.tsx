'use client'

import {
	Award,
	BookOpen,
	CheckSquare,
	ChevronLeft,
	FileText,
	GraduationCap,
	LayoutDashboard,
	LogOut,
	Menu,
	Moon,
	Sun,
	Users,
	X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const navItems = [
	{
		label: 'Dashboard',
		href: '/teacher-panel/dashboard',
		icon: LayoutDashboard,
	},
	{ label: 'Davomat', href: '/teacher-panel/attendance', icon: CheckSquare },
	{ label: 'Guruhlar', href: '/teacher-panel/groups', icon: Users },
	{ label: 'Uy vazifalari', href: '/teacher-panel/homework', icon: BookOpen },
	{ label: 'Materiallar', href: '/teacher-panel/materials', icon: FileText },
	{ label: 'Sertifikatlar', href: '/teacher-panel/certificates', icon: Award },
]

export default function TeacherLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const router = useRouter()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [collapsed, setCollapsed] = useState(false)
	const [dark, setDark] = useState(true)

	// Theme init
	useEffect(() => {
		const saved = localStorage.getItem('teacher-theme')
		const isDark = saved ? saved === 'dark' : true
		setDark(isDark)
		document.documentElement.classList.toggle('dark', isDark)
	}, [])

	const toggleTheme = () => {
		const next = !dark
		setDark(next)
		document.documentElement.classList.toggle('dark', next)
		localStorage.setItem('teacher-theme', next ? 'dark' : 'light')
	}

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(href + '/')

	const handleLogout = () => {
		localStorage.removeItem('teacherLoggedIn')
		router.push('/login')
	}

	return (
		<div className='flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300'>
			{/* ── Mobile overlay ── */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* ══ SIDEBAR ══════════════════════════════════════════════════ */}
			<aside
				className={`
				fixed lg:relative z-50 h-full flex flex-col
				bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
				border-r border-slate-200 dark:border-white/5
				transition-all duration-300 ease-in-out shrink-0
				shadow-xl dark:shadow-none
				${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
				${collapsed ? 'w-[72px]' : 'w-64'}
			`}
			>
				{/* Glow — dark modeda ko'rinadi */}
				<div className='absolute inset-0 pointer-events-none overflow-hidden'>
					<div className='absolute -top-20 -left-10 w-48 h-48 bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-3xl' />
					<div className='absolute bottom-10 left-0 w-32 h-32 bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-2xl' />
				</div>

				{/* ── Logo ── */}
				<div
					className={`relative flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-white/5 ${collapsed ? 'justify-center' : ''}`}
				>
					<div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30'>
						<GraduationCap className='w-5 h-5 text-white' />
					</div>
					{!collapsed && (
						<div className='min-w-0'>
							<p className='text-sm font-black text-slate-900 dark:text-white leading-none'>
								Al-Kharazmi
							</p>
							<p className='text-[10px] text-slate-400 dark:text-slate-500 mt-0.5'>
								O'qituvchi paneli
							</p>
						</div>
					)}

					{/* Desktop collapse */}
					<button
						onClick={() => setCollapsed(v => !v)}
						className='hidden lg:flex ml-auto w-6 h-6 rounded-lg items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all shrink-0'
					>
						<ChevronLeft
							className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
						/>
					</button>

					{/* Mobile close */}
					<button
						onClick={() => setSidebarOpen(false)}
						className='lg:hidden ml-auto w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors'
					>
						<X className='w-4 h-4' />
					</button>
				</div>

				{/* ── Nav ── */}
				<nav className='flex-1 overflow-y-auto py-4 px-2 space-y-0.5'>
					{navItems.map(item => {
						const Icon = item.icon
						const active = isActive(item.href)
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setSidebarOpen(false)}
								title={collapsed ? item.label : undefined}
								className={`
									relative flex items-center gap-3 rounded-xl px-3 py-2.5
									text-sm font-semibold transition-all duration-200 group
									${collapsed ? 'justify-center' : ''}
									${
										active
											? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-sm'
											: 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
									}
								`}
							>
								{/* Active left bar */}
								{active && (
									<span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full' />
								)}

								<Icon
									style={{ width: 18, height: 18 }}
									className={`shrink-0 transition-colors ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}
								/>

								{!collapsed && <span className='truncate'>{item.label}</span>}

								{/* Tooltip */}
								{collapsed && (
									<div className='absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 border border-slate-700 dark:border-white/10 rounded-lg text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50'>
										{item.label}
										<div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800' />
									</div>
								)}
							</Link>
						)
					})}
				</nav>

				{/* ── Bottom: theme toggle + logout + user card ── */}
				<div className='px-2 pb-4 pt-2 border-t border-slate-100 dark:border-white/5 space-y-1'>
					{/* Theme toggle */}
					<button
						onClick={toggleTheme}
						className={`
							relative flex items-center gap-3 rounded-xl px-3 py-2.5 w-full
							text-sm font-semibold transition-all duration-200 group
							text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent
							${collapsed ? 'justify-center' : ''}
						`}
					>
						{dark ? (
							<Sun
								style={{ width: 18, height: 18 }}
								className='shrink-0 text-amber-500'
							/>
						) : (
							<Moon
								style={{ width: 18, height: 18 }}
								className='shrink-0 text-indigo-500'
							/>
						)}
						{!collapsed && (
							<span className='truncate'>
								{dark ? "Yorug' rejim" : "Qorong'u rejim"}
							</span>
						)}
						{collapsed && (
							<div className='absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 border border-slate-700 dark:border-white/10 rounded-lg text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50'>
								{dark ? "Yorug' rejim" : "Qorong'u rejim"}
								<div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800' />
							</div>
						)}
					</button>

					{/* Logout */}
					<button
						onClick={handleLogout}
						className={`
							relative flex items-center gap-3 rounded-xl px-3 py-2.5 w-full
							text-sm font-semibold transition-all duration-200 group
							text-red-500 dark:text-red-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-300 border border-transparent
							${collapsed ? 'justify-center' : ''}
						`}
					>
						<LogOut style={{ width: 18, height: 18 }} className='shrink-0' />
						{!collapsed && <span className='truncate'>Chiqish</span>}
						{collapsed && (
							<div className='absolute left-full ml-3 px-2.5 py-1.5 bg-red-900 border border-white/10 rounded-lg text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50'>
								Chiqish
								<div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-red-900' />
							</div>
						)}
					</button>

					{/* User card */}
					{!collapsed && (
						<div className='mt-1 flex items-center gap-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl px-3 py-2.5'>
							<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0'>
								<span className='text-white text-[10px] font-black'>O'Q</span>
							</div>
							<div className='min-w-0 flex-1'>
								<p className='text-xs font-bold text-slate-900 dark:text-white truncate'>
									O'qituvchi
								</p>
								<p className='text-[10px] text-slate-400 dark:text-slate-500 truncate font-medium'>
									teacher@edu.uz
								</p>
							</div>
						</div>
					)}
				</div>
			</aside>

			{/* ══ MAIN ══════════════════════════════════════════════════════ */}
			<div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
				{/* Mobile topbar */}
				<header className='lg:hidden flex items-center gap-3 px-4 py-3 bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-white/5 shrink-0'>
					<button
						onClick={() => setSidebarOpen(true)}
						className='w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all'
					>
						<Menu className='w-5 h-5' />
					</button>
					<div className='w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center'>
						<GraduationCap className='w-4 h-4 text-white' />
					</div>
					<p className='text-sm font-black text-slate-900 dark:text-white flex-1'>
						Al-Kharazmi
					</p>

					{/* Mobile theme toggle */}
					<button
						onClick={toggleTheme}
						className='w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all'
					>
						{dark ? (
							<Sun className='w-4 h-4 text-amber-500' />
						) : (
							<Moon className='w-4 h-4 text-indigo-500' />
						)}
					</button>
				</header>

				<main className='flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300'>
					{children}
				</main>
			</div>
		</div>
	)
}
