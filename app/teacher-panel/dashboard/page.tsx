'use client'

import { createClient } from '@supabase/supabase-js'
import {
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	GraduationCap,
	TrendingUp,
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
	mentor_id: string
	enrolled_count?: number
}

export default function TeacherDashboard() {
	const [groups, setGroups] = useState<Group[]>([])
	const [todayGroups, setTodayGroups] = useState<Group[]>([])
	const [studentCount, setStudentCount] = useState(0)
	const [loading, setLoading] = useState(true)
	const today = new Date().toLocaleDateString('uz-UZ', { weekday: 'long' })

	useEffect(() => {
		fetchDashboard()
	}, [])

	const fetchDashboard = async () => {
		setLoading(true)
		const { data: groupsData } = await supabase
			.from('groups')
			.select('*')
			.eq('mentor_id', MENTOR_ID)
		if (!groupsData) {
			setLoading(false)
			return
		}

		const { data: enrollments } = await supabase
			.from('group_enrollments')
			.select('group_id, student_id')
			.in(
				'group_id',
				groupsData.map(g => g.id),
			)

		const countMap: Record<string, number> = {}
		;(enrollments || []).forEach(e => {
			countMap[e.group_id] = (countMap[e.group_id] || 0) + 1
		})

		const enriched = groupsData.map(g => ({
			...g,
			enrolled_count: countMap[g.id] || 0,
		}))
		setGroups(enriched)
		setStudentCount(Object.values(countMap).reduce((a, b) => a + b, 0))

		const todayShort = new Date().toLocaleDateString('uz-UZ', {
			weekday: 'short',
		})
		setTodayGroups(
			enriched.filter(
				g =>
					g.schedule?.toLowerCase().includes(today.toLowerCase()) ||
					g.schedule?.toLowerCase().includes(todayShort.toLowerCase()),
			),
		)
		setLoading(false)
	}

	const stats = [
		{
			label: 'Guruhlarim',
			value: groups.length,
			icon: Users,
			bg: 'bg-blue-50 dark:bg-blue-500/10',
			color: 'text-blue-600 dark:text-blue-400',
			sub: 'ta aktiv guruh',
		},
		{
			label: 'Jami talabalar',
			value: studentCount,
			icon: GraduationCap,
			bg: 'bg-violet-50 dark:bg-violet-500/10',
			color: 'text-violet-600 dark:text-violet-400',
			sub: "ta o'quvchi",
		},
		{
			label: 'Bugungi darslar',
			value: todayGroups.length,
			icon: Calendar,
			bg: 'bg-emerald-50 dark:bg-emerald-500/10',
			color: 'text-emerald-600 dark:text-emerald-400',
			sub: 'ta dars bugun',
		},
		{
			label: 'Faollik',
			value: '98%',
			icon: TrendingUp,
			bg: 'bg-amber-50 dark:bg-amber-500/10',
			color: 'text-amber-600 dark:text-amber-400',
			sub: "o'rtacha davomat",
		},
	]

	const groupColors = [
		'from-blue-500 to-indigo-600',
		'from-violet-500 to-purple-600',
		'from-emerald-500 to-teal-600',
		'from-amber-500 to-orange-600',
	]

	if (loading) {
		return (
			<div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center'>
				<div className='flex flex-col items-center gap-3'>
					<div className='w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
					<p className='text-slate-500 dark:text-slate-400 text-sm'>
						Yuklanmoqda...
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white p-6 space-y-6 transition-colors duration-300'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
						O'qituvchi Paneli
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
						{new Date().toLocaleDateString('uz-UZ', {
							weekday: 'long',
							day: 'numeric',
							month: 'long',
						})}
					</p>
				</div>
				<div className='flex items-center gap-2 bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 px-4 py-2 rounded-xl'>
					<Clock className='w-4 h-4 text-blue-600 dark:text-blue-400' />
					<span className='text-blue-700 dark:text-blue-300 text-sm font-semibold'>
						{today}
					</span>
				</div>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{stats.map(s => {
					const Icon = s.icon
					return (
						<div
							key={s.label}
							className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:shadow-md dark:hover:border-white/10 transition-all'
						>
							<div
								className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-4`}
							>
								<Icon className={`w-5 h-5 ${s.color}`} />
							</div>
							<div className='text-3xl font-black text-slate-900 dark:text-white mb-0.5'>
								{s.value}
							</div>
							<div className='text-xs text-slate-500 dark:text-slate-400'>
								{s.sub}
							</div>
							<div className='text-[11px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-bold'>
								{s.label}
							</div>
						</div>
					)
				})}
			</div>

			<div className='grid lg:grid-cols-2 gap-6'>
				{/* Bugungi darslar */}
				<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='w-8 h-8 bg-emerald-50 dark:bg-emerald-500/15 rounded-xl flex items-center justify-center'>
							<Calendar className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
						</div>
						<h2 className='font-bold text-slate-900 dark:text-white'>
							Bugungi darslar
						</h2>
						<span className='ml-auto text-xs bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg font-bold'>
							{todayGroups.length} ta
						</span>
					</div>
					{todayGroups.length === 0 ? (
						<div className='text-center py-8'>
							<CheckCircle2 className='w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2' />
							<p className='text-slate-400 dark:text-slate-500 text-sm'>
								Bugun dars yo'q
							</p>
						</div>
					) : (
						<div className='space-y-2'>
							{todayGroups.map(g => (
								<div
									key={g.id}
									className='flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 hover:border-emerald-200 dark:hover:border-emerald-500/20 transition-all'
								>
									<div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
									<div className='flex-1'>
										<p className='text-sm font-bold text-slate-900 dark:text-white'>
											{g.name}
										</p>
										<p className='text-[11px] text-slate-500 dark:text-slate-400'>
											{g.schedule}
										</p>
									</div>
									<div className='flex items-center gap-1 text-xs text-slate-400'>
										<Users className='w-3 h-3' />
										{g.enrolled_count}
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Barcha guruhlar */}
				<div className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5'>
					<div className='flex items-center gap-2 mb-4'>
						<div className='w-8 h-8 bg-blue-50 dark:bg-blue-500/15 rounded-xl flex items-center justify-center'>
							<BookOpen className='w-4 h-4 text-blue-600 dark:text-blue-400' />
						</div>
						<h2 className='font-bold text-slate-900 dark:text-white'>
							Guruhlarim
						</h2>
						<span className='ml-auto text-xs bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-lg font-bold'>
							{groups.length} ta
						</span>
					</div>
					{groups.length === 0 ? (
						<div className='text-center py-8'>
							<Users className='w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2' />
							<p className='text-slate-400 dark:text-slate-500 text-sm'>
								Guruhlar topilmadi
							</p>
						</div>
					) : (
						<div className='space-y-2'>
							{groups.map((g, idx) => (
								<div
									key={g.id}
									className='flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all'
								>
									<div
										className={`w-8 h-8 rounded-xl bg-gradient-to-br ${groupColors[idx % groupColors.length]} flex items-center justify-center shrink-0`}
									>
										<span className='text-white text-[10px] font-black'>
											{g.name.slice(0, 2).toUpperCase()}
										</span>
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-bold text-slate-900 dark:text-white truncate'>
											{g.name}
										</p>
										<p className='text-[11px] text-slate-500 dark:text-slate-400 truncate'>
											{g.schedule}
										</p>
									</div>
									<div className='flex items-center gap-1.5 shrink-0'>
										<Users className='w-3 h-3 text-slate-400' />
										<span className='text-xs text-slate-500 dark:text-slate-400 font-semibold'>
											{g.enrolled_count}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
