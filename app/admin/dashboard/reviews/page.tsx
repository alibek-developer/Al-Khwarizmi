'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	CheckCircle2,
	Eye,
	Loader2,
	MessageSquarePlus,
	MoreHorizontal,
	Search,
	Star,
	Trash2,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Supabase ──────────────────────────────────────────────────────────────
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Types ─────────────────────────────────────────────────────────────────
type ReviewRow = {
	id: number
	student_name: string
	course_id: number
	rating: number
	comment: string
	is_approved: boolean
	created_at: string
}

type Review = {
	id: number
	student: string
	avatar: string
	color: string
	course: string
	course_id: number
	rating: number
	comment: string
	date: string
	approved: boolean
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

const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'

// ─── Helpers ───────────────────────────────────────────────────────────────
function rowToReview(row: ReviewRow, idx: number): Review {
	return {
		id: row.id,
		student: row.student_name,
		avatar: row.student_name
			.split(' ')
			.map((w: string) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase(),
		color: colors[idx % colors.length],
		course: COURSE_MAP[row.course_id] ?? `Kurs ${row.course_id}`,
		course_id: row.course_id,
		rating: row.rating,
		comment: row.comment,
		date: new Date(row.created_at).toLocaleDateString('uz-UZ', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}),
		approved: row.is_approved,
	}
}

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
	return (
		<div
			className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
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

// ─── ActionMenu (fixed position — jadval overflow dan chiqmaydi) ───────────
function ActionMenu({
	review,
	onView,
	onApprove,
	onDelete,
}: {
	review: Review
	onView: () => void
	onApprove: () => void
	onDelete: () => void
}) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, right: 0 })

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		setPos({
			top: rect.bottom + window.scrollY + 4,
			right: window.innerWidth - rect.right,
		})
		setOpen(v => !v)
	}

	useEffect(() => {
		if (!open) return
		const close = () => setOpen(false)
		document.addEventListener('click', close)
		return () => document.removeEventListener('click', close)
	}, [open])

	return (
		<div onClick={e => e.stopPropagation()}>
			<button
				onClick={handleOpen}
				className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
			>
				<MoreHorizontal className='w-4 h-4' />
			</button>
			{open && (
				<div
					className='fixed w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[999] py-1'
					style={{ top: pos.top, right: pos.right }}
				>
					<button
						onClick={() => {
							onView()
							setOpen(false)
						}}
						className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
					>
						<Eye className='w-3.5 h-3.5' /> Ko'rish
					</button>
					{!review.approved && (
						<button
							onClick={() => {
								onApprove()
								setOpen(false)
							}}
							className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors'
						>
							<CheckCircle2 className='w-3.5 h-3.5' /> Tasdiqlash
						</button>
					)}
					<button
						onClick={() => {
							onDelete()
							setOpen(false)
						}}
						className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
					>
						<Trash2 className='w-3.5 h-3.5' /> O'chirish
					</button>
				</div>
			)}
		</div>
	)
}

// ─── StarRating ─────────────────────────────────────────────────────────────
function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
	return (
		<div className='flex items-center gap-0.5'>
			{[1, 2, 3, 4, 5].map(s => (
				<Star
					key={s}
					style={{ width: size, height: size }}
					className={
						s <= rating
							? 'fill-amber-400 text-amber-400'
							: 'fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700'
					}
				/>
			))}
		</div>
	)
}

const dist = [5, 4, 3, 2, 1]

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ReviewsPage() {
	const [reviews, setReviews] = useState<Review[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
	const [showAdd, setShowAdd] = useState(false)
	const [viewItem, setViewItem] = useState<Review | null>(null)
	const [deleteItem, setDeleteItem] = useState<Review | null>(null)
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)

	const [form, setForm] = useState({
		student: '',
		course: 'Web Development',
		rating: 5,
		comment: '',
	})

	// ── Toast helper ──
	const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	// ── Fetch ──
	const fetchReviews = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('reviews')
			.select('*')
			.order('created_at', { ascending: false })
		if (error) {
			showToast('Yuklashda xato: ' + error.message, 'error')
			setLoading(false)
			return
		}
		setReviews((data as ReviewRow[]).map(rowToReview))
		setLoading(false)
	}

	useEffect(() => {
		fetchReviews()
	}, [])

	// ── INSERT ──
	const handleAdd = async () => {
		if (!form.student || !form.comment) return
		setSaving(true)
		const { error } = await supabase.from('reviews').insert([
			{
				student_name: form.student,
				course_id: COURSE_ID_MAP[form.course] ?? 1,
				rating: form.rating,
				comment: form.comment,
				is_approved: false,
			},
		])
		setSaving(false)
		if (error) {
			showToast("Qo'shishda xato: " + error.message, 'error')
			return
		}
		showToast("Sharh muvaffaqiyatli qo'shildi!")
		setShowAdd(false)
		setForm({ student: '', course: 'Web Development', rating: 5, comment: '' })
		fetchReviews()
	}

	// ── APPROVE ──
	const handleApprove = async (id: number) => {
		const { error } = await supabase
			.from('reviews')
			.update({ is_approved: true })
			.eq('id', id)
		if (error) {
			showToast('Tasdiqlashda xato', 'error')
			return
		}
		showToast('Sharh tasdiqlandi!')
		fetchReviews()
	}

	// ── REJECT (o'chirish) ──
	const handleReject = async (id: number) => {
		const { error } = await supabase.from('reviews').delete().eq('id', id)
		if (error) {
			showToast('Rad etishda xato', 'error')
			return
		}
		showToast('Sharh rad etildi')
		fetchReviews()
	}

	// ── DELETE ──
	const handleDelete = async () => {
		if (!deleteItem) return
		setSaving(true)
		const { error } = await supabase
			.from('reviews')
			.delete()
			.eq('id', deleteItem.id)
		setSaving(false)
		if (error) {
			showToast("O'chirishda xato: " + error.message, 'error')
			return
		}
		showToast("Sharh o'chirildi!")
		setDeleteItem(null)
		fetchReviews()
	}

	// ── Filter ──
	const filtered = reviews.filter(r => {
		const ms =
			r.student.toLowerCase().includes(search.toLowerCase()) ||
			r.course.toLowerCase().includes(search.toLowerCase())
		const mf =
			filter === 'all' || (filter === 'approved' ? r.approved : !r.approved)
		return ms && mf
	})

	const avg = reviews.length
		? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
		: '0.0'
	const max = Math.max(
		...dist.map(s => reviews.filter(r => r.rating === s).length),
		1,
	)

	return (
		<div className='space-y-5 pb-6'>
			{toast && <Toast msg={toast.msg} type={toast.type} />}

			{/* ── ADD MODAL ── */}
			{showAdd && (
				<Modal
					title="Yangi Sharh Qo'shish"
					onClose={() => {
						setShowAdd(false)
						setForm({
							student: '',
							course: 'Web Development',
							rating: 5,
							comment: '',
						})
					}}
				>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Talaba ismi *</label>
								<input
									className={inputCls}
									placeholder='Ism Familiya'
									value={form.student}
									onChange={e =>
										setForm(p => ({ ...p, student: e.target.value }))
									}
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
						<div>
							<label className={labelCls}>Reyting</label>
							<div className='flex gap-2'>
								{[1, 2, 3, 4, 5].map(s => (
									<button
										key={s}
										type='button'
										onClick={() => setForm(p => ({ ...p, rating: s }))}
										className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all ${form.rating >= s ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'border-slate-200 dark:border-slate-700'}`}
									>
										<Star
											className={`w-4 h-4 ${form.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
										/>
									</button>
								))}
							</div>
						</div>
						<div>
							<label className={labelCls}>Sharh matni *</label>
							<textarea
								className='w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none'
								rows={3}
								placeholder='Kurs haqida fikr...'
								value={form.comment}
								onChange={e =>
									setForm(p => ({ ...p, comment: e.target.value }))
								}
							/>
						</div>
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => {
									setShowAdd(false)
									setForm({
										student: '',
										course: 'Web Development',
										rating: 5,
										comment: '',
									})
								}}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor
							</button>
							<button
								onClick={handleAdd}
								disabled={saving || !form.student || !form.comment}
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

			{/* ── VIEW MODAL ── */}
			{viewItem && (
				<Modal title="Sharh Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='flex items-center gap-3 mb-4'>
						<div
							className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${viewItem.color} flex items-center justify-center`}
						>
							<span className='text-white font-black'>{viewItem.avatar}</span>
						</div>
						<div>
							<p className='font-black text-slate-900 dark:text-white'>
								{viewItem.student}
							</p>
							<p className='text-sm text-slate-500'>
								{viewItem.course} · {viewItem.date}
							</p>
						</div>
					</div>
					<StarRating rating={viewItem.rating} size={16} />
					<p className='text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed'>
						{viewItem.comment}
					</p>
				</Modal>
			)}

			{/* ── DELETE MODAL ── */}
			{deleteItem && (
				<Modal title="Sharhni O'chirish" onClose={() => setDeleteItem(null)}>
					<p className='text-sm text-slate-600 dark:text-slate-300 mb-5'>
						<span className='font-bold'>{deleteItem.student}</span> sharhini
						o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
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

			{/* ── HEADER ── */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white'>
						Sharhlar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						Talabalar fikr-mulohazalari
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'
				>
					<MessageSquarePlus className='w-3.5 h-3.5' /> Yangi Sharh
				</button>
			</div>

			{/* ── SUMMARY ── */}
			<div className='grid sm:grid-cols-3 gap-4'>
				<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col items-center justify-center'>
					<div className='text-4xl font-black text-slate-900 dark:text-white mb-1'>
						{avg}
					</div>
					<StarRating rating={5} size={14} />
					<p className='text-[11px] text-slate-400 mt-1'>
						{reviews.length} ta sharh
					</p>
				</div>
				<div className='sm:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm'>
					<p className='text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-3'>
						Reyting taqsimoti
					</p>
					<div className='space-y-2'>
						{dist.map(s => {
							const cnt = reviews.filter(r => r.rating === s).length
							return (
								<div key={s} className='flex items-center gap-3'>
									<div className='flex items-center gap-1 w-8 shrink-0'>
										<span className='text-[11px] font-bold text-slate-600 dark:text-slate-400'>
											{s}
										</span>
										<Star className='w-2.5 h-2.5 fill-amber-400 text-amber-400' />
									</div>
									<div className='flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
										<div
											className='h-full bg-amber-400 rounded-full transition-all'
											style={{ width: `${(cnt / max) * 100}%` }}
										/>
									</div>
									<span className='text-[11px] font-semibold text-slate-500 w-5 text-right'>
										{cnt}
									</span>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			{/* ── SEARCH & FILTER ── */}
			<div className='flex items-center gap-3 flex-wrap'>
				<div className='relative flex-1 max-w-xs'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Sharh qidirish...'
						className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
					/>
				</div>
				<div className='flex gap-1.5'>
					{(['all', 'approved', 'pending'] as const).map(f => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
						>
							{f === 'all'
								? `Barchasi (${reviews.length})`
								: f === 'approved'
									? `Tasdiqlangan (${reviews.filter(r => r.approved).length})`
									: `Kutilmoqda (${reviews.filter(r => !r.approved).length})`}
						</button>
					))}
				</div>
			</div>

			{/* ── TABLE ── */}
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
										'Reyting',
										'Sharh',
										'Sana',
										'Holat',
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
											colSpan={8}
											className='text-center py-12 text-slate-400 text-sm'
										>
											Sharh topilmadi
										</td>
									</tr>
								) : (
									filtered.map((r, idx) => (
										<tr
											key={r.id}
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
														className={`w-8 h-8 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0`}
													>
														<span className='text-white text-[10px] font-black'>
															{r.avatar}
														</span>
													</div>
													<span className='text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap'>
														{r.student}
													</span>
												</div>
											</td>
											<td className='px-4 py-3'>
												<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
													{r.course}
												</span>
											</td>
											<td className='px-4 py-3'>
												<StarRating rating={r.rating} size={11} />
											</td>
											<td className='px-4 py-3'>
												<span className='text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 max-w-[200px]'>
													{r.comment}
												</span>
											</td>
											<td className='px-4 py-3'>
												<span className='text-[11px] text-slate-400 whitespace-nowrap'>
													{r.date}
												</span>
											</td>
											<td className='px-4 py-3'>
												{r.approved ? (
													<span className='inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'>
														<CheckCircle2 className='w-2.5 h-2.5' />{' '}
														Tasdiqlangan
													</span>
												) : (
													<div className='flex items-center gap-1.5'>
														<button
															onClick={() => handleApprove(r.id)}
															className='text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors'
														>
															Tasdiqlash
														</button>
														<button
															onClick={() => handleReject(r.id)}
															className='text-[10px] font-bold px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-500/15 hover:bg-red-200 text-red-600 dark:text-red-400 transition-colors'
														>
															Rad
														</button>
													</div>
												)}
											</td>
											<td className='px-4 py-3'>
												<ActionMenu
													review={r}
													onView={() => setViewItem(r)}
													onApprove={() => handleApprove(r.id)}
													onDelete={() => setDeleteItem(r)}
												/>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
				<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
					<p className='text-[11px] text-slate-400'>
						{filtered.length} ta sharh
					</p>
					{!loading && (
						<button
							onClick={fetchReviews}
							className='text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold'
						>
							Yangilash.
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
