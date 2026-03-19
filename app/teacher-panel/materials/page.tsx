'use client'

import { createClient } from '@supabase/supabase-js'
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

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
const MENTOR_ID = process.env.NEXT_PUBLIC_MENTOR_ID || ''

type Group = { id: string; name: string }
type Material = {
	id: string
	group_id: string
	title: string
	file_url: string
	link_url: string
	category: string
	created_at: string
	group_name?: string
}

const CATEGORIES = [
	'Darslik',
	'Video',
	'Amaliyot',
	"Qo'shimcha",
	'Test',
	'Boshqa',
]

const categoryColors: Record<string, string> = {
	Darslik: 'bg-blue-500/15 text-blue-400',
	Video: 'bg-red-500/15 text-red-400',
	Amaliyot: 'bg-emerald-500/15 text-emerald-400',
	"Qo'shimcha": 'bg-amber-500/15 text-amber-400',
	Test: 'bg-violet-500/15 text-violet-400',
	Boshqa: 'bg-slate-500/15 text-slate-400',
}

const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5'

export default function MaterialsPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [materials, setMaterials] = useState<Material[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [showAdd, setShowAdd] = useState(false)
	const [filterGroup, setFilterGroup] = useState('all')
	const [filterCat, setFilterCat] = useState('all')
	const [toast, setToast] = useState<{
		msg: string
		type: 'success' | 'error'
	} | null>(null)

	const [form, setForm] = useState({
		group_id: '',
		title: '',
		file_url: '',
		link_url: '',
		category: 'Darslik',
	})

	useEffect(() => {
		fetchAll()
	}, [])

	const showToast = (msg: string, type: 'success' | 'error') => {
		setToast({ msg, type })
		setTimeout(() => setToast(null), 3000)
	}

	const fetchAll = async () => {
		setLoading(true)
		const { data: gData } = await supabase
			.from('groups')
			.select('id, name')
			.eq('mentor_id', MENTOR_ID)
		setGroups(gData || [])

		if (!gData || gData.length === 0) {
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
			showToast('Xato: ' + error.message, 'error')
			return
		}
		showToast("Material qo'shildi!", 'success')
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

	const handleDelete = async (id: string) => {
		const { error } = await supabase.from('materials').delete().eq('id', id)
		if (error) {
			showToast("O'chirishda xato", 'error')
			return
		}
		showToast("Material o'chirildi!", 'success')
		setMaterials(p => p.filter(m => m.id !== id))
	}

	const filtered = materials
		.filter(m => filterGroup === 'all' || m.group_id === filterGroup)
		.filter(m => filterCat === 'all' || m.category === filterCat)

	return (
		<div className='min-h-screen bg-slate-950 text-white p-6 space-y-6'>
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

			{/* Add Modal */}
			{showAdd && (
				<div
					className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
					onClick={() => setShowAdd(false)}
				>
					<div
						className='w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl'
						onClick={e => e.stopPropagation()}
					>
						<div className='flex items-center justify-between px-6 py-4 border-b border-white/5'>
							<h3 className='font-black text-white'>Material Qo'shish</h3>
							<button
								onClick={() => setShowAdd(false)}
								className='w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/5 transition-colors'
							>
								<X className='w-4 h-4' />
							</button>
						</div>
						<div className='p-6 space-y-4'>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className={labelCls}>Guruh *</label>
									<select
										className={inputCls}
										value={form.group_id}
										onChange={e =>
											setForm(p => ({ ...p, group_id: e.target.value }))
										}
									>
										<option value=''>Tanlang</option>
										{groups.map(g => (
											<option key={g.id} value={g.id}>
												{g.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className={labelCls}>Kategoriya</label>
									<select
										className={inputCls}
										value={form.category}
										onChange={e =>
											setForm(p => ({ ...p, category: e.target.value }))
										}
									>
										{CATEGORIES.map(c => (
											<option key={c}>{c}</option>
										))}
									</select>
								</div>
							</div>
							<div>
								<label className={labelCls}>Sarlavha *</label>
								<input
									className={inputCls}
									placeholder='Material nomi'
									value={form.title}
									onChange={e =>
										setForm(p => ({ ...p, title: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Fayl URL</label>
								<input
									className={inputCls}
									placeholder='https://drive.google.com/...'
									value={form.file_url}
									onChange={e =>
										setForm(p => ({ ...p, file_url: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Havola (Link)</label>
								<input
									className={inputCls}
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
									className='flex-1 h-10 rounded-xl border border-white/10 text-slate-400 text-sm font-bold hover:bg-white/5 transition-colors'
								>
									Bekor
								</button>
								<button
									onClick={handleAdd}
									disabled={saving || !form.title || !form.group_id}
									className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white text-sm font-black transition-colors flex items-center justify-center gap-2'
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

			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-2xl font-black text-white'>Materiallar</h1>
					<p className='text-slate-400 text-sm mt-0.5'>
						Dars materiallari va resurslar
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20'
				>
					<Plus className='w-4 h-4' /> Material Qo'shish
				</button>
			</div>

			{/* Filters */}
			<div className='flex gap-2 flex-wrap'>
				<button
					onClick={() => setFilterGroup('all')}
					className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterGroup === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-white/10 text-slate-400 hover:border-white/20'}`}
				>
					Barcha guruhlar
				</button>
				{groups.map(g => (
					<button
						key={g.id}
						onClick={() => setFilterGroup(g.id)}
						className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterGroup === g.id ? 'bg-blue-600 text-white' : 'bg-slate-900 border border-white/10 text-slate-400 hover:border-white/20'}`}
					>
						{g.name}
					</button>
				))}
			</div>
			<div className='flex gap-2 flex-wrap'>
				<button
					onClick={() => setFilterCat('all')}
					className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCat === 'all' ? 'bg-slate-600 text-white' : 'bg-slate-900 border border-white/10 text-slate-400 hover:border-white/20'}`}
				>
					Barchasi
				</button>
				{CATEGORIES.map(c => (
					<button
						key={c}
						onClick={() => setFilterCat(c)}
						className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterCat === c ? categoryColors[c] + ' border border-current' : 'bg-slate-900 border border-white/10 text-slate-400 hover:border-white/20'}`}
					>
						{c}
					</button>
				))}
			</div>

			{loading ? (
				<div className='flex items-center justify-center py-20 gap-3'>
					<Loader2 className='w-5 h-5 animate-spin text-blue-500' />
					<span className='text-slate-400'>Yuklanmoqda...</span>
				</div>
			) : filtered.length === 0 ? (
				<div className='text-center py-20 bg-slate-900/50 border border-white/5 rounded-2xl'>
					<BookOpen className='w-12 h-12 text-slate-700 mx-auto mb-3' />
					<p className='text-slate-500'>Material topilmadi</p>
				</div>
			) : (
				<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{filtered.map(m => (
						<div
							key={m.id}
							className='bg-slate-900/80 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:border-blue-500/20 transition-all group'
						>
							<div className='flex items-start justify-between mb-3'>
								<div className='w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center'>
									{m.file_url ? (
										<FileText className='w-4 h-4 text-blue-400' />
									) : (
										<Link className='w-4 h-4 text-blue-400' />
									)}
								</div>
								<div className='flex items-center gap-1'>
									<span
										className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${categoryColors[m.category] || 'bg-slate-500/15 text-slate-400'}`}
									>
										{m.category}
									</span>
									<button
										onClick={() => handleDelete(m.id)}
										className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100'
									>
										<Trash2 className='w-3.5 h-3.5' />
									</button>
								</div>
							</div>
							<h3 className='font-black text-white mb-1 line-clamp-2 text-sm'>
								{m.title}
							</h3>
							<p className='text-xs text-blue-400 font-semibold mb-3'>
								{m.group_name}
							</p>
							<div className='flex gap-2 pt-3 border-t border-white/5'>
								{m.file_url && (
									<a
										href={m.file_url}
										target='_blank'
										rel='noreferrer'
										className='flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400 transition-colors'
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
										className='flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400 transition-colors'
									>
										<ExternalLink className='w-3 h-3' />
										Havola
									</a>
								)}
								{!m.file_url && !m.link_url && (
									<span className='text-xs text-slate-600'>Havola yo'q</span>
								)}
								<span className='ml-auto text-[10px] text-slate-600'>
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
