'use client'

import {
	AlertCircle,
	ArrowDownRight,
	ArrowUpRight,
	BookOpen,
	CheckCircle2,
	Clock,
	CreditCard,
	GraduationCap,
	Star,
	Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const stats = [
	{
		id: 'students',
		label: 'Talabalar',
		labelEn: 'Total Students',
		value: '524',
		change: '+12%',
		up: true,
		desc: "O'tgan oyga nisbatan",
		icon: Users,
		color: 'blue',
		bg: 'bg-blue-500',
		light: 'bg-blue-50 dark:bg-blue-500/10',
		text: 'text-blue-600 dark:text-blue-400',
		border: 'border-blue-100 dark:border-blue-500/20',
	},
	{
		id: 'revenue',
		label: 'Daromad',
		labelEn: 'Monthly Revenue',
		value: '$8,240',
		change: '+23%',
		up: true,
		desc: "O'tgan oyga nisbatan",
		icon: CreditCard,
		color: 'emerald',
		bg: 'bg-emerald-500',
		light: 'bg-emerald-50 dark:bg-emerald-500/10',
		text: 'text-emerald-600 dark:text-emerald-400',
		border: 'border-emerald-100 dark:border-emerald-500/20',
	},
	{
		id: 'courses',
		label: 'Faol Kurslar',
		labelEn: 'Active Courses',
		value: '4',
		change: '0%',
		up: true,
		desc: 'Barcha kurslar faol',
		icon: BookOpen,
		color: 'violet',
		bg: 'bg-violet-500',
		light: 'bg-violet-50 dark:bg-violet-500/10',
		text: 'text-violet-600 dark:text-violet-400',
		border: 'border-violet-100 dark:border-violet-500/20',
	},
	{
		id: 'rating',
		label: "O'rtacha Reyting",
		labelEn: 'Avg. Rating',
		value: '4.8',
		change: '+0.3',
		up: true,
		desc: "Barcha kurslar bo'yicha",
		icon: Star,
		color: 'amber',
		bg: 'bg-amber-500',
		light: 'bg-amber-50 dark:bg-amber-500/10',
		text: 'text-amber-600 dark:text-amber-400',
		border: 'border-amber-100 dark:border-amber-500/20',
	},
]

const recentStudents = [
	{
		name: 'Abdullayev Jasur',
		course: 'Web Development',
		date: '12 yan',
		status: 'active',
		avatar: 'AJ',
		amount: '$499',
	},
	{
		name: 'Toshmatova Dilnoza',
		course: 'English Course',
		date: '11 yan',
		status: 'active',
		avatar: 'TD',
		amount: '$299',
	},
	{
		name: 'Karimov Sherzod',
		course: 'Data Science',
		date: '10 yan',
		status: 'pending',
		avatar: 'KS',
		amount: '$449',
	},
	{
		name: 'Yusupova Malika',
		course: 'AI & ML',
		date: '9 yan',
		status: 'active',
		avatar: 'YM',
		amount: '$599',
	},
	{
		name: 'Normatov Bobur',
		course: 'English Course',
		date: '8 yan',
		status: 'inactive',
		avatar: 'NB',
		amount: '$299',
	},
]

const courseStats = [
	{
		name: 'English Course',
		students: 198,
		revenue: '$3,200',
		progress: 78,
		color: 'bg-blue-500',
	},
	{
		name: 'Web Development',
		students: 142,
		revenue: '$2,840',
		progress: 62,
		color: 'bg-violet-500',
	},
	{
		name: 'Data Science',
		students: 98,
		revenue: '$1,650',
		progress: 43,
		color: 'bg-emerald-500',
	},
	{
		name: 'AI & ML',
		students: 86,
		revenue: '$860',
		progress: 38,
		color: 'bg-amber-500',
	},
]

const monthlyData = [40, 55, 35, 70, 65, 80, 60, 90, 75, 95, 85, 100]
const months = ['Y', 'F', 'M', 'A', 'M', 'I', 'I', 'A', 'S', 'O', 'N', 'D']

/* ─────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
	const map: Record<string, { label: string; cls: string; icon: any }> = {
		active: {
			label: 'Faol',
			cls: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
			icon: CheckCircle2,
		},
		pending: {
			label: 'Kutilmoqda',
			cls: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
			icon: Clock,
		},
		inactive: {
			label: 'Nofaol',
			cls: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
			icon: AlertCircle,
		},
	}
	const s = map[status] ?? map.inactive
	const Icon = s.icon
	return (
		<span
			className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${s.cls}`}
		>
			<Icon className='w-2.5 h-2.5' /> {s.label}
		</span>
	)
}

/* ─────────────────────────────────────────
   MINI SPARKLINE (CSS bars)
───────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
	const max = Math.max(...data)
	return (
		<div className='flex items-end gap-0.5 h-8'>
			{data.map((v, i) => (
				<div
					key={i}
					className={`${color} rounded-sm opacity-80 w-2 transition-all`}
					style={{ height: `${(v / max) * 100}%` }}
				/>
			))}
		</div>
	)
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function AdminDashboardPage() {
	const router = useRouter()
	const [greeting, setGreeting] = useState('')

	useEffect(() => {
		const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
		const userRole = localStorage.getItem('userRole')

		if (!isLoggedIn || userRole !== 'admin') {
			router.replace('/login')
		}

		const h = new Date().getHours()
		if (h < 12) setGreeting('Xayrli tong')
		else if (h < 17) setGreeting('Xayrli kun')
		else setGreeting('Xayrli kech')
	}, [router])

	const today = new Date().toLocaleDateString('uz-UZ', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})

	return (
		<div className='space-y-5 pb-6'>
			{/* ── Greeting ── */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white tracking-tight'>
						{greeting}, Admin 👋
					</h1>
					<p className='text-slate-400 dark:text-slate-500 text-xs mt-0.5 capitalize'>
						{today}
					</p>
				</div>
				<div className='hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 shadow-sm'>
					<div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
					<span className='text-xs font-semibold text-slate-600 dark:text-slate-300'>
						Tizim faol
					</span>
				</div>
			</div>

			{/* ── 4 Stat Cards ── */}
			<div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
				{stats.map((stat, idx) => {
					const Icon = stat.icon
					return (
						<div
							key={stat.id}
							className='group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5'
							style={{ animationDelay: `${idx * 60}ms` }}
						>
							<div className='flex items-start justify-between mb-3'>
								<div
									className={`w-9 h-9 ${stat.light} border ${stat.border} rounded-xl flex items-center justify-center`}
								>
									<Icon
										className={`${stat.text}`}
										style={{ width: 17, height: 17 }}
									/>
								</div>
								<span
									className={`flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-lg
									${
										stat.up
											? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
											: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10'
									}`}
								>
									{stat.up ? (
										<ArrowUpRight className='w-3 h-3' />
									) : (
										<ArrowDownRight className='w-3 h-3' />
									)}
									{stat.change}
								</span>
							</div>

							<div className='text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5'>
								{stat.value}
							</div>
							<div className='text-xs font-semibold text-slate-600 dark:text-slate-300'>
								{stat.label}
							</div>
							<div className='text-[10px] text-slate-400 mt-0.5'>
								{stat.desc}
							</div>
						</div>
					)
				})}
			</div>

			{/* ── Main row: Chart + Course stats ── */}
			<div className='grid lg:grid-cols-5 gap-4'>
				{/* Bar chart — monthly revenue */}
				<div className='lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm'>
					<div className='flex items-center justify-between mb-5'>
						<div>
							<h3 className='font-black text-slate-900 dark:text-white text-sm'>
								Oylik Daromad
							</h3>
							<p className='text-[10px] text-slate-400 mt-0.5'>
								2025-yil bo'yicha
							</p>
						</div>
						<div className='text-right'>
							<p className='text-xl font-black text-slate-900 dark:text-white'>
								$8,240
							</p>
							<span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 justify-end'>
								<ArrowUpRight className='w-3 h-3' /> +23% o'tgan oy
							</span>
						</div>
					</div>

					{/* Bar chart */}
					<div className='flex items-end gap-1.5 h-28 mb-2'>
						{monthlyData.map((v, i) => {
							const max = Math.max(...monthlyData)
							const isLast = i === monthlyData.length - 1
							const height = `${(v / max) * 100}%`
							return (
								<div
									key={i}
									className='flex-1 flex flex-col items-center gap-1 group/bar'
								>
									<div
										className='w-full relative rounded-t-lg overflow-hidden'
										style={{ height: 96 }}
									>
										<div
											className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500
												${
													isLast
														? 'bg-blue-600'
														: 'bg-slate-200 dark:bg-slate-700 group-hover/bar:bg-blue-300 dark:group-hover/bar:bg-blue-500/50'
												}`}
											style={{ height }}
										/>
									</div>
									<span className='text-[9px] text-slate-400'>{months[i]}</span>
								</div>
							)
						})}
					</div>
				</div>

				{/* Course breakdown */}
				<div className='lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-black text-slate-900 dark:text-white text-sm'>
							Kurslar bo'yicha
						</h3>
						<BookOpen className='w-4 h-4 text-slate-400' />
					</div>
					<div className='space-y-3.5'>
						{courseStats.map(c => (
							<div key={c.name}>
								<div className='flex items-center justify-between mb-1.5'>
									<div className='flex items-center gap-2'>
										<div className={`w-2 h-2 rounded-full ${c.color}`} />
										<span className='text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[110px]'>
											{c.name}
										</span>
									</div>
									<div className='text-right'>
										<span className='text-xs font-black text-slate-900 dark:text-white'>
											{c.students}
										</span>
										<span className='text-[10px] text-slate-400 ml-1'>
											talaba
										</span>
									</div>
								</div>
								{/* Progress bar */}
								<div className='h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
									<div
										className={`h-full ${c.color} rounded-full transition-all duration-700`}
										style={{ width: `${c.progress}%` }}
									/>
								</div>
							</div>
						))}
					</div>

					{/* Mini totals */}
					<div className='grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800'>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5'>
							<p className='text-[10px] text-slate-400 mb-0.5'>Jami talaba</p>
							<p className='text-base font-black text-slate-900 dark:text-white'>
								524
							</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5'>
							<p className='text-[10px] text-slate-400 mb-0.5'>Jami daromad</p>
							<p className='text-base font-black text-slate-900 dark:text-white'>
								$8,550
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* ── Recent students ── */}
			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				<div className='flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800'>
					<div>
						<h3 className='font-black text-slate-900 dark:text-white text-sm'>
							So'nggi Ro'yxatdan O'tganlar
						</h3>
						<p className='text-[10px] text-slate-400 mt-0.5'>
							Oxirgi 5 ta yangi talaba
						</p>
					</div>
					<button className='text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors flex items-center gap-1'>
						Barchasi <ArrowUpRight className='w-3.5 h-3.5' />
					</button>
				</div>

				{/* Table */}
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-slate-100 dark:border-slate-800'>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-2.5'>
									Talaba
								</th>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2.5 hidden sm:table-cell'>
									Kurs
								</th>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2.5 hidden md:table-cell'>
									Sana
								</th>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2.5'>
									Holat
								</th>
								<th className='text-right text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-2.5'>
									To'lov
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
							{recentStudents.map(s => (
								<tr
									key={s.name}
									className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group'
								>
									<td className='px-5 py-3'>
										<div className='flex items-center gap-3'>
											<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0'>
												<span className='text-white text-[10px] font-black'>
													{s.avatar}
												</span>
											</div>
											<span className='font-semibold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[120px]'>
												{s.name}
											</span>
										</div>
									</td>
									<td className='px-3 py-3 hidden sm:table-cell'>
										<span className='text-xs text-slate-500 dark:text-slate-400'>
											{s.course}
										</span>
									</td>
									<td className='px-3 py-3 hidden md:table-cell'>
										<span className='text-xs text-slate-400'>{s.date}</span>
									</td>
									<td className='px-3 py-3'>
										<StatusBadge status={s.status} />
									</td>
									<td className='px-5 py-3 text-right'>
										<span className='text-xs font-black text-slate-900 dark:text-white'>
											{s.amount}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* ── Bottom row: quick stats ── */}
			<div className='grid sm:grid-cols-3 gap-4'>
				{[
					{
						label: 'Bu oyda yangi talabalar',
						value: '48',
						sub: "+12 o'gan haftaga",
						icon: Users,
						color: 'text-blue-600 dark:text-blue-400',
						bg: 'bg-blue-50 dark:bg-blue-500/10',
					},
					{
						label: 'Kurs yakunlagan talabalar',
						value: '31',
						sub: 'Sertifikat berildi',
						icon: GraduationCap,
						color: 'text-emerald-600 dark:text-emerald-400',
						bg: 'bg-emerald-50 dark:bg-emerald-500/10',
					},
					{
						label: "Kutilayotgan to'lovlar",
						value: '7',
						sub: '$1,240 jami',
						icon: CreditCard,
						color: 'text-amber-600 dark:text-amber-400',
						bg: 'bg-amber-50 dark:bg-amber-500/10',
					},
				].map(item => {
					const Icon = item.icon
					return (
						<div
							key={item.label}
							className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5'
						>
							<div
								className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}
							>
								<Icon
									className={item.color}
									style={{ width: 18, height: 18 }}
								/>
							</div>
							<div>
								<p className='text-xl font-black text-slate-900 dark:text-white leading-none'>
									{item.value}
								</p>
								<p className='text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5'>
									{item.label}
								</p>
								<p className='text-[10px] text-slate-400 mt-0.5'>{item.sub}</p>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
