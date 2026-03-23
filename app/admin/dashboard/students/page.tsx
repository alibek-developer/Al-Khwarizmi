'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Download,
	Edit2,
	Eye,
	EyeOff,
	FileSpreadsheet,
	FileText,
	Loader2,
	MoreHorizontal,
	Search,
	Trash2,
	UserPlus,
	X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Types ─────────────────────────────────────────────────────────────────
type StudentRow = {
	id: number
	first_name: string
	last_name: string
	father_name: string
	birth_date: string
	phone: string
	parent_phone: string
	certificate_id: string
	pinfl: string
	course_id: number
	payment_amount: number
	status: string
	created_at: string
	email?: string
	password?: string
}

type Student = {
	id: number
	first_name: string
	last_name: string
	father_name: string
	full_name: string
	birth_date: string
	phone: string
	parent_phone: string
	certificate_id: string
	pinfl: string
	course: string
	course_id: number
	payment_amount: number
	date: string
	status: string
	paid: string
	avatar: string
	color: string
	email?: string
	password?: string
}

// ─── Constants ─────────────────────────────────────────────────────────────
// Kurslar DB dan yuklanadi — pastda fetchCourses() bilan to'ldiriladi
let COURSE_MAP: Record<number, string> = {}
let COURSE_ID_MAP: Record<string, number> = {}

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

function PasswordInput({
	value,
	onChange,
	placeholder = '••••••••',
}: {
	value: string
	onChange: (v: string) => void
	placeholder?: string
}) {
	const [show, setShow] = useState(false)
	return (
		<div className='relative'>
			<input
				type={show ? 'text' : 'password'}
				className={inputCls + ' pr-10'}
				placeholder={placeholder}
				value={value}
				onChange={e => onChange(e.target.value)}
				autoComplete='new-password'
			/>
			<button
				type='button'
				onClick={() => setShow(v => !v)}
				className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors'
			>
				{show ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
			</button>
		</div>
	)
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function rowToStudent(row: StudentRow, idx: number): Student {
	const full_name = [row.first_name, row.last_name].filter(Boolean).join(' ')
	return {
		id: row.id,
		first_name: row.first_name || '',
		last_name: row.last_name || '',
		father_name: row.father_name || '',
		full_name,
		birth_date: row.birth_date || '',
		phone: row.phone || '',
		parent_phone: row.parent_phone || '',
		certificate_id: row.certificate_id || '',
		pinfl: row.pinfl || '',
		course: COURSE_MAP[row.course_id] ?? `Kurs ${row.course_id}`,
		course_id: row.course_id,
		payment_amount: row.payment_amount || 0,
		date: new Date(row.created_at).toLocaleDateString('uz-UZ', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}),
		status: row.status,
		paid: row.payment_amount ? `$${row.payment_amount}` : '$0',
		avatar:
			full_name
				.split(' ')
				.map((w: string) => w[0])
				.join('')
				.slice(0, 2)
				.toUpperCase() || '??',
		color: colors[idx % colors.length],
		email: row.email || '',
		password: row.password || '',
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
				className='w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col'
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

// ─── ActionMenu ─────────────────────────────────────────────────────────────
function ActionMenu({
	student,
	onView,
	onEdit,
	onDelete,
}: {
	student: Student
	onView: () => void
	onEdit: () => void
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
					<button
						onClick={() => {
							onEdit()
							setOpen(false)
						}}
						className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
					>
						<Edit2 className='w-3.5 h-3.5' /> Tahrirlash
					</button>
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

// ─── Export Button ──────────────────────────────────────────────────────────
function ExportMenu({ students }: { students: Student[] }) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!open) return
		const close = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
		}
		document.addEventListener('mousedown', close)
		return () => document.removeEventListener('mousedown', close)
	}, [open])

	const exportCSV = () => {
		const headers = [
			'#',
			'Ism',
			'Familiya',
			'Otasining ismi',
			"Tug'ilgan sana",
			'Telefon',
			'Ota-ona telefoni',
			'Guvohnoma raqami',
			'PINFL',
			'Kurs',
			'Holat',
			"To'lov",
			'Sana',
		]
		const rows = students.map((s, i) => [
			i + 1,
			s.first_name,
			s.last_name,
			s.father_name,
			s.birth_date,
			s.phone,
			s.parent_phone,
			s.certificate_id,
			s.pinfl,
			s.course,
			s.status,
			s.paid,
			s.date,
		])
		const csv = [headers, ...rows]
			.map(r =>
				r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','),
			)
			.join('\n')
		const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `talabalar_${new Date().toISOString().slice(0, 10)}.csv`
		a.click()
		URL.revokeObjectURL(url)
		setOpen(false)
	}

	const exportGoogleSheets = () => {
		// CSV yuklab olib, Google Sheets ga ochish uchun link
		const headers = [
			'#',
			'Ism',
			'Familiya',
			'Otasining ismi',
			"Tug'ilgan sana",
			'Telefon',
			'Ota-ona telefoni',
			'Guvohnoma raqami',
			'PINFL',
			'Kurs',
			'Holat',
			"To'lov",
			'Sana',
		]
		const rows = students.map((s, i) => [
			i + 1,
			s.first_name,
			s.last_name,
			s.father_name,
			s.birth_date,
			s.phone,
			s.parent_phone,
			s.certificate_id,
			s.pinfl,
			s.course,
			s.status,
			s.paid,
			s.date,
		])
		const csv = [headers, ...rows]
			.map(r =>
				r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','),
			)
			.join('\n')
		const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `talabalar_${new Date().toISOString().slice(0, 10)}.csv`
		a.click()
		URL.revokeObjectURL(url)
		// Google Sheets ochish
		setTimeout(() => {
			window.open('https://sheets.new', '_blank')
		}, 500)
		setOpen(false)
	}

	return (
		<div className='relative' ref={ref}>
			<button
				onClick={() => setOpen(v => !v)}
				className='flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-bold hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm'
			>
				<Download className='w-3.5 h-3.5' /> Eksport
			</button>
			{open && (
				<div className='absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden'>
					<button
						onClick={exportCSV}
						className='w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left'
					>
						<div className='w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5'>
							<FileText className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
						</div>
						<div>
							<p className='text-xs font-bold text-slate-900 dark:text-white'>
								CSV yuklab olish
							</p>
							<p className='text-[10px] text-slate-400 mt-0.5'>
								Excel da ochish uchun
							</p>
						</div>
					</button>
					<button
						onClick={exportGoogleSheets}
						className='w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left'
					>
						<div className='w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5'>
							<FileSpreadsheet className='w-4 h-4 text-blue-600 dark:text-blue-400' />
						</div>
						<div>
							<p className='text-xs font-bold text-slate-900 dark:text-white'>
								Google Sheets
							</p>
							<p className='text-[10px] text-slate-400 mt-0.5'>
								Spreadsheetga yuboradi
							</p>
						</div>
					</button>
				</div>
			)}
		</div>
	)
}

// ─── Student Form ───────────────────────────────────────────────────────────
type FormState = {
	first_name: string
	last_name: string
	father_name: string
	birth_date: string
	phone: string
	parent_phone: string
	certificate_id: string
	pinfl: string
	course: string
	email: string
	password: string
}

const emptyForm: FormState = {
	first_name: '',
	last_name: '',
	father_name: '',
	birth_date: '',
	phone: '',
	parent_phone: '',
	certificate_id: '',
	pinfl: '',
	course: '',
	email: '',
	password: '',
}

function StudentForm({
	form,
	onChange,
	coursesDB,
}: {
	form: FormState
	onChange: (f: FormState) => void
	coursesDB: { id: number; title_en: string; title_uz: string }[]
}) {
	const set =
		(key: keyof FormState) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
			onChange({ ...form, [key]: e.target.value })

	return (
		<div className='space-y-4'>
			<div className='grid grid-cols-3 gap-3'>
				<div>
					<label className={labelCls}>Familiya *</label>
					<input
						className={inputCls}
						placeholder='Karimov'
						value={form.last_name}
						onChange={set('last_name')}
					/>
				</div>
				<div>
					<label className={labelCls}>Ism *</label>
					<input
						className={inputCls}
						placeholder='Jasur'
						value={form.first_name}
						onChange={set('first_name')}
					/>
				</div>
				<div>
					<label className={labelCls}>Otasining ismi</label>
					<input
						className={inputCls}
						placeholder='Aliyevich'
						value={form.father_name}
						onChange={set('father_name')}
					/>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className={labelCls}>Tug'ilgan sana</label>
					<input
						className={inputCls}
						type='date'
						value={form.birth_date}
						onChange={set('birth_date')}
					/>
				</div>
				<div>
					<label className={labelCls}>Kurs</label>
					<select
						className={inputCls}
						value={form.course}
						onChange={set('course')}
					>
						<option value=''>— Kurs tanlang —</option>
						{coursesDB.map(c => (
							<option key={c.id} value={c.title_en}>
								{c.title_en}
								{c.title_uz ? ` · ${c.title_uz}` : ''}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className={labelCls}>Telefon</label>
					<input
						className={inputCls}
						placeholder='+998 90 000 00 00'
						value={form.phone}
						onChange={set('phone')}
					/>
				</div>
				<div>
					<label className={labelCls}>Ota-ona telefoni</label>
					<input
						className={inputCls}
						placeholder='+998 90 000 00 00'
						value={form.parent_phone}
						onChange={set('parent_phone')}
					/>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3'>
				<div>
					<label className={labelCls}>Guvohnoma raqami</label>
					<input
						className={inputCls}
						placeholder='AA1234567'
						value={form.certificate_id}
						onChange={set('certificate_id')}
					/>
				</div>
				<div>
					<label className={labelCls}>PINFL (JSHSHR)</label>
					<input
						className={inputCls}
						placeholder='12345678901234'
						maxLength={14}
						value={form.pinfl}
						onChange={set('pinfl')}
					/>
				</div>
			</div>

			<div className='bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 space-y-3'>
				<p className='text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2'>
					<span className='w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[7px]'>🔑</span>
					Student Panel Login Ma&apos;lumotlari
				</p>
				<div className='grid grid-cols-2 gap-3'>
					<div>
						<label className={labelCls}>Email</label>
						<input
							className={inputCls}
							type='email'
							placeholder='student@email.com'
							value={form.email}
							onChange={set('email')}
							autoComplete='off'
						/>
					</div>
					<div>
						<label className={labelCls}>Parol *</label>
						<PasswordInput
							value={form.password}
							onChange={v => onChange({ ...form, password: v })}
						/>
					</div>
				</div>
				<p className='text-[10px] text-emerald-600 dark:text-emerald-400'>
					Bu email va parol orqali talaba student paneliga kiradi
				</p>
			</div>
		</div>
	)
}

// ─── Main Page ─────────────────────────────────────────────────────────────
// ── CourseDB type ────────────────────────────────────────────────────────
type CourseDB = { id: number; title_en: string; title_uz: string }

export default function StudentsPage() {
	const [coursesDB, setCoursesDB] = useState<CourseDB[]>([])
	const [students, setStudents] = useState<Student[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [search, setSearch] = useState('')
	const [filterStatus, setFilterStatus] = useState('all')
	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Student | null>(null)
	const [viewItem, setViewItem] = useState<Student | null>(null)
	const [deleteItem, setDeleteItem] = useState<Student | null>(null)
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)
	const [form, setForm] = useState<FormState>(emptyForm)

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
			showToast('Yuklashda xato', 'error')
			setLoading(false)
			return
		}
		setStudents((data as StudentRow[]).map(rowToStudent))
		setLoading(false)
	}

	const fetchCourses = async () => {
		const { data } = await supabase
			.from('courses')
			.select('id, title_en, title_uz')
			.order('title_en')
		let list = data || []

		// Agar courses jadvali bo'sh bo'lsa — default 4 ta kursni qo'shamiz
		if (list.length === 0) {
			const defaults = [
				{
					title_en: 'Web Development',
					title_uz: 'Veb Dasturlash',
					price: 0,
					rating: 5.0,
					lessons_count: 0,
					total_students: 0,
				},
				{
					title_en: 'English Course',
					title_uz: 'Ingliz tili',
					price: 0,
					rating: 5.0,
					lessons_count: 0,
					total_students: 0,
				},
				{
					title_en: 'Data Science',
					title_uz: "Ma'lumotlar Fanlari",
					price: 0,
					rating: 5.0,
					lessons_count: 0,
					total_students: 0,
				},
				{
					title_en: 'AI & ML',
					title_uz: "Sun'iy Intellekt",
					price: 0,
					rating: 5.0,
					lessons_count: 0,
					total_students: 0,
				},
			]
			const { data: inserted } = await supabase
				.from('courses')
				.insert(defaults)
				.select('id, title_en, title_uz')
			list = inserted || []
		}

		setCoursesDB(list)
		COURSE_MAP = Object.fromEntries(list.map(c => [c.id, c.title_en]))
		COURSE_ID_MAP = Object.fromEntries(list.map(c => [c.title_en, c.id]))
		// Birinchi kursni default qilib o'rnatamiz
		if (list.length > 0) {
			setForm(prev => ({ ...prev, course: prev.course || list[0].title_en }))
		}
	}

	useEffect(() => {
		fetchCourses()
		fetchStudents()
	}, [])

	const handleAdd = async () => {
		if (!form.first_name || !form.last_name || !form.password) return
		setSaving(true)
		const { error } = await supabase.from('students').insert([
			{
				first_name: form.first_name,
				last_name: form.last_name,
				father_name: form.father_name,
				birth_date: form.birth_date || null,
				phone: form.phone,
				parent_phone: form.parent_phone,
				certificate_id: form.certificate_id,
				pinfl: form.pinfl,
				course_id: COURSE_ID_MAP[form.course] ?? null,
				payment_amount: 0,
				status: 'active',
				email: form.email || null,
				password: form.password,
			},
		])
		setSaving(false)
		if (error) {
			showToast("Qo'shishda xato: " + error.message, 'error')
			return
		}
		showToast("Talaba muvaffaqiyatli qo'shildi!")
		setShowAdd(false)
		setForm(emptyForm)
		fetchStudents()
	}

	const handleEdit = async () => {
		if (!editItem) return
		setSaving(true)
		const updateData: Record<string, unknown> = {
			first_name: editItem.first_name,
			last_name: editItem.last_name,
			father_name: editItem.father_name,
			birth_date: editItem.birth_date || null,
			phone: editItem.phone,
			parent_phone: editItem.parent_phone,
			certificate_id: editItem.certificate_id,
			pinfl: editItem.pinfl,
			course_id: COURSE_ID_MAP[editItem.course] ?? editItem.course_id ?? null,
			status: editItem.status,
			email: editItem.email || null,
		}
		if (editItem.password && editItem.password.trim()) {
			updateData.password = editItem.password
		}
		const { error } = await supabase
			.from('students')
			.update(updateData)
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
			s.full_name.toLowerCase().includes(search.toLowerCase()) ||
			s.course.toLowerCase().includes(search.toLowerCase()) ||
			s.pinfl.includes(search)
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

			{/* ── ADD MODAL ── */}
			{showAdd && (
				<Modal
					title="Yangi Talaba Qo'shish"
					onClose={() => {
						setShowAdd(false)
						setForm(emptyForm)
					}}
				>
					<StudentForm form={form} onChange={setForm} coursesDB={coursesDB} />
					<div className='flex gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800'>
						<button
							onClick={() => {
								setShowAdd(false)
								setForm(emptyForm)
							}}
							className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
						>
							Bekor
						</button>
						<button
							onClick={handleAdd}
							disabled={saving || !form.first_name || !form.last_name || !form.password}
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

			{/* ── EDIT MODAL ── */}
			{editItem && (
				<Modal title='Talabani Tahrirlash' onClose={() => setEditItem(null)}>
					<div className='space-y-4'>
						<div className='grid grid-cols-3 gap-3'>
							<div>
								<label className={labelCls}>Familiya</label>
								<input
									className={inputCls}
									value={editItem.last_name}
									onChange={e =>
										setEditItem(p =>
											p
												? {
														...p,
														last_name: e.target.value,
														full_name: `${e.target.value} ${p.first_name}`,
													}
												: null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Ism</label>
								<input
									className={inputCls}
									value={editItem.first_name}
									onChange={e =>
										setEditItem(p =>
											p
												? {
														...p,
														first_name: e.target.value,
														full_name: `${p.last_name} ${e.target.value}`,
													}
												: null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Otasining ismi</label>
								<input
									className={inputCls}
									value={editItem.father_name}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, father_name: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Tug'ilgan sana</label>
								<input
									className={inputCls}
									type='date'
									value={editItem.birth_date}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, birth_date: e.target.value } : null,
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
									<option value=''>— Kurs tanlang —</option>
									{coursesDB.map(c => (
										<option key={c.id} value={c.title_en}>
											{c.title_en}
											{c.title_uz ? ` · ${c.title_uz}` : ''}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
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
							<div>
								<label className={labelCls}>Ota-ona telefoni</label>
								<input
									className={inputCls}
									value={editItem.parent_phone}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, parent_phone: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Guvohnoma raqami</label>
								<input
									className={inputCls}
									value={editItem.certificate_id}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, certificate_id: e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>PINFL (JSHSHR)</label>
								<input
									className={inputCls}
									maxLength={14}
									value={editItem.pinfl}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, pinfl: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div className='bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-4 space-y-3'>
							<p className='text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2'>
								<span className='w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[7px]'>🔑</span>
								Student Panel Login Ma&apos;lumotlari
							</p>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className={labelCls}>Email</label>
									<input
										className={inputCls}
										type='email'
										value={editItem.email || ''}
										onChange={e =>
											setEditItem(p =>
												p ? { ...p, email: e.target.value } : null,
											)
										}
									/>
								</div>
								<div>
									<label className={labelCls}>Yangi parol (ixtiyoriy)</label>
									<PasswordInput
										value={editItem.password || ''}
										onChange={v =>
											setEditItem(p => (p ? { ...p, password: v } : null))
										}
										placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
									/>
								</div>
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
					</div>
				</Modal>
			)}

			{/* ── VIEW MODAL ── */}
			{viewItem && (
				<Modal title="Talaba Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='flex items-center gap-4 mb-5'>
						<div
							className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${viewItem.color} flex items-center justify-center shrink-0`}
						>
							<span className='text-white text-lg font-black'>
								{viewItem.avatar}
							</span>
						</div>
						<div>
							<p className='font-black text-slate-900 dark:text-white text-base'>
								{viewItem.full_name}
							</p>
							<p className='text-sm text-blue-600 dark:text-blue-400 font-semibold'>
								{viewItem.course}
							</p>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-x-6'>
						{[
							['Familiya', viewItem.last_name],
							['Ism', viewItem.first_name],
							['Otasining ismi', viewItem.father_name],
							["Tug'ilgan sana", viewItem.birth_date],
							['Telefon', viewItem.phone],
							['Ota-ona telefoni', viewItem.parent_phone],
							['Guvohnoma raqami', viewItem.certificate_id],
							['PINFL (JSHSHR)', viewItem.pinfl],
							['Kurs', viewItem.course],
							['Holat', viewItem.status],
							["To'lov", viewItem.paid],
							["Ro'yxatga olingan", viewItem.date],
						].map(([k, v]) => (
							<div
								key={k}
								className='flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0'
							>
								<span className='text-xs text-slate-400'>{k}</span>
								<span className='text-xs font-bold text-slate-900 dark:text-white text-right max-w-[140px] truncate'>
									{v || '—'}
								</span>
							</div>
						))}
					</div>

					{viewItem.email && (
						<div className='mt-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3'>
							<p className='text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-2'>
								🔑 Login Ma&apos;lumotlari
							</p>
							<div className='flex justify-between text-xs'>
								<span className='text-slate-500'>Email</span>
								<span className='font-bold text-slate-900 dark:text-white'>
									{viewItem.email}
								</span>
							</div>
							<div className='flex justify-between text-xs mt-1'>
								<span className='text-slate-500'>Parol</span>
								<span className='font-bold text-slate-900 dark:text-white'>
									{'•'.repeat(Math.min(viewItem.password?.length || 0, 10))}
								</span>
							</div>
						</div>
					)}
				</Modal>
			)}

			{/* ── DELETE MODAL ── */}
			{deleteItem && (
				<Modal title="Talabani O'chirish" onClose={() => setDeleteItem(null)}>
					<p className='text-sm text-slate-600 dark:text-slate-300 mb-5'>
						<span className='font-bold text-slate-900 dark:text-white'>
							"{deleteItem.full_name}"
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

			{/* ── HEADER ── */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white'>
						Talabalar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						{students.length} ta talaba ro'yxatda
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<ExportMenu students={filtered} />
					<button
						onClick={() => setShowAdd(true)}
						className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'
					>
						<UserPlus className='w-3.5 h-3.5' /> Talaba Qo'shish
					</button>
				</div>
			</div>

			{/* ── STATS ── */}
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

			{/* ── SEARCH & FILTER ── */}
			<div className='flex items-center gap-3 flex-wrap'>
				<div className='relative flex-1 max-w-xs'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Ism, kurs yoki PINFL...'
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
										'Telefon',
										'PINFL',
										'Guvohnoma',
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
											colSpan={10}
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
														<div>
															<p className='text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap'>
																{s.full_name}
															</p>
															{s.father_name && (
																<p className='text-[10px] text-slate-400'>
																	{s.father_name}
																</p>
															)}
														</div>
													</div>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
														{s.course}
													</span>
												</td>
												<td className='px-4 py-3'>
													<div>
														<p className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
															{s.phone || '—'}
														</p>
														{s.parent_phone && (
															<p className='text-[10px] text-slate-400'>
																{s.parent_phone}
															</p>
														)}
													</div>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 dark:text-slate-400 font-mono'>
														{s.pinfl || '—'}
													</span>
												</td>
												<td className='px-4 py-3'>
													<span className='text-[11px] text-slate-500 dark:text-slate-400'>
														{s.certificate_id || '—'}
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
													<ActionMenu
														student={s}
														onView={() => setViewItem(s)}
														onEdit={() => setEditItem(s)}
														onDelete={() => setDeleteItem(s)}
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
