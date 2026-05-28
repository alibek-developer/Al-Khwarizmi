'use client'

import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Loader2,
	Save,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

type Group = {
	id: number
	name: string
	schedule_days: string
	class_time: string
}
type Student = {
	id: number
	first_name: string
	last_name: string
	phone?: string
}
type AttStatus = 'present' | 'absent' | 'late'
type AttMap = Record<number, AttStatus>

const STATUS = {
	present: {
		label: 'Keldi',
		icon: CheckCircle2,
		off: 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-transparent hover:border-emerald-300 dark:hover:border-emerald-600',
		on: 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400',
	},
	late: {
		label: 'Kech',
		icon: Clock,
		off: 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-transparent hover:border-amber-300 dark:hover:border-amber-600',
		on: 'bg-amber-50 dark:bg-amber-500/15 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-400',
	},
	absent: {
		label: 'Kelmadi',
		icon: AlertCircle,
		off: 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-transparent hover:border-red-300 dark:hover:border-red-600',
		on: 'bg-red-50 dark:bg-red-500/15 border-red-400 dark:border-red-500 text-red-700 dark:text-red-400',
	},
}

const COLORS = [
	'from-blue-500 to-indigo-600',
	'from-pink-500 to-rose-600',
	'from-emerald-500 to-teal-600',
	'from-violet-500 to-purple-600',
	'from-cyan-500 to-blue-600',
	'from-amber-500 to-orange-600',
]

// ── Mentor ID — 3 usulda aniqlanadi ─────────────────────────────────────
async function getMentorId(): Promise<number | null> {
	const stored = localStorage.getItem('teacherMentorId')
	if (stored && parseInt(stored) > 0) return parseInt(stored)
	const env = process.env.NEXT_PUBLIC_MENTOR_ID
	if (env && parseInt(env) > 0) return parseInt(env)
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

export default function AttendancePage() {
	const [mentorId, setMentorId] = useState<number | null>(null)
	const [groups, setGroups] = useState<Group[]>([])
	const [selGroup, setSelGroup] = useState<Group | null>(null)
	const [students, setStudents] = useState<Student[]>([])
	const [att, setAtt] = useState<AttMap>({})
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
	const [gLoading, setGLoading] = useState(true)
	const [sLoading, setSLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

	const msg = (m: string, ok = true) => {
		setToast({ msg: m, ok })
		setTimeout(() => setToast(null), 3000)
	}

	// 1. Mentor ID → guruhlar
	useEffect(() => {
		getMentorId().then(id => {
			setMentorId(id)
			if (!id) {
				setGLoading(false)
				return
			}
			supabase
				.from('groups')
				.select('id, name, schedule_days, class_time')
				.eq('mentor_id', id)
				.then(({ data }) => {
					setGroups(data || [])
					setGLoading(false)
				})
		})
	}, [])

	// 2. Guruh + sana o'zgarganda talabalar + davomat
	useEffect(() => {
		if (selGroup) fetchStudents(selGroup.id)
	}, [selGroup, date])

	const fetchStudents = async (groupId: number) => {
		setSLoading(true)
		const { data: enData } = await supabase
			.from('group_enrollments')
			.select('student_id')
			.eq('group_id', groupId)
		const ids = (enData || []).map(e => e.student_id)
		if (!ids.length) {
			setStudents([])
			setAtt({})
			setSLoading(false)
			return
		}

		const { data: stData } = await supabase
			.from('students')
			.select('id, first_name, last_name, phone')
			.in('id', ids)
			.order('last_name')
		setStudents(stData || [])

		const { data: attData } = await supabase
			.from('attendance')
			.select('student_id, status')
			.eq('group_id', groupId)
			.eq('date', date)

		const map: AttMap = {}
		;(attData || []).forEach(a => {
			map[a.student_id] = a.status
		})
		;(stData || []).forEach(s => {
			if (!map[s.id]) map[s.id] = 'present'
		})
		setAtt(map)
		setSLoading(false)
	}

	const setAll = (status: AttStatus) => {
		const m: AttMap = {}
		students.forEach(s => {
			m[s.id] = status
		})
		setAtt(m)
	}

	const handleSave = async () => {
		if (!selGroup) return
		setSaving(true)
		const rows = students.map(s => ({
			group_id: selGroup.id,
			student_id: s.id,
			date,
			status: att[s.id] || 'present',
		}))
		const { error } = await supabase
			.from('attendance')
			.upsert(rows, { onConflict: 'group_id,student_id,date' })
		setSaving(false)
		if (error) msg('Saqlashda xato: ' + error.message, false)
		else msg('Davomat saqlandi!')
	}

	const counts = {
		present: students.filter(s => att[s.id] === 'present').length,
		late: students.filter(s => att[s.id] === 'late').length,
		absent: students.filter(s => att[s.id] === 'absent').length,
	}

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-5 transition-colors'>
			{toast && (
				<div
					className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}
				>
					{toast.ok ? (
						<CheckCircle2 className='w-4 h-4' />
					) : (
						<AlertCircle className='w-4 h-4' />
					)}
					{toast.msg}
				</div>
			)}

			<div>
				<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
					Davomat
				</h1>
				<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
					Guruh tanlang va davomatni belgilang
				</p>
			</div>

			{/* Mentor ID topilmasa xabar */}
			{!gLoading && mentorId === null && (
				<div className='bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-4 flex items-start gap-3'>
					<AlertCircle className='w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5' />
					<div>
						<p className='text-sm font-bold text-amber-800 dark:text-amber-300'>
							Mentor hisobi topilmadi
						</p>
						<p className='text-xs text-amber-600 dark:text-amber-400 mt-0.5'>
							Tizimga kirgan email mentors jadvalidagi email bilan mos
							kelmayapti yoki
							<code className='mx-1 px-1 bg-amber-100 dark:bg-amber-500/20 rounded'>
								NEXT_PUBLIC_MENTOR_ID
							</code>
							env variable o'rnatilmagan.
						</p>
					</div>
				</div>
			)}

			{/* Controls */}
			<div className='flex flex-wrap gap-3 items-end'>
				<div className='flex-1 min-w-[220px]'>
					<label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5'>
						Guruh
					</label>
					{gLoading ? (
						<div className='h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl flex items-center px-3 gap-2'>
							<Loader2 className='w-4 h-4 animate-spin text-blue-500' />
							<span className='text-sm text-slate-400'>Yuklanmoqda...</span>
						</div>
					) : (
						<select
							value={selGroup?.id || ''}
							onChange={e => {
								const g =
									groups.find(g => g.id === parseInt(e.target.value)) || null
								setSelGroup(g)
								setStudents([])
								setAtt({})
							}}
							className='w-full h-10 px-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors'
						>
							<option value=''>— Guruhni tanlang —</option>
							{groups.map(g => (
								<option key={g.id} value={g.id}>
									{g.name}
									{g.schedule_days ? ` · ${g.schedule_days}` : ''}
									{g.class_time ? ` ${g.class_time}` : ''}
								</option>
							))}
						</select>
					)}
				</div>
				<div>
					<label className='block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5'>
						Sana
					</label>
					<input
						type='date'
						value={date}
						onChange={e => setDate(e.target.value)}
						className='h-10 px-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors'
					/>
				</div>
			</div>

			{/* Stats + setAll */}
			{selGroup && !sLoading && students.length > 0 && (
				<div className='flex flex-wrap gap-2 items-center'>
					{(['present', 'late', 'absent'] as AttStatus[]).map(st => {
						const cfg = STATUS[st]
						const Icon = cfg.icon
						return (
							<div
								key={st}
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${cfg.on}`}
							>
								<Icon className='w-3.5 h-3.5' />
								{cfg.label}: {counts[st]}
							</div>
						)
					})}
					<div className='flex gap-2 ml-auto flex-wrap'>
						<span className='text-[11px] text-slate-400 self-center'>
							Barchasi:
						</span>
						{(['present', 'late', 'absent'] as AttStatus[]).map(st => {
							const cfg = STATUS[st]
							return (
								<button
									key={st}
									onClick={() => setAll(st)}
									className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${cfg.off}`}
								>
									{cfg.label}
								</button>
							)
						})}
					</div>
				</div>
			)}

			{/* Body */}
			{!selGroup ? (
				<div className='flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl gap-3'>
					<Users className='w-14 h-14 text-slate-300 dark:text-slate-700' />
					<p className='text-slate-400 dark:text-slate-500 font-medium'>
						{groups.length === 0 && !gLoading
							? 'Sizga biriktirilgan guruh topilmadi'
							: 'Yuqoridan guruhni tanlang'}
					</p>
				</div>
			) : sLoading ? (
				<div className='flex items-center justify-center py-24 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl gap-3'>
					<Loader2 className='w-5 h-5 animate-spin text-blue-500' />
					<span className='text-slate-500 dark:text-slate-400'>
						Yuklanmoqda...
					</span>
				</div>
			) : students.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl gap-3'>
					<Users className='w-14 h-14 text-slate-300 dark:text-slate-700' />
					<p className='text-slate-400 dark:text-slate-500'>
						Bu guruhda talaba yo'q
					</p>
				</div>
			) : (
				<>
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
										Holat
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-100 dark:divide-white/5'>
								{students.map((s, idx) => {
									const cur = att[s.id] || 'present'
									const full = `${s.last_name} ${s.first_name}`.trim()
									const ini =
										`${s.last_name?.[0] || ''}${s.first_name?.[0] || ''}`.toUpperCase()
									return (
										<tr
											key={s.id}
											className='hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors'
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
													<div>
														<p className='font-bold text-slate-900 dark:text-white text-xs'>
															{full}
														</p>
														{s.phone && (
															<p className='text-[10px] text-slate-400'>
																{s.phone}
															</p>
														)}
													</div>
												</div>
											</td>
											<td className='px-5 py-3'>
												<div className='flex gap-2 flex-wrap'>
													{(['present', 'late', 'absent'] as AttStatus[]).map(
														st => {
															const cfg = STATUS[st]
															const Icon = cfg.icon
															return (
																<button
																	key={st}
																	onClick={() =>
																		setAtt(p => ({ ...p, [s.id]: st }))
																	}
																	className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${cur === st ? cfg.on : cfg.off}`}
																>
																	<Icon className='w-3 h-3' />
																	{cfg.label}
																</button>
															)
														},
													)}
												</div>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
					<div className='flex justify-end'>
						<button
							onClick={handleSave}
							disabled={saving}
							className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-black text-sm h-11 px-8 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20'
						>
							{saving ? (
								<>
									<Loader2 className='w-4 h-4 animate-spin' />
									Saqlanmoqda...
								</>
							) : (
								<>
									<Save className='w-4 h-4' />
									Davomatni Saqlash
								</>
							)}
						</button>
					</div>
				</>
			)}
		</div>
	)
}
