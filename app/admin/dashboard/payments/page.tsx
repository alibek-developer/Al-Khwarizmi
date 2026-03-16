'use client'

import {
	ArrowUpRight,
	CheckCircle2,
	Clock,
	DollarSign,
	Download,
	Eye,
	MoreHorizontal,
	Search,
	TrendingUp,
	XCircle,
} from 'lucide-react'
import { useState } from 'react'

const paymentsData = [
	{
		id: 'PAY-001',
		student: 'Abdullayev Jasur',
		avatar: 'AJ',
		color: 'from-blue-500 to-indigo-600',
		course: 'Web Development',
		amount: '$499',
		date: '12 yan 2025',
		method: 'Naqd',
		status: 'completed',
	},
	{
		id: 'PAY-002',
		student: 'Toshmatova Dilnoza',
		avatar: 'TD',
		color: 'from-pink-500 to-rose-600',
		course: 'English Course',
		amount: '$299',
		date: '11 yan 2025',
		method: 'Karta',
		status: 'completed',
	},
	{
		id: 'PAY-003',
		student: 'Karimov Sherzod',
		avatar: 'KS',
		color: 'from-emerald-500 to-teal-600',
		course: 'Data Science',
		amount: '$449',
		date: '10 yan 2025',
		method: "To'lov tizimi",
		status: 'pending',
	},
	{
		id: 'PAY-004',
		student: 'Yusupova Malika',
		avatar: 'YM',
		color: 'from-violet-500 to-purple-600',
		course: 'AI & ML',
		amount: '$599',
		date: '9 yan 2025',
		method: 'Karta',
		status: 'completed',
	},
	{
		id: 'PAY-005',
		student: 'Normatov Bobur',
		avatar: 'NB',
		color: 'from-slate-500 to-slate-700',
		course: 'English Course',
		amount: '$299',
		date: '8 yan 2025',
		method: 'Naqd',
		status: 'failed',
	},
	{
		id: 'PAY-006',
		student: 'Hasanov Ulugbek',
		avatar: 'HU',
		color: 'from-cyan-500 to-blue-600',
		course: 'Web Development',
		amount: '$499',
		date: '7 yan 2025',
		method: 'Karta',
		status: 'completed',
	},
	{
		id: 'PAY-007',
		student: 'Rahimova Zulfiya',
		avatar: 'RZ',
		color: 'from-amber-500 to-orange-600',
		course: 'Data Science',
		amount: '$449',
		date: '6 yan 2025',
		method: "To'lov tizimi",
		status: 'pending',
	},
]

const statusMap = {
	completed: {
		label: "To'landi",
		cls: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
		icon: CheckCircle2,
	},
	pending: {
		label: 'Kutilmoqda',
		cls: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
		icon: Clock,
	},
	failed: {
		label: 'Muvaffaqiyatsiz',
		cls: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400',
		icon: XCircle,
	},
}

const monthlyRevenue = [
	1200, 1800, 1400, 2200, 2000, 2600, 2200, 3100, 2800, 3400, 3100, 3800,
]
const months = ['Y', 'F', 'M', 'A', 'M', 'I', 'I', 'A', 'S', 'O', 'N', 'D']

export default function PaymentsPage() {
	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState<
		'all' | 'completed' | 'pending' | 'failed'
	>('all')
	const [menu, setMenu] = useState<string | null>(null)

	const filtered = paymentsData.filter(p => {
		const matchSearch =
			p.student.toLowerCase().includes(search.toLowerCase()) ||
			p.course.toLowerCase().includes(search.toLowerCase()) ||
			p.id.toLowerCase().includes(search.toLowerCase())
		const matchFilter = filter === 'all' || p.status === filter
		return matchSearch && matchFilter
	})

	const totalRevenue = paymentsData
		.filter(p => p.status === 'completed')
		.reduce((a, p) => a + parseInt(p.amount.replace('$', '')), 0)
	const pending = paymentsData
		.filter(p => p.status === 'pending')
		.reduce((a, p) => a + parseInt(p.amount.replace('$', '')), 0)
	const maxBar = Math.max(...monthlyRevenue)

	return (
		<div className='space-y-5 pb-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white tracking-tight'>
						To'lovlar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						Barcha to'lovlarni kuzating
					</p>
				</div>
				<button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'>
					<Download className='w-3.5 h-3.5' /> Eksport
				</button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				{[
					{
						label: 'Jami Daromad',
						value: `$${totalRevenue.toLocaleString()}`,
						change: '+23%',
						up: true,
						icon: DollarSign,
						bg: 'bg-emerald-50 dark:bg-emerald-500/10',
						color: 'text-emerald-600 dark:text-emerald-400',
					},
					{
						label: 'Bu oyda',
						value: '$2,146',
						change: '+18%',
						up: true,
						icon: TrendingUp,
						bg: 'bg-blue-50 dark:bg-blue-500/10',
						color: 'text-blue-600 dark:text-blue-400',
					},
					{
						label: 'Kutilayotgan',
						value: `$${pending}`,
						change: `${paymentsData.filter(p => p.status === 'pending').length} ta`,
						up: true,
						icon: Clock,
						bg: 'bg-amber-50 dark:bg-amber-500/10',
						color: 'text-amber-600 dark:text-amber-400',
					},
					{
						label: 'Muvaffaqiyatsiz',
						value: `${paymentsData.filter(p => p.status === 'failed').length}`,
						change: '-',
						up: false,
						icon: XCircle,
						bg: 'bg-red-50 dark:bg-red-500/10',
						color: 'text-red-600 dark:text-red-400',
					},
				].map(s => {
					const Icon = s.icon
					return (
						<div
							key={s.label}
							className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm'
						>
							<div className='flex items-center justify-between mb-2'>
								<div
									className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center`}
								>
									<Icon className={s.color} style={{ width: 16, height: 16 }} />
								</div>
								<span
									className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${s.up && s.change !== '-' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}
								>
									{s.up && s.change !== '-' && (
										<ArrowUpRight className='w-2.5 h-2.5' />
									)}
									{s.change}
								</span>
							</div>
							<div className='text-lg font-black text-slate-900 dark:text-white'>
								{s.value}
							</div>
							<div className='text-[11px] text-slate-400'>{s.label}</div>
						</div>
					)
				})}
			</div>

			{/* Mini chart */}
			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm'>
				<div className='flex items-center justify-between mb-4'>
					<div>
						<p className='text-sm font-black text-slate-900 dark:text-white'>
							Oylik daromad
						</p>
						<p className='text-[10px] text-slate-400'>2025-yil</p>
					</div>
					<span className='text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1'>
						<ArrowUpRight className='w-3 h-3' /> +23% o'tgan yilga nisbatan
					</span>
				</div>
				<div className='flex items-end gap-1.5 h-20'>
					{monthlyRevenue.map((v, i) => (
						<div
							key={i}
							className='flex-1 flex flex-col items-center gap-1 group'
						>
							<div
								className='w-full relative rounded-t-md'
								style={{ height: 72 }}
							>
								<div
									className={`absolute bottom-0 w-full rounded-t-md transition-all ${i === monthlyRevenue.length - 1 ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-300 dark:group-hover:bg-blue-500/50'}`}
									style={{ height: `${(v / maxBar) * 100}%` }}
								/>
							</div>
							<span className='text-[8px] text-slate-400'>{months[i]}</span>
						</div>
					))}
				</div>
			</div>

			{/* Search + filter */}
			<div className='flex items-center gap-3'>
				<div className='relative flex-1 max-w-xs'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="To'lov ID yoki ism..."
						className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
					/>
				</div>
				<div className='flex gap-1.5'>
					{(['all', 'completed', 'pending', 'failed'] as const).map(f => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
						>
							{f === 'all'
								? 'Barchasi'
								: f === 'completed'
									? "To'landi"
									: f === 'pending'
										? 'Kutilmoqda'
										: 'Muvaffaqiyatsiz'}
						</button>
					))}
				</div>
			</div>

			{/* Table */}
			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-slate-100 dark:border-slate-800'>
								{[
									'ID',
									'Talaba',
									'Kurs',
									'Summa',
									'Usul',
									'Sana',
									'Holat',
									'',
								].map(h => (
									<th
										key={h}
										className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3'
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
							{filtered.map(p => {
								const st = statusMap[p.status as keyof typeof statusMap]
								const Icon = st.icon
								return (
									<tr
										key={p.id}
										className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
									>
										<td className='px-4 py-3'>
											<span className='text-[10px] font-bold text-slate-400 font-mono'>
												{p.id}
											</span>
										</td>
										<td className='px-4 py-3'>
											<div className='flex items-center gap-2'>
												<div
													className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center shrink-0`}
												>
													<span className='text-white text-[9px] font-black'>
														{p.avatar}
													</span>
												</div>
												<span className='text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]'>
													{p.student}
												</span>
											</div>
										</td>
										<td className='px-4 py-3'>
											<span className='text-[11px] text-slate-500 dark:text-slate-400'>
												{p.course}
											</span>
										</td>
										<td className='px-4 py-3'>
											<span className='text-sm font-black text-slate-900 dark:text-white'>
												{p.amount}
											</span>
										</td>
										<td className='px-4 py-3'>
											<span className='text-[11px] text-slate-500 dark:text-slate-400'>
												{p.method}
											</span>
										</td>
										<td className='px-4 py-3'>
											<span className='text-[11px] text-slate-400'>
												{p.date}
											</span>
										</td>
										<td className='px-4 py-3'>
											<span
												className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${st.cls}`}
											>
												<Icon className='w-2.5 h-2.5' /> {st.label}
											</span>
										</td>
										<td className='px-4 py-3'>
											<div className='relative'>
												<button
													onClick={() => setMenu(menu === p.id ? null : p.id)}
													className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
												>
													<MoreHorizontal className='w-4 h-4' />
												</button>
												{menu === p.id && (
													<div className='absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1'>
														{[
															{ icon: Eye, label: "Ko'rish" },
															{ icon: Download, label: 'Chek yuklab' },
														].map(({ icon: Icon, label }) => (
															<button
																key={label}
																onClick={() => setMenu(null)}
																className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
															>
																<Icon className='w-3.5 h-3.5' /> {label}
															</button>
														))}
													</div>
												)}
											</div>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-800'>
					<p className='text-[11px] text-slate-400'>
						{filtered.length} ta to'lov ko'rsatilmoqda
					</p>
				</div>
			</div>
		</div>
	)
}
