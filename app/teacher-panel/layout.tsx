'use client'

import {
	Award,
	BookOpen,
	CheckSquare,
	ChevronLeft,
	FileText,
	GraduationCap,
	LayoutDashboard,
	Menu,
	Settings,
	Users,
	X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

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

const bottomItems = [
	{ label: 'Sozlamalar', href: '/teacher-panel/settings', icon: Settings },
]

export default function TeacherLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [collapsed, setCollapsed] = useState(false)

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(href + '/')

	return (
		<div className='flex h-screen bg-slate-950 overflow-hidden'>
			{/* ── Mobile overlay ───────────────────────────────────────────── */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* ── Sidebar ──────────────────────────────────────────────────── */}
			<aside
				className={`
          fixed lg:relative z-50 h-full flex flex-col
          bg-slate-900/95 backdrop-blur-xl
          border-r border-white/5
          transition-all duration-300 ease-in-out shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-[72px]' : 'w-64'}
        `}
			>
				{/* Sidebar glow */}
				<div className='absolute inset-0 pointer-events-none overflow-hidden rounded-r-none'>
					<div className='absolute -top-20 -left-10 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl' />
					<div className='absolute bottom-10 left-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl' />
				</div>

				{/* ── Logo / Brand ── */}
				<div
					className={`relative flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center px-0' : ''}`}
				>
					<div className='w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30'>
						<GraduationCap className='w-5 h-5 text-white' />
					</div>
					{!collapsed && (
						<div className='min-w-0'>
							<p className='text-sm font-black text-white leading-none'>
								Al-Kharazmi
							</p>
							<p className='text-[10px] text-slate-500 mt-0.5'>
								O'qituvchi paneli
							</p>
						</div>
					)}

					{/* Collapse toggle — desktop only */}
					<button
						onClick={() => setCollapsed(v => !v)}
						className='hidden lg:flex ml-auto w-6 h-6 rounded-lg items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all shrink-0'
					>
						<ChevronLeft
							className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
						/>
					</button>

					{/* Mobile close */}
					<button
						onClick={() => setSidebarOpen(false)}
						className='lg:hidden ml-auto w-7 h-7 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/5 transition-colors'
					>
						<X className='w-4 h-4' />
					</button>
				</div>

				{/* ── Nav items ── */}
				<nav className='flex-1 overflow-y-auto py-4 px-2 space-y-1'>
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
                  ${collapsed ? 'justify-center px-0' : ''}
                  ${
										active
											? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-sm'
											: 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
									}
                `}
							>
								{/* Active indicator */}
								{active && (
									<span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-full' />
								)}

								<Icon
									className={`w-4.5 h-4.5 shrink-0 transition-colors ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}
									style={{ width: 18, height: 18 }}
								/>

								{!collapsed && <span className='truncate'>{item.label}</span>}

								{/* Tooltip when collapsed */}
								{collapsed && (
									<div className='absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50'>
										{item.label}
										<div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800' />
									</div>
								)}
							</Link>
						)
					})}
				</nav>

				{/* ── Bottom items ── */}
				<div className='px-2 pb-4 pt-2 border-t border-white/5 space-y-1'>
					{bottomItems.map(item => {
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
                  ${collapsed ? 'justify-center px-0' : ''}
                  ${
										active
											? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
											: 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
									}
                `}
							>
								<Icon
									style={{ width: 18, height: 18 }}
									className={`shrink-0 ${active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}
								/>
								{!collapsed && <span className='truncate'>{item.label}</span>}
								{collapsed && (
									<div className='absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 border border-white/10 rounded-lg text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50'>
										{item.label}
										<div className='absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800' />
									</div>
								)}
							</Link>
						)
					})}

					{/* User card */}
					{!collapsed && (
						<div className='mt-2 flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-3 py-2.5'>
							<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0'>
								<span className='text-white text-[10px] font-black'>O'Q</span>
							</div>
							<div className='min-w-0 flex-1'>
								<p className='text-xs font-bold text-white truncate'>
									O'qituvchi
								</p>
								<p className='text-[10px] text-slate-500 truncate'>
									teacher@edu.uz
								</p>
							</div>
						</div>
					)}
				</div>
			</aside>

			{/* ── Main content ─────────────────────────────────────────────── */}
			<div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
				{/* Mobile topbar */}
				<header className='lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900/80 backdrop-blur-sm border-b border-white/5 shrink-0'>
					<button
						onClick={() => setSidebarOpen(true)}
						className='w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all'
					>
						<Menu className='w-5 h-5' />
					</button>
					<div className='w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center'>
						<GraduationCap className='w-4 h-4 text-white' />
					</div>
					<p className='text-sm font-black text-white'>Al-Kharazmi</p>
				</header>

				{/* Page content */}
				<main className='flex-1 overflow-y-auto'>{children}</main>
			</div>
		</div>
	)
}
