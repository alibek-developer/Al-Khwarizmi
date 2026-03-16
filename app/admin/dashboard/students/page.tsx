'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Edit2,
	Eye,
	Loader2,
	MoreHorizontal,
	Search,
	Trash2,
	UserPlus,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Supabase client ───────────────────────────────────────────────────────
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Types ─────────────────────────────────────────────────────────────────
type StudentRow = {
	id: number
	full_name: string
	phone: string
	email: string
	course_id: number
	payment_amount: number
	status: string
	created_at: string
}

type Student = {
	id: number
	name: string
	email: string
	phone: string
	course: string
	date: string
	status: string
	paid: string
	avatar: string
	color: string
	course_id: number
}

// ─── Constants ─────────────────────────────────────────────────────────────
const COURSE_MAP: Record<number, string> = {
	1: 'Web Development',
	2: 'English Course',
	3: 'Data Science',
	4: 'AI & ML',
}
const COURSE_ID_MAP: Record<string, number> = {
	'Web Development': 1,
	'English Course': 2,
	'Data Science': 3,
	'AI & ML': 4,
}
const courses = ['Web Development', 'English Course', 'Data Science', 'AI & ML']

const colors = [
	'from-blue-500 to-indigo-600',
	'from-pink-500 to-rose-600',
	'from-emerald-500 to-teal-600',
	'from-violet-500 to-purple-600',
	'from-cyan-500 to-blue-600',
	'from-amber-500 to-orange-600',
]

const statusMap = {
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

const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'

// ─── Helpers ───────────────────────────────────────────────────────────────
function rowToStudent(row: StudentRow, idx: number): Student {
	return {
		id: row.id,
		name: row.full_name,
		email: row.email,
		phone: row.phone,
		course: COURSE_MAP[row.course_id] ?? `Kurs ${row.course_id}`,
		date: new Date(row.created_at).toLocaleDateString('uz-UZ', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}),
		status: row.status,
		paid: row.payment_amount ? `$${row.payment_amount}` : '$0',
		avatar: row.full_name
			.split(' ')
			.map((w: string) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase(),
		color: colors[idx % colors.length],
		course_id: row.course_id,
	}
}

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
	return (
		<div
			className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white transition-all
			${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
		>
			{type === 'success' ? (
				<CheckCircle2 className='w-4 h-4' />
			) : (
				<AlertCircle className='w-4 h-4' />
			)}
			{msg}
		</div>
	)
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function Modal({
	title,
	onClose,
	children,
}: {
	title: string
	onClose: () => void
	children: React.ReactNode
}) {
	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col'
				onClick={e => e.stopPropagation()}
			>
				<div className='flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0'>
					<h3 className='font-black text-slate-900 dark:text-white text-base'>
						{title}
					</h3>
					<button
						onClick={onClose}
						className='w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
					>
						<X className='w-4 h-4' />
					</button>
				</div>
				<div className='p-6 overflow-y-auto'>{children}</div>
			</div>
		</div>
	)
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function StudentsPage() {
	const [students, setStudents] = useState<Student[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [search, setSearch] = useState('')
	const [filterStatus, setFilterStatus] = useState('all')
	const [menu, setMenu] = useState<number | null>(null)
	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Student | null>(null)
	const [viewItem, setViewItem] = useState<Student | null>(null)
	const [deleteItem, setDeleteItem] = useState<Student | null>(null)
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)

	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		course: 'Web Development',
	})

	const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	const fetchStudents = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('students')
			.select('*')
			.order('created_at', { ascending: false })
		if (error) {
			showToast("Ma'lumotlarni yuklashda xato", 'error')
			setLoading(false)
			return
		}
		setStudents((data as StudentRow[]).map(rowToStudent))
		setLoading(false)
	}

	useEffect(() => {
		fetchStudents()
	}, [])

	const handleAdd = async () => {
		if (!form.name) return
		setSaving(true)
		const { error } = await supabase.from('students').insert([
			{
				full_name: form.name,
				email: form.email,
				phone: form.phone,
				course_id: COURSE_ID_MAP[form.course] ?? 1,
				payment_amount: 0,
				status: 'active',
			},
		])
		setSaving(false)
		if (error) {
			showToast("Qo'shishda xato: " + error.message, 'error')
			return
		}
		showToast("Talaba muvaffaqiyatli qo'shildi!")
		setShowAdd(false)
		setForm({ name: '', email: '', phone: '', course: 'Web Development' })
		fetchStudents()
	}

	const handleEdit = async () => {
		if (!editItem) return
		setSaving(true)
		const { error } = await supabase
			.from('students')
			.update({
				full_name: editItem.name,
				email: editItem.email,
				phone: editItem.phone,
				course_id: COURSE_ID_MAP[editItem.course] ?? editItem.course_id,
				status: editItem.status,
			})
			.eq('id', editItem.id)
		setSaving(false)
		if (error) {
			showToast('Tahrirlashda xato: ' + error.message, 'error')
			return
		}
		showToast('Talaba yangilandi!')
		setEditItem(null)
		fetchStudents()
	}

	const handleDelete = async () => {
		if (!deleteItem) return
		setSaving(true)
		const { error } = await supabase
			.from('students')
			.delete()
			.eq('id', deleteItem.id)
		setSaving(false)
		if (error) {
			showToast("O'chirishda xato: " + error.message, 'error')
			return
		}
		showToast("Talaba o'chirildi!")
		setDeleteItem(null)
		fetchStudents()
	}

	const filtered = students.filter(s => {
		const ms =
			s.name.toLowerCase().includes(search.toLowerCase()) ||
			s.course.toLowerCase().includes(search.toLowerCase())
		const mf = filterStatus === 'all' || s.status === filterStatus
		return ms && mf
	})

	const counts = {
		all: students.length,
		active: students.filter(s => s.status === 'active').length,
		pending: students.filter(s => s.status === 'pending').length,
		inactive: students.filter(s => s.status === 'inactive').length,
	}

	return (
		<div className='space-y-5 pb-6'>
			{toast && <Toast msg={toast.msg} type={toast.type} />}

			{showAdd && (
				<Modal
					title="Yangi Talaba Qo'shish"
					onClose={() => {
						setShowAdd(false)
						setForm({
							name: '',
							email: '',
							phone: '',
							course: 'Web Development',
						})
					}}
				>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>To'liq ism *</label>
								<input
									className={inputCls}
									placeholder='Ism Familiya'
									value={form.name}
									onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
								/>
							</div>
							<div>
								<label className={labelCls}>Kurs</label>
								<select
									className={inputCls}
									value={form.course}
									onChange={e =>
										setForm(p => ({ ...p, course: e.target.value }))
									}
								>
									{courses.map(c => (
										<option key={c}>{c}</option>
									))}
								</select>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Email</label>
								<input
									className={inputCls}
									type='email'
									placeholder='email@gmail.com'
									value={form.email}
									onChange={e =>
										setForm(p => ({ ...p, email: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Telefon</label>
								<input
									className={inputCls}
									placeholder='+998 90 000 00 00'
									value={form.phone}
									onChange={e =>
										setForm(p => ({ ...p, phone: e.target.value }))
									}
								/>
							</div>
						</div>
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => {
									setShowAdd(false)
									setForm({
										name: '',
										email: '',
										phone: '',
										course: 'Web Development',
									})
								}}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor
							</button>
							<button
								onClick={handleAdd}
								disabled={saving || !form.name}
								className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
							>
								{saving ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Saqlanmoqda...
									</>
								) : (
									"Qo'shish"
								)}
							</button>
						</div>
					</div>
				</Modal>
			)}

			{editItem && (
				<Modal title='Talabani Tahrirlash' onClose={() => setEditItem(null)}>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>To'liq ism</label>
								<input
									className={inputCls}
									value={editItem.name}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, name: e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Kurs</label>
								<select
									className={inputCls}
									value={editItem.course}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, course: e.target.value } : null,
										)
									}
								>
									{courses.map(c => (
										<option key={c}>{c}</option>
									))}
								</select>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Email</label>
								<input
									className={inputCls}
									value={editItem.email}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, email: e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Telefon</label>
								<input
									className={inputCls}
									value={editItem.phone}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, phone: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div>
							<label className={labelCls}>Holat</label>
							<select
								className={inputCls}
								value={editItem.status}
								onChange={e =>
									setEditItem(p =>
										p ? { ...p, status: e.target.value } : null,
									)
								}
							>
								<option value='active'>Faol</option>
								<option value='pending'>Kutilmoqda</option>
								<option value='inactive'>Nofaol</option>
							</select>
						</div>
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => setEditItem(null)}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor
							</button>
							<button
								onClick={handleEdit}
								disabled={saving}
								className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
							>
								{saving ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Saqlanmoqda...
									</>
								) : (
									'Saqlash'
								)}
							</button>
						</div>
					</div>
				</Modal>
			)}

			{viewItem && (
				<Modal title="Talaba Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='flex items-center gap-4 mb-4'>
						<div
							className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${viewItem.color} flex items-center justify-center`}
						>
							<span className='text-white text-lg font-black'>
								{viewItem.avatar}
							</span>
						</div>
						<div>
							<p className='font-black text-slate-900 dark:text-white'>
								{viewItem.name}
							</p>
							<p className='text-sm text-blue-600 dark:text-blue-400 font-semibold'>
								{viewItem.course}
							</p>
						</div>
					</div>
					<div className='space-y-2'>
						{[
							['Email', viewItem.email],
							['Telefon', viewItem.phone],
							['Kurs', viewItem.course],
							['Sana', viewItem.date],
							["To'lov", viewItem.paid],
						].map(([k, v]) => (
							<div
								key={k}
								className='flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0'
							>
								<span className='text-xs text-slate-500'>{k}</span>
								<span className='text-xs font-bold text-slate-900 dark:text-white'>
									{v}
								</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{deleteItem && (
				<Modal title="Talabani O'chirish" onClose={() => setDeleteItem(null)}>
					<p className='text-sm text-slate-600 dark:text-slate-300 mb-5'>
						<span className='font-bold text-slate-900 dark:text-white'>
							"{deleteItem.name}"
						</span>{' '}
						ni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
					</p>
					<div className='flex gap-3'>
						<button
							onClick={() => setDeleteItem(null)}
							className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
						>
							Bekor
						</button>
						<button
							onClick={handleDelete}
							disabled={saving}
							className='flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
						>
							{saving ? (
								<>
									<Loader2 className='w-4 h-4 animate-spin' />
									O'chirilmoqda...
								</>
							) : (
								"O'chirish"
							)}
						</button>
					</div>
				</Modal>
			)}

			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white'>
						Talabalar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						{students.length} ta talaba ro'yxatda
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'
				>
					<UserPlus className='w-3.5 h-3.5' /> Talaba Qo'shish
				</button>
			</div>

			<div className='grid grid-cols-3 gap-3'>
				{[
					{
						label: 'Faol',
						value: counts.active,
						icon: CheckCircle2,
						bg: 'bg-emerald-50 dark:bg-emerald-500/10',
						color: 'text-emerald-600 dark:text-emerald-400',
					},
					{
						label: 'Kutilmoqda',
						value: counts.pending,
						icon: Clock,
						bg: 'bg-amber-50 dark:bg-amber-500/10',
						color: 'text-amber-600 dark:text-amber-400',
					},
					{
						label: 'Nofaol',
						value: counts.inactive,
						icon: AlertCircle,
						bg: 'bg-slate-100 dark:bg-slate-800',
						color: 'text-slate-600 dark:text-slate-400',
					},
				].map(s => {
					const Icon = s.icon
					return (
						<div
							key={s.label}
							className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-3'
						>
							<div
								className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}
							>
								<Icon className={s.color} style={{ width: 17, height: 17 }} />
							</div>
							<div>
								<div className='text-lg font-black text-slate-900 dark:text-white leading-none'>
									{s.value}
								</div>
								<div className='text-[11px] text-slate-400 mt-0.5'>
									{s.label}
								</div>
							</div>
						</div>
					)
				})}
			</div>

			<div className='flex items-center gap-3 flex-wrap'>
				<div className='relative flex-1 max-w-xs'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Ism yoki kurs bo'yicha..."
						className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
					/>
				</div>
				<div className='flex gap-1.5'>
					{(['all', 'active', 'pending', 'inactive'] as const).map(s => (
						<button
							key={s}
							onClick={() => setFilterStatus(s)}
							className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${filterStatus === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}
						>
							{s === 'all'
								? `Barchasi (${counts.all})`
								: s === 'active'
									? `Faol (${counts.active})`
									: s === 'pending'
										? `Kutilmoqda (${counts.pending})`
										: `Nofaol (${counts.inactive})`}
						</button>
					))}
				</div>
			</div>

			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm'>
				{loading ? (
					<div className='flex items-center justify-center py-16 gap-3'>
						<Loader2 className='w-5 h-5 animate-spin text-blue-600' />
						<span className='text-sm text-slate-400'>Yuklanmoqda...</span>
					</div>
				) : (
					<div className='overflow-x-auto rounded-2xl'>
						<table className='w-full text-sm'>
							<thead>
								<tr className='border-b border-slate-100 dark:border-slate-800'>
									{[
										'#',
										'Talaba',
										'Kurs',
										'Telefon',
										'Email',
										'Sana',
										'Holat',
										"To'lov",
										'',
									].map(h => (
										<th
											key={h}
											className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3 whitespace-nowrap'
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-100 dark:divide-slate-800'>
								{filtered.length === 0 ? (
									<tr>
										<td
											colSpan={9}
											className='text-center py-12 text-slate-400 text-sm'
										>
											Talabalar topilmadi
										</td>
									</tr>
								) : (
									filtered.map((s, idx) => {
										const st =
											statusMap[s.status as keyof typeof statusMap] ??
											statusMap.inactive
										const Icon = st.icon
										return (
											<tr
												key={s.id}
												className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
											>
												<td className='px-4 py-3'>
													<span className='text-xs text-slate-400 font-mono'>
														{idx + 1}
													</span>
												</td>
												<td className='px-4 py-3'>
													<div className='flex items-center gap-2.5'>
														<div
															className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}
														>
															<span className='text-white text-[10px] font-black'>
																{s.avatar}
															</span>
														</div>
														<span className='text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap'>
															{s.name}
														</span>
													</div>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
														{s.course}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
														{s.phone}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 dark:text-slate-400'>
														{s.email}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-400 whitespace-nowrap'>
														{s.date}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span
														className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${st.cls}`}
													>
														<Icon className='w-2.5 h-2.5' />
														{st.label}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-xs font-black text-slate-900 dark:text-white'>
														{s.paid}
													</span>
												</td>
												<td className='px-4 py-3'>
													<div className='relative'>
														<button
															onClick={() =>
																setMenu(menu === s.id ? null : s.id)
															}
															className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
														>
															<MoreHorizontal className='w-4 h-4' />
														</button>
														{menu === s.id && (
															<div className='absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1'>
																<button
																	onClick={() => {
																		setViewItem(s)
																		setMenu(null)
																	}}
																	className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
																>
																	<Eye className='w-3.5 h-3.5' /> Ko'rish
																</button>
																<button
																	onClick={() => {
																		setEditItem(s)
																		setMenu(null)
																	}}
																	className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
																>
																	<Edit2 className='w-3.5 h-3.5' /> Tahrirlash
																</button>
																<button
																	onClick={() => {
																		setDeleteItem(s)
																		setMenu(null)
																	}}
																	className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
																>
																	<Trash2 className='w-3.5 h-3.5' /> O'chirish
																</button>
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
				<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
					<p className='text-[11px] text-slate-400'>
						{filtered.length} ta natija
					</p>
					{!loading && (
						<button
							onClick={fetchStudents}
							className='text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold'
						>
							Yangilash
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
