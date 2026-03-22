'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	BookOpen,
	CheckCircle2,
	Clock,
	Eye,
	FileText,
	Loader2,
	Plus,
	Star,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
const MENTOR_ID = process.env.NEXT_PUBLIC_MENTOR_ID || ''

type Group = { id: string; name: string }
type Homework = {
	id: string
	group_id: string
	title: string
	description: string
	due_date: string
	file_url: string
	created_at: string
	group_name?: string
	submission_count?: number
}
type Submission = {
	id: string
	homework_id: string
	student_id: string
	file_url: string
	comment: string
	grade: number | null
	status: string
	submitted_at: string
	student_name?: string
}

const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5'

export default function HomeworkPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [homeworks, setHomeworks] = useState<Homework[]>([])
	const [submissions, setSubmissions] = useState<Submission[]>([])
	const [selectedHw, setSelectedHw] = useState<Homework | null>(null)
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [showAdd, setShowAdd] = useState(false)
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)
	const [grades, setGrades] = useState<Record<string, string>>({})
	const [filterGroup, setFilterGroup] = useState('all')
	const [form, setForm] = useState({
		group_id: '',
		title: '',
		description: '',
		due_date: '',
		file_url: '',
	})

	useEffect(() => {
		fetchAll()
	}, [])

	const showToast = (msg: string, type: 'success' | 'error') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	const fetchAll = async () => {
		setLoading(true)
		const { data: gData } = await supabase
			.from('groups')
			.select('id, name')
			.eq('mentor_id', MENTOR_ID)
		setGroups(gData || [])
		if (!gData?.length) {
			setLoading(false)
			return
		}

		const { data: hwData } = await supabase
			.from('homeworks')
			.select('*')
			.in(
				'group_id',
				gData.map(g => g.id),
			)
			.order('created_at', { ascending: false })
		const { data: subData } = await supabase
			.from('homework_submissions')
			.select('homework_id')
			.in(
				'homework_id',
				(hwData || []).map(h => h.id),
			)
		const countMap: Record<string, number> = {}
		;(subData || []).forEach(s => {
			countMap[s.homework_id] = (countMap[s.homework_id] || 0) + 1
		})
		const gMap = Object.fromEntries(gData.map(g => [g.id, g.name]))
		setHomeworks(
			(hwData || []).map(h => ({
				...h,
				group_name: gMap[h.group_id] || '—',
				submission_count: countMap[h.id] || 0,
			})),
		)
		setLoading(false)
	}

	const fetchSubmissions = async (hw: Homework) => {
		setSelectedHw(hw)
		const { data } = await supabase
			.from('homework_submissions')
			.select('*')
			.eq('homework_id', hw.id)
			.order('submitted_at', { ascending: false })
		const ids = (data || []).map(s => s.student_id)
		let sMap: Record<string, string> = {}
		if (ids.length) {
			const { data: stData } = await supabase
				.from('students')
				.select('id, first_name, last_name')
				.in('id', ids)
			;(stData || []).forEach(s => {
				sMap[s.id] = `${s.last_name} ${s.first_name}`.trim()
			})
		}
		const merged = (data || []).map(s => ({
			...s,
			student_name: sMap[s.student_id] || '—',
		}))
		setSubmissions(merged)
		const initG: Record<string, string> = {}
		merged.forEach(s => {
			initG[s.id] = s.grade?.toString() || ''
		})
		setGrades(initG)
	}

	const handleAdd = async () => {
		if (!form.title || !form.group_id) return
		setSaving(true)
		const { error } = await supabase
			.from('homeworks')
			.insert([
				{
					group_id: form.group_id,
					title: form.title,
					description: form.description,
					due_date: form.due_date || null,
					file_url: form.file_url || null,
				},
			])
		setSaving(false)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast("Vazifa qo'shildi!", 'success')
		setShowAdd(false)
		setForm({
			group_id: '',
			title: '',
			description: '',
			due_date: '',
			file_url: '',
		})
		fetchAll()
	}

	const handleGrade = async (subId: string) => {
		const grade = parseInt(grades[subId] || '0')
		if (isNaN(grade) || grade < 0 || grade > 100) {
			showToast("Baho 0-100 oralig'ida bo'lishi kerak", 'error')
			return
		}
		const { error } = await supabase
			.from('homework_submissions')
			.update({ grade, status: 'checked' })
			.eq('id', subId)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast('Baho saqlandi!', 'success')
		setSubmissions(p =>
			p.map(s => (s.id === subId ? { ...s, grade, status: 'checked' } : s)),
		)
	}

	const filtered =
		filterGroup === 'all'
			? homeworks
			: homeworks.filter(h => h.group_id === filterGroup)
	const isOverdue = (d: string) => d && new Date(d) < new Date()

	const modalBase =
		'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
	const modalCard =
		'w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl'

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 space-y-6 transition-colors duration-300'>
			{toast && (
				<div
					className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
				>
					{toast.type === 'success' ? (
						<CheckCircle2 className='w-4 h-4' />
					) : (
						<AlertCircle className='w-4 h-4' />
					)}
					{toast.msg}
				</div>
			)}

			{/* Add Modal */}
			{showAdd && (
				<div className={modalBase} onClick={() => setShowAdd(false)}>
					<div className={modalCard} onClick={e => e.stopPropagation()}>
						<div className='flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5'>
							<h3 className='font-black text-slate-900 dark:text-white'>
								Yangi Vazifa
							</h3>
							<button
								onClick={() => setShowAdd(false)}
								className='w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors'
							>
								<X className='w-4 h-4' />
							</button>
						</div>
						<div className='p-6 space-y-4'>
							<div>
								<label className={labelCls}>Guruh *</label>
								<select
									className={inputCls}
									value={form.group_id}
									onChange={e =>
										setForm(p => ({ ...p, group_id: e.target.value }))
									}
								>
									<option value=''>Tanlang</option>
									{groups.map(g => (
										<option key={g.id} value={g.id}>
											{g.name}
										</option>
									))}
								</select>
							</div>
							<div>
								<label className={labelCls}>Sarlavha *</label>
								<input
									className={inputCls}
									placeholder='Vazifa nomi'
									value={form.title}
									onChange={e =>
										setForm(p => ({ ...p, title: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Tavsif</label>
								<textarea
									rows={3}
									className='w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none'
									placeholder='Vazifa tavsifi...'
									value={form.description}
									onChange={e =>
										setForm(p => ({ ...p, description: e.target.value }))
									}
								/>
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className={labelCls}>Muddat</label>
									<input
										type='datetime-local'
										className={inputCls}
										value={form.due_date}
										onChange={e =>
											setForm(p => ({ ...p, due_date: e.target.value }))
										}
									/>
								</div>
								<div>
									<label className={labelCls}>Fayl URL</label>
									<input
										className={inputCls}
										placeholder='https://...'
										value={form.file_url}
										onChange={e =>
											setForm(p => ({ ...p, file_url: e.target.value }))
										}
									/>
								</div>
							</div>
							<div className='flex gap-3 pt-2'>
								<button
									onClick={() => setShowAdd(false)}
									className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors'
								>
									Bekor
								</button>
								<button
									onClick={handleAdd}
									disabled={saving || !form.title || !form.group_id}
									className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 dark:disabled:bg-slate-700 text-white disabled:text-slate-400 text-sm font-black transition-colors flex items-center justify-center gap-2'
								>
									{saving ? (
										<>
											<Loader2 className='w-4 h-4 animate-spin' />
											...
										</>
									) : (
										<>
											<Plus className='w-4 h-4' />
											Qo'shish
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Submissions Modal */}
			{selectedHw && (
				<div className={modalBase} onClick={() => setSelectedHw(null)}>
					<div
						className='w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col'
						onClick={e => e.stopPropagation()}
					>
						<div className='flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 shrink-0'>
							<div>
								<h3 className='font-black text-slate-900 dark:text-white'>
									{selectedHw.title}
								</h3>
								<p className='text-xs text-slate-400 dark:text-slate-500'>
									{submissions.length} ta topshiriq
								</p>
							</div>
							<button
								onClick={() => setSelectedHw(null)}
								className='w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors'
							>
								<X className='w-4 h-4' />
							</button>
						</div>
						<div className='p-4 overflow-y-auto'>
							{submissions.length === 0 ? (
								<div className='text-center py-10'>
									<FileText className='w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2' />
									<p className='text-slate-400 dark:text-slate-500 text-sm'>
										Hali topshirilmagan
									</p>
								</div>
							) : (
								<div className='space-y-2'>
									{submissions.map(sub => (
										<div
											key={sub.id}
											className='flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3'
										>
											<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0'>
												<span className='text-white text-[10px] font-black'>
													{sub.student_name
														?.split(' ')
														.map(w => w[0])
														.join('')
														.slice(0, 2)}
												</span>
											</div>
											<div className='flex-1 min-w-0'>
												<p className='text-sm font-bold text-slate-900 dark:text-white truncate'>
													{sub.student_name}
												</p>
												{sub.comment && (
													<p className='text-[11px] text-slate-500 dark:text-slate-400 truncate'>
														{sub.comment}
													</p>
												)}
												<div className='flex items-center gap-2 mt-1'>
													<span
														className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${sub.status === 'checked' ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'}`}
													>
														{sub.status === 'checked'
															? 'Baholangan'
															: 'Kutilmoqda'}
													</span>
													{sub.file_url && (
														<a
															href={sub.file_url}
															target='_blank'
															rel='noreferrer'
															className='text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1'
														>
															<Eye className='w-3 h-3' />
															Fayl
														</a>
													)}
												</div>
											</div>
											<div className='flex items-center gap-2 shrink-0'>
												<input
													type='number'
													min={0}
													max={100}
													value={grades[sub.id] || ''}
													onChange={e =>
														setGrades(p => ({ ...p, [sub.id]: e.target.value }))
													}
													placeholder='0-100'
													className='w-20 h-9 px-2 text-center text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500'
												/>
												<button
													onClick={() => handleGrade(sub.id)}
													className='h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1'
												>
													<Star className='w-3 h-3' />
													Baho
												</button>
											</div>
											{sub.grade !== null && (
												<div className='text-right shrink-0'>
													<div
														className={`text-lg font-black ${sub.grade >= 80 ? 'text-emerald-600 dark:text-emerald-400' : sub.grade >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}
													>
														{sub.grade}
													</div>
													<div className='text-[10px] text-slate-400'>ball</div>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
						Vazifalar
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
						Uy vazifalarini boshqaring
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20'
				>
					<Plus className='w-4 h-4' /> Yangi Vazifa
				</button>
			</div>

			{/* Filter */}
			<div className='flex gap-2 flex-wrap'>
				{[
					{ id: 'all', name: `Barchasi (${homeworks.length})` },
					...groups.map(g => ({
						id: g.id,
						name: `${g.name} (${homeworks.filter(h => h.group_id === g.id).length})`,
					})),
				].map(g => (
					<button
						key={g.id}
						onClick={() => setFilterGroup(g.id)}
						className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterGroup === g.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}
					>
						{g.name}
					</button>
				))}
			</div>

			{loading ? (
				<div className='flex items-center justify-center py-20 gap-3'>
					<Loader2 className='w-5 h-5 animate-spin text-blue-500' />
					<span className='text-slate-400 dark:text-slate-500'>
						Yuklanmoqda...
					</span>
				</div>
			) : filtered.length === 0 ? (
				<div className='text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl'>
					<BookOpen className='w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3' />
					<p className='text-slate-400 dark:text-slate-500'>
						Vazifalar topilmadi
					</p>
				</div>
			) : (
				<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filtered.map(hw => {
						const overdue = hw.due_date && isOverdue(hw.due_date)
						return (
							<div
								key={hw.id}
								className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-md transition-all group'
							>
								<div className='flex items-start justify-between mb-3'>
									<div className='w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center'>
										<BookOpen className='w-4 h-4 text-blue-600 dark:text-blue-400' />
									</div>
									{hw.due_date && (
										<span
											className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${overdue ? 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'}`}
										>
											<Clock className='w-2.5 h-2.5' />
											{new Date(hw.due_date).toLocaleDateString('uz-UZ')}
										</span>
									)}
								</div>
								<h3 className='font-black text-slate-900 dark:text-white mb-1 line-clamp-1'>
									{hw.title}
								</h3>
								<p className='text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2'>
									{hw.group_name}
								</p>
								{hw.description && (
									<p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3'>
										{hw.description}
									</p>
								)}
								<div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5'>
									<span className='text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1'>
										<FileText className='w-3 h-3' />
										{hw.submission_count} topshiriq
									</span>
									<button
										onClick={() => fetchSubmissions(hw)}
										className='text-xs text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 transition-colors flex items-center gap-1'
									>
										<Eye className='w-3 h-3' />
										Ko'rish
									</button>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
