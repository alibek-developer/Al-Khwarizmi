'use client'

import { createClient } from '@supabase/supabase-js'
import {
	AlertCircle,
	CheckCircle2,
	Edit2,
	Eye,
	GraduationCap,
	Loader2,
	MoreHorizontal,
	Plus,
	Search,
	Star,
	Trash2,
	Upload,
	Users,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Supabase client ───────────────────────────────────────────────────────
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// ─── Types ─────────────────────────────────────────────────────────────────
type Mentor = {
	id: number
	full_name: string
	specialty_en: string
	specialty_uz: string
	experience: string
	former_company: string
	about_en: string
	about_uz: string
	skills: string[]
	total_students: number
	rating: number
	image_url: string
	phone: string
	email: string
	created_at?: string
}

// ─── Constants ─────────────────────────────────────────────────────────────
const allSkills = [
	'React',
	'Node.js',
	'TypeScript',
	'PostgreSQL',
	'Docker',
	'Python',
	'Pandas',
	'NumPy',
	'Scikit-learn',
	'SQL',
	'PyTorch',
	'TensorFlow',
	'OpenCV',
	'FastAPI',
	'LangChain',
	'IELTS',
	'CEFR B2–C2',
	'Business English',
	'Academic Writing',
	'Speaking',
	'Swift',
	'Kotlin',
	'Flutter',
	'React Native',
	'Firebase',
	'Figma',
	'Prototyping',
	'User Research',
	'AWS',
	'GCP',
	'Git',
]

const gradients = [
	'from-blue-500 to-blue-700',
	'from-violet-500 to-violet-700',
	'from-emerald-500 to-emerald-700',
	'from-amber-500 to-amber-700',
	'from-pink-500 to-rose-600',
	'from-cyan-500 to-blue-600',
]

const emptyForm = {
	full_name: '',
	specialty_en: '',
	specialty_uz: '',
	experience: '',
	former_company: '',
	about_en: '',
	about_uz: '',
	skills: [] as string[],
	total_students: 0,
	rating: 5.0,
	phone: '',
	email: '',
	image_url: '',
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'
const textareaCls =
	'w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none'

function getInitials(name: string) {
	return name
		.split(' ')
		.map(w => w[0])
		.join('')
		.slice(0, 2)
		.toUpperCase()
}

// ─── Dropdown Menu (portal) ────────────────────────────────────────────────
function ActionMenu({
	mentor,
	onView,
	onEdit,
	onDelete,
}: {
	mentor: Mentor
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
		<div className='relative' onClick={e => e.stopPropagation()}>
			<button
				onClick={handleOpen}
				className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
			>
				<MoreHorizontal className='w-4 h-4' />
			</button>
			{open && typeof window !== 'undefined' && (
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
						<Eye className='w-3.5 h-3.5' />
						Ko'rish
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
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
	return (
		<div
			className={`fixed bottom-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white transition-all
			${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}
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

// ─── Skills picker ─────────────────────────────────────────────────────────
function SkillsPicker({
	selected,
	onChange,
}: {
	selected: string[]
	onChange: (s: string[]) => void
}) {
	const toggle = (skill: string) =>
		onChange(
			selected.includes(skill)
				? selected.filter(s => s !== skill)
				: [...selected, skill],
		)
	return (
		<div>
			<label className={labelCls}>
				Ko'nikmalar / Skills
				{selected.length > 0 && (
					<span className='ml-2 text-blue-600 dark:text-blue-400 normal-case tracking-normal font-bold'>
						{selected.length} ta tanlandi
					</span>
				)}
			</label>
			<div className='flex flex-wrap gap-1.5 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl max-h-36 overflow-y-auto'>
				{allSkills.map(skill => {
					const on = selected.includes(skill)
					return (
						<button
							key={skill}
							type='button'
							onClick={() => toggle(skill)}
							className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all
								${on ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-300 hover:text-blue-600'}`}
						>
							{on && <span className='text-[10px]'>✓</span>}
							{skill}
						</button>
					)
				})}
			</div>
			{selected.length > 0 && (
				<div className='flex flex-wrap gap-1.5 mt-2'>
					{selected.map(s => (
						<span
							key={s}
							className='flex items-center gap-1 text-[11px] font-semibold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-2.5 py-1 rounded-lg'
						>
							{s}
							<button
								type='button'
								onClick={() => toggle(s)}
								className='hover:text-red-500 transition-colors ml-0.5'
							>
								×
							</button>
						</span>
					))}
				</div>
			)}
		</div>
	)
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function MentorsPage() {
	const [mentors, setMentors] = useState<Mentor[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [search, setSearch] = useState('')
	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Mentor | null>(null)
	const [viewItem, setViewItem] = useState<Mentor | null>(null)
	const [deleteItem, setDeleteItem] = useState<Mentor | null>(null)
	const [imgPreview, setImgPreview] = useState('')
	const [form, setForm] = useState(emptyForm)
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)

	// ── Toast helper ──
	const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	// ── Fetch all mentors ──
	const fetchMentors = async () => {
		setLoading(true)
		const { data, error } = await supabase
			.from('mentors')
			.select('*')
			.order('created_at', { ascending: false })
		if (error) {
			showToast("Ma'lumotlarni yuklashda xato", 'error')
			setLoading(false)
			return
		}
		setMentors(data || [])
		setLoading(false)
	}

	useEffect(() => {
		fetchMentors()
	}, [])

	// ── Upload image to Supabase Storage ──
	const uploadImage = async (file: File): Promise<string> => {
		const ext = file.name.split('.').pop()
		const path = `mentors/${Date.now()}.${ext}`
		const { error } = await supabase.storage
			.from('images')
			.upload(path, file, { upsert: true })
		if (error) return ''
		const { data } = supabase.storage.from('images').getPublicUrl(path)
		return data.publicUrl
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		// Preview
		const reader = new FileReader()
		reader.onload = ev => setImgPreview(ev.target?.result as string)
		reader.readAsDataURL(file)
		// Upload to storage
		const url = await uploadImage(file)
		if (url) setForm(p => ({ ...p, image_url: url }))
	}

	// ── INSERT ──
	const handleAdd = async () => {
		if (!form.full_name) return
		setSaving(true)
		const { error } = await supabase.from('mentors').insert([
			{
				full_name: form.full_name,
				specialty_en: form.specialty_en,
				specialty_uz: form.specialty_uz,
				experience: form.experience,
				former_company: form.former_company,
				about_en: form.about_en,
				about_uz: form.about_uz,
				skills: form.skills,
				total_students: 0,
				rating: 5.0,
				phone: form.phone,
				email: form.email,
				image_url: form.image_url,
			},
		])
		setSaving(false)
		if (error) {
			showToast("Qo'shishda xato: " + error.message, 'error')
			return
		}
		showToast("Mentor muvaffaqiyatli qo'shildi!")
		setShowAdd(false)
		setForm(emptyForm)
		setImgPreview('')
		fetchMentors()
	}

	// ── UPDATE ──
	const handleEdit = async () => {
		if (!editItem) return
		setSaving(true)
		const { error } = await supabase
			.from('mentors')
			.update({
				full_name: editItem.full_name,
				specialty_en: editItem.specialty_en,
				specialty_uz: editItem.specialty_uz,
				experience: editItem.experience,
				former_company: editItem.former_company,
				about_en: editItem.about_en,
				about_uz: editItem.about_uz,
				phone: editItem.phone,
				email: editItem.email,
				rating: editItem.rating,
			})
			.eq('id', editItem.id)
		setSaving(false)
		if (error) {
			showToast('Tahrirlashda xato: ' + error.message, 'error')
			return
		}
		showToast('Mentor yangilandi!')
		setEditItem(null)
		fetchMentors()
	}

	// ── DELETE ──
	const handleDelete = async () => {
		if (!deleteItem) return
		setSaving(true)
		const { error } = await supabase
			.from('mentors')
			.delete()
			.eq('id', deleteItem.id)
		setSaving(false)
		if (error) {
			showToast("O'chirishda xato: " + error.message, 'error')
			return
		}
		showToast("Mentor o'chirildi!")
		setDeleteItem(null)
		fetchMentors()
	}

	const filtered = mentors.filter(
		m =>
			m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
			m.specialty_en?.toLowerCase().includes(search.toLowerCase()),
	)

	// ─── RENDER ────────────────────────────────────────────────────────────
	return (
		<div className='space-y-5 pb-6'>
			{toast && <Toast msg={toast.msg} type={toast.type} />}

			{/* ── ADD MODAL ── */}
			{showAdd && (
				<Modal
					title="Yangi Mentor Qo'shish"
					onClose={() => {
						setShowAdd(false)
						setForm(emptyForm)
						setImgPreview('')
					}}
				>
					<div className='space-y-4'>
						{/* Image */}
						<div>
							<label className={labelCls}>Mentor Rasmi</label>
							<label className='flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-400 transition-colors overflow-hidden bg-slate-50 dark:bg-slate-800'>
								{imgPreview ? (
									<img
										src={imgPreview}
										className='w-full h-full object-cover'
									/>
								) : (
									<>
										<Upload className='w-5 h-5 text-slate-400 mb-1' />
										<span className='text-xs text-slate-400'>Rasm yuklash</span>
									</>
								)}
								<input
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handleFileChange}
								/>
							</label>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>To'liq ism *</label>
								<input
									className={inputCls}
									placeholder='Ism Familiya'
									value={form.full_name}
									onChange={e =>
										setForm(p => ({ ...p, full_name: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Mutaxassislik (EN)</label>
								<input
									className={inputCls}
									placeholder='Web Developer'
									value={form.specialty_en}
									onChange={e =>
										setForm(p => ({ ...p, specialty_en: e.target.value }))
									}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Mutaxassislik (UZ)</label>
								<input
									className={inputCls}
									placeholder='Veb Dasturchi'
									value={form.specialty_uz}
									onChange={e =>
										setForm(p => ({ ...p, specialty_uz: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Tajriba</label>
								<input
									className={inputCls}
									placeholder='8+ years'
									value={form.experience}
									onChange={e =>
										setForm(p => ({ ...p, experience: e.target.value }))
									}
								/>
							</div>
						</div>
						<div>
							<label className={labelCls}>Avvalgi ish joyi</label>
							<input
								className={inputCls}
								placeholder='Former Meta'
								value={form.former_company}
								onChange={e =>
									setForm(p => ({ ...p, former_company: e.target.value }))
								}
							/>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Email</label>
								<input
									className={inputCls}
									type='email'
									placeholder='email@gmail.com'
									value={form.email}
									onChange={e =>
										setForm(p => ({ ...p, email: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Telefon</label>
								<input
									className={inputCls}
									placeholder='+998 90 000 00 00'
									value={form.phone}
									onChange={e =>
										setForm(p => ({ ...p, phone: e.target.value }))
									}
								/>
							</div>
						</div>
						<div>
							<label className={labelCls}>About (EN)</label>
							<textarea
								rows={3}
								className={textareaCls}
								placeholder='Mentor haqida...'
								value={form.about_en}
								onChange={e =>
									setForm(p => ({ ...p, about_en: e.target.value }))
								}
							/>
						</div>
						<div>
							<label className={labelCls}>About (UZ)</label>
							<textarea
								rows={2}
								className={textareaCls}
								placeholder="O'zbekcha tavsif..."
								value={form.about_uz}
								onChange={e =>
									setForm(p => ({ ...p, about_uz: e.target.value }))
								}
							/>
						</div>
						<SkillsPicker
							selected={form.skills}
							onChange={skills => setForm(p => ({ ...p, skills }))}
						/>
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => {
									setShowAdd(false)
									setForm(emptyForm)
									setImgPreview('')
								}}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor
							</button>
							<button
								onClick={handleAdd}
								disabled={saving || !form.full_name}
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

			{/* ── EDIT MODAL ── */}
			{editItem && (
				<Modal title='Mentorni Tahrirlash' onClose={() => setEditItem(null)}>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>To'liq ism</label>
								<input
									className={inputCls}
									value={editItem.full_name}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, full_name: e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Mutaxassislik (EN)</label>
								<input
									className={inputCls}
									value={editItem.specialty_en}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, specialty_en: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Mutaxassislik (UZ)</label>
								<input
									className={inputCls}
									value={editItem.specialty_uz}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, specialty_uz: e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Tajriba</label>
								<input
									className={inputCls}
									value={editItem.experience}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, experience: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div>
							<label className={labelCls}>Avvalgi ish joyi</label>
							<input
								className={inputCls}
								value={editItem.former_company}
								onChange={e =>
									setEditItem(p =>
										p ? { ...p, former_company: e.target.value } : null,
									)
								}
							/>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Email</label>
								<input
									className={inputCls}
									value={editItem.email}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, email: e.target.value } : null,
										)
									}
								/>
							</div>
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
						</div>
						<div>
							<label className={labelCls}>About (EN)</label>
							<textarea
								rows={3}
								className={textareaCls}
								value={editItem.about_en}
								onChange={e =>
									setEditItem(p =>
										p ? { ...p, about_en: e.target.value } : null,
									)
								}
							/>
						</div>
						<div>
							<label className={labelCls}>About (UZ)</label>
							<textarea
								rows={2}
								className={textareaCls}
								value={editItem.about_uz}
								onChange={e =>
									setEditItem(p =>
										p ? { ...p, about_uz: e.target.value } : null,
									)
								}
							/>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Talabalar</label>
								<input
									className={inputCls}
									type='number'
									value={editItem.total_students}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, total_students: +e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Reyting</label>
								<input
									className={inputCls}
									type='number'
									step='0.1'
									min='0'
									max='5'
									value={editItem.rating}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, rating: +e.target.value } : null,
										)
									}
								/>
							</div>
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
								className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
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
				<Modal title="Mentor Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='flex items-center gap-4 mb-5'>
						{viewItem.image_url ? (
							<img
								src={viewItem.image_url}
								className='w-16 h-16 rounded-2xl object-cover shrink-0'
							/>
						) : (
							<div
								className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[viewItem.id % gradients.length]} flex items-center justify-center shrink-0`}
							>
								<span className='text-white text-xl font-black'>
									{getInitials(viewItem.full_name)}
								</span>
							</div>
						)}
						<div>
							<p className='font-black text-slate-900 dark:text-white text-base'>
								{viewItem.full_name}
							</p>
							<p className='text-sm text-blue-600 dark:text-blue-400 font-semibold'>
								{viewItem.specialty_en}
							</p>
							<p className='text-xs text-slate-400 italic'>
								{viewItem.specialty_uz}
							</p>
						</div>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-3 gap-2 mb-4'>
						{[
							{
								icon: Users,
								label: 'Talabalar',
								value: viewItem.total_students,
								color: 'text-blue-600',
							},
							{
								icon: Star,
								label: 'Tajriba',
								value: viewItem.experience,
								color: 'text-amber-500',
							},
							{
								icon: Star,
								label: 'Reyting',
								value: viewItem.rating,
								color: 'text-amber-500',
							},
						].map(s => {
							const Icon = s.icon
							return (
								<div
									key={s.label}
									className='bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center'
								>
									<Icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
									<p className='text-sm font-black text-slate-900 dark:text-white'>
										{s.value}
									</p>
									<p className='text-[10px] text-slate-400'>{s.label}</p>
								</div>
							)
						})}
					</div>

					<div className='space-y-2 mb-4'>
						{[
							['Avvalgi ish joyi', viewItem.former_company],
							['Email', viewItem.email],
							['Telefon', viewItem.phone],
						]
							.filter(([, v]) => v)
							.map(([k, v]) => (
								<div
									key={k}
									className='flex justify-between py-2 border-b border-slate-100 dark:border-slate-800'
								>
									<span className='text-xs text-slate-400'>{k}</span>
									<span className='text-xs font-bold text-slate-900 dark:text-white'>
										{v}
									</span>
								</div>
							))}
					</div>

					{viewItem.about_en && (
						<div className='mb-4'>
							<p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2'>
								<span className='w-3 h-0.5 bg-blue-600 rounded-full' />
								About
							</p>
							<p className='text-xs text-slate-600 dark:text-slate-300 leading-relaxed'>
								{viewItem.about_en}
							</p>
							{viewItem.about_uz && (
								<p className='text-[11px] text-slate-400 italic mt-1 leading-relaxed'>
									{viewItem.about_uz}
								</p>
							)}
						</div>
					)}

					{viewItem.skills?.length > 0 && (
						<div>
							<p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2'>
								<span className='w-3 h-0.5 bg-blue-600 rounded-full' />
								Ko'nikmalar
							</p>
							<div className='flex flex-wrap gap-1.5'>
								{viewItem.skills.map(s => (
									<span
										key={s}
										className='text-[11px] font-semibold bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 px-2.5 py-1 rounded-lg'
									>
										{s}
									</span>
								))}
							</div>
						</div>
					)}
				</Modal>
			)}

			{/* ── DELETE MODAL ── */}
			{deleteItem && (
				<Modal title="Mentorni O'chirish" onClose={() => setDeleteItem(null)}>
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
						Mentorlar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						Barcha o'qituvchilarni boshqaring
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'
				>
					<Plus className='w-3.5 h-3.5' /> Yangi Mentor
				</button>
			</div>

			{/* ── STATS ── */}
			<div className='grid grid-cols-3 gap-3'>
				{[
					{
						label: 'Jami Mentorlar',
						value: mentors.length,
						icon: GraduationCap,
						bg: 'bg-blue-50 dark:bg-blue-500/10',
						color: 'text-blue-600 dark:text-blue-400',
					},
					{
						label: 'Jami Talabalar',
						value: mentors.reduce((a, m) => a + (m.total_students || 0), 0),
						icon: Users,
						bg: 'bg-violet-50 dark:bg-violet-500/10',
						color: 'text-violet-600 dark:text-violet-400',
					},
					{
						label: "O'rtacha Reyting",
						value: mentors.length
							? (
									mentors.reduce((a, m) => a + (m.rating || 0), 0) /
									mentors.length
								).toFixed(1)
							: '—',
						icon: Star,
						bg: 'bg-amber-50 dark:bg-amber-500/10',
						color: 'text-amber-600 dark:text-amber-400',
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

			{/* ── SEARCH ── */}
			<div className='relative max-w-xs'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
				<input
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder='Mentor qidirish...'
					className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
				/>
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
										'Mentor',
										'Mutaxassislik',
										'Tajriba',
										'Ish joyi',
										'Talabalar',
										'Reyting',
										'Email',
										'Telefon',
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
											colSpan={11}
											className='text-center py-12 text-slate-400 text-sm'
										>
											Mentor topilmadi
										</td>
									</tr>
								) : (
									filtered.map((m, idx) => (
										<tr
											key={m.id}
											className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
										>
											<td className='px-4 py-3'>
												<span className='text-xs text-slate-400 font-mono'>
													{idx + 1}
												</span>
											</td>
											<td className='px-4 py-3'>
												<div className='flex items-center gap-2.5'>
													{m.image_url ? (
														<img
															src={m.image_url}
															className='w-8 h-8 rounded-xl object-cover shrink-0'
														/>
													) : (
														<div
															className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradients[m.id % gradients.length]} flex items-center justify-center shrink-0`}
														>
															<span className='text-white text-[10px] font-black'>
																{getInitials(m.full_name)}
															</span>
														</div>
													)}
													<p className='text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap'>
														{m.full_name}
													</p>
												</div>
											</td>
											<td className='px-4 py-3'>
												<span className='text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap'>
													{m.specialty_en}
												</span>
											</td>
											<td className='px-4 py-3'>
												<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
													{m.experience}
												</span>
											</td>
											<td className='px-4 py-3'>
												<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
													{m.former_company}
												</span>
											</td>
											<td className='px-4 py-3'>
												<div className='flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300'>
													<Users className='w-3 h-3 text-slate-400' />
													{m.total_students}
												</div>
											</td>
											<td className='px-4 py-3'>
												<div className='flex items-center gap-1'>
													<Star className='w-3 h-3 fill-amber-400 text-amber-400' />
													<span className='text-xs font-bold text-slate-700 dark:text-slate-300'>
														{m.rating}
													</span>
												</div>
											</td>
											<td className='px-4 py-3'>
												<span className='text-[11px] text-slate-500 dark:text-slate-400'>
													{m.email}
												</span>
											</td>
											<td className='px-4 py-3'>
												<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
													{m.phone}
												</span>
											</td>
											<td className='px-4 py-3'>
												<span className='text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'>
													Faol
												</span>
											</td>
											<td className='px-4 py-3'>
												<ActionMenu
													mentor={m}
													onView={() => setViewItem(m)}
													onEdit={() => setEditItem(m)}
													onDelete={() => setDeleteItem(m)}
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
						{filtered.length} ta mentor
					</p>
					{!loading && (
						<button
							onClick={fetchMentors}
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
