'use client'

import {
	ArrowLeft,
	Calendar,
	Loader2,
	Search,
	Trash2,
	UserMinus,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'
// ── Mentor ID — 3 usulda aniqlanadi ──────────────────────────────────────
// 1. localStorage (login paytida saqlangan)
// 2. NEXT_PUBLIC_MENTOR_ID env
// 3. Supabase auth → mentors.email
async function getMentorId(): Promise<number | null> {
	// 1. Login paytida saqlangan ID
	const stored = localStorage.getItem('teacherMentorId')
	if (stored && parseInt(stored) > 0) return parseInt(stored)

	// 2. Env variable
	const env = process.env.NEXT_PUBLIC_MENTOR_ID
	if (env && parseInt(env) > 0) return parseInt(env)

	// 3. Supabase auth → email orqali
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user?.email) return null
	const { data } = await supabase
		.from('mentors')
		.select('id')
		.eq('email', user.email)
		.single()
	if (data?.id) {
		localStorage.setItem('teacherMentorId', String(data.id))
		return data.id
	}
	return null
}

type Group = {
	id: number
	name: string
	course_id: number | null
	schedule_days: string
	class_time: string
	start_date: string
	max_students: number
	status: string
	enrolled_count?: number
}
type Student = {
	id: number
	first_name: string
	last_name: string
	phone?: string
	enrollment_id?: number
}

const COLORS = [
	'from-blue-500 to-indigo-600',
	'from-pink-500 to-rose-600',
	'from-emerald-500 to-teal-600',
	'from-violet-500 to-purple-600',
	'from-cyan-500 to-blue-600',
	'from-amber-500 to-orange-600',
]

export default function GroupsPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [selGroup, setSelGroup] = useState<Group | null>(null)
	const [students, setStudents] = useState<Student[]>([])
	const [gLoading, setGLoading] = useState(true)
	const [sLoading, setSLoading] = useState(false)
	const [removing, setRemoving] = useState<number | null>(null)
	const [search, setSearch] = useState('')
	const [confirmId, setConfirmId] = useState<number | null>(null) // enrollment_id to remove

	// Guruhlarni yuklash
	useEffect(() => {
		fetchGroups()
	}, [])

	const fetchGroups = async () => {
		setGLoading(true)
		const { data } = await supabase
			.from('groups')
			.select('*')
			.eq('mentor_id', await getMentorId())
		if (!data) {
			setGroups([])
			setGLoading(false)
			return
		}

		// enrolled count
		const { data: enData } = await supabase
			.from('group_enrollments')
			.select('group_id')
			.in(
				'group_id',
				data.map(g => g.id),
			)
		const cnt: Record<number, number> = {}
		;(enData || []).forEach(e => {
			cnt[e.group_id] = (cnt[e.group_id] || 0) + 1
		})

		setGroups(data.map(g => ({ ...g, enrolled_count: cnt[g.id] || 0 })))
		setGLoading(false)
	}

	const openGroup = async (g: Group) => {
		setSelGroup(g)
		setSLoading(true)
		setSearch('')
		const { data: enData } = await supabase
			.from('group_enrollments')
			.select('id, student_id')
			.eq('group_id', g.id)
		const ids = (enData || []).map(e => e.student_id)
		if (!ids.length) {
			setStudents([])
			setSLoading(false)
			return
		}

		const { data: stData } = await supabase
			.from('students')
			.select('id, first_name, last_name, phone')
			.in('id', ids)
			.order('last_name')

		// enrollment_id ni student ga biriktiramiz (chiqarish uchun kerak)
		const enMap: Record<number, number> = {}
		;(enData || []).forEach(e => {
			enMap[e.student_id] = e.id
		})

		setStudents((stData || []).map(s => ({ ...s, enrollment_id: enMap[s.id] })))
		setSLoading(false)
	}

	// Talabani guruhdan chiqarish
	const handleRemove = async (enrollmentId: number, studentId: number) => {
		setRemoving(studentId)
		await supabase.from('group_enrollments').delete().eq('id', enrollmentId)
		setStudents(p => p.filter(s => s.id !== studentId))
		setSelGroup(prev =>
			prev ? { ...prev, enrolled_count: (prev.enrolled_count || 1) - 1 } : prev,
		)
		setGroups(p =>
			p.map(g =>
				g.id === selGroup?.id
					? { ...g, enrolled_count: (g.enrolled_count || 1) - 1 }
					: g,
			),
		)
		setRemoving(null)
		setConfirmId(null)
	}

	const filtered = students.filter(s => {
		const full = `${s.last_name} ${s.first_name}`.toLowerCase()
		return (
			full.includes(search.toLowerCase()) || (s.phone || '').includes(search)
		)
	})

	if (gLoading) {
		return (
			<div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center'>
				<Loader2 className='w-6 h-6 animate-spin text-blue-500' />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-5 transition-colors'>
			{/* Confirm remove modal */}
			{confirmId !== null &&
				(() => {
					const s = students.find(s => s.enrollment_id === confirmId)
					if (!s) return null
					return (
						<div
							className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
							onClick={() => setConfirmId(null)}
						>
							<div
								className='w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl'
								onClick={e => e.stopPropagation()}
							>
								<div className='flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-2xl mx-auto mb-4'>
									<UserMinus className='w-6 h-6 text-red-500' />
								</div>
								<h3 className='text-center font-black text-slate-900 dark:text-white mb-1'>
									Guruhdan chiqarish
								</h3>
								<p className='text-center text-sm text-slate-500 dark:text-slate-400 mb-5'>
									<span className='font-bold text-slate-800 dark:text-white'>
										{s.last_name} {s.first_name}
									</span>
									ni guruhdan chiqarasizmi?
								</p>
								<div className='flex gap-3'>
									<button
										onClick={() => setConfirmId(null)}
										className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors'
									>
										Bekor
									</button>
									<button
										onClick={() => handleRemove(confirmId, s.id)}
										disabled={removing === s.id}
										className='flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
									>
										{removing === s.id ? (
											<Loader2 className='w-4 h-4 animate-spin' />
										) : (
											<Trash2 className='w-4 h-4' />
										)}
										Chiqarish
									</button>
								</div>
							</div>
						</div>
					)
				})()}

			{/* Header */}
			<div className='flex items-center gap-3'>
				{selGroup && (
					<button
						onClick={() => {
							setSelGroup(null)
							setStudents([])
						}}
						className='w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all'
					>
						<ArrowLeft className='w-4 h-4' />
					</button>
				)}
				<div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
						{selGroup ? selGroup.name : 'Guruhlarim'}
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
						{selGroup
							? `${students.length} ta talaba`
							: `${groups.length} ta guruh`}
					</p>
				</div>
			</div>

			{/* Guruhlar grid */}
			{!selGroup ? (
				groups.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl gap-3'>
						<Users className='w-14 h-14 text-slate-300 dark:text-slate-700' />
						<p className='text-slate-400 dark:text-slate-500'>
							Guruhlar topilmadi
						</p>
					</div>
				) : (
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						{groups.map((g, idx) => (
							<button
								key={g.id}
								onClick={() => openGroup(g)}
								className='text-left bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group'
							>
								<div
									className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${COLORS[idx % COLORS.length]} flex items-center justify-center mb-4`}
								>
									<span className='text-white font-black text-lg'>
										{g.name.slice(0, 2).toUpperCase()}
									</span>
								</div>
								<h3 className='font-black text-slate-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate'>
									{g.name}
								</h3>
								{g.schedule_days && (
									<p className='text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1'>
										<Calendar className='w-3 h-3 shrink-0' />
										{g.schedule_days} {g.class_time && `· ${g.class_time}`}
									</p>
								)}
								<div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-3'>
									<span className='flex items-center gap-1 text-xs text-slate-400'>
										<Users className='w-3 h-3' />
										{g.enrolled_count}/{g.max_students || '∞'}
									</span>
									<span
										className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${g.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}
									>
										{g.status === 'active' ? 'Faol' : g.status}
									</span>
								</div>
							</button>
						))}
					</div>
				)
			) : (
				/* Talabalar ro'yxati */
				<>
					{/* Group info banner */}
					<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4 shadow-sm'>
						<div
							className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${COLORS[groups.findIndex(g => g.id === selGroup.id) % COLORS.length]} flex items-center justify-center shrink-0`}
						>
							<span className='text-white font-black'>
								{selGroup.name.slice(0, 2).toUpperCase()}
							</span>
						</div>
						<div className='flex-1 min-w-0'>
							<h2 className='font-black text-slate-900 dark:text-white truncate'>
								{selGroup.name}
							</h2>
							{selGroup.schedule_days && (
								<p className='text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5'>
									<Calendar className='w-3 h-3' />
									{selGroup.schedule_days}{' '}
									{selGroup.class_time && `· ${selGroup.class_time}`}
								</p>
							)}
						</div>
						<div className='text-right shrink-0'>
							<div className='text-2xl font-black text-slate-900 dark:text-white'>
								{students.length}
							</div>
							<div className='text-[11px] text-slate-400'>
								{selGroup.max_students ? `/ ${selGroup.max_students}` : ''}{' '}
								talaba
							</div>
						</div>
					</div>

					{/* Progress bar */}
					{selGroup.max_students > 0 && (
						<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 shadow-sm'>
							<div className='flex justify-between text-xs mb-1.5'>
								<span className='text-slate-500 dark:text-slate-400'>
									Band o'rinlar
								</span>
								<span
									className={`font-bold ${students.length >= selGroup.max_students ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}
								>
									{students.length}/{selGroup.max_students}
								</span>
							</div>
							<div className='h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden'>
								<div
									className={`h-full rounded-full transition-all ${students.length >= selGroup.max_students ? 'bg-red-500' : 'bg-blue-500'}`}
									style={{
										width: `${Math.min(100, (students.length / selGroup.max_students) * 100)}%`,
									}}
								/>
							</div>
						</div>
					)}

					{/* Search */}
					<div className='relative max-w-xs'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
						<input
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder='Talaba qidirish...'
							className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
						/>
					</div>

					{sLoading ? (
						<div className='flex items-center justify-center py-16 gap-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl'>
							<Loader2 className='w-5 h-5 animate-spin text-blue-500' />
							<span className='text-slate-400'>Yuklanmoqda...</span>
						</div>
					) : filtered.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl gap-3'>
							<Users className='w-12 h-12 text-slate-300 dark:text-slate-700' />
							<p className='text-slate-400 dark:text-slate-500 text-sm'>
								Talaba topilmadi
							</p>
						</div>
					) : (
						<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm'>
							<table className='w-full text-sm'>
								<thead>
									<tr className='border-b border-slate-100 dark:border-white/5'>
										<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-3 w-10'>
											#
										</th>
										<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-3'>
											Talaba
										</th>
										<th className='text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 py-3'>
											Telefon
										</th>
										<th className='px-5 py-3 w-14'></th>
									</tr>
								</thead>
								<tbody className='divide-y divide-slate-100 dark:divide-white/5'>
									{filtered.map((s, idx) => {
										const full = `${s.last_name} ${s.first_name}`.trim()
										const ini =
											`${s.last_name?.[0] || ''}${s.first_name?.[0] || ''}`.toUpperCase()
										return (
											<tr
												key={s.id}
												className='hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group'
											>
												<td className='px-5 py-3 text-slate-400 font-mono text-xs'>
													{idx + 1}
												</td>
												<td className='px-5 py-3'>
													<div className='flex items-center gap-3'>
														<div
															className={`w-8 h-8 rounded-xl bg-gradient-to-br ${COLORS[idx % COLORS.length]} flex items-center justify-center shrink-0`}
														>
															<span className='text-white text-[10px] font-black'>
																{ini}
															</span>
														</div>
														<span className='font-bold text-slate-900 dark:text-white text-xs'>
															{full}
														</span>
													</div>
												</td>
												<td className='px-5 py-3 text-slate-500 dark:text-slate-400 text-xs'>
													{s.phone || '—'}
												</td>
												<td className='px-5 py-3'>
													<button
														onClick={() => setConfirmId(s.enrollment_id!)}
														className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100'
													>
														<UserMinus className='w-3.5 h-3.5' />
													</button>
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
							<div className='px-5 py-3 border-t border-slate-100 dark:border-white/5'>
								<p className='text-[11px] text-slate-400'>
									{filtered.length} ta talaba
								</p>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
