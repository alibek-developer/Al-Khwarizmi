'use client'

import {
	BookOpen,
	Edit2,
	Eye,
	GraduationCap,
	MoreHorizontal,
	Plus,
	Search,
	Star,
	Trash2,
	Upload,
	Users,
	X,
} from 'lucide-react'
import { useState } from 'react'

const initialMentors = [
	{
		id: 1,
		name: 'Tulkin Rajabbaev',
		spec: 'English Teacher',
		specUz: 'Ingliz Tili',
		courses: 3,
		students: 198,
		rating: 4.9,
		email: 'tulkin@gmail.com',
		phone: '+998901234567',
		status: 'active',
		avatar: 'TR',
		color: 'from-blue-500 to-blue-700',
		img: '',
	},
	{
		id: 2,
		name: 'Sarah Jenkins',
		spec: 'Full-Stack Developer',
		specUz: 'Veb Dasturchi',
		courses: 2,
		students: 142,
		rating: 5.0,
		email: 'sarah@gmail.com',
		phone: '+998901234568',
		status: 'active',
		avatar: 'SJ',
		color: 'from-violet-500 to-violet-700',
		img: '',
	},
	{
		id: 3,
		name: 'Elena Rodriguez',
		spec: 'Data Scientist',
		specUz: "Ma'lumotlar Olimi",
		courses: 3,
		students: 98,
		rating: 4.8,
		email: 'elena@gmail.com',
		phone: '+998901234569',
		status: 'active',
		avatar: 'ER',
		color: 'from-emerald-500 to-emerald-700',
		img: '',
	},
	{
		id: 4,
		name: 'Michael Volkov',
		spec: 'AI Engineer',
		specUz: "Sun'iy Intellekt",
		courses: 2,
		students: 86,
		rating: 4.9,
		email: 'michael@gmail.com',
		phone: '+998901234570',
		status: 'active',
		avatar: 'MV',
		color: 'from-amber-500 to-amber-700',
		img: '',
	},
]

type Mentor = (typeof initialMentors)[0]
const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'

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

const colors = [
	'from-blue-500 to-blue-700',
	'from-violet-500 to-violet-700',
	'from-emerald-500 to-emerald-700',
	'from-amber-500 to-amber-700',
	'from-pink-500 to-rose-600',
	'from-cyan-500 to-blue-600',
]

export default function MentorsPage() {
	const [mentors, setMentors] = useState(initialMentors)
	const [search, setSearch] = useState('')
	const [menu, setMenu] = useState<number | null>(null)
	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Mentor | null>(null)
	const [viewItem, setViewItem] = useState<Mentor | null>(null)
	const [deleteItem, setDeleteItem] = useState<Mentor | null>(null)
	const [imgPreview, setImgPreview] = useState('')
	const [form, setForm] = useState({
		name: '',
		spec: '',
		specUz: '',
		email: '',
		phone: '',
	})

	const filtered = mentors.filter(m =>
		m.name.toLowerCase().includes(search.toLowerCase()),
	)

	const handleImg = (
		e: React.ChangeEvent<HTMLInputElement>,
		cb: (s: string) => void,
	) => {
		const file = e.target.files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = ev => cb(ev.target?.result as string)
		reader.readAsDataURL(file)
	}

	const handleAdd = () => {
		if (!form.name) return
		const initials = form.name
			.split(' ')
			.map(w => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
		setMentors(p => [
			...p,
			{
				id: Date.now(),
				name: form.name,
				spec: form.spec,
				specUz: form.specUz,
				courses: 0,
				students: 0,
				rating: 5.0,
				email: form.email,
				phone: form.phone,
				status: 'active',
				avatar: initials,
				color: colors[p.length % colors.length],
				img: imgPreview,
			},
		])
		setShowAdd(false)
		setForm({ name: '', spec: '', specUz: '', email: '', phone: '' })
		setImgPreview('')
	}

	const handleEdit = () => {
		if (!editItem) return
		setMentors(p => p.map(m => (m.id === editItem.id ? editItem : m)))
		setEditItem(null)
	}
	const handleDelete = () => {
		if (!deleteItem) return
		setMentors(p => p.filter(m => m.id !== deleteItem.id))
		setDeleteItem(null)
	}

	return (
		<div className='space-y-5 pb-6'>
			{showAdd && (
				<Modal title="Yangi Mentor Qo'shish" onClose={() => setShowAdd(false)}>
					<div className='space-y-4'>
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
									onChange={e => handleImg(e, setImgPreview)}
								/>
							</label>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>To'liq ism *</label>
								<input
									className={inputCls}
									placeholder='Ism Familiya'
									value={form.name}
									onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
								/>
							</div>
							<div>
								<label className={labelCls}>Mutaxassislik (EN)</label>
								<input
									className={inputCls}
									placeholder='Web Developer'
									value={form.spec}
									onChange={e => setForm(p => ({ ...p, spec: e.target.value }))}
								/>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>Mutaxassislik (UZ)</label>
								<input
									className={inputCls}
									placeholder='Veb Dasturchi'
									value={form.specUz}
									onChange={e =>
										setForm(p => ({ ...p, specUz: e.target.value }))
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
							<label className={labelCls}>Email</label>
							<input
								className={inputCls}
								type='email'
								placeholder='email@gmail.com'
								value={form.email}
								onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
							/>
						</div>
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => setShowAdd(false)}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor
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
				<Modal title='Mentorni Tahrirlash' onClose={() => setEditItem(null)}>
					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-3'>
							<div>
								<label className={labelCls}>To'liq ism</label>
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
								<label className={labelCls}>Mutaxassislik</label>
								<input
									className={inputCls}
									value={editItem.spec}
									onChange={e =>
										setEditItem(p =>
											p ? { ...p, spec: e.target.value } : null,
										)
									}
								/>
							</div>
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
						<div className='flex gap-3 pt-2'>
							<button
								onClick={() => setEditItem(null)}
								className='flex-1 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 transition-colors'
							>
								Bekor
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
				<Modal title="Mentor Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='flex items-center gap-4 mb-4'>
						{viewItem.img ? (
							<img
								src={viewItem.img}
								className='w-16 h-16 rounded-2xl object-cover'
							/>
						) : (
							<div
								className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${viewItem.color} flex items-center justify-center`}
							>
								<span className='text-white text-xl font-black'>
									{viewItem.avatar}
								</span>
							</div>
						)}
						<div>
							<p className='font-black text-slate-900 dark:text-white'>
								{viewItem.name}
							</p>
							<p className='text-sm text-slate-500'>{viewItem.spec}</p>
						</div>
					</div>
					<div className='space-y-2'>
						{[
							['Email', viewItem.email],
							['Telefon', viewItem.phone],
							['Kurslar', String(viewItem.courses)],
							['Talabalar', String(viewItem.students)],
							['Reyting', String(viewItem.rating)],
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
				<Modal title="Mentorni O'chirish" onClose={() => setDeleteItem(null)}>
					<p className='text-sm text-slate-600 dark:text-slate-300 mb-5'>
						<span className='font-bold text-slate-900 dark:text-white'>
							"{deleteItem.name}"
						</span>{' '}
						ni o'chirishni tasdiqlaysizmi?
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
							className='flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-black transition-colors'
						>
							O'chirish
						</button>
					</div>
				</Modal>
			)}

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
						value: mentors.reduce((a, m) => a + m.students, 0),
						icon: Users,
						bg: 'bg-violet-50 dark:bg-violet-500/10',
						color: 'text-violet-600 dark:text-violet-400',
					},
					{
						label: "O'rtacha Reyting",
						value: (
							mentors.reduce((a, m) => a + m.rating, 0) / mentors.length
						).toFixed(1),
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

			<div className='relative max-w-xs'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
				<input
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder='Mentor qidirish...'
					className='w-full h-9 pl-9 pr-4 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
				/>
			</div>

			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-slate-100 dark:border-slate-800'>
								{[
									'#',
									'Mentor',
									'Mutaxassislik',
									'Kurslar',
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
							{filtered.map((m, idx) => (
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
											{m.img ? (
												<img
													src={m.img}
													className='w-8 h-8 rounded-xl object-cover shrink-0'
												/>
											) : (
												<div
													className={`w-8 h-8 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0`}
												>
													<span className='text-white text-[10px] font-black'>
														{m.avatar}
													</span>
												</div>
											)}
											<div>
												<p className='text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap'>
													{m.name}
												</p>
											</div>
										</div>
									</td>
									<td className='px-4 py-3'>
										<span className='text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap'>
											{m.spec}
										</span>
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300'>
											<BookOpen className='w-3 h-3 text-slate-400' />
											{m.courses}
										</div>
									</td>
									<td className='px-4 py-3'>
										<div className='flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300'>
											<Users className='w-3 h-3 text-slate-400' />
											{m.students}
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
										<div className='relative'>
											<button
												onClick={() => setMenu(menu === m.id ? null : m.id)}
												className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
											>
												<MoreHorizontal className='w-4 h-4' />
											</button>
											{menu === m.id && (
												<div className='absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1'>
													<button
														onClick={() => {
															setViewItem(m)
															setMenu(null)
														}}
														className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
													>
														<Eye className='w-3.5 h-3.5' />
														Ko'rish
													</button>
													<button
														onClick={() => {
															setEditItem(m)
															setMenu(null)
														}}
														className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
													>
														<Edit2 className='w-3.5 h-3.5' />
														Tahrirlash
													</button>
													<button
														onClick={() => {
															setDeleteItem(m)
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
						{filtered.length} ta mentor
					</p>
				</div>
			</div>
		</div>
	)
}
