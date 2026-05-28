'use client'

import { supabase } from '@/lib/supabase'
import {
	ArrowUpRight,
	CheckCircle2,
	Clock,
	DollarSign,
	Download,
	Loader2,
	MoreHorizontal,
	Search,
	XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type PaymentRow = {
	id: number
	student_id: number
	amount: number
	method: string
	status: 'completed' | 'pending' | 'failed'
	paid_at: string
	students?: { first_name: string; last_name: string } | null
}

const statusMap = {
	completed: { label: "To'landi", cls: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', icon: CheckCircle2 },
	pending: { label: 'Kutilmoqda', cls: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400', icon: Clock },
	failed: { label: 'Muvaffaqiyatsiz', cls: 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400', icon: XCircle },
}

const colors = ['from-blue-500 to-indigo-600', 'from-pink-500 to-rose-600', 'from-emerald-500 to-teal-600', 'from-violet-500 to-purple-600', 'from-cyan-500 to-blue-600', 'from-amber-500 to-orange-600']

export default function PaymentsPage() {
	const [payments, setPayments] = useState<PaymentRow[]>([])
	const [loading, setLoading] = useState(true)
	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')
	const [menu, setMenu] = useState<number | null>(null)

	const fetchPayments = async () => {
		setLoading(true)
		const { data } = await supabase
			.from('payments')
			.select('*, students(first_name, last_name)')
			.order('paid_at', { ascending: false })
		setPayments(data || [])
		setLoading(false)
	}

	useEffect(() => { fetchPayments() }, [])

	const filtered = payments.filter(p => {
		const name = p.students ? `${p.students.first_name} ${p.students.last_name}` : `Talaba #${p.student_id}`
		return (name.toLowerCase().includes(search.toLowerCase()) || `PAY-${p.id}`.includes(search)) &&
			(filter === 'all' || p.status === filter)
	})

	const totalRevenue = payments.filter(p => p.status === 'completed').reduce((a, p) => a + p.amount, 0)
	const pendingTotal = payments.filter(p => p.status === 'pending').reduce((a, p) => a + p.amount, 0)
	const pendingCount = payments.filter(p => p.status === 'pending').length
	const failedCount = payments.filter(p => p.status === 'failed').length

	return (
		<div className='space-y-5 pb-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white tracking-tight'>To'lovlar</h1>
					<p className='text-slate-400 text-xs mt-0.5'>Barcha to'lovlarni kuzating</p>
				</div>
				<button onClick={fetchPayments} className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'>
					<Download className='w-3.5 h-3.5' /> Yangilash
				</button>
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				{[
					{ label: 'Jami Daromad', value: `$${totalRevenue.toLocaleString()}`, change: `${payments.length} ta`, up: true, icon: DollarSign, bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400' },
					{ label: "To'langan", value: `${payments.filter(p => p.status === 'completed').length} ta`, change: `$${totalRevenue}`, up: true, icon: CheckCircle2, bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600 dark:text-blue-400' },
					{ label: 'Kutilayotgan', value: `$${pendingTotal}`, change: `${pendingCount} ta`, up: true, icon: Clock, bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-600 dark:text-amber-400' },
					{ label: 'Muvaffaqiyatsiz', value: `${failedCount}`, change: '-', up: false, icon: XCircle, bg: 'bg-red-50 dark:bg-red-500/10', color: 'text-red-600 dark:text-red-400' },
				].map(s => {
					const Icon = s.icon
					return (
						<div key={s.label} className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm'>
							<div className='flex items-center justify-between mb-2'>
								<div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center`}>
									<Icon className={s.color} style={{ width: 16, height: 16 }} />
								</div>
								<span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${s.up && s.change !== '-' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
									{s.up && s.change !== '-' && <ArrowUpRight className='w-2.5 h-2.5' />}
									{s.change}
								</span>
							</div>
							<div className='text-lg font-black text-slate-900 dark:text-white'>{s.value}</div>
							<div className='text-[11px] text-slate-400'>{s.label}</div>
						</div>
					)
				})}
			</div>

			<div className='flex items-center gap-3'>
				<div className='relative flex-1 max-w-xs'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
					<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ism yoki ID..." className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors' />
				</div>
				<div className='flex gap-1.5'>
					{(['all', 'completed', 'pending', 'failed'] as const).map(f => (
						<button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}>
							{f === 'all' ? `Barchasi (${payments.length})` : f === 'completed' ? `To'landi (${payments.filter(p => p.status === 'completed').length})` : f === 'pending' ? `Kutilmoqda (${pendingCount})` : `Muvaffaqiyatsiz (${failedCount})`}
						</button>
					))}
				</div>
			</div>

			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				{loading ? (
					<div className='flex items-center justify-center py-16 gap-3'>
						<Loader2 className='w-5 h-5 animate-spin text-blue-600' />
						<span className='text-sm text-slate-400'>Yuklanmoqda...</span>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-slate-100 dark:border-slate-800'>
									{['ID', 'Talaba', 'Summa', 'Usul', 'Sana', 'Holat', ''].map(h => (
										<th key={h} className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3'>{h}</th>
									))}
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
								{filtered.length === 0 ? (
									<tr><td colSpan={7} className='text-center py-12 text-slate-400 text-sm'>To'lov topilmadi</td></tr>
								) : (
									filtered.map((p, idx) => {
										const st = statusMap[p.status]
										const Icon = st.icon
										const name = p.students ? `${p.students.first_name} ${p.students.last_name}` : `Talaba #${p.student_id}`
										const initials = p.students ? `${p.students.first_name[0]}${p.students.last_name[0]}`.toUpperCase() : 'T'
										return (
											<tr key={p.id} className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
												<td className='px-4 py-3'><span className='text-[10px] font-bold text-slate-400 font-mono'>PAY-{p.id}</span></td>
												<td className='px-4 py-3'>
													<div className='flex items-center gap-2'>
														<div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colors[idx % colors.length]} flex items-center justify-center shrink-0`}>
															<span className='text-white text-[9px] font-black'>{initials}</span>
														</div>
														<span className='text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]'>{name}</span>
													</div>
												</td>
												<td className='px-4 py-3'><span className='text-sm font-black text-slate-900 dark:text-white'>${p.amount}</span></td>
												<td className='px-4 py-3'><span className='text-[11px] text-slate-500'>{p.method}</span></td>
												<td className='px-4 py-3'><span className='text-[11px] text-slate-400'>{new Date(p.paid_at).toLocaleDateString('uz-UZ')}</span></td>
												<td className='px-4 py-3'>
													<span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${st.cls}`}>
														<Icon className='w-2.5 h-2.5' /> {st.label}
													</span>
												</td>
												<td className='px-4 py-3'>
													<div className='relative'>
														<button onClick={() => setMenu(menu === p.id ? null : p.id)} className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'>
															<MoreHorizontal className='w-4 h-4' />
														</button>
														{menu === p.id && (
															<div className='absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1'>
																<button onClick={() => setMenu(null)} className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'>Ko'rish</button>
															</div>
														)}
													</div>
												</td>
											</tr>
										)
									})
								)}
							</tbody>
						</table>
					</div>
				)}
				{!loading && (
					<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-800'>
						<p className='text-[11px] text-slate-400'>{filtered.length} ta to'lov</p>
					</div>
				)}
			</div>
		</div>
	)
}
