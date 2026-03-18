'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	ArrowRightLeft,
	BookOpen,
	Calendar,
	CheckCircle2,
	Clock,
	Download,
	Edit2,
	Eye,
	FileSpreadsheet,
	Loader2,
	MoreHorizontal,
	Plus,
	Search,
	Trash2,
	UserPlus,
	Users,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Types ─────────────────────────────────────────────────────────────────
type Group = {
	id: number
	name: string
	course_id: number | null
	price: number
	duration: string
	duration_type: string
	schedule_days: string
	class_time: string
	start_date: string
	mentor_id: number | null
	max_students: number
	status: string
	created_at?: string
	course_name?: string
	mentor_name?: string
	enrolled_count?: number
}

type Enrollment = {
	id: number
	group_id: number
	student_id: number
	enrolled_at: string
	student_name?: string
	student_phone?: string
}

// ── Student endi first_name + last_name ──
type Student = {
	id: number
	first_name: string
	last_name: string
	phone?: string
}

// ── Helper: to'liq ism ──
const getFullName = (s: Student) =>
	`${s.last_name || ''} ${s.first_name || ''}`.trim() || '—'

type Course = { id: number; title_en: string }
type Mentor = { id: number; full_name: string }

const emptyForm = {
	name: '',
	course_id: null as number | null,
	price: 0,
	duration: '',
	duration_type: 'oy',
	schedule_days: '',
	class_time: '',
	start_date: '',
	mentor_id: null as number | null,
	max_students: 20,
	status: 'active',
}

const statusMap: Record<string, { label: string; cls: string }> = {
	active: {
		label: 'Faol',
		cls: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
	},
	inactive: {
		label: 'Nofaol',
		cls: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
	},
	completed: {
		label: 'Tugagan',
		cls: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400',
	},
	planned: {
		label: 'Rejalashtirilgan',
		cls: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
	},
}

const weekDays = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']
const durTypes = ['oy', 'hafta', 'kun', 'yil']

const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'

function Toast({
	msg,
	type,
}: {
	msg: string
	type: 'success' | 'error' | 'info'
}) {
	const colors = {
		success: 'bg-emerald-600',
		error: 'bg-red-600',
		info: 'bg-slate-800 dark:bg-slate-700',
	}
	return (
		<div
			className={`fixed bottom-5 right-5 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${colors[type]}`}
		>
			{type === 'success' ? (
				<CheckCircle2 className='w-4 h-4' />
			) : type === 'error' ? (
				<AlertCircle className='w-4 h-4' />
			) : (
				<FileSpreadsheet className='w-4 h-4 text-emerald-400' />
			)}
			{msg}
		</div>
	)
}

function Modal({
	title,
	onClose,
	children,
	wide,
}: {
	title: string
	onClose: () => void
	children: React.ReactNode
	wide?: boolean
}) {
	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className={`w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col`}
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

function ActionMenu({
	onView,
	onEdit,
	onDelete,
	onEnroll,
}: {
	onView: () => void
	onEdit: () => void
	onDelete: () => void
	onEnroll: () => void
}) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, right: 0 })
	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		const r = e.currentTarget.getBoundingClientRect()
		setPos({
			top: r.bottom + window.scrollY + 4,
			right: window.innerWidth - r.right,
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
					className='fixed w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[999] py-1'
					style={{ top: pos.top, right: pos.right }}
				>
					<button
						onClick={() => {
							onView()
							setOpen(false)
						}}
						className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
					>
						<Eye className='w-3.5 h-3.5' />
						Ko'rish
					</button>
					<button
						onClick={() => {
							onEnroll()
							setOpen(false)
						}}
						className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors'
					>
						<UserPlus className='w-3.5 h-3.5' />
						O'quvchi qo'shish
					</button>
					<button
						onClick={() => {
							onEdit()
							setOpen(false)
						}}
						className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
					>
						<Edit2 className='w-3.5 h-3.5' />
						Tahrirlash
					</button>
					<button
						onClick={() => {
							onDelete()
							setOpen(false)
						}}
						className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
					>
						<Trash2 className='w-3.5 h-3.5' />
						O'chirish
					</button>
				</div>
			)}
		</div>
	)
}

function DaysPicker({
	value,
	onChange,
}: {
	value: string
	onChange: (v: string) => void
}) {
	const sel = value
		? value
				.split(',')
				.map(d => d.trim())
				.filter(Boolean)
		: []

	const toggle = (d: string) => {
		const next = sel.includes(d) ? sel.filter(x => x !== d) : [...sel, d]
		onChange(weekDays.filter(x => next.includes(x)).join(', '))
	}

	// Tezkor presetlar
	const presets = [
		{
			label: 'Du-Cho-Ju',
			days: ['Du', 'Cho', 'Ju'],
			color:
				'bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-500/25',
		},
		{
			label: 'Se-Pa-Sha',
			days: ['Se', 'Pa', 'Sha'],
			color:
				'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-500/25',
		},
		{
			label: 'Har kun',
			days: ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha'],
			color:
				'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/25',
		},
		{
			label: 'Tozalash',
			days: [],
			color:
				'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/25',
		},
	]

	const applyPreset = (days: string[]) => {
		onChange(weekDays.filter(x => days.includes(x)).join(', '))
	}

	return (
		<div className='space-y-2'>
			{/* Preset tugmalar */}
			<div className='flex gap-1.5 flex-wrap'>
				{presets.map(p => (
					<button
						key={p.label}
						type='button'
						onClick={() => applyPreset(p.days)}
						className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${p.color}`}
					>
						{p.label}
					</button>
				))}
			</div>
			{/* Alohida kunlar */}
			<div className='flex gap-1.5'>
				{weekDays.map(d => (
					<button
						key={d}
						type='button'
						onClick={() => toggle(d)}
						className={`w-10 h-9 rounded-xl text-xs font-bold transition-all ${sel.includes(d) ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
					>
						{d}
					</button>
				))}
			</div>
		</div>
	)
}

function GroupForm({
	form,
	onChange,
	courses,
	mentors,
}: {
	form: typeof emptyForm
	onChange: (f: typeof emptyForm) => void
	courses: Course[]
	mentors: Mentor[]
}) {
	const set = (p: Partial<typeof emptyForm>) => onChange({ ...form, ...p })
	return (
		<div className='space-y-4'>
			<div>
				<label className={labelCls}>Guruh nomi *</label>
				<input
					className={inputCls}
					placeholder='WEB-01, ENG-A1'
					value={form.name}
					onChange={e => set({ name: e.target.value })}
				/>
			</div>
			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className={labelCls}>Kurs</label>
					<select
						className={inputCls}
						value={form.course_id ?? ''}
						onChange={e =>
							set({ course_id: e.target.value ? +e.target.value : null })
						}
					>
						<option value=''>Tanlang</option>
						{courses.map(c => (
							<option key={c.id} value={c.id}>
								{c.title_en}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className={labelCls}>Mentor</label>
					<select
						className={inputCls}
						value={form.mentor_id ?? ''}
						onChange={e =>
							set({ mentor_id: e.target.value ? +e.target.value : null })
						}
					>
						<option value=''>Tanlang</option>
						{mentors.map(m => (
							<option key={m.id} value={m.id}>
								{m.full_name}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className={labelCls}>Narx ($)</label>
					<input
						className={inputCls}
						type='number'
						placeholder='499'
						value={form.price || ''}
						onChange={e => set({ price: +e.target.value })}
					/>
				</div>
				<div>
					<label className={labelCls}>Max talabalar</label>
					<input
						className={inputCls}
						type='number'
						placeholder='20'
						value={form.max_students || ''}
						onChange={e => set({ max_students: +e.target.value })}
					/>
				</div>
			</div>
			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className={labelCls}>Davomiyligi</label>
					<input
						className={inputCls}
						type='number'
						placeholder='6'
						value={form.duration || ''}
						onChange={e => set({ duration: e.target.value })}
					/>
				</div>
				<div>
					<label className={labelCls}>Turi</label>
					<select
						className={inputCls}
						value={form.duration_type}
						onChange={e => set({ duration_type: e.target.value })}
					>
						{durTypes.map(t => (
							<option key={t}>{t}</option>
						))}
					</select>
				</div>
			</div>
			<div>
				<label className={labelCls}>Dars kunlari</label>
				<DaysPicker
					value={form.schedule_days}
					onChange={v => set({ schedule_days: v })}
				/>
				{form.schedule_days && (
					<p className='mt-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold'>
						{form.schedule_days}
					</p>
				)}
			</div>
			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className={labelCls}>Dars vaqti</label>
					<input
						className={inputCls}
						type='time'
						value={form.class_time}
						onChange={e => set({ class_time: e.target.value })}
					/>
				</div>
				<div>
					<label className={labelCls}>Boshlanish sanasi</label>
					<input
						className={inputCls}
						type='date'
						value={form.start_date}
						onChange={e => set({ start_date: e.target.value })}
					/>
				</div>
			</div>
			<div>
				<label className={labelCls}>Holat</label>
				<select
					className={inputCls}
					value={form.status}
					onChange={e => set({ status: e.target.value })}
				>
					{Object.entries(statusMap).map(([k, v]) => (
						<option key={k} value={k}>
							{v.label}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}

// ─── Export ─────────────────────────────────────────────────────────────────
function buildGroupsCSV(groups: Group[]) {
	const h = [
		'ID',
		'Guruh',
		'Kurs',
		'Mentor',
		'Narx',
		'Davomiyligi',
		'Kunlar',
		'Vaqt',
		'Boshlanish',
		"O'rinlar",
		'Talabalar',
		'Holat',
	]
	const rows = groups.map(g => [
		g.id,
		g.name,
		g.course_name || '',
		g.mentor_name || '',
		g.price,
		`${g.duration} ${g.duration_type}`,
		g.schedule_days,
		g.class_time,
		g.start_date,
		g.max_students,
		g.enrolled_count ?? 0,
		statusMap[g.status]?.label || g.status,
	])
	return (
		'\uFEFF' +
		[h, ...rows]
			.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
			.join('\n')
	)
}

function buildEnrollmentsCSV(group: Group, enrollments: Enrollment[]) {
	const h = ['#', "O'quvchi ismi", 'Telefon', "Qo'shilgan sana", 'Guruh']
	const rows = enrollments.map((e, i) => [
		i + 1,
		e.student_name || '',
		e.student_phone || '',
		new Date(e.enrolled_at).toLocaleDateString('uz-UZ'),
		group.name,
	])
	return (
		'\uFEFF' +
		[h, ...rows]
			.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
			.join('\n')
	)
}

function downloadCSV(content: string, filename: string) {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.click()
	URL.revokeObjectURL(url)
}

const SHEETS_URL =
	process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK ||
	'https://docs.google.com/spreadsheets/d/13ZqRgiCZMm3ueDIEZ5fAQP1P5cH2xSaugQvtHbwM2gE/edit'

async function sendToGoogleSheets(
	data: Record<string, unknown>[],
	sheetName: string,
): Promise<boolean> {
	if (!SHEETS_URL) return false
	try {
		const res = await fetch(SHEETS_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ sheetName, rows: data }),
		})
		return res.ok
	} catch {
		return false
	}
}

function openSheetsWithData(csv: string) {
	navigator.clipboard.writeText(csv).catch(() => {})
	const url = SHEETS_URL.replace(/\/edit.*$/, '/edit')
	window.open(
		url.includes('spreadsheets/d/') ? url : 'https://sheets.new',
		'_blank',
	)
}

// ════════════════════════════════════════════════════════════════════════════
export default function GroupsPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [courses, setCourses] = useState<Course[]>([])
	const [mentors, setMentors] = useState<Mentor[]>([])
	const [allStudents, setAllStudents] = useState<Student[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [search, setSearch] = useState('')
	const [filterStatus, setFilterStatus] = useState('all')
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error' | 'info'
	} | null>(null)

	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Group | null>(null)
	const [viewItem, setViewItem] = useState<Group | null>(null)
	const [deleteItem, setDeleteItem] = useState<Group | null>(null)
	const [enrollGroup, setEnrollGroup] = useState<Group | null>(null)
	const [studentsGroup, setStudentsGroup] = useState<Group | null>(null)
	const [form, setForm] = useState({ ...emptyForm })

	const [enrollments, setEnrollments] = useState<Enrollment[]>([])
	const [enrollLoading, setEnrollLoading] = useState(false)
	const [selectedStudents, setSelectedStudents] = useState<Set<number>>(
		new Set(),
	)
	const [studentSearch, setStudentSearch] = useState('')
	const [moveTarget, setMoveTarget] = useState<number | null>(null)
	const [moveEnrollment, setMoveEnrollment] = useState<Enrollment | null>(null)
	const [allEnrolledStudentIds, setAllEnrolledStudentIds] = useState<
		Set<number>
	>(new Set())
	const [exportGroupOpen, setExportGroupOpen] = useState(false)
	const [exportMainOpen, setExportMainOpen] = useState(false)
	const [sheetsLoading, setSheetsLoading] = useState(false)

	const showToast = (
		msg: string,
		type: 'success' | 'error' | 'info' = 'success',
	) => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3500)
	}

	const fetchAll = async () => {
		setLoading(true)
		const [{ data: gData }, { data: cData }, { data: mData }, { data: sData }] =
			await Promise.all([
				supabase
					.from('groups')
					.select('*')
					.order('created_at', { ascending: false }),
				supabase.from('courses').select('id, title_en').order('title_en'),
				supabase.from('mentors').select('id, full_name').order('full_name'),
				// ✅ first_name + last_name + phone
				supabase
					.from('students')
					.select('id, first_name, last_name, phone')
					.order('last_name'),
			])
		setCourses(cData || [])
		setMentors(mData || [])
		// ✅ student array to'g'ri type
		setAllStudents(sData || [])

		const cMap = Object.fromEntries((cData || []).map(c => [c.id, c.title_en]))
		const mMap = Object.fromEntries((mData || []).map(m => [m.id, m.full_name]))

		const { data: enData } = await supabase
			.from('group_enrollments')
			.select('group_id, student_id')
		const countMap: Record<number, number> = {}
		const enrolledSet = new Set<number>()
		;(enData || []).forEach(e => {
			countMap[e.group_id] = (countMap[e.group_id] || 0) + 1
			enrolledSet.add(e.student_id)
		})
		setAllEnrolledStudentIds(enrolledSet)

		setGroups(
			(gData || []).map(g => ({
				...g,
				course_name: g.course_id ? cMap[g.course_id] : '—',
				mentor_name: g.mentor_id ? mMap[g.mentor_id] : '—',
				enrolled_count: countMap[g.id] || 0,
			})),
		)
		setLoading(false)
	}

	useEffect(() => {
		fetchAll()
	}, [])

	const fetchEnrollments = async (groupId: number) => {
		setEnrollLoading(true)
		const { data } = await supabase
			.from('group_enrollments')
			.select('id, group_id, student_id, enrolled_at')
			.eq('group_id', groupId)
			.order('enrolled_at', { ascending: false })
		// ✅ getFullName ishlatiladi
		const sMap = Object.fromEntries(allStudents.map(s => [s.id, s]))
		const merged = (data || []).map(e => ({
			...e,
			student_name: sMap[e.student_id] ? getFullName(sMap[e.student_id]) : '—',
			student_phone: sMap[e.student_id]?.phone || '',
		}))
		setEnrollments(merged)
		setEnrollLoading(false)
	}

	const handleAdd = async () => {
		if (!form.name) return
		setSaving(true)
		const { error } = await supabase
			.from('groups')
			.insert([
				{
					name: form.name,
					course_id: form.course_id,
					price: form.price,
					duration: form.duration,
					duration_type: form.duration_type,
					schedule_days: form.schedule_days,
					class_time: form.class_time,
					start_date: form.start_date || null,
					mentor_id: form.mentor_id,
					max_students: form.max_students,
					status: form.status,
				},
			])
		setSaving(false)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast("Guruh qo'shildi!")
		setShowAdd(false)
		setForm({ ...emptyForm })
		fetchAll()
	}

	const handleEdit = async () => {
		if (!editItem) return
		setSaving(true)
		const { error } = await supabase
			.from('groups')
			.update({
				name: editItem.name,
				course_id: editItem.course_id,
				price: editItem.price,
				duration: editItem.duration,
				duration_type: editItem.duration_type,
				schedule_days: editItem.schedule_days,
				class_time: editItem.class_time,
				start_date: editItem.start_date || null,
				mentor_id: editItem.mentor_id,
				max_students: editItem.max_students,
				status: editItem.status,
			})
			.eq('id', editItem.id)
		setSaving(false)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast('Guruh yangilandi!')
		setEditItem(null)
		fetchAll()
	}

	const handleDelete = async () => {
		if (!deleteItem) return
		setSaving(true)
		const { error } = await supabase
			.from('groups')
			.delete()
			.eq('id', deleteItem.id)
		setSaving(false)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast("Guruh o'chirildi!")
		setDeleteItem(null)
		fetchAll()
	}

	const handleEnrollStudent = async () => {
		if (!enrollGroup || selectedStudents.size === 0) return
		setSaving(true)
		const ids = Array.from(selectedStudents)
		const rows = ids.map(sid => ({ group_id: enrollGroup.id, student_id: sid }))
		const { error } = await supabase.from('group_enrollments').insert(rows)
		setSaving(false)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast(`${ids.length} ta o'quvchi qo'shildi!`)
		setSelectedStudents(new Set())
		setStudentSearch('')
		fetchAll()
		if (studentsGroup?.id === enrollGroup.id) fetchEnrollments(enrollGroup.id)
		setEnrollGroup(null)
	}

	const handleRemoveEnrollment = async (enrollmentId: number) => {
		const { error } = await supabase
			.from('group_enrollments')
			.delete()
			.eq('id', enrollmentId)
		if (error) {
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast("O'quvchi guruhdan chiqarildi!")
		if (studentsGroup) fetchEnrollments(studentsGroup.id)
		fetchAll()
	}

	const handleMoveStudent = async () => {
		if (!moveEnrollment || !moveTarget) return
		setSaving(true)
		const { error: insErr } = await supabase
			.from('group_enrollments')
			.insert([{ group_id: moveTarget, student_id: moveEnrollment.student_id }])
		if (insErr) {
			setSaving(false)
			showToast("Ko'chirishda xato: " + insErr.message, 'error')
			return
		}
		await supabase
			.from('group_enrollments')
			.delete()
			.eq('id', moveEnrollment.id)
		setSaving(false)
		showToast("O'quvchi ko'chirildi!")
		setMoveEnrollment(null)
		setMoveTarget(null)
		if (studentsGroup) fetchEnrollments(studentsGroup.id)
		fetchAll()
	}

	const openStudentsModal = (g: Group) => {
		setStudentsGroup(g)
		fetchEnrollments(g.id)
	}

	const enrolledIds = new Set(enrollments.map(e => e.student_id))

	// 1 talaba = 1 guruh: barcha guruhlardagi talabalarni ham chiqar
	const filteredStudents = allStudents.filter(
		s =>
			!enrolledIds.has(s.id) &&
			!allEnrolledStudentIds.has(s.id) &&
			(getFullName(s).toLowerCase().includes(studentSearch.toLowerCase()) ||
				(s.phone || '').includes(studentSearch)),
	)

	const filtered = groups.filter(g => {
		const ms =
			g.name?.toLowerCase().includes(search.toLowerCase()) ||
			g.course_name?.toLowerCase().includes(search.toLowerCase())
		const mf = filterStatus === 'all' || g.status === filterStatus
		return ms && mf
	})

	return (
		<div className='space-y-5 pb-6'>
			{toast && <Toast msg={toast.msg} type={toast.type} />}

			{/* ── ADD ── */}
			{showAdd && (
				<Modal
					title="Yangi Guruh Qo'shish"
					onClose={() => {
						setShowAdd(false)
						setForm({ ...emptyForm })
					}}
				>
					<GroupForm
						form={form}
						onChange={setForm}
						courses={courses}
						mentors={mentors}
					/>
					<div className='flex gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800'>
						<button
							onClick={() => {
								setShowAdd(false)
								setForm({ ...emptyForm })
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
				</Modal>
			)}

			{/* ── EDIT ── */}
			{editItem && (
				<Modal title='Guruhni Tahrirlash' onClose={() => setEditItem(null)}>
					<GroupForm
						form={{
							name: editItem.name,
							course_id: editItem.course_id,
							price: editItem.price,
							duration: editItem.duration,
							duration_type: editItem.duration_type,
							schedule_days: editItem.schedule_days,
							class_time: editItem.class_time,
							start_date: editItem.start_date,
							mentor_id: editItem.mentor_id,
							max_students: editItem.max_students,
							status: editItem.status,
						}}
						onChange={f => setEditItem({ ...editItem, ...f })}
						courses={courses}
						mentors={mentors}
					/>
					<div className='flex gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800'>
						<button
							onClick={() => setEditItem(null)}
							className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
						>
							Bekor
						</button>
						<button
							onClick={handleEdit}
							disabled={saving}
							className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
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
				</Modal>
			)}

			{/* ── VIEW ── */}
			{viewItem && (
				<Modal title="Guruh Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='space-y-0'>
						{[
							['Guruh nomi', viewItem.name],
							['Kurs', viewItem.course_name || '—'],
							['Mentor', viewItem.mentor_name || '—'],
							['Narx', `$${viewItem.price}`],
							['Davomiyligi', `${viewItem.duration} ${viewItem.duration_type}`],
							['Dars kunlari', viewItem.schedule_days || '—'],
							['Dars vaqti', viewItem.class_time || '—'],
							['Boshlanish', viewItem.start_date || '—'],
							['Max talabalar', String(viewItem.max_students)],
							["Hozirgi o'quvchilar", String(viewItem.enrolled_count || 0)],
							['Holat', statusMap[viewItem.status]?.label || viewItem.status],
						].map(([k, v]) => (
							<div
								key={k}
								className='flex justify-between py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0'
							>
								<span className='text-xs text-slate-400'>{k}</span>
								<span className='text-xs font-bold text-slate-900 dark:text-white'>
									{v}
								</span>
							</div>
						))}
					</div>
					<button
						onClick={() => {
							setViewItem(null)
							openStudentsModal(viewItem)
						}}
						className='mt-4 w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors'
					>
						<Users className='w-4 h-4' /> O'quvchilar ro'yxatini ko'rish
					</button>
				</Modal>
			)}

			{/* ── DELETE ── */}
			{deleteItem && (
				<Modal title="Guruhni O'chirish" onClose={() => setDeleteItem(null)}>
					<p className='text-sm text-slate-600 dark:text-slate-300 mb-5'>
						<span className='font-bold text-slate-900 dark:text-white'>
							"{deleteItem.name}"
						</span>{' '}
						guruhini o'chirishni tasdiqlaysizmi?
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

			{/* ── ENROLL STUDENT (multi-select) ── */}
			{enrollGroup && (
				<Modal
					title={`O'quvchi qo'shish — ${enrollGroup.name}`}
					onClose={() => {
						setEnrollGroup(null)
						setSelectedStudents(new Set())
						setStudentSearch('')
					}}
				>
					<div className='space-y-4'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
							<input
								value={studentSearch}
								onChange={e => setStudentSearch(e.target.value)}
								placeholder='Familiya, ism yoki telefon...'
								className='w-full h-10 pl-9 pr-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
							/>
						</div>

						<div className='max-h-72 overflow-y-auto space-y-1 border border-slate-100 dark:border-slate-800 rounded-xl p-1'>
							{filteredStudents.length === 0 ? (
								<p className='text-center text-sm text-slate-400 py-6'>
									{allStudents.length === 0
										? 'Talabalar yuklanmoqda...'
										: studentSearch
											? "Qidiruv bo'yicha topilmadi"
											: 'Barcha talabalar guruhga biriktirilgan'}
								</p>
							) : (
								<>
									<button
										type='button'
										onClick={() => {
											const all = filteredStudents.slice(0, 50).map(s => s.id)
											const allSel = all.every(id => selectedStudents.has(id))
											setSelectedStudents(allSel ? new Set() : new Set(all))
										}}
										className='w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors border-b border-slate-100 dark:border-slate-800 mb-1'
									>
										<div
											className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${filteredStudents.slice(0, 50).every(s => selectedStudents.has(s.id)) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}
										>
											{filteredStudents
												.slice(0, 50)
												.every(s => selectedStudents.has(s.id)) && (
												<CheckCircle2 className='w-2.5 h-2.5 text-white' />
											)}
										</div>
										Barchasini tanlash ({filteredStudents.length} ta)
									</button>
									{filteredStudents.slice(0, 50).map(s => {
										const fullName = getFullName(s)
										const initials = fullName
											.split(' ')
											.map((w: string) => w[0])
											.join('')
											.slice(0, 2)
										const isSel = selectedStudents.has(s.id)
										return (
											<button
												key={s.id}
												onClick={() => {
													const n = new Set(selectedStudents)
													if (n.has(s.id)) n.delete(s.id)
													else n.add(s.id)
													setSelectedStudents(n)
												}}
												className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isSel ? 'bg-blue-50 dark:bg-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
											>
												<div
													className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${isSel ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}
												>
													{isSel && (
														<CheckCircle2 className='w-2.5 h-2.5 text-white' />
													)}
												</div>
												<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0'>
													<span className='text-white text-[10px] font-black'>
														{initials}
													</span>
												</div>
												<div className='flex-1 min-w-0'>
													<p
														className={`text-xs font-bold truncate ${isSel ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}
													>
														{fullName}
													</p>
													<p className='text-[10px] text-slate-400 truncate'>
														{s.phone || '—'}
													</p>
												</div>
											</button>
										)
									})}
								</>
							)}
						</div>

						{selectedStudents.size > 0 && (
							<div className='bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between'>
								<p className='text-xs font-bold text-blue-700 dark:text-blue-300'>
									{selectedStudents.size} ta talaba tanlandi →{' '}
									{enrollGroup.name}
								</p>
								<button
									onClick={() => setSelectedStudents(new Set())}
									className='text-[10px] text-blue-400 hover:text-red-500 font-semibold'
								>
									Tozalash
								</button>
							</div>
						)}

						<div className='flex gap-3'>
							<button
								onClick={() => {
									setEnrollGroup(null)
									setSelectedStudents(new Set())
									setStudentSearch('')
								}}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor
							</button>
							<button
								onClick={handleEnrollStudent}
								disabled={selectedStudents.size === 0 || saving}
								className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
							>
								{saving ? (
									<>
										<Loader2 className='w-4 h-4 animate-spin' />
										Qo'shilmoqda...
									</>
								) : (
									<>
										<UserPlus className='w-4 h-4' />
										{selectedStudents.size > 0
											? `${selectedStudents.size} ta qo'shish`
											: "Qo'shish"}
									</>
								)}
							</button>
						</div>
					</div>
				</Modal>
			)}

			{/* ── MOVE STUDENT ── */}
			{moveEnrollment && (
				<Modal
					title={`Ko'chirish — ${moveEnrollment.student_name}`}
					onClose={() => {
						setMoveEnrollment(null)
						setMoveTarget(null)
					}}
				>
					<p className='text-xs text-slate-500 dark:text-slate-400 mb-4'>
						<span className='font-bold text-slate-900 dark:text-white'>
							{moveEnrollment.student_name}
						</span>{' '}
						ni qaysi guruhga ko'chirmoqchisiz?
					</p>
					<div className='max-h-64 overflow-y-auto space-y-1 border border-slate-100 dark:border-slate-800 rounded-xl p-1 mb-4'>
						{groups
							.filter(g => g.id !== studentsGroup?.id)
							.map(g => (
								<button
									key={g.id}
									onClick={() => setMoveTarget(g.id)}
									className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${moveTarget === g.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
								>
									<div>
										<p className='text-xs font-bold'>{g.name}</p>
										<p
											className={`text-[10px] ${moveTarget === g.id ? 'text-blue-200' : 'text-slate-400'}`}
										>
											{g.course_name} · {g.enrolled_count}/{g.max_students}
										</p>
									</div>
									{moveTarget === g.id && (
										<CheckCircle2 className='w-4 h-4 shrink-0' />
									)}
								</button>
							))}
					</div>
					<div className='flex gap-3'>
						<button
							onClick={() => {
								setMoveEnrollment(null)
								setMoveTarget(null)
							}}
							className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
						>
							Bekor
						</button>
						<button
							onClick={handleMoveStudent}
							disabled={!moveTarget || saving}
							className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
						>
							{saving ? (
								<>
									<Loader2 className='w-4 h-4 animate-spin' />
									...
								</>
							) : (
								<>
									<ArrowRightLeft className='w-4 h-4' />
									Ko'chirish
								</>
							)}
						</button>
					</div>
				</Modal>
			)}

			{/* ── STUDENTS LIST ── */}
			{studentsGroup && !moveEnrollment && !enrollGroup && (
				<Modal
					wide
					title={`${studentsGroup.name} — O'quvchilar (${enrollments.length}/${studentsGroup.max_students})`}
					onClose={() => {
						setStudentsGroup(null)
						setEnrollments([])
					}}
				>
					<div className='space-y-3'>
						<div className='flex items-center justify-between gap-3'>
							<button
								onClick={() => setEnrollGroup(studentsGroup)}
								className='flex items-center gap-2 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all'
							>
								<UserPlus className='w-3.5 h-3.5' /> O'quvchi qo'shish
							</button>
							<div className='relative' onClick={e => e.stopPropagation()}>
								<button
									onClick={() => setExportGroupOpen(!exportGroupOpen)}
									className='flex items-center gap-2 h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:border-slate-300 transition-all'
								>
									<Download className='w-3.5 h-3.5' /> Eksport
								</button>
								{exportGroupOpen && (
									<div className='absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1.5'>
										<button
											onClick={() => {
												downloadCSV(
													buildEnrollmentsCSV(studentsGroup, enrollments),
													`${studentsGroup.name}_talabalar.csv`,
												)
												setExportGroupOpen(false)
											}}
											className='w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
										>
											<Download className='w-4 h-4 text-slate-500' />
											<div className='text-left'>
												<p className='font-bold'>CSV yuklab olish</p>
												<p className='text-[10px] text-slate-400'>
													Excel uchun
												</p>
											</div>
										</button>
										<button
											onClick={async () => {
												setExportGroupOpen(false)
												setSheetsLoading(true)
												const rows = enrollments.map(e => ({
													"O'quvchi": e.student_name,
													Telefon: e.student_phone,
													Guruh: studentsGroup.name,
													"Qo'shilgan": new Date(
														e.enrolled_at,
													).toLocaleDateString('uz-UZ'),
												}))
												const ok = await sendToGoogleSheets(
													rows,
													studentsGroup.name,
												)
												setSheetsLoading(false)
												if (ok) {
													showToast('Google Sheets ga yuborildi! ✓', 'success')
													window.open(
														SHEETS_URL.replace(/\/edit.*$/, '/edit'),
														'_blank',
													)
												} else {
													openSheetsWithData(
														buildEnrollmentsCSV(studentsGroup, enrollments),
													)
													showToast(
														'Buferga nusxalandi! Ctrl+V bilan joylashtiring',
														'info',
													)
												}
											}}
											className='w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
										>
											{sheetsLoading ? (
												<Loader2 className='w-4 h-4 animate-spin text-emerald-500' />
											) : (
												<FileSpreadsheet className='w-4 h-4 text-emerald-500' />
											)}
											<div className='text-left'>
												<p className='font-bold'>Google Sheets</p>
												<p className='text-[10px] text-slate-400'>
													Spreadsheetga yuboradi
												</p>
											</div>
										</button>
									</div>
								)}
							</div>
						</div>

						<div className='bg-slate-50 dark:bg-slate-800 rounded-xl p-3'>
							<div className='flex justify-between text-xs mb-1.5'>
								<span className='text-slate-500'>Band bo'lgan o'rinlar</span>
								<span className='font-bold text-slate-900 dark:text-white'>
									{enrollments.length}/{studentsGroup.max_students}
								</span>
							</div>
							<div className='h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
								<div
									className={`h-full rounded-full transition-all ${enrollments.length >= studentsGroup.max_students ? 'bg-red-500' : 'bg-blue-600'}`}
									style={{
										width: `${Math.min(100, (enrollments.length / studentsGroup.max_students) * 100)}%`,
									}}
								/>
							</div>
						</div>

						{enrollLoading ? (
							<div className='flex items-center justify-center py-10 gap-2'>
								<Loader2 className='w-5 h-5 animate-spin text-blue-600' />
								<span className='text-sm text-slate-400'>Yuklanmoqda...</span>
							</div>
						) : enrollments.length === 0 ? (
							<div className='text-center py-10'>
								<Users className='w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2' />
								<p className='text-sm text-slate-400'>
									Guruhda hali o'quvchi yo'q
								</p>
								<button
									onClick={() => setEnrollGroup(studentsGroup)}
									className='mt-3 text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline'
								>
									Birinchi o'quvchini qo'shish →
								</button>
							</div>
						) : (
							<div className='space-y-1.5 max-h-80 overflow-y-auto'>
								{enrollments.map((e, idx) => (
									<div
										key={e.id}
										className='flex items-center gap-3 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group'
									>
										<span className='text-[10px] text-slate-400 font-mono w-5 shrink-0'>
											{idx + 1}
										</span>
										<div className='w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0'>
											<span className='text-white text-[9px] font-black'>
												{e.student_name
													?.split(' ')
													.map((w: string) => w[0])
													.join('')
													.slice(0, 2)}
											</span>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-xs font-bold text-slate-900 dark:text-white truncate'>
												{e.student_name}
											</p>
											<p className='text-[10px] text-slate-400 truncate'>
												{e.student_phone || '—'}
											</p>
										</div>
										<span className='text-[10px] text-slate-400 hidden sm:block'>
											{new Date(e.enrolled_at).toLocaleDateString('uz-UZ')}
										</span>
										<div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
											<button
												onClick={() => setMoveEnrollment(e)}
												title="Boshqa guruhga ko'chirish"
												className='w-7 h-7 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors'
											>
												<ArrowRightLeft className='w-3.5 h-3.5' />
											</button>
											<button
												onClick={() => handleRemoveEnrollment(e.id)}
												title='Guruhdan chiqarish'
												className='w-7 h-7 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
											>
												<X className='w-3.5 h-3.5' />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</Modal>
			)}

			{/* ── HEADER ── */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white'>
						Guruhlar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						Barcha o'quv guruhlarini boshqaring
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<div className='relative' onClick={e => e.stopPropagation()}>
						<button
							onClick={() => setExportMainOpen(!exportMainOpen)}
							className='flex items-center gap-2 h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs font-bold hover:border-slate-300 dark:hover:border-slate-600 transition-all'
						>
							<Download className='w-3.5 h-3.5' /> Eksport
						</button>
						{exportMainOpen && (
							<div className='absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1.5'>
								<button
									onClick={() => {
										downloadCSV(
											buildGroupsCSV(filtered),
											`guruhlar_${new Date().toISOString().slice(0, 10)}.csv`,
										)
										setExportMainOpen(false)
									}}
									className='w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
								>
									<Download className='w-4 h-4 text-slate-500' />
									<div className='text-left'>
										<p className='font-bold'>CSV yuklab olish</p>
										<p className='text-[10px] text-slate-400'>
											Excel da ochish uchun
										</p>
									</div>
								</button>
								<button
									onClick={async () => {
										setExportMainOpen(false)
										setSheetsLoading(true)
										const rows = filtered.map(g => ({
											Guruh: g.name,
											Kurs: g.course_name || '',
											Mentor: g.mentor_name || '',
											'Narx ($)': g.price,
											Davomiyligi: `${g.duration} ${g.duration_type}`,
											Kunlar: g.schedule_days,
											Vaqt: g.class_time,
											Boshlanish: g.start_date,
											"Max o'rin": g.max_students,
											"O'quvchilar": g.enrolled_count || 0,
											Holat: statusMap[g.status]?.label || g.status,
										}))
										const ok = await sendToGoogleSheets(rows, 'Guruhlar')
										setSheetsLoading(false)
										if (ok) {
											showToast('Google Sheets ga yuborildi! ✓', 'success')
											window.open(
												SHEETS_URL.replace(/\/edit.*$/, '/edit'),
												'_blank',
											)
										} else {
											openSheetsWithData(buildGroupsCSV(filtered))
											showToast(
												'Buferga nusxalandi! Ctrl+V bilan joylashtiring',
												'info',
											)
										}
									}}
									className='w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
								>
									{sheetsLoading ? (
										<Loader2 className='w-4 h-4 animate-spin text-emerald-500' />
									) : (
										<FileSpreadsheet className='w-4 h-4 text-emerald-500' />
									)}
									<div className='text-left'>
										<p className='font-bold'>Google Sheets</p>
										<p className='text-[10px] text-slate-400'>
											Spreadsheetga yuboradi
										</p>
									</div>
								</button>
							</div>
						)}
					</div>
					<button
						onClick={() => setShowAdd(true)}
						className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'
					>
						<Plus className='w-3.5 h-3.5' /> Yangi Guruh
					</button>
				</div>
			</div>

			{/* ── STATS ── */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				{[
					{
						label: 'Jami Guruhlar',
						value: groups.length,
						icon: Users,
						bg: 'bg-blue-50 dark:bg-blue-500/10',
						color: 'text-blue-600 dark:text-blue-400',
					},
					{
						label: 'Faol guruhlar',
						value: groups.filter(g => g.status === 'active').length,
						icon: CheckCircle2,
						bg: 'bg-emerald-50 dark:bg-emerald-500/10',
						color: 'text-emerald-600 dark:text-emerald-400',
					},
					{
						label: "Jami o'quvchilar",
						value: groups.reduce((a, g) => a + (g.enrolled_count || 0), 0),
						icon: Users,
						bg: 'bg-violet-50 dark:bg-violet-500/10',
						color: 'text-violet-600 dark:text-violet-400',
					},
					{
						label: "Bo'sh o'rinlar",
						value: groups.reduce(
							(a, g) => a + (g.max_students || 0) - (g.enrolled_count || 0),
							0,
						),
						icon: BookOpen,
						bg: 'bg-amber-50 dark:bg-amber-500/10',
						color: 'text-amber-600 dark:text-amber-400',
					},
				].map(s => {
					const Icon = s.icon
					return (
						<div
							key={s.label}
							className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm'
						>
							<div
								className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mb-2`}
							>
								<Icon className={s.color} style={{ width: 16, height: 16 }} />
							</div>
							<div className='text-xl font-black text-slate-900 dark:text-white'>
								{s.value}
							</div>
							<div className='text-[11px] text-slate-500 dark:text-slate-400'>
								{s.label}
							</div>
						</div>
					)
				})}
			</div>

			{/* ── SEARCH ── */}
			<div className='flex items-center gap-3 flex-wrap'>
				<div className='relative flex-1 max-w-xs'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Guruh yoki kurs qidirish...'
						className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
					/>
				</div>
				<div className='flex gap-1.5 flex-wrap'>
					{[
						['all', 'Barchasi'],
						...Object.entries(statusMap).map(([k, v]) => [k, v.label]),
					].map(([val, lbl]) => (
						<button
							key={val}
							onClick={() => setFilterStatus(val)}
							className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${filterStatus === val ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}
						>
							{lbl}
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
										'Guruh',
										'Kurs',
										'Mentor',
										'Narx',
										'Davom',
										'Kunlar',
										'Vaqt',
										'Boshlanish',
										"O'quvchilar",
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
											colSpan={12}
											className='text-center py-12 text-slate-400 text-sm'
										>
											Guruh topilmadi
										</td>
									</tr>
								) : (
									filtered.map((g, idx) => {
										const st = statusMap[g.status] || statusMap.inactive
										const pct = g.max_students
											? Math.round(
													((g.enrolled_count || 0) / g.max_students) * 100,
												)
											: 0
										const full = (g.enrolled_count || 0) >= g.max_students
										return (
											<tr
												key={g.id}
												className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
											>
												<td className='px-4 py-3'>
													<span className='text-xs text-slate-400 font-mono'>
														{idx + 1}
													</span>
												</td>
												<td className='px-4 py-3'>
													<p className='text-xs font-black text-slate-900 dark:text-white whitespace-nowrap'>
														{g.name}
													</p>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap'>
														{g.course_name}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
														{g.mentor_name}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-xs font-black text-emerald-600 dark:text-emerald-400'>
														${g.price}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 whitespace-nowrap'>
														{g.duration} {g.duration_type}
													</span>
												</td>
												<td className='px-4 py-3'>
													<div className='flex gap-0.5 flex-wrap max-w-[100px]'>
														{weekDays.map(d => (
															<span
																key={d}
																className={`text-[9px] font-bold px-1 py-0.5 rounded ${g.schedule_days?.includes(d) ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
															>
																{d}
															</span>
														))}
													</div>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 flex items-center gap-1 whitespace-nowrap'>
														<Clock className='w-3 h-3' />
														{g.class_time || '—'}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 flex items-center gap-1 whitespace-nowrap'>
														<Calendar className='w-3 h-3' />
														{g.start_date
															? new Date(g.start_date).toLocaleDateString(
																	'uz-UZ',
																)
															: '—'}
													</span>
												</td>
												<td className='px-4 py-3'>
													<div className='flex items-center gap-2'>
														<button
															onClick={() => openStudentsModal(g)}
															className='flex items-center gap-1 hover:text-blue-600 transition-colors'
														>
															<div className='text-left'>
																<p
																	className={`text-xs font-bold ${full ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}
																>
																	{g.enrolled_count || 0}/{g.max_students}
																</p>
																<div className='w-14 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-0.5'>
																	<div
																		className={`h-full rounded-full ${full ? 'bg-red-500' : 'bg-blue-500'}`}
																		style={{ width: `${Math.min(100, pct)}%` }}
																	/>
																</div>
															</div>
														</button>
														<button
															onClick={() => setEnrollGroup(g)}
															title="O'quvchi qo'shish"
															className='w-6 h-6 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors shrink-0'
														>
															<UserPlus className='w-3.5 h-3.5' />
														</button>
													</div>
												</td>
												<td className='px-4 py-3'>
													<span
														className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${st.cls}`}
													>
														{st.label}
													</span>
												</td>
												<td className='px-4 py-3'>
													<ActionMenu
														onView={() => setViewItem(g)}
														onEdit={() => setEditItem(g)}
														onDelete={() => setDeleteItem(g)}
														onEnroll={() => setEnrollGroup(g)}
													/>
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
						{filtered.length} ta guruh
					</p>
					{!loading && (
						<button
							onClick={fetchAll}
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
