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
import { supabase } from '@/lib/supabase'

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
		<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${s.cls}`}>
			<Icon className='w-2.5 h-2.5' /> {s.label}
		</span>
	)
}

const months = ['Y', 'F', 'M', 'A', 'M', 'I', 'I', 'A', 'S', 'O', 'N', 'D']

export default function AdminDashboardPage() {
	const router = useRouter()
	const [greeting, setGreeting] = useState('')
	const [isMounted, setIsMounted] = useState(false)
	const [loading, setLoading] = useState(true)

	const [studentCount, setStudentCount] = useState(0)
	const [totalRevenue, setTotalRevenue] = useState(0)
	const [courseCount, setCourseCount] = useState(0)
	const [avgRating, setAvgRating] = useState(0)
	const [monthlyRevenue, setMonthlyRevenue] = useState<number[]>(Array(12).fill(0))
	const [courseBreakdown, setCourseBreakdown] = useState<{ name: string; students: number; color: string }[]>([])
	const [recentStudents, setRecentStudents] = useState<any[]>([])
	const [newThisMonth, setNewThisMonth] = useState(0)
	const [certCount, setCertCount] = useState(0)
	const [pendingRevenue, setPendingRevenue] = useState(0)

	const colors = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500']

	useEffect(() => {
		setIsMounted(true)
		const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
		const userRole = localStorage.getItem('userRole')
		if (!isLoggedIn || userRole !== 'admin') {
			router.replace('/login')
			return
		}
		const h = new Date().getHours()
		if (h < 12) setGreeting('Xayrli tong')
		else if (h < 17) setGreeting('Xayrli kun')
		else setGreeting('Xayrli kech')
	}, [router])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const now = new Date()
				const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

				const [studRes, payRes, courseRes, revRes, recentRes, newRes, certRes, pendRes, monthlyRes] =
					await Promise.all([
						supabase.from('students').select('id', { count: 'exact', head: true }),
						supabase.from('payments').select('amount').eq('status', 'completed'),
						supabase.from('courses').select('id', { count: 'exact', head: true }),
						supabase.from('reviews').select('rating'),
						supabase.from('students').select('*, courses(title_en)').order('created_at', { ascending: false }).limit(5),
						supabase.from('students').select('id', { count: 'exact', head: true }).gte('created_at', startOfMonth),
						supabase.from('certificates').select('id', { count: 'exact', head: true }),
						supabase.from('payments').select('amount').eq('status', 'pending'),
						supabase.from('payments').select('amount, paid_at').eq('status', 'completed'),
					])

				setStudentCount(studRes.count ?? 0)
				setCourseCount(courseRes.count ?? 0)
				setNewThisMonth(newRes.count ?? 0)
				setCertCount(certRes.count ?? 0)

				const allPayments = payRes.data || []
				const totalAmt = allPayments.reduce((sum, p) => sum + Number(p.amount), 0)
				setTotalRevenue(totalAmt)

				const ratings = revRes.data || []
				setAvgRating(ratings.length > 0
					? Math.round(ratings.reduce((s, r) => s + r.rating, 0) / ratings.length * 10) / 10
					: 0
				)

				// Oylik daromad
				const monthly = Array(12).fill(0)
				const monthlyPayments = monthlyRes.data || []
				monthlyPayments.forEach(p => {
					if (p.paid_at) {
						const m = new Date(p.paid_at).getMonth()
						monthly[m] += Number(p.amount)
					}
				})
				setMonthlyRevenue(monthly)

				// Course breakdown
				const { data: courses } = await supabase.from('courses').select('id, title_en')
				if (courses) {
					const breakdown = await Promise.all(
						courses.map(async (c, i) => {
							const { count } = await supabase
								.from('students')
								.select('id', { count: 'exact', head: true })
								.eq('course_id', c.id)
							return { name: c.title_en, students: count ?? 0, color: colors[i % colors.length] }
						})
					)
					setCourseBreakdown(breakdown)
				}

				// Recent students
				if (recentRes.data) {
					setRecentStudents(
						recentRes.data.map((s: any) => ({
							name: `${s.first_name || ''} ${s.last_name || ''}`.trim(),
							course: s.courses?.title_en || '—',
							date: s.created_at ? new Date(s.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }) : '—',
							status: s.status || 'pending',
							avatar: ((s.first_name?.[0] || '') + (s.last_name?.[0] || '')).slice(0, 2) || '??',
							amount: s.payment_amount ? `$${s.payment_amount}` : '$0',
						}))
					)
				}

				const pendingPayments = pendRes.data || []
				setPendingRevenue(pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0))
			} catch (err) {
				console.error('Dashboard yuklashda xato:', err)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	const today = new Date().toLocaleDateString('uz-UZ', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})

	const maxMonthly = Math.max(...monthlyRevenue, 1)

	const statCards = [
		{
			id: 'students', label: 'Talabalar', value: String(studentCount), change: '', up: true,
			desc: 'Jami talabalar', icon: Users, light: 'bg-blue-50 dark:bg-blue-500/10',
			text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-500/20',
		},
		{
			id: 'revenue', label: 'Daromad', value: `$${totalRevenue.toLocaleString()}`, change: '', up: true,
			desc: "To'langan to'lovlar", icon: CreditCard, light: 'bg-emerald-50 dark:bg-emerald-500/10',
			text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-500/20',
		},
		{
			id: 'courses', label: 'Faol Kurslar', value: String(courseCount), change: '', up: true,
			desc: 'Barcha kurslar', icon: BookOpen, light: 'bg-violet-50 dark:bg-violet-500/10',
			text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-500/20',
		},
		{
			id: 'rating', label: "O'rtacha Reyting", value: String(avgRating), change: '', up: true,
			desc: "Barcha kurslar bo'yicha", icon: Star, light: 'bg-amber-50 dark:bg-amber-500/10',
			text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-500/20',
		},
	]

	if (!isMounted || loading) {
		return (
			<div className='flex items-center justify-center h-64'>
				<div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
			</div>
		)
	}

	return (
		<div className='space-y-5 pb-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white tracking-tight'>
						{greeting}, Admin 👋
					</h1>
					<p className='text-slate-400 dark:text-slate-500 text-xs mt-0.5 capitalize'>{today}</p>
				</div>
				<div className='hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 shadow-sm'>
					<div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
					<span className='text-xs font-semibold text-slate-600 dark:text-slate-300'>Tizim faol</span>
				</div>
			</div>

			<div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
				{statCards.map((stat, idx) => {
					const Icon = stat.icon
					return (
						<div key={stat.id} className='group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5'>
							<div className='flex items-start justify-between mb-3'>
								<div className={`w-9 h-9 ${stat.light} border ${stat.border} rounded-xl flex items-center justify-center`}>
									<Icon className={stat.text} style={{ width: 17, height: 17 }} />
								</div>
							</div>
							<div className='text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5'>{stat.value}</div>
							<div className='text-xs font-semibold text-slate-600 dark:text-slate-300'>{stat.label}</div>
							<div className='text-[10px] text-slate-400 mt-0.5'>{stat.desc}</div>
						</div>
					)
				})}
			</div>

			<div className='grid lg:grid-cols-5 gap-4'>
				<div className='lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm'>
					<div className='flex items-center justify-between mb-5'>
						<div>
							<h3 className='font-black text-slate-900 dark:text-white text-sm'>Oylik Daromad</h3>
							<p className='text-[10px] text-slate-400 mt-0.5'>{new Date().getFullYear()}-yil bo'yicha</p>
						</div>
						<div className='text-right'>
							<p className='text-xl font-black text-slate-900 dark:text-white'>${totalRevenue.toLocaleString()}</p>
						</div>
					</div>
					<div className='flex items-end gap-1.5 h-28 mb-2'>
						{monthlyRevenue.map((v, i) => {
							const height = `${(v / maxMonthly) * 100}%`
							const isLast = i === monthlyRevenue.length - 1
							return (
								<div key={i} className='flex-1 flex flex-col items-center gap-1 group/bar'>
									<div className='w-full relative rounded-t-lg overflow-hidden' style={{ height: 96 }}>
										<div
											className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${isLast ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700 group-hover/bar:bg-blue-300 dark:group-hover/bar:bg-blue-500/50'}`}
											style={{ height }}
										/>
									</div>
									<span className='text-[9px] text-slate-400'>{months[i]}</span>
								</div>
							)
						})}
					</div>
				</div>

				<div className='lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='font-black text-slate-900 dark:text-white text-sm'>Kurslar bo'yicha</h3>
						<BookOpen className='w-4 h-4 text-slate-400' />
					</div>
					<div className='space-y-3.5'>
						{courseBreakdown.length > 0 ? courseBreakdown.map(c => (
							<div key={c.name}>
								<div className='flex items-center justify-between mb-1.5'>
									<div className='flex items-center gap-2'>
										<div className={`w-2 h-2 rounded-full ${c.color}`} />
										<span className='text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[110px]'>{c.name}</span>
									</div>
									<div className='text-right'>
										<span className='text-xs font-black text-slate-900 dark:text-white'>{c.students}</span>
										<span className='text-[10px] text-slate-400 ml-1'>talaba</span>
									</div>
								</div>
							</div>
						)) : (
							<p className='text-xs text-slate-400 text-center py-4'>Kurslar mavjud emas</p>
						)}
					</div>
					<div className='grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800'>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5'>
							<p className='text-[10px] text-slate-400 mb-0.5'>Jami talaba</p>
							<p className='text-base font-black text-slate-900 dark:text-white'>{studentCount}</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5'>
							<p className='text-[10px] text-slate-400 mb-0.5'>Jami daromad</p>
							<p className='text-base font-black text-slate-900 dark:text-white'>${totalRevenue.toLocaleString()}</p>
						</div>
					</div>
				</div>
			</div>

			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				<div className='flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800'>
					<div>
						<h3 className='font-black text-slate-900 dark:text-white text-sm'>So'nggi Ro'yxatdan O'tganlar</h3>
						<p className='text-[10px] text-slate-400 mt-0.5'>Oxirgi 5 ta yangi talaba</p>
					</div>
				</div>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-slate-100 dark:border-slate-800'>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-2.5'>Talaba</th>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2.5 hidden sm:table-cell'>Kurs</th>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2.5 hidden md:table-cell'>Sana</th>
								<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2.5'>Holat</th>
								<th className='text-right text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-2.5'>To'lov</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
							{recentStudents.length > 0 ? recentStudents.map(s => (
								<tr key={s.name + s.date} className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group'>
									<td className='px-5 py-3'>
										<div className='flex items-center gap-3'>
											<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0'>
												<span className='text-white text-[10px] font-black'>{s.avatar}</span>
											</div>
											<span className='font-semibold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[120px]'>{s.name}</span>
										</div>
									</td>
									<td className='px-3 py-3 hidden sm:table-cell'>
										<span className='text-xs text-slate-500 dark:text-slate-400'>{s.course}</span>
									</td>
									<td className='px-3 py-3 hidden md:table-cell'>
										<span className='text-xs text-slate-400'>{s.date}</span>
									</td>
									<td className='px-3 py-3'><StatusBadge status={s.status} /></td>
									<td className='px-5 py-3 text-right'>
										<span className='text-xs font-black text-slate-900 dark:text-white'>{s.amount}</span>
									</td>
								</tr>
							)) : (
								<tr><td colSpan={5} className='text-center py-8 text-xs text-slate-400'>Talabalar mavjud emas</td></tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<div className='grid sm:grid-cols-3 gap-4'>
				{[
					{ label: 'Bu oyda yangi talabalar', value: String(newThisMonth), sub: "Ro'yxatdan o'tgan", icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
					{ label: 'Kurs yakunlagan talabalar', value: String(certCount), sub: 'Sertifikat berildi', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
					{ label: "Kutilayotgan to'lovlar", value: String(pendingRevenue ? `$${pendingRevenue}` : '$0'), sub: 'To\'lanmagan', icon: CreditCard, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
				].map(item => {
					const Icon = item.icon
					return (
						<div key={item.label} className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5'>
							<div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
								<Icon className={item.color} style={{ width: 18, height: 18 }} />
							</div>
							<div>
								<p className='text-xl font-black text-slate-900 dark:text-white'>{item.value}</p>
								<p className='text-xs font-semibold text-slate-600 dark:text-slate-300'>{item.label}</p>
								<p className='text-[10px] text-slate-400 mt-0.5'>{item.sub}</p>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
