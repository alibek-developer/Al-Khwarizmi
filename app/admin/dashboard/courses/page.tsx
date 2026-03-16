'use client'

import {
	BookOpen,
	CheckCircle2,
	Edit2,
	Eye,
	MoreHorizontal,
	Plus,
	Search,
	Star,
	Trash2,
	TrendingUp,
	Upload,
	Users,
	X,
} from 'lucide-react'
import { useState } from 'react'

const initialCourses = [
	{
		id: 1,
		name: 'English Course',
		nameUz: 'Ingliz Tili',
		students: 198,
		duration: '3–13 oy',
		rating: 4.9,
		revenue: '$3,200',
		status: 'active',
		level: 'A1–C1',
		image: '',
		color: 'bg-blue-500',
		light: 'bg-blue-50 dark:bg-blue-500/10',
		text: 'text-blue-600 dark:text-blue-400',
	},
	{
		id: 2,
		name: 'Web Development',
		nameUz: 'Veb Dasturlash',
		students: 142,
		duration: '6 oy',
		rating: 4.9,
		revenue: '$2,840',
		status: 'active',
		level: 'Intermediate',
		image: '',
		color: 'bg-violet-500',
		light: 'bg-violet-50 dark:bg-violet-500/10',
		text: 'text-violet-600 dark:text-violet-400',
	},
	{
		id: 3,
		name: 'Data Science',
		nameUz: "Ma'lumotlar Fani",
		students: 98,
		duration: '4 oy',
		rating: 4.8,
		revenue: '$1,650',
		status: 'active',
		level: 'Beginner',
		image: '',
		color: 'bg-emerald-500',
		light: 'bg-emerald-50 dark:bg-emerald-500/10',
		text: 'text-emerald-600 dark:text-emerald-400',
	},
	{
		id: 4,
		name: 'AI & ML',
		nameUz: "Sun'iy Intellekt",
		students: 86,
		duration: '5 oy',
		rating: 4.9,
		revenue: '$860',
		status: 'active',
		level: 'Advanced',
		image: '',
		color: 'bg-amber-500',
		light: 'bg-amber-50 dark:bg-amber-500/10',
		text: 'text-amber-600 dark:text-amber-400',
	},
]

type Course = (typeof initialCourses)[0]

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
				className='w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				<div className='flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800'>
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
				<div className='p-6'>{children}</div>
			</div>
		</div>
	)
}

const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'

export default function CoursesPage() {
	const [courses, setCourses] = useState(initialCourses)
	const [search, setSearch] = useState('')
	const [menu, setMenu] = useState<number | null>(null)
	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Course | null>(null)
	const [viewItem, setViewItem] = useState<Course | null>(null)
	const [deleteItem, setDeleteItem] = useState<Course | null>(null)
	const [imgPreview, setImgPreview] = useState('')
	const [form, setForm] = useState({
		name: '',
		nameUz: '',
		duration: '',
		level: '',
		revenue: '',
	})

	const filtered = courses.filter(c =>
		c.name.toLowerCase().includes(search.toLowerCase()),
	)

	const handleAdd = () => {
		if (!form.name) return
		setCourses(prev => [
			...prev,
			{
				id: Date.now(),
				name: form.name,
				nameUz: form.nameUz,
				students: 0,
				duration: form.duration,
				rating: 5.0,
				revenue: form.revenue || '$0',
				status: 'active',
				level: form.level,
				image: imgPreview,
				color: 'bg-blue-500',
				light: 'bg-blue-50 dark:bg-blue-500/10',
				text: 'text-blue-600 dark:text-blue-400',
			},
		])
		setShowAdd(false)
		setForm({ name: '', nameUz: '', duration: '', level: '', revenue: '' })
		setImgPreview('')
	}

	const handleEdit = () => {
		if (!editItem) return
		setCourses(prev => prev.map(c => (c.id === editItem.id ? editItem : c)))
		setEditItem(null)
	}

	const handleDelete = () => {
		if (!deleteItem) return
		setCourses(prev => prev.filter(c => c.id !== deleteItem.id))
		setDeleteItem(null)
	}

	const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = ev => setImgPreview(ev.target?.result as string)
			reader.readAsDataURL(file)
		}
	}

	return (
		<div className='space-y-5 pb-6'>
			{/* Modals */}
			{showAdd && (
				<Modal title="Yangi Kurs Qo'shish" onClose={() => setShowAdd(false)}>
					<div className='space-y-4'>
						{/* Image upload */}
						<div>
							<label className={labelCls}>Kurs Rasmi</label>
							<label className='flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-400 transition-colors overflow-hidden bg-slate-50 dark:bg-slate-800'>
								{imgPreview ? (
									<img
										src={imgPreview}
										alt=''
										className='w-full h-full object-cover'
									/>
								) : (
									<>
										<Upload className='w-6 h-6 text-slate-400 mb-1' />
										<span className='text-xs text-slate-400'>
											Rasm yuklash uchun bosing
										</span>
									</>
								)}
								<input
									type='file'
									accept='image/*'
									className='hidden'
									onChange={handleImg}
								/>
							</label>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Kurs nomi (EN) *</label>
								<input
									className={inputCls}
									placeholder='Web Development'
									value={form.name}
									onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
								/>
							</div>
							<div>
								<label className={labelCls}>Kurs nomi (UZ)</label>
								<input
									className={inputCls}
									placeholder='Veb Dasturlash'
									value={form.nameUz}
									onChange={e =>
										setForm(p => ({ ...p, nameUz: e.target.value }))
									}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Davomiyligi</label>
								<input
									className={inputCls}
									placeholder='6 oy'
									value={form.duration}
									onChange={e =>
										setForm(p => ({ ...p, duration: e.target.value }))
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Daraja</label>
								<select
									className={inputCls}
									value={form.level}
									onChange={e =>
										setForm(p => ({ ...p, level: e.target.value }))
									}
								>
									<option value=''>Tanlang</option>
									{['Beginner', 'Intermediate', 'Advanced', 'A1–C1'].map(l => (
										<option key={l}>{l}</option>
									))}
								</select>
							</div>
						</div>
						<div>
							<label className={labelCls}>Narx</label>
							<input
								className={inputCls}
								placeholder='$499'
								value={form.revenue}
								onChange={e =>
									setForm(p => ({ ...p, revenue: e.target.value }))
								}
							/>
						</div>
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => setShowAdd(false)}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
							>
								Bekor qilish
							</button>
							<button
								onClick={handleAdd}
								disabled={!form.name}
								className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-black transition-colors'
							>
								Qo'shish
							</button>
						</div>
					</div>
				</Modal>
			)}

			{editItem && (
				<Modal title='Kursni Tahrirlash' onClose={() => setEditItem(null)}>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Kurs nomi (EN)</label>
								<input
									className={inputCls}
									value={editItem.name}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, name: e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Kurs nomi (UZ)</label>
								<input
									className={inputCls}
									value={editItem.nameUz}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, nameUz: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Davomiyligi</label>
								<input
									className={inputCls}
									value={editItem.duration}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, duration: e.target.value } : null,
										)
									}
								/>
							</div>
							<div>
								<label className={labelCls}>Daraja</label>
								<input
									className={inputCls}
									value={editItem.level}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, level: e.target.value } : null,
										)
									}
								/>
							</div>
						</div>
						<div>
							<label className={labelCls}>Daromad</label>
							<input
								className={inputCls}
								value={editItem.revenue}
								onChange={e =>
									setEditItem(p =>
										p ? { ...p, revenue: e.target.value } : null,
									)
								}
							/>
						</div>
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => setEditItem(null)}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor qilish
							</button>
							<button
								onClick={handleEdit}
								className='flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black transition-colors'
							>
								Saqlash
							</button>
						</div>
					</div>
				</Modal>
			)}

			{viewItem && (
				<Modal title="Kurs Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='space-y-3'>
						{viewItem.image && (
							<img
								src={viewItem.image}
								alt=''
								className='w-full h-32 object-cover rounded-xl mb-2'
							/>
						)}
						{[
							['Nomi', viewItem.name],
							["O'zbekcha", viewItem.nameUz],
							['Davomiyligi', viewItem.duration],
							['Daraja', viewItem.level],
							['Talabalar', String(viewItem.students)],
							['Reyting', String(viewItem.rating)],
							['Daromad', viewItem.revenue],
						].map(([k, v]) => (
							<div
								key={k}
								className='flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0'
							>
								<span className='text-xs text-slate-500'>{k}</span>
								<span className='text-xs font-bold text-slate-900 dark:text-white'>
									{v}
								</span>
							</div>
						))}
					</div>
				</Modal>
			)}

			{deleteItem && (
				<Modal title="Kursni O'chirish" onClose={() => setDeleteItem(null)}>
					<p className='text-sm text-slate-600 dark:text-slate-300 mb-5'>
						<span className='font-bold text-slate-900 dark:text-white'>
							"{deleteItem.name}"
						</span>{' '}
						kursini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
					</p>
					<div className='flex gap-3'>
						<button
							onClick={() => setDeleteItem(null)}
							className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
						>
							Bekor qilish
						</button>
						<button
							onClick={handleDelete}
							className='flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-black transition-colors'
						>
							O'chirish
						</button>
					</div>
				</Modal>
			)}

			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-xl font-black text-slate-900 dark:text-white'>
						Kurslar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						Barcha kurslarni boshqaring
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'
				>
					<Plus className='w-3.5 h-3.5' /> Yangi Kurs
				</button>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
				{[
					{
						label: 'Jami Kurslar',
						value: courses.length,
						icon: BookOpen,
						bg: 'bg-blue-50 dark:bg-blue-500/10',
						color: 'text-blue-600 dark:text-blue-400',
					},
					{
						label: 'Jami Talabalar',
						value: courses.reduce((a, c) => a + c.students, 0),
						icon: Users,
						bg: 'bg-violet-50 dark:bg-violet-500/10',
						color: 'text-violet-600 dark:text-violet-400',
					},
					{
						label: "O'rtacha Reyting",
						value: (
							courses.reduce((a, c) => a + c.rating, 0) / courses.length
						).toFixed(1),
						icon: Star,
						bg: 'bg-amber-50 dark:bg-amber-500/10',
						color: 'text-amber-600 dark:text-amber-400',
					},
					{
						label: 'Jami Daromad',
						value: '$8,550',
						icon: TrendingUp,
						bg: 'bg-emerald-50 dark:bg-emerald-500/10',
						color: 'text-emerald-600 dark:text-emerald-400',
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

			{/* Search */}
			<div className='relative max-w-xs'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
				<input
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder='Kurs qidirish...'
					className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
				/>
			</div>

			{/* Table */}
			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-slate-100 dark:border-slate-800'>
								{[
									'#',
									'Rasm',
									'Kurs nomi',
									'Daraja',
									'Talabalar',
									'Davomiyligi',
									'Reyting',
									'Daromad',
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
							{filtered.map((c, idx) => (
								<tr
									key={c.id}
									className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
								>
									<td className='px-4 py-3'>
										<span className='text-xs text-slate-400 font-mono'>
											{idx + 1}
										</span>
									</td>
									<td className='px-4 py-3'>
										{c.image ? (
											<img
												src={c.image}
												alt=''
												className='w-10 h-8 rounded-lg object-cover'
											/>
										) : (
											<div
												className={`w-10 h-8 ${c.light} rounded-lg flex items-center justify-center`}
											>
												<BookOpen
													className={c.text}
													style={{ width: 14, height: 14 }}
												/>
											</div>
										)}
									</td>
									<td className='px-4 py-3'>
										<p className='text-xs font-bold text-slate-800 dark:text-slate-200'>
											{c.name}
										</p>
										<p className={`text-[10px] italic ${c.text}`}>{c.nameUz}</p>
									</td>
									<td className='px-4 py-3'>
										<span className='text-[11px] text-slate-500 dark:text-slate-400'>
											{c.level}
										</span>
									</td>
									<td className='px-4 py-3'>
										<span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
											{c.students}
										</span>
									</td>
									<td className='px-4 py-3'>
										<span className='text-[11px] text-slate-500 dark:text-slate-400'>
											{c.duration}
										</span>
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-1'>
											<Star className='w-3 h-3 fill-amber-400 text-amber-400' />
											<span className='text-xs font-bold text-slate-700 dark:text-slate-300'>
												{c.rating}
											</span>
										</div>
									</td>
									<td className='px-4 py-3'>
										<span className='text-xs font-black text-emerald-600 dark:text-emerald-400'>
											{c.revenue}
										</span>
									</td>
									<td className='px-4 py-3'>
										<span className='flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/15 px-2 py-0.5 rounded-lg w-fit'>
											<CheckCircle2 className='w-2.5 h-2.5' />
											Faol
										</span>
									</td>
									<td className='px-4 py-3'>
										<div className='relative'>
											<button
												onClick={() => setMenu(menu === c.id ? null : c.id)}
												className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
											>
												<MoreHorizontal className='w-4 h-4' />
											</button>
											{menu === c.id && (
												<div className='absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1'>
													<button
														onClick={() => {
															setViewItem(c)
															setMenu(null)
														}}
														className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
													>
														<Eye className='w-3.5 h-3.5' />
														Ko'rish
													</button>
													<button
														onClick={() => {
															setEditItem(c)
															setMenu(null)
														}}
														className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
													>
														<Edit2 className='w-3.5 h-3.5' />
														Tahrirlash
													</button>
													<button
														onClick={() => {
															setDeleteItem(c)
															setMenu(null)
														}}
														className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors'
													>
														<Trash2 className='w-3.5 h-3.5' />
														O'chirish
													</button>
												</div>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-800'>
					<p className='text-[11px] text-slate-400'>
						{filtered.length} ta kurs
					</p>
				</div>
			</div>
		</div>
	)
}
