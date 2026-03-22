'use client'

import { createClient } from '@supabase/supabase-js'
import {
	ArrowLeft,
	BookOpen,
	Calendar,
	Loader2,
	Search,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
const MENTOR_ID = process.env.NEXT_PUBLIC_MENTOR_ID || ''

type Group = {
	id: string
	name: string
	schedule: string
	enrolled_count?: number
}
type Student = {
	id: string
	first_name: string
	last_name: string
	phone?: string
}

const avatarColors = [
	'from-blue-500 to-indigo-600',
	'from-pink-500 to-rose-600',
	'from-emerald-500 to-teal-600',
	'from-violet-500 to-purple-600',
	'from-cyan-500 to-blue-600',
	'from-amber-500 to-orange-600',
]

export default function GroupsPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
	const [students, setStudents] = useState<Student[]>([])
	const [loading, setLoading] = useState(true)
	const [studentsLoading, setStudentsLoading] = useState(false)
	const [search, setSearch] = useState('')

	useEffect(() => {
		fetchGroups()
	}, [])

	const fetchGroups = async () => {
		setLoading(true)
		const { data } = await supabase
			.from('groups')
			.select('*')
			.eq('mentor_id', MENTOR_ID)
		if (!data) {
			setLoading(false)
			return
		}
		const { data: enData } = await supabase
			.from('group_enrollments')
			.select('group_id')
			.in(
				'group_id',
				data.map(g => g.id),
			)
		const countMap: Record<string, number> = {}
		;(enData || []).forEach(e => {
			countMap[e.group_id] = (countMap[e.group_id] || 0) + 1
		})
		setGroups(data.map(g => ({ ...g, enrolled_count: countMap[g.id] || 0 })))
		setLoading(false)
	}

	const openGroup = async (group: Group) => {
		setSelectedGroup(group)
		setStudentsLoading(true)
		setSearch('')
		const { data: enData } = await supabase
			.from('group_enrollments')
			.select('student_id')
			.eq('group_id', group.id)
		const ids = (enData || []).map(e => e.student_id)
		if (!ids.length) {
			setStudents([])
			setStudentsLoading(false)
			return
		}
		const { data } = await supabase
			.from('students')
			.select('id, first_name, last_name, phone')
			.in('id', ids)
			.order('last_name')
		setStudents(data || [])
		setStudentsLoading(false)
	}

	const filteredStudents = students.filter(s => {
		const full = `${s.last_name} ${s.first_name}`.toLowerCase()
		return (
			full.includes(search.toLowerCase()) || (s.phone || '').includes(search)
		)
	})

	if (loading) {
		return (
			<div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center'>
				<Loader2 className='w-6 h-6 animate-spin text-blue-500' />
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 space-y-6 transition-colors duration-300'>
			<div className='flex items-center gap-3'>
				{selectedGroup && (
					<button
						onClick={() => setSelectedGroup(null)}
						className='w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all'
					>
						<ArrowLeft className='w-4 h-4' />
					</button>
				)}
				<div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
						{selectedGroup ? selectedGroup.name : 'Guruhlarim'}
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
						{selectedGroup
							? `${students.length} ta talaba`
							: `${groups.length} ta guruh`}
					</p>
				</div>
			</div>

			{!selectedGroup ? (
				groups.length === 0 ? (
					<div className='text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl'>
						<BookOpen className='w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3' />
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
									className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center mb-4`}
								>
									<span className='text-white font-black text-lg'>
										{g.name.slice(0, 2).toUpperCase()}
									</span>
								</div>
								<h3 className='font-black text-slate-900 dark:text-white text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
									{g.name}
								</h3>
								{g.schedule && (
									<p className='text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3'>
										<Calendar className='w-3 h-3' />
										{g.schedule}
									</p>
								)}
								<div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5'>
									<span className='text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1'>
										<Users className='w-3 h-3' />
										{g.enrolled_count} talaba
									</span>
									<span className='text-[10px] text-blue-600 dark:text-blue-400 font-bold'>
										Ko'rish →
									</span>
								</div>
							</button>
						))}
					</div>
				)
			) : (
				<>
					{/* Group info */}
					<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4 shadow-sm'>
						<div
							className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColors[groups.findIndex(g => g.id === selectedGroup.id) % avatarColors.length]} flex items-center justify-center shrink-0`}
						>
							<span className='text-white font-black'>
								{selectedGroup.name.slice(0, 2).toUpperCase()}
							</span>
						</div>
						<div>
							<h2 className='font-black text-slate-900 dark:text-white'>
								{selectedGroup.name}
							</h2>
							{selectedGroup.schedule && (
								<p className='text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5'>
									<Calendar className='w-3 h-3' />
									{selectedGroup.schedule}
								</p>
							)}
						</div>
						<div className='ml-auto text-right'>
							<div className='text-2xl font-black text-slate-900 dark:text-white'>
								{students.length}
							</div>
							<div className='text-[11px] text-slate-400 dark:text-slate-500'>
								talaba
							</div>
						</div>
					</div>

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

					{studentsLoading ? (
						<div className='flex items-center justify-center py-16 gap-3'>
							<Loader2 className='w-5 h-5 animate-spin text-blue-500' />
							<span className='text-slate-400 dark:text-slate-500'>
								Yuklanmoqda...
							</span>
						</div>
					) : filteredStudents.length === 0 ? (
						<div className='text-center py-16 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl'>
							<Users className='w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2' />
							<p className='text-slate-400 dark:text-slate-500 text-sm'>
								Talaba topilmadi
							</p>
						</div>
					) : (
						<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm'>
							<table className='w-full text-sm'>
								<thead>
									<tr className='border-b border-slate-100 dark:border-white/5'>
										{['#', 'Talaba', 'Telefon'].map(h => (
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
									{filteredStudents.map((s, idx) => {
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
														<span className='font-bold text-slate-900 dark:text-white text-xs'>
															{full}
														</span>
													</div>
												</td>
												<td className='px-5 py-3 text-slate-500 dark:text-slate-400 text-xs'>
													{s.phone || '—'}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
							<div className='px-5 py-3 border-t border-slate-100 dark:border-white/5'>
								<p className='text-[11px] text-slate-400 dark:text-slate-500'>
									{filteredStudents.length} ta talaba
								</p>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}
