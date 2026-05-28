'use client'

import { supabase } from '@/lib/supabase'
import {
	CheckCircle2,
	CreditCard,
	Loader2,
	XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type Payment = {
	id: number
	amount: number
	method: string
	status: 'pending' | 'completed' | 'failed'
	description: string | null
	paid_at: string
}

export default function StudentPaymentsPage() {
	const [payments, setPayments] = useState<Payment[]>([])
	const [courseName, setCourseName] = useState('')
	const [coursePrice, setCoursePrice] = useState(0)
	const [payAmount, setPayAmount] = useState(0)
	const [payMethod, setPayMethod] = useState('Karta')
	const [loading, setLoading] = useState(true)
	const [paying, setPaying] = useState(false)
	const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

	const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	const fetchData = async () => {
		const studentId = localStorage.getItem('studentId')
		if (!studentId) { setLoading(false); return }

		let price = 0
		let totalPaid = 0

		const { data: student } = await supabase
			.from('students')
			.select('course_id, courses(price, title_en)')
			.eq('id', Number(studentId))
			.single()

		if (student) {
			const c = student.courses as { title_en: string; price: number } | null
			price = Number(c?.price) || 0
			setCourseName(c?.title_en || '—')
			setCoursePrice(price)
		}

		const { data } = await supabase
			.from('payments')
			.select('*')
			.eq('student_id', Number(studentId))
			.order('created_at', { ascending: false })
		setPayments(data || [])

		totalPaid = (data || [])
			.filter(p => p.status === 'completed')
			.reduce((a, p) => a + p.amount, 0)

		setPayAmount(Math.max(0, price - totalPaid) || price)
		setLoading(false)
	}

	useEffect(() => { fetchData() }, [])

	const handlePay = async () => {
		const studentId = localStorage.getItem('studentId')
		const studentName = localStorage.getItem('studentName')
		if (!studentId) return
		setPaying(true)
		const { error } = await supabase.from('payments').insert([
			{
				student_id: Number(studentId),
				amount: payAmount,
				method: payMethod,
				status: 'completed',
				description: `${studentName || 'Talaba'} tomonidan to'landi`,
			},
		])
		setPaying(false)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast(`$${payAmount} to'lov muvaffaqiyatli amalga oshirildi!`)
		fetchData()
	}

	const totalPaid = payments
		.filter(p => p.status === 'completed')
		.reduce((a, p) => a + p.amount, 0)

	const remaining = Math.max(0, coursePrice - totalPaid)

	const statusBadge = (status: string) => {
		if (status === 'completed') return 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
		if (status === 'pending') return 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'
		return 'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'
	}

	return (
		<div className='space-y-5 pb-6'>
			{toast && (
				<div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
					{toast.type === 'success' ? <CheckCircle2 className='w-4 h-4' /> : <XCircle className='w-4 h-4' />}
					{toast.msg}
				</div>
			)}

			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white tracking-tight'>To'lovlar</h1>
					<p className='text-slate-400 text-xs mt-0.5'>Kurs to'lovlari va to'lov qilish</p>
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
				<div className='bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl'>
					<p className='text-sm text-blue-200 font-medium mb-1'>Kurs</p>
					<p className='text-lg font-black'>{courseName}</p>
				</div>
				<div className='bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-xl'>
					<p className='text-sm text-emerald-200 font-medium mb-1'>Kurs narxi</p>
					<p className='text-3xl font-black'>${coursePrice}</p>
				</div>
				<div className='bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-5 text-white shadow-xl'>
					<p className='text-sm text-amber-200 font-medium mb-1'>Qolgan to'lov</p>
					<p className='text-3xl font-black'>${remaining}</p>
				</div>
			</div>

			<div className='bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-5 text-white shadow-xl'>
				<p className='text-sm text-slate-300 font-medium mb-1'>Jami to'langan</p>
				<p className='text-3xl font-black'>${totalPaid}</p>
				<p className='text-xs text-slate-400 mt-1'>{payments.length} ta to'lov</p>
			</div>

			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5'>
				<h2 className='text-sm font-black text-slate-900 dark:text-white mb-3'>To'lov qilish</h2>
				<div className='flex flex-col sm:flex-row gap-3'>
					<div className='flex-1'>
						<label className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block'>Summa</label>
						<div className='relative'>
							<span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold'>$</span>
							<input
								type='number'
								className='w-full h-10 pl-7 pr-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors'
								value={payAmount}
								onChange={e => setPayAmount(Number(e.target.value) || 0)}
								min={1}
								max={remaining}
							/>
						</div>
					</div>
					<div className='w-full sm:w-44'>
						<label className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block'>Usul</label>
						<select
							className='w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors'
							value={payMethod}
							onChange={e => setPayMethod(e.target.value)}
						>
							<option value='Karta'>Karta</option>
							<option value='Naqd'>Naqd</option>
							<option value="To'lov tizimi">To'lov tizimi</option>
						</select>
					</div>
					<div className='flex items-end'>
						<button
							onClick={handlePay}
							disabled={paying}
							className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25 h-10'
						>
							{paying ? (
								<><Loader2 className='w-3.5 h-3.5 animate-spin' /> To'lanmoqda...</>
							) : (
								<><CreditCard className='w-3.5 h-3.5' /> To'lash</>
							)}
						</button>
					</div>
				</div>
			</div>

			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				{loading ? (
					<div className='flex items-center justify-center py-16 gap-3'>
						<Loader2 className='w-5 h-5 animate-spin text-blue-600' />
						<span className='text-sm text-slate-400'>Yuklanmoqda...</span>
					</div>
				) : payments.length === 0 ? (
					<div className='text-center py-16'>
						<CreditCard className='w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3' />
						<p className='text-slate-500 dark:text-slate-400 text-sm'>Hali to'lov qilinmagan</p>
						<p className='text-xs text-slate-400 mt-1'>Yuqoridagi forma orqali to'lov qiling</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-slate-100 dark:border-slate-800'>
									{['#', 'Summa', 'Usul', 'Sana', 'Holat'].map(h => (
										<th key={h} className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3'>{h}</th>
									))}
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
								{payments.map((p, idx) => (
									<tr key={p.id} className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'>
										<td className='px-4 py-3'><span className='text-xs text-slate-400 font-mono'>{idx + 1}</span></td>
										<td className='px-4 py-3'><span className='text-sm font-black text-slate-900 dark:text-white'>${p.amount}</span></td>
										<td className='px-4 py-3'><span className='text-xs text-slate-500'>{p.method}</span></td>
										<td className='px-4 py-3'><span className='text-xs text-slate-400'>{new Date(p.paid_at).toLocaleDateString('uz-UZ')}</span></td>
										<td className='px-4 py-3'>
											<span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${statusBadge(p.status)}`}>
												{p.status === 'completed' ? <CheckCircle2 className='w-2.5 h-2.5' /> : <XCircle className='w-2.5 h-2.5' />}
												{p.status === 'completed' ? "To'landi" : p.status === 'pending' ? 'Kutilmoqda' : 'Bekor'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}
