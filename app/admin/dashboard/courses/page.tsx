'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	BookOpen, CheckCircle2, Edit2, Eye, Loader2, MoreHorizontal,
	Plus, Search, Star, Trash2, TrendingUp, Upload, Users, X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Supabase ──────────────────────────────────────────────────────────────
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Types ─────────────────────────────────────────────────────────────────
type Course = {
	id: number
	category_id: number | null
	mentor_id: number | null
	title_en: string
	title_uz: string
	duration: string
	level: string
	lessons_count: number
	total_students: number
	price: number
	image_url: string
	badge: string
	rating: number
	created_at?: string
}

// ─── Constants ─────────────────────────────────────────────────────────────
const emptyForm: Omit<Course, 'id' | 'created_at'> = {
	category_id: null,
	mentor_id: null,
	title_en: '',
	title_uz: '',
	duration: '',
	level: '',
	lessons_count: 0,
	total_students: 0,
	price: 0,
	image_url: '',
	badge: '',
	rating: 5.0,
}

const levelColors: Record<string, string> = {
	Beginner: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
	Intermediate: 'bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400',
	Advanced: 'bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400',
	'A1–C1': 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
}

const badgeColors: Record<string, string> = {
	HOT: 'bg-red-500', NEW: 'bg-blue-500', POPULAR: 'bg-purple-500',
	TRENDING: 'bg-orange-500', '': '',
}

const inputCls = 'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls = 'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'

// ─── Toast ─────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
	return (
		<div className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
			{type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
			{msg}
		</div>
	)
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
			<div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
					<h3 className="font-black text-slate-900 dark:text-white text-base">{title}</h3>
					<button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X className="w-4 h-4" /></button>
				</div>
				<div className="p-6 overflow-y-auto">{children}</div>
			</div>
		</div>
	)
}

// ─── ActionMenu ─────────────────────────────────────────────────────────────
function ActionMenu({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, right: 0 })

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		const rect = e.currentTarget.getBoundingClientRect()
		setPos({ top: rect.bottom + window.scrollY + 4, right: window.innerWidth - rect.right })
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
			<button onClick={handleOpen} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
				<MoreHorizontal className="w-4 h-4" />
			</button>
			{open && (
				<div className="fixed w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[999] py-1"
					style={{ top: pos.top, right: pos.right }}>
					<button onClick={() => { onView(); setOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Eye className="w-3.5 h-3.5" />Ko'rish</button>
					<button onClick={() => { onEdit(); setOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"><Edit2 className="w-3.5 h-3.5" />Tahrirlash</button>
					<button onClick={() => { onDelete(); setOpen(false) }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" />O'chirish</button>
				</div>
			)}
		</div>
	)
}

// ─── Shared upload helper ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────
// Rasm yuklash qoidasi:
//   preview  (base64)  → faqat brauzerda ko'rsatish uchun — DB ga KIRMAYDI
//   storageUrl (https) → Supabase Storage URL       — faqat SHU DB ga yoziladi
// ─────────────────────────────────────────────────────────────────────────
async function uploadToStorage(file: File): Promise<string> {
	const ext = file.name.split('.').pop()
	const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
	const path = `courses/${fileName}`

	const { error } = await supabase.storage
		.from('images')
		.upload(path, file, { upsert: true, contentType: file.type })

	if (error) {
		console.error('❌ Storage upload xato:', error.message)
		return ''
	}

	const { data } = supabase.storage.from('images').getPublicUrl(path)
	console.log('✅ Storage URL:', data.publicUrl)
	return data.publicUrl  // https://... — DB ga yoziladigan narsa shu
}

// ─── Image Upload Box ─────────────────────────────────────────────────────
function ImageUploadBox({
	currentUrl,
	onUploaded,
}: {
	currentUrl: string            // DB dagi joriy https:// URL
	onUploaded: (url: string) => void  // Storage URL tayyor bo'lganda chaqiriladi
}) {
	// preview — faqat ko'rsatish (base64 yoki joriy URL), DB ga BORMAYDI
	const [preview, setPreview] = useState(currentUrl || '')
	const [uploading, setUploading] = useState(false)
	const [uploadError, setUploadError] = useState('')
	const [uploaded, setUploaded] = useState(false)

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		setUploadError('')
		setUploaded(false)

		// Bosqich 1: base64 preview — faqat ko'rsatish uchun (DB ga bormaydi)
		const reader = new FileReader()
		reader.onload = ev => setPreview(ev.target?.result as string)
		reader.readAsDataURL(file)

		// Bosqich 2: Supabase Storage ga yuklash
		setUploading(true)
		const storageUrl = await uploadToStorage(file)
		setUploading(false)

		if (!storageUrl) {
			setUploadError("Yuklashda xato. 'images' bucket mavjudligini tekshiring.")
			return
		}

		// Bosqich 3: Faqat Storage URL ni yuqoriga uzatamiz — bu DB ga yoziladi
		setUploaded(true)
		onUploaded(storageUrl)
	}

	return (
		<div>
			<label className={labelCls}>Kurs Rasmi</label>
			<label className="relative flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden bg-slate-50 dark:bg-slate-800
				hover:border-blue-400
				border-slate-200 dark:border-slate-700">
				{preview
					? <img src={preview} alt="" className="w-full h-full object-cover" />
					: (
						<div className="flex flex-col items-center gap-1 pointer-events-none">
							<Upload className="w-6 h-6 text-slate-400" />
							<span className="text-xs text-slate-400">Rasm yuklash uchun bosing</span>
							<span className="text-[10px] text-slate-300 dark:text-slate-600">JPG · PNG · WEBP</span>
						</div>
					)}

				{/* Yuklanmoqda overlay */}
				{uploading && (
					<div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 pointer-events-none">
						<Loader2 className="w-6 h-6 text-white animate-spin" />
						<span className="text-white text-xs font-bold">Storage ga yuklanmoqda...</span>
					</div>
				)}

				{/* Muvaffaqiyat badge */}
				{uploaded && !uploading && (
					<div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
						<CheckCircle2 className="w-2.5 h-2.5" /> Yuklandi
					</div>
				)}

				<input type="file" accept="image/*" className="hidden" onChange={handleChange} />
			</label>

			{/* Xato */}
			{uploadError && (
				<p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
					<AlertCircle className="w-3 h-3 shrink-0" /> {uploadError}
				</p>
			)}

			{/* Saqlangan URL ko'rsatish */}
			{currentUrl?.startsWith('http') && !uploaded && (
				<p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
					<CheckCircle2 className="w-2.5 h-2.5" /> Storage URL saqlangan
				</p>
			)}
		</div>
	)
}

// ─── Course Form Fields ─────────────────────────────────────────────────────
function CourseFormFields({ form, onChange }: {
	form: typeof emptyForm
	onChange: (f: typeof emptyForm) => void
}) {
	const [mentors, setMentors] = useState<{ id: number; full_name: string; specialty_en: string; image_url: string }[]>([])

	useEffect(() => {
		supabase.from('mentors').select('id, full_name, specialty_en, image_url').order('full_name')
			.then(({ data }) => setMentors(data || []))
	}, [])

	const selectedMentor = mentors.find(m => m.id === form.mentor_id)

	return (
		<div className="space-y-4">
			{/* Image — shared box */}
			<ImageUploadBox
				currentUrl={form.image_url}
				onUploaded={url => onChange({ ...form, image_url: url })}
			/>

			<div className="grid grid-cols-2 gap-3">
				<div><label className={labelCls}>Kurs nomi (EN) *</label><input className={inputCls} placeholder="Web Development" value={form.title_en} onChange={e => onChange({ ...form, title_en: e.target.value })} /></div>
				<div><label className={labelCls}>Kurs nomi (UZ)</label><input className={inputCls} placeholder="Veb Dasturlash" value={form.title_uz} onChange={e => onChange({ ...form, title_uz: e.target.value })} /></div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div><label className={labelCls}>Davomiyligi</label><input className={inputCls} placeholder="6 oy" value={form.duration} onChange={e => onChange({ ...form, duration: e.target.value })} /></div>
				<div>
					<label className={labelCls}>Daraja</label>
					<select className={inputCls} value={form.level} onChange={e => onChange({ ...form, level: e.target.value })}>
						<option value="">Tanlang</option>
						{['Beginner', 'Intermediate', 'Advanced', 'A1–C1'].map(l => <option key={l}>{l}</option>)}
					</select>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div><label className={labelCls}>Darslar soni</label><input className={inputCls} type="number" placeholder="48" value={form.lessons_count || ''} onChange={e => onChange({ ...form, lessons_count: +e.target.value })} /></div>
				<div><label className={labelCls}>Narx ($)</label><input className={inputCls} type="number" placeholder="499" value={form.price || ''} onChange={e => onChange({ ...form, price: +e.target.value })} /></div>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className={labelCls}>Badge</label>
					<select className={inputCls} value={form.badge} onChange={e => onChange({ ...form, badge: e.target.value })}>
						<option value="">Badge yo'q</option>
						{['HOT', 'NEW', 'POPULAR', 'TRENDING'].map(b => <option key={b}>{b}</option>)}
					</select>
				</div>
				<div><label className={labelCls}>Reyting (0–5)</label><input className={inputCls} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => onChange({ ...form, rating: +e.target.value })} /></div>
			</div>

			{/* Teacher select */}
			<div>
				<label className={labelCls}>
					O'qituvchi biriktirish
					{mentors.length === 0 && <span className="ml-2 text-slate-400 normal-case tracking-normal font-normal">Yuklanmoqda...</span>}
				</label>
				<select className={inputCls} value={form.mentor_id ?? ''} onChange={e => onChange({ ...form, mentor_id: e.target.value ? +e.target.value : null })}>
					<option value="">O'qituvchi tanlang</option>
					{mentors.map(m => <option key={m.id} value={m.id}>{m.full_name} — {m.specialty_en}</option>)}
				</select>

				{/* Preview card */}
				{selectedMentor && (
					<div className="mt-2 flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-3 py-2.5">
						{selectedMentor.image_url
							? <img src={selectedMentor.image_url} className="w-8 h-8 rounded-xl object-cover shrink-0" />
							: <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
								<span className="text-white text-[10px] font-black">
									{selectedMentor.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
								</span>
							</div>}
						<div className="flex-1 min-w-0">
							<p className="text-xs font-bold text-blue-700 dark:text-blue-300 truncate">{selectedMentor.full_name}</p>
							<p className="text-[10px] text-blue-500 dark:text-blue-400 truncate">{selectedMentor.specialty_en} · Biriktirildi ✓</p>
						</div>
						<button type="button" onClick={() => onChange({ ...form, mentor_id: null })}
							className="text-blue-400 hover:text-red-500 transition-colors shrink-0">
							<X className="w-3.5 h-3.5" />
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

// ─── Edit Course Form (with mentor fetch) ─────────────────────────────────
function EditMentorModal({ editItem, setEditItem, saving, onSave }: {
	editItem: Course
	setEditItem: (c: Course | null) => void
	saving: boolean
	onSave: () => void
}) {
	const [mentors, setMentors] = useState<{ id: number; full_name: string; specialty_en: string; image_url: string }[]>([])

	useEffect(() => {
		supabase.from('mentors').select('id, full_name, specialty_en, image_url').order('full_name')
			.then(({ data }) => setMentors(data || []))
	}, [])

	const selectedMentor = mentors.find(m => m.id === editItem.mentor_id)
	const set = (patch: Partial<Course>) => setEditItem({ ...editItem, ...patch })

	return (
		<div className="space-y-4">
			{/* Image upload in edit mode */}
			<ImageUploadBox
				currentUrl={editItem.image_url}
				onUploaded={url => set({ image_url: url })}
			/>
			<div className="grid grid-cols-2 gap-3">
				<div><label className={labelCls}>Kurs nomi (EN)</label><input className={inputCls} value={editItem.title_en} onChange={e => set({ title_en: e.target.value })} /></div>
				<div><label className={labelCls}>Kurs nomi (UZ)</label><input className={inputCls} value={editItem.title_uz} onChange={e => set({ title_uz: e.target.value })} /></div>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div><label className={labelCls}>Davomiyligi</label><input className={inputCls} value={editItem.duration} onChange={e => set({ duration: e.target.value })} /></div>
				<div>
					<label className={labelCls}>Daraja</label>
					<select className={inputCls} value={editItem.level} onChange={e => set({ level: e.target.value })}>
						{['Beginner', 'Intermediate', 'Advanced', 'A1–C1'].map(l => <option key={l}>{l}</option>)}
					</select>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div><label className={labelCls}>Darslar</label><input className={inputCls} type="number" value={editItem.lessons_count} onChange={e => set({ lessons_count: +e.target.value })} /></div>
				<div><label className={labelCls}>Narx ($)</label><input className={inputCls} type="number" value={editItem.price} onChange={e => set({ price: +e.target.value })} /></div>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className={labelCls}>Badge</label>
					<select className={inputCls} value={editItem.badge} onChange={e => set({ badge: e.target.value })}>
						<option value="">Badge yo'q</option>
						{['HOT', 'NEW', 'POPULAR', 'TRENDING'].map(b => <option key={b}>{b}</option>)}
					</select>
				</div>
				<div><label className={labelCls}>Reyting</label><input className={inputCls} type="number" step="0.1" min="0" max="5" value={editItem.rating} onChange={e => set({ rating: +e.target.value })} /></div>
			</div>

			{/* Teacher select */}
			<div>
				<label className={labelCls}>
					O'qituvchi
					{mentors.length === 0 && <span className="ml-2 text-slate-400 normal-case tracking-normal font-normal">Yuklanmoqda...</span>}
				</label>
				<select className={inputCls} value={editItem.mentor_id ?? ''}
					onChange={e => set({ mentor_id: e.target.value ? +e.target.value : null })}>
					<option value="">O'qituvchi tanlang</option>
					{mentors.map(m => <option key={m.id} value={m.id}>{m.full_name} — {m.specialty_en}</option>)}
				</select>

				{selectedMentor && (
					<div className="mt-2 flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl px-3 py-2.5">
						{selectedMentor.image_url
							? <img src={selectedMentor.image_url} className="w-8 h-8 rounded-xl object-cover shrink-0" />
							: <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
								<span className="text-white text-[10px] font-black">
									{selectedMentor.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
								</span>
							</div>}
						<div className="flex-1 min-w-0">
							<p className="text-xs font-bold text-blue-700 dark:text-blue-300 truncate">{selectedMentor.full_name}</p>
							<p className="text-[10px] text-blue-500 dark:text-blue-400 truncate">{selectedMentor.specialty_en} · Biriktirildi ✓</p>
						</div>
						<button type="button" onClick={() => set({ mentor_id: null })}
							className="text-blue-400 hover:text-red-500 transition-colors shrink-0">
							<X className="w-3.5 h-3.5" />
						</button>
					</div>
				)}
			</div>

			<div className="flex gap-3 pt-2">
				<button onClick={() => setEditItem(null)} className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors">Bekor qilish</button>
				<button onClick={onSave} disabled={saving}
					className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white text-sm font-black transition-colors flex items-center justify-center gap-2">
					{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saqlanmoqda...</> : 'Saqlash'}
				</button>
			</div>
		</div>
	)
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function CoursesPage() {
	const [courses, setCourses] = useState<Course[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [search, setSearch] = useState('')
	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Course | null>(null)
	const [viewItem, setViewItem] = useState<Course | null>(null)
	const [deleteItem, setDeleteItem] = useState<Course | null>(null)
	const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm })
	const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

	const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	// ── Fetch ──
	const fetchCourses = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('courses')
			.select('*')
			.order('created_at', { ascending: false })
		if (error) { showToast("Yuklashda xato: " + error.message, 'error'); setLoading(false); return }
		setCourses(data || [])
		setLoading(false)
	}
	useEffect(() => { fetchCourses() }, [])

	// ── INSERT ──
	const handleAdd = async () => {
		if (!form.title_en) return
		setSaving(true)
		const { error } = await supabase.from('courses').insert([{
			title_en: form.title_en,
			title_uz: form.title_uz,
			duration: form.duration,
			level: form.level,
			lessons_count: form.lessons_count,
			total_students: 0,
			price: form.price,
			image_url: form.image_url,
			badge: form.badge,
			rating: form.rating,
			category_id: form.category_id,
			mentor_id: form.mentor_id,
		}])
		setSaving(false)
		if (error) { showToast("Qo'shishda xato: " + error.message, 'error'); return }
		showToast("Kurs muvaffaqiyatli qo'shildi!")
		setShowAdd(false)
		setForm({ ...emptyForm })
		fetchCourses()
	}

	// ── UPDATE ──
	const handleEdit = async () => {
		if (!editItem) return
		setSaving(true)
		const { error } = await supabase.from('courses').update({
			title_en: editItem.title_en,
			title_uz: editItem.title_uz,
			duration: editItem.duration,
			level: editItem.level,
			lessons_count: editItem.lessons_count,
			total_students: editItem.total_students,
			price: editItem.price,
			image_url: editItem.image_url,
			badge: editItem.badge,
			rating: editItem.rating,
			mentor_id: editItem.mentor_id,
		}).eq('id', editItem.id)
		setSaving(false)
		if (error) { showToast('Tahrirlashda xato: ' + error.message, 'error'); return }
		showToast('Kurs yangilandi!')
		setEditItem(null)
		fetchCourses()
	}

	// ── DELETE ──
	const handleDelete = async () => {
		if (!deleteItem) return
		setSaving(true)
		const { error } = await supabase.from('courses').delete().eq('id', deleteItem.id)
		setSaving(false)
		if (error) { showToast("O'chirishda xato: " + error.message, 'error'); return }
		showToast("Kurs o'chirildi!")
		setDeleteItem(null)
		fetchCourses()
	}

	const filtered = courses.filter(c =>
		c.title_en?.toLowerCase().includes(search.toLowerCase()) ||
		c.title_uz?.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className="space-y-5 pb-6">
			{toast && <Toast msg={toast.msg} type={toast.type} />}

			{/* ── ADD MODAL ── */}
			{showAdd && (
				<Modal title="Yangi Kurs Qo'shish" onClose={() => { setShowAdd(false); setForm({ ...emptyForm }) }}>
					<CourseFormFields form={form} onChange={setForm} />
					<div className="flex gap-3 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
						<button onClick={() => { setShowAdd(false); setForm({ ...emptyForm }) }} className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors">Bekor qilish</button>
						<button onClick={handleAdd} disabled={saving || !form.title_en}
							className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-black transition-colors flex items-center justify-center gap-2">
							{saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saqlanmoqda...</> : "Qo'shish"}
						</button>
					</div>
				</Modal>
			)}

			{/* ── EDIT MODAL ── */}
			{editItem && (
				<Modal title="Kursni Tahrirlash" onClose={() => setEditItem(null)}>
					<EditMentorModal editItem={editItem} setEditItem={setEditItem} saving={saving} onSave={handleEdit} />
				</Modal>
			)}

			{/* ── VIEW MODAL ── */}
			{viewItem && (
				<Modal title="Kurs Ma'lumotlari" onClose={() => setViewItem(null)}>
					{viewItem.image_url && <img src={viewItem.image_url} className="w-full h-36 object-cover rounded-xl mb-4" />}
					<div className="flex items-center gap-2 mb-4">
						<span className="font-black text-slate-900 dark:text-white text-base">{viewItem.title_en}</span>
						{viewItem.badge && <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded-md ${badgeColors[viewItem.badge] || 'bg-slate-500'}`}>{viewItem.badge}</span>}
					</div>
					<div className="space-y-2">
						{[
							["O'zbekcha nomi", viewItem.title_uz],
							['Davomiyligi', viewItem.duration],
							['Daraja', viewItem.level],
							['Darslar soni', String(viewItem.lessons_count)],
							['Jami talabalar', String(viewItem.total_students)],
							['Narx', `$${viewItem.price}`],
							['Reyting', String(viewItem.rating)],
						].map(([k, v]) => (
							<div key={k} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
								<span className="text-xs text-slate-400">{k}</span>
								<span className="text-xs font-bold text-slate-900 dark:text-white">{v}</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{/* ── DELETE MODAL ── */}
			{deleteItem && (
				<Modal title="Kursni O'chirish" onClose={() => setDeleteItem(null)}>
					<p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
						<span className="font-bold text-slate-900 dark:text-white">"{deleteItem.title_en}"</span> kursini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
					</p>
					<div className="flex gap-3">
						<button onClick={() => setDeleteItem(null)} className="flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors">Bekor qilish</button>
						<button onClick={handleDelete} disabled={saving}
							className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white text-sm font-black transition-colors flex items-center justify-center gap-2">
							{saving ? <><Loader2 className="w-4 h-4 animate-spin" />O'chirilmoqda...</> : "O'chirish"}
						</button>
					</div>
				</Modal>
			)}

			{/* ── HEADER ── */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-black text-slate-900 dark:text-white">Kurslar</h1>
					<p className="text-slate-400 text-xs mt-0.5">Barcha kurslarni boshqaring</p>
				</div>
				<button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25">
					<Plus className="w-3.5 h-3.5" /> Yangi Kurs
				</button>
			</div>

			{/* ── STATS ── */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				{[
					{ label: 'Jami Kurslar', value: courses.length, icon: BookOpen, bg: 'bg-blue-50 dark:bg-blue-500/10', color: 'text-blue-600 dark:text-blue-400' },
					{ label: 'Jami Talabalar', value: courses.reduce((a, c) => a + (c.total_students || 0), 0), icon: Users, bg: 'bg-violet-50 dark:bg-violet-500/10', color: 'text-violet-600 dark:text-violet-400' },
					{ label: "O'rtacha Reyting", value: courses.length ? (courses.reduce((a, c) => a + (c.rating || 0), 0) / courses.length).toFixed(1) : '—', icon: Star, bg: 'bg-amber-50 dark:bg-amber-500/10', color: 'text-amber-600 dark:text-amber-400' },
					{ label: 'Jami Daromad', value: `$${courses.reduce((a, c) => a + (c.price * c.total_students || 0), 0).toLocaleString()}`, icon: TrendingUp, bg: 'bg-emerald-50 dark:bg-emerald-500/10', color: 'text-emerald-600 dark:text-emerald-400' },
				].map(s => { const Icon = s.icon; return (
					<div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
						<div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mb-2`}><Icon className={s.color} style={{ width: 16, height: 16 }} /></div>
						<div className="text-xl font-black text-slate-900 dark:text-white">{s.value}</div>
						<div className="text-[11px] text-slate-500 dark:text-slate-400">{s.label}</div>
					</div>
				)})}
			</div>

			{/* ── SEARCH ── */}
			<div className="relative max-w-xs">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
				<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kurs qidirish..."
					className="w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors" />
			</div>

			{/* ── TABLE ── */}
			<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
				{loading ? (
					<div className="flex items-center justify-center py-16 gap-3">
						<Loader2 className="w-5 h-5 animate-spin text-blue-600" />
						<span className="text-sm text-slate-400">Yuklanmoqda...</span>
					</div>
				) : (
					<div className="overflow-x-auto rounded-2xl">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-slate-100 dark:border-slate-800">
									{['#', 'Rasm', 'Kurs nomi', 'Daraja', 'Darslar', 'Talabalar', 'Davomiyligi', 'Narx', 'Reyting', 'Badge', 'Holat', ''].map(h => (
										<th key={h} className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-3 whitespace-nowrap">{h}</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
								{filtered.length === 0 ? (
									<tr><td colSpan={12} className="text-center py-12 text-slate-400 text-sm">Kurs topilmadi</td></tr>
								) : filtered.map((c, idx) => (
									<tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
										<td className="px-4 py-3"><span className="text-xs text-slate-400 font-mono">{idx + 1}</span></td>
										<td className="px-4 py-3">
											{c.image_url
												? <img src={c.image_url} className="w-10 h-8 rounded-lg object-cover" />
												: <div className="w-10 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center"><BookOpen className="text-blue-600 dark:text-blue-400" style={{ width: 14, height: 14 }} /></div>}
										</td>
										<td className="px-4 py-3">
											<p className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{c.title_en}</p>
											<p className="text-[10px] italic text-blue-600 dark:text-blue-400">{c.title_uz}</p>
										</td>
										<td className="px-4 py-3">
											{c.level && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${levelColors[c.level] || 'bg-slate-100 text-slate-500'}`}>{c.level}</span>}
										</td>
										<td className="px-4 py-3"><div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300"><BookOpen className="w-3 h-3 text-slate-400" />{c.lessons_count}</div></td>
										<td className="px-4 py-3"><div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300"><Users className="w-3 h-3 text-slate-400" />{c.total_students}</div></td>
										<td className="px-4 py-3"><span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{c.duration}</span></td>
										<td className="px-4 py-3"><span className="text-xs font-black text-emerald-600 dark:text-emerald-400">${c.price}</span></td>
										<td className="px-4 py-3"><div className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="text-xs font-bold text-slate-700 dark:text-slate-300">{c.rating}</span></div></td>
										<td className="px-4 py-3">
											{c.badge ? <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded-md ${badgeColors[c.badge] || 'bg-slate-500'}`}>{c.badge}</span> : <span className="text-slate-300 dark:text-slate-700 text-xs">—</span>}
										</td>
										<td className="px-4 py-3"><span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 px-2 py-0.5 rounded-lg w-fit"><CheckCircle2 className="w-2.5 h-2.5" />Faol</span></td>
										<td className="px-4 py-3">
											<ActionMenu
												onView={() => setViewItem(c)}
												onEdit={() => setEditItem(c)}
												onDelete={() => setDeleteItem(c)}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
				<div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
					<p className="text-[11px] text-slate-400">{filtered.length} ta kurs</p>
					{!loading && <button onClick={fetchCourses} className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold">Yangilash</button>}
				</div>
			</div>
		</div>
	)
}