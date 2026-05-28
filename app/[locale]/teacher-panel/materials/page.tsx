'use client'

import {
	AlertCircle,
	BookOpen,
	CheckCircle2,
	Download,
	ExternalLink,
	FileText,
	Link,
	Loader2,
	Plus,
	Trash2,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'
import { getMentorId } from '@/lib/teacher-utils'

type Group = { id: number; name: string }
type Material = {
	id: number
	group_id: number
	title: string
	file_url: string
	link_url: string
	category: string
	created_at: string
	group_name?: string
}

const CATS = ['Darslik', 'Video', 'Amaliyot', "Qo'shimcha", 'Test', 'Boshqa']

const CAT_COLOR: Record<string, string> = {
	Darslik:
		'bg-blue-50   dark:bg-blue-500/15   text-blue-700   dark:text-blue-400',
	Video: 'bg-red-50    dark:bg-red-500/15    text-red-700    dark:text-red-400',
	Amaliyot:
		'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
	"Qo'shimcha":
		'bg-amber-50  dark:bg-amber-500/15  text-amber-700  dark:text-amber-400',
	Test: 'bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400',
	Boshqa:
		'bg-slate-100 dark:bg-slate-500/15  text-slate-600  dark:text-slate-400',
}

const iCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors'
const lCls =
	'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5'
const fBtnOff =
	'bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'

export default function MaterialsPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [materials, setMaterials] = useState<Material[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [showAdd, setShowAdd] = useState(false)
	const [fGroup, setFGroup] = useState<number | 'all'>('all')
	const [fCat, setFCat] = useState<string>('all')
	const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
	const [form, setForm] = useState({
		group_id: '' as number | '',
		title: '',
		file_url: '',
		link_url: '',
		category: 'Darslik',
	})

	const msg = (m: string, ok = true) => {
		setToast({ msg: m, ok })
		setTimeout(() => setToast(null), 3000)
	}

	const [mentorId, setMentorId] = useState<number | null>(null)

	useEffect(() => {
		getMentorId().then(id => {
			setMentorId(id)
			if (id) fetchAll(id)
			else setLoading(false)
		})
	}, [])

	const fetchAll = async (mid?: number) => {
		const id = mid ?? mentorId
		if (!id) {
			setLoading(false)
			return
		}
		setLoading(true)
		const { data: gData } = await supabase
			.from('groups')
			.select('id, name')
			.eq('mentor_id', id)
		setGroups(gData || [])
		if (!gData?.length) {
			setLoading(false)
			return
		}

		const gMap = Object.fromEntries(gData.map(g => [g.id, g.name]))
		const { data: mData } = await supabase
			.from('materials')
			.select('*')
			.in(
				'group_id',
				gData.map(g => g.id),
			)
			.order('created_at', { ascending: false })

		setMaterials(
			(mData || []).map(m => ({ ...m, group_name: gMap[m.group_id] || '—' })),
		)
		setLoading(false)
	}

	const handleAdd = async () => {
		if (!form.title || !form.group_id) return
		setSaving(true)
		const { error } = await supabase.from('materials').insert([
			{
				group_id: form.group_id,
				title: form.title,
				file_url: form.file_url || null,
				link_url: form.link_url || null,
				category: form.category,
			},
		])
		setSaving(false)
		if (error) {
			msg('Xato: ' + error.message, false)
			return
		}
		msg("Material qo'shildi!")
		setShowAdd(false)
		setForm({
			group_id: '',
			title: '',
			file_url: '',
			link_url: '',
			category: 'Darslik',
		})
		fetchAll()
	}

	const handleDelete = async (id: number) => {
		const { error } = await supabase.from('materials').delete().eq('id', id)
		if (error) {
			msg("O'chirishda xato", false)
			return
		}
		msg("Material o'chirildi!")
		setMaterials(p => p.filter(m => m.id !== id))
	}

	const filtered = materials
		.filter(m => fGroup === 'all' || m.group_id === fGroup)
		.filter(m => fCat === 'all' || m.category === fCat)

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

			{/* ── Add Modal ── */}
			{showAdd && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
					onClick={() => setShowAdd(false)}
				>
					<div
						className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						<div className='flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5'>
							<h3 className='font-black text-slate-900 dark:text-white'>
								Material Qo'shish
							</h3>
							<button
								onClick={() => setShowAdd(false)}
								className='w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors'
							>
								<X className='w-4 h-4' />
							</button>
						</div>
						<div className='p-6 space-y-4'>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className={lCls}>Guruh *</label>
									<select
										className={iCls}
										value={form.group_id}
										onChange={e =>
											setForm(p => ({
												...p,
												group_id: e.target.value
													? parseInt(e.target.value)
													: '',
											}))
										}
									>
										<option value=''>— Tanlang —</option>
										{groups.map(g => (
											<option key={g.id} value={g.id}>
												{g.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className={lCls}>Kategoriya</label>
									<select
										className={iCls}
										value={form.category}
										onChange={e =>
											setForm(p => ({ ...p, category: e.target.value }))
										}
									>
										{CATS.map(c => (
											<option key={c}>{c}</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className={lCls}>Sarlavha *</label>
								<input
									className={iCls}
									placeholder='Material nomi'
									value={form.title}
									onChange={e =>
										setForm(p => ({ ...p, title: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={lCls}>Fayl URL</label>
								<input
									className={iCls}
									placeholder='https://drive.google.com/...'
									value={form.file_url}
									onChange={e =>
										setForm(p => ({ ...p, file_url: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={lCls}>Havola (Link)</label>
								<input
									className={iCls}
									placeholder='https://youtube.com/...'
									value={form.link_url}
									onChange={e =>
										setForm(p => ({ ...p, link_url: e.target.value }))
									}
								/>
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

			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white'>
						Materiallar
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mt-0.5'>
						Dars materiallari va resurslar
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20'
				>
					<Plus className='w-4 h-4' />
					Material Qo'shish
				</button>
			</div>

			{/* Guruh filter */}
			<div className='flex gap-2 flex-wrap'>
				<button
					onClick={() => setFGroup('all')}
					className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${fGroup === 'all' ? 'bg-blue-600 text-white shadow-sm' : fBtnOff}`}
				>
					Barcha guruhlar
				</button>
				{groups.map(g => (
					<button
						key={g.id}
						onClick={() => setFGroup(g.id)}
						className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${fGroup === g.id ? 'bg-blue-600 text-white shadow-sm' : fBtnOff}`}
					>
						{g.name}
					</button>
				))}
			</div>

			{/* Kategoriya filter */}
			<div className='flex gap-2 flex-wrap'>
				<button
					onClick={() => setFCat('all')}
					className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${fCat === 'all' ? 'bg-slate-700 text-white shadow-sm' : fBtnOff}`}
				>
					Barchasi
				</button>
				{CATS.map(c => (
					<button
						key={c}
						onClick={() => setFCat(c)}
						className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${fCat === c ? CAT_COLOR[c] + ' border border-current' : fBtnOff}`}
					>
						{c}
					</button>
				))}
			</div>

			{/* Body */}
			{loading ? (
				<div className='flex items-center justify-center py-20 gap-3'>
					<Loader2 className='w-5 h-5 animate-spin text-blue-500' />
					<span className='text-slate-400'>Yuklanmoqda...</span>
				</div>
			) : filtered.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl gap-3'>
					<BookOpen className='w-14 h-14 text-slate-300 dark:text-slate-700' />
					<p className='text-slate-400 dark:text-slate-500'>
						Material topilmadi
					</p>
				</div>
			) : (
				<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filtered.map(m => (
						<div
							key={m.id}
							className='bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-md transition-all group'
						>
							<div className='flex items-start justify-between mb-3'>
								<div className='w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center'>
									{m.file_url ? (
										<FileText className='w-4 h-4 text-blue-600 dark:text-blue-400' />
									) : (
										<Link className='w-4 h-4 text-blue-600 dark:text-blue-400' />
									)}
								</div>
								<div className='flex items-center gap-1.5'>
									<span
										className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${CAT_COLOR[m.category] || 'bg-slate-100 dark:bg-slate-500/15 text-slate-500'}`}
									>
										{m.category}
									</span>
									<button
										onClick={() => handleDelete(m.id)}
										className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100'
									>
										<Trash2 className='w-3.5 h-3.5' />
									</button>
								</div>
							</div>

							<h3 className='font-black text-slate-900 dark:text-white mb-1 line-clamp-2 text-sm'>
								{m.title}
							</h3>
							<p className='text-xs text-blue-600 dark:text-blue-400 font-semibold mb-3'>
								{m.group_name}
							</p>

							<div className='flex gap-3 pt-3 border-t border-slate-100 dark:border-white/5'>
								{m.file_url && (
									<a
										href={m.file_url}
										target='_blank'
										rel='noreferrer'
										className='flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
									>
										<Download className='w-3 h-3' />
										Yuklab olish
									</a>
								)}
								{m.link_url && (
									<a
										href={m.link_url}
										target='_blank'
										rel='noreferrer'
										className='flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
									>
										<ExternalLink className='w-3 h-3' />
										Havola
									</a>
								)}
								{!m.file_url && !m.link_url && (
									<span className='text-xs text-slate-300 dark:text-slate-600'>
										Havola yo'q
									</span>
								)}
								<span className='ml-auto text-[10px] text-slate-400 dark:text-slate-600'>
									{new Date(m.created_at).toLocaleDateString('uz-UZ')}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
