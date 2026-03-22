'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Loader2,
	Save,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
const MENTOR_ID = process.env.NEXT_PUBLIC_MENTOR_ID || ''

type Group = { id: string; name: string; schedule: string }
type Student = {
	id: string
	first_name: string
	last_name: string
	phone?: string
}
type AttendanceStatus = 'present' | 'absent' | 'late'
type AttendanceMap = Record<string, AttendanceStatus>

const statusConfig = {
	present: {
		label: 'Keldi',
		icon: CheckCircle2,
		cls: 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-500/50 bg-white dark:bg-transparent',
		activeCls:
			'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-400',
	},
	late: {
		label: 'Kech',
		icon: Clock,
		cls: 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-300 dark:hover:border-amber-500/50 bg-white dark:bg-transparent',
		activeCls:
			'bg-amber-50 dark:bg-amber-500/15 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-400',
	},
	absent: {
		label: 'Kelmadi',
		icon: AlertCircle,
		cls: 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-red-300 dark:hover:border-red-500/50 bg-white dark:bg-transparent',
		activeCls:
			'bg-red-50 dark:bg-red-500/15 border-red-400 dark:border-red-500 text-red-700 dark:text-red-400',
	},
}

const avatarColors = [
	'from-blue-500 to-indigo-600',
	'from-pink-500 to-rose-600',
	'from-emerald-500 to-teal-600',
	'from-violet-500 to-purple-600',
	'from-cyan-500 to-blue-600',
	'from-amber-500 to-orange-600',
]

export default function AttendancePage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [selectedGroup, setSelectedGroup] = useState('')
	const [students, setStudents] = useState<Student[]>([])
	const [attendance, setAttendance] = useState<AttendanceMap>({})
	const [selectedDate, setSelectedDate] = useState(
		new Date().toISOString().slice(0, 10),
	)
	const [loading, setLoading] = useState(false)
	const [saving, setSaving] = useState(false)
	const [groupsLoading, setGroupsLoading] = useState(true)
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)

	useEffect(() => {
		fetchGroups()
	}, [])
	useEffect(() => {
		if (selectedGroup) fetchStudents(selectedGroup)
	}, [selectedGroup, selectedDate])

	const showToast = (msg: string, type: 'success' | 'error') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	const fetchGroups = async () => {
		setGroupsLoading(true)
		const { data } = await supabase
			.from('groups')
			.select('id, name, schedule')
			.eq('mentor_id', MENTOR_ID)
		setGroups(data || [])
		setGroupsLoading(false)
	}

	const fetchStudents = async (groupId: string) => {
		setLoading(true)
		const { data: enData } = await supabase
			.from('group_enrollments')
			.select('student_id')
			.eq('group_id', groupId)
		const ids = (enData || []).map(e => e.student_id)
		if (!ids.length) {
			setStudents([])
			setLoading(false)
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
			.eq('date', selectedDate)
		const map: AttendanceMap = {}
		;(attData || []).forEach(a => {
			map[a.student_id] = a.status
		})
		;(stData || []).forEach(s => {
			if (!map[s.id]) map[s.id] = 'present'
		})
		setAttendance(map)
		setLoading(false)
	}

	const setAll = (status: AttendanceStatus) => {
		const map: AttendanceMap = {}
		students.forEach(s => {
			map[s.id] = status
		})
		setAttendance(map)
	}

	const handleSave = async () => {
		if (!selectedGroup) return
		setSaving(true)
		const rows = students.map(s => ({
			group_id: selectedGroup,
			student_id: s.id,
			date: selectedDate,
			status: attendance[s.id] || 'present',
		}))
		const { error } = await supabase
			.from('attendance')
			.upsert(rows, { onConflict: 'group_id,student_id,date' })
		setSaving(false)
		if (error) showToast('Saqlashda xato: ' + error.message, 'error')
		else showToast('Davomat saqlandi!', 'success')
	}

	const counts = {
		present: students.filter(s => attendance[s.id] === 'present').length,
		late: students.filter(s => attendance[s.id] === 'late').length,
		absent: students.filter(s => attendance[s.id] === 'absent').length,
	}

	const inputCls =
		'h-10 px-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors'

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

			<div>
				<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
					Davomat
				</h1>
				<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
					Guruh tanlang va davomatni belgilang
				</p>
			</div>

			{/* Controls */}
			<div className='flex flex-wrap gap-3 items-end'>
				<div className='flex-1 min-w-[200px]'>
					<label className='block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5'>
						Guruh
					</label>
					<select
						value={selectedGroup}
						onChange={e => setSelectedGroup(e.target.value)}
						className={`w-full ${inputCls}`}
					>
						<option value=''>Guruhni tanlang...</option>
						{groups.map(g => (
							<option key={g.id} value={g.id}>
								{g.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className='block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5'>
						Sana
					</label>
					<input
						type='date'
						value={selectedDate}
						onChange={e => setSelectedDate(e.target.value)}
						className={inputCls}
					/>
				</div>
			</div>

			{/* Stats + setAll */}
			{selectedGroup && !loading && students.length > 0 && (
				<div className='flex gap-3 flex-wrap items-center'>
					{(['present', 'late', 'absent'] as AttendanceStatus[]).map(st => {
						const cfg = statusConfig[st]
						const Icon = cfg.icon
						return (
							<div
								key={st}
								className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${cfg.activeCls}`}
							>
								<Icon className='w-4 h-4' />
								{cfg.label}: {counts[st]}
							</div>
						)
					})}
					<div className='flex gap-2 ml-auto'>
						{(['present', 'late', 'absent'] as AttendanceStatus[]).map(st => {
							const cfg = statusConfig[st]
							return (
								<button
									key={st}
									onClick={() => setAll(st)}
									className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${cfg.cls}`}
								>
									Barchasi: {cfg.label}
								</button>
							)
						})}
					</div>
				</div>
			)}

			{/* Body */}
			{!selectedGroup ? (
				<div className='text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl'>
					<Users className='w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3' />
					<p className='text-slate-400 dark:text-slate-500'>Guruhni tanlang</p>
				</div>
			) : loading ? (
				<div className='flex items-center justify-center py-20 gap-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl'>
					<Loader2 className='w-5 h-5 animate-spin text-blue-500' />
					<span className='text-slate-500 dark:text-slate-400'>
						Yuklanmoqda...
					</span>
				</div>
			) : students.length === 0 ? (
				<div className='text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl'>
					<Users className='w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3' />
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
									{['#', 'Talaba', 'Holat'].map(h => (
										<th
											key={h}
											className='text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-5 py-3'
										>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody className='divide-y divide-slate-100 dark:divide-white/5'>
								{students.map((s, idx) => {
									const cur = attendance[s.id] || 'present'
									const full = `${s.last_name} ${s.first_name}`.trim()
									const initials =
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
														className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0`}
													>
														<span className='text-white text-[10px] font-black'>
															{initials}
														</span>
													</div>
													<div>
														<p className='font-bold text-slate-900 dark:text-white text-xs'>
															{full}
														</p>
														{s.phone && (
															<p className='text-[10px] text-slate-400 dark:text-slate-500'>
																{s.phone}
															</p>
														)}
													</div>
												</div>
											</td>
											<td className='px-5 py-3'>
												<div className='flex gap-2'>
													{(
														['present', 'late', 'absent'] as AttendanceStatus[]
													).map(st => {
														const cfg = statusConfig[st]
														const Icon = cfg.icon
														const isActive = cur === st
														return (
															<button
																key={st}
																onClick={() =>
																	setAttendance(p => ({ ...p, [s.id]: st }))
																}
																className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${isActive ? cfg.activeCls : cfg.cls}`}
															>
																<Icon className='w-3 h-3' />
																{cfg.label}
															</button>
														)
													})}
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
