'use client'

import {
	AlertCircle,
	CheckCircle2,
	Clock,
	Edit2,
	Eye,
	MoreHorizontal,
	Search,
	Trash2,
	UserPlus,
	X,
} from 'lucide-react'
import { useState } from 'react'

const initialStudents = [
	{
		id: 1,
		name: 'Abdullayev Jasur',
		email: 'jasur@gmail.com',
		phone: '+998901111111',
		course: 'Web Development',
		date: '12 yan 2025',
		status: 'active',
		paid: '$499',
		avatar: 'AJ',
		color: 'from-blue-500 to-indigo-600',
	},
	{
		id: 2,
		name: 'Toshmatova Dilnoza',
		email: 'dilnoza@gmail.com',
		phone: '+998902222222',
		course: 'English Course',
		date: '11 yan 2025',
		status: 'active',
		paid: '$299',
		avatar: 'TD',
		color: 'from-pink-500 to-rose-600',
	},
	{
		id: 3,
		name: 'Karimov Sherzod',
		email: 'sherzod@gmail.com',
		phone: '+998903333333',
		course: 'Data Science',
		date: '10 yan 2025',
		status: 'pending',
		paid: '$449',
		avatar: 'KS',
		color: 'from-emerald-500 to-teal-600',
	},
	{
		id: 4,
		name: 'Yusupova Malika',
		email: 'malika@gmail.com',
		phone: '+998904444444',
		course: 'AI & ML',
		date: '9 yan 2025',
		status: 'active',
		paid: '$599',
		avatar: 'YM',
		color: 'from-violet-500 to-purple-600',
	},
	{
		id: 5,
		name: 'Normatov Bobur',
		email: 'bobur@gmail.com',
		phone: '+998905555555',
		course: 'English Course',
		date: '8 yan 2025',
		status: 'inactive',
		paid: '$299',
		avatar: 'NB',
		color: 'from-slate-500 to-slate-700',
	},
	{
		id: 6,
		name: 'Hasanov Ulugbek',
		email: 'ulugbek@gmail.com',
		phone: '+998906666666',
		course: 'Web Development',
		date: '7 yan 2025',
		status: 'active',
		paid: '$499',
		avatar: 'HU',
		color: 'from-cyan-500 to-blue-600',
	},
	{
		id: 7,
		name: 'Rahimova Zulfiya',
		email: 'zulfiya@gmail.com',
		phone: '+998907777777',
		course: 'Data Science',
		date: '6 yan 2025',
		status: 'active',
		paid: '$449',
		avatar: 'RZ',
		color: 'from-amber-500 to-orange-600',
	},
	{
		id: 8,
		name: 'Mirzayev Doniyor',
		email: 'doniyor@gmail.com',
		phone: '+998908888888',
		course: 'AI & ML',
		date: '5 yan 2025',
		status: 'pending',
		paid: '$599',
		avatar: 'MD',
		color: 'from-red-500 to-rose-600',
	},
]

type Student = (typeof initialStudents)[0]
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
const courses = ['Web Development', 'English Course', 'Data Science', 'AI & ML']
const inputCls =
	'w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors'
const labelCls =
	'block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'
const colors = [
	'from-blue-500 to-indigo-600',
	'from-pink-500 to-rose-600',
	'from-emerald-500 to-teal-600',
	'from-violet-500 to-purple-600',
	'from-cyan-500 to-blue-600',
	'from-amber-500 to-orange-600',
]

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
				className='w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700'
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

export default function StudentsPage() {
	const [students, setStudents] = useState(initialStudents)
	const [search, setSearch] = useState('')
	const [filterStatus, setFilterStatus] = useState('all')
	const [menu, setMenu] = useState<number | null>(null)
	const [showAdd, setShowAdd] = useState(false)
	const [editItem, setEditItem] = useState<Student | null>(null)
	const [viewItem, setViewItem] = useState<Student | null>(null)
	const [deleteItem, setDeleteItem] = useState<Student | null>(null)
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		course: 'Web Development',
		paid: '',
	})

	const filtered = students.filter(s => {
		const ms =
			s.name.toLowerCase().includes(search.toLowerCase()) ||
			s.course.toLowerCase().includes(search.toLowerCase())
		const mf = filterStatus === 'all' || s.status === filterStatus
		return ms && mf
	})
	const counts = {
		all: students.length,
		active: students.filter(s => s.status === 'active').length,
		pending: students.filter(s => s.status === 'pending').length,
		inactive: students.filter(s => s.status === 'inactive').length,
	}

	const handleAdd = () => {
		if (!form.name) return
		const initials = form.name
			.split(' ')
			.map(w => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()
		setStudents(p => [
			...p,
			{
				id: Date.now(),
				name: form.name,
				email: form.email,
				phone: form.phone,
				course: form.course,
				date: new Date().toLocaleDateString('uz-UZ', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				}),
				status: 'active',
				paid: form.paid || '$0',
				avatar: initials,
				color: colors[p.length % colors.length],
			},
		])
		setShowAdd(false)
		setForm({
			name: '',
			email: '',
			phone: '',
			course: 'Web Development',
			paid: '',
		})
	}
	const handleEdit = () => {
		if (!editItem) return
		setStudents(p => p.map(s => (s.id === editItem.id ? editItem : s)))
		setEditItem(null)
	}
	const handleDelete = () => {
		if (!deleteItem) return
		setStudents(p => p.filter(s => s.id !== deleteItem.id))
		setDeleteItem(null)
	}

	return (
		<div className='space-y-5 pb-6'>
			{showAdd && (
				<Modal title="Yangi Talaba Qo'shish" onClose={() => setShowAdd(false)}>
					<div className='space-y-4'>
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
								<label className={labelCls}>Kurs</label>
								<select
									className={inputCls}
									value={form.course}
									onChange={e =>
										setForm(p => ({ ...p, course: e.target.value }))
									}
								>
									{courses.map(c => (
										<option key={c}>{c}</option>
									))}
								</select>
							</div>
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
							<label className={labelCls}>To'lov miqdori</label>
							<input
								className={inputCls}
								placeholder='$499'
								value={form.paid}
								onChange={e => setForm(p => ({ ...p, paid: e.target.value }))}
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
				<Modal title='Talabani Tahrirlash' onClose={() => setEditItem(null)}>
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
									{courses.map(c => (
										<option key={c}>{c}</option>
									))}
								</select>
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
						</div>
						<div>
							<label className={labelCls}>To'lov</label>
							<input
								className={inputCls}
								value={editItem.paid}
								onChange={e =>
									setEditItem(p => (p ? { ...p, paid: e.target.value } : null))
								}
							/>
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
				<Modal title="Talaba Ma'lumotlari" onClose={() => setViewItem(null)}>
					<div className='flex items-center gap-4 mb-4'>
						<div
							className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${viewItem.color} flex items-center justify-center`}
						>
							<span className='text-white text-lg font-black'>
								{viewItem.avatar}
							</span>
						</div>
						<div>
							<p className='font-black text-slate-900 dark:text-white'>
								{viewItem.name}
							</p>
							<p className='text-sm text-slate-500'>{viewItem.course}</p>
						</div>
					</div>
					<div className='space-y-2'>
						{[
							['Email', viewItem.email],
							['Telefon', viewItem.phone],
							['Kurs', viewItem.course],
							['Sana', viewItem.date],
							["To'lov", viewItem.paid],
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
				<Modal title="Talabani O'chirish" onClose={() => setDeleteItem(null)}>
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
						Talabalar
					</h1>
					<p className='text-slate-400 text-xs mt-0.5'>
						{students.length} ta talaba ro'yxatda
					</p>
				</div>
				<button
					onClick={() => setShowAdd(true)}
					className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] shadow-md shadow-blue-500/25'
				>
					<UserPlus className='w-3.5 h-3.5' /> Talaba Qo'shish
				</button>
			</div>

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
								<div className='text-lg font-black text-slate-900 dark:text-white'>
									{s.value}
								</div>
								<div className='text-[11px] text-slate-400'>{s.label}</div>
							</div>
						</div>
					)
				})}
			</div>

			<div className='flex items-center gap-3 flex-wrap'>
				<div className='relative flex-1 max-w-xs'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder="Ism yoki kurs bo'yicha..."
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

			<div className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-slate-100 dark:border-slate-800'>
								{[
									'#',
									'Talaba',
									'Kurs',
									'Telefon',
									'Email',
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
							{filtered.map((s, idx) => {
								const st = statusMap[s.status as keyof typeof statusMap]
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
												<span className='text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap'>
													{s.name}
												</span>
											</div>
										</td>
										<td className='px-4 py-3'>
											<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
												{s.course}
											</span>
										</td>
										<td className='px-4 py-3'>
											<span className='text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap'>
												{s.phone}
											</span>
										</td>
										<td className='px-4 py-3'>
											<span className='text-[11px] text-slate-500 dark:text-slate-400'>
												{s.email}
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
											<div className='relative'>
												<button
													onClick={() => setMenu(menu === s.id ? null : s.id)}
													className='w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
												>
													<MoreHorizontal className='w-4 h-4' />
												</button>
												{menu === s.id && (
													<div className='absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-10 py-1'>
														<button
															onClick={() => {
																setViewItem(s)
																setMenu(null)
															}}
															className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
														>
															<Eye className='w-3.5 h-3.5' />
															Ko'rish
														</button>
														<button
															onClick={() => {
																setEditItem(s)
																setMenu(null)
															}}
															className='w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
														>
															<Edit2 className='w-3.5 h-3.5' />
															Tahrirlash
														</button>
														<button
															onClick={() => {
																setDeleteItem(s)
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
								)
							})}
						</tbody>
					</table>
				</div>
				<div className='px-4 py-3 border-t border-slate-100 dark:border-slate-800'>
					<p className='text-[11px] text-slate-400'>
						{filtered.length} ta natija
					</p>
				</div>
			</div>
		</div>
	)
}
