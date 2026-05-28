'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useIsUzbek } from '@/components/language-context'
import { Button } from '@/components/ui/button'
import {
	Award,
	BriefcaseBusiness,
	CheckCircle2,
	Clock,
	GraduationCap,
	Mail,
	Star,
	Users,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Supabase ──────────────────────────────────────────────────────────────
import { supabase } from '@/lib/supabase'

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

// ─── Helpers ───────────────────────────────────────────────────────────────
function getInitials(name: string) {
	return (
		name
			?.split(' ')
			.map(w => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase() || '??'
	)
}

// ─── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
	return (
		<div
			className='relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse'
			style={{ aspectRatio: '3/4' }}
		>
			<div className='absolute bottom-0 left-0 right-0 p-4 space-y-2'>
				<div className='h-3 bg-slate-300 dark:bg-slate-700 rounded w-3/4' />
				<div className='h-2.5 bg-slate-300 dark:bg-slate-700 rounded w-1/2' />
			</div>
		</div>
	)
}

// ─── Modal ─────────────────────────────────────────────────────────────────
function TeacherModal({
	mentor,
	onClose,
}: {
	mentor: Mentor
	onClose: () => void
}) {
	const isUzbek = useIsUzbek()
	const stats = [
		{
			icon: Users,
			value: mentor.total_students?.toLocaleString() || '0',
			label: 'Talabalar',
			color: 'text-blue-600',
		},
		{
			icon: Clock,
			value: mentor.experience || '—',
			label: 'Tajriba',
			color: 'text-emerald-600',
		},
		{
			icon: Star,
			value: mentor.rating?.toString() || '5.0',
			label: 'Reyting',
			color: 'text-amber-500',
		},
	]

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row max-h-[92vh] sm:h-[85vh]'
				onClick={e => e.stopPropagation()}
			>
				{/* Close */}
				<button
					onClick={onClose}
					className='absolute top-3 right-3 z-20 w-9 h-9 rounded-xl bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-colors'
				>
					<X className='w-4 h-4' />
				</button>

				{/* ── PHOTO ── */}
				<div className='relative shrink-0 h-52 sm:h-auto sm:w-[45%]'>
					{mentor.image_url ? (
						<img
							src={mentor.image_url}
							alt={mentor.full_name}
							className='absolute inset-0 w-full h-full object-cover object-top'
						/>
					) : (
						<div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center'>
							<span className='text-white text-6xl font-black opacity-30'>
								{getInitials(mentor.full_name)}
							</span>
						</div>
					)}
					<div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent' />
					<div className='absolute bottom-0 left-0 right-0 p-5 sm:p-7'>
						<h2 className='text-2xl sm:text-3xl font-black text-white leading-tight'>
							{mentor.full_name}
						</h2>
						<p className='text-blue-300 text-sm font-semibold mt-0.5'>
							{isUzbek ? mentor.specialty_uz : mentor.specialty_en}
						</p>
						<p className='text-slate-400 text-xs mt-0.5 italic'>
							{isUzbek ? mentor.specialty_en : mentor.specialty_uz}
						</p>
					</div>
				</div>

				{/* ── RIGHT PANEL ── */}
				<div className='flex-1 overflow-y-auto p-5 sm:p-7 min-h-0'>
					{/* Stats */}
					<div className='grid grid-cols-3 gap-2.5 mb-5'>
						{stats.map(({ icon: Icon, value, label, color }) => (
							<div
								key={label}
								className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center'
							>
								<Icon className={`w-4 h-4 mx-auto mb-1.5 ${color}`} />
								<div className='font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-tight'>
									{value}
								</div>
								<div className='text-[10px] text-slate-400 mt-0.5'>{label}</div>
							</div>
						))}
					</div>

					{/* Former company */}
					{mentor.former_company && (
						<div className='flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800'>
							<BriefcaseBusiness className='w-4 h-4 text-slate-400 shrink-0' />
							<span className='text-sm text-slate-500 dark:text-slate-400 font-medium'>
								{mentor.former_company}
							</span>
						</div>
					)}

					{/* Bio */}
					{(mentor.about_en || mentor.about_uz) && (
						<div className='mb-5'>
							<h4 className='text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2.5 flex items-center gap-2'>
								<span className='w-3 h-0.5 bg-blue-600 rounded-full' /> About
							</h4>
							{mentor.about_en && (
								<p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2'>
									{isUzbek ? mentor.about_uz : mentor.about_en}
								</p>
							)}
							{mentor.about_uz && mentor.about_en && (
								<p className='text-xs text-slate-400 italic leading-relaxed'>
									{isUzbek ? mentor.about_en : mentor.about_uz}
								</p>
							)}
						</div>
					)}

					{/* Skills */}
					{mentor.skills?.length > 0 && (
						<div className='mb-5'>
							<h4 className='text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2'>
								<span className='w-3 h-0.5 bg-blue-600 rounded-full' /> Skills /
								Ko'nikmalar
							</h4>
							<div className='flex flex-wrap gap-2'>
								{mentor.skills.map(skill => (
									<span
										key={skill}
										className='flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl'
									>
										<CheckCircle2 className='w-3 h-3' /> {skill}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Contact info */}
					{(mentor.email || mentor.phone) && (
						<div className='mb-5 flex flex-wrap gap-2'>
							{mentor.email && (
								<a
									href={`mailto:${mentor.email}`}
									className='flex items-center gap-2 text-xs text-slate-500 hover:text-blue-600 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl transition-colors'
								>
									<Mail className='w-3.5 h-3.5' /> {mentor.email}
								</a>
							)}
						</div>
					)}

					{/* CTA */}
					<div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end'>
						<button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-blue-500/25'>
							<GraduationCap className='w-4 h-4' />
							Kursga yozilish
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

// ─── PAGE ──────────────────────────────────────────────────────────────────
export default function TeachersPage() {
	const [mentors, setMentors] = useState<Mentor[]>([])
	const [loading, setLoading] = useState(true)
	const [selected, setSelected] = useState<Mentor | null>(null)
	const isUzbek = useIsUzbek()

	useEffect(() => {
		supabase
			.from('mentors')
			.select('*')
			.order('created_at', { ascending: true })
			.then(({ data, error }) => {
				if (!error) setMentors(data || [])
				setLoading(false)
			})
	}, [])

	const totalStudents = mentors.reduce((a, m) => a + (m.total_students || 0), 0)

	return (
		<>
			<Header />
			{selected && (
				<TeacherModal mentor={selected} onClose={() => setSelected(null)} />
			)}

			<main className='flex-1'>
				{/* ── HERO ── */}
				<section className='py-16 md:py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
						<div className='inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest'>
							<span className='w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse' />
							{isUzbek ? "O'qituvchilar" : 'The Faculty'}
						</div>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-black mb-5 text-slate-900 dark:text-white leading-[1.05] tracking-tight'>
							{isUzbek ? (
								"Eng yaxshi mutaxassislardan o'rganing"
							) : (
								<>
									Learn from the{' '}
									<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500'>
										Best Minds
									</span>
									<br />
									in Modern Tech
								</>
							)}
						</h1>
						<p className='text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-3 leading-relaxed'>
							{isUzbek
								? "Bizning o'qituvchilarimiz talabalarni jahon darajasidagi muhandislarga aylantirishga bag'ishlangan tajribali mutaxassislar."
								: 'Our educators are industry veterans from global tech giants, dedicated to transforming students into world-class engineers.'}
						</p>
						<p className='text-slate-400 dark:text-slate-600 max-w-xl mx-auto mb-10 text-sm italic leading-relaxed'>
							{isUzbek
								? 'Our educators are industry veterans from global tech giants.'
								: "Bizning o'qituvchilarimiz dunyo yetakchi texnologiya kompaniyalaridan kelgan tajribali mutaxassislar."}
						</p>

						{/* Stats */}
						<div className='flex flex-wrap justify-center gap-3'>
							{[
								{
									icon: Users,
									label: `${mentors.length}+ Expert Mentors`,
									labelUz: `${mentors.length}+ Mutaxassis Mentor`,
								},
								{
									icon: Award,
									label: 'Industry Certified',
									labelUz: 'Sanoat Sertifikatlangan',
								},
								{
									icon: Clock,
									label: '10+ Years Avg. Exp',
									labelUz: "O'rtacha 10+ yil Tajriba",
								},
							].map(({ icon: Icon, label, labelUz }) => (
								<div
									key={label}
									className='flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-sm'
								>
									<Icon className='w-4 h-4 text-blue-600' />
									<div className='text-left'>
										<span className='text-sm font-bold text-slate-700 dark:text-slate-300 block'>
											{isUzbek ? labelUz : label}
										</span>
										<span className='text-xs text-slate-400 italic'>
											{isUzbek ? label : labelUz}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ── TEACHERS GRID ── */}
				<section className='py-16 bg-slate-50 dark:bg-slate-900'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3'>
							<div>
								<p className='text-blue-600 text-xs font-bold tracking-widest uppercase mb-1'>
									{isUzbek ? 'Jamoamiz' : 'Our Team'}
								</p>
								<h2 className='text-2xl md:text-3xl font-black text-slate-900 dark:text-white'>
									{isUzbek
										? "Tavsiya etilgan o'qituvchilar"
										: 'Featured Instructors'}
								</h2>
								<p className='text-sm text-slate-500 dark:text-slate-400 mt-1 italic'>
									{isUzbek
										? 'Maqsadlaringizga mos mentorlarni toping — Discover mentors who match your goals'
										: 'Mentorlaringizni tanlang — Discover mentors who match your goals'}
								</p>
							</div>
							<p className='text-xs text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl'>
								{isUzbek
									? "Batafsil ko'rish uchun kartani bosing"
									: 'Click on a card to view details'}
							</p>
						</div>

						{/* Grid */}
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10'>
							{loading
								? Array.from({ length: 8 }).map((_, i) => (
										<SkeletonCard key={i} />
									))
								: mentors.map(mentor => (
										<div
											key={mentor.id}
											onClick={() => setSelected(mentor)}
											className='group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5'
											style={{ aspectRatio: '3/4' }}
										>
											{/* Image or gradient fallback */}
											{mentor.image_url ? (
												<img
													src={mentor.image_url}
													alt={mentor.full_name}
													className='absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105'
												/>
											) : (
												<div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700'>
													<div className='absolute inset-0 flex items-center justify-center'>
														<span className='text-white text-5xl font-black opacity-20'>
															{getInitials(mentor.full_name)}
														</span>
													</div>
												</div>
											)}

											{/* Gradient overlay */}
											<div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent' />

											{/* Bottom info */}
											<div className='absolute bottom-0 left-0 right-0 p-4 z-10'>
												<h3 className='font-black text-white text-sm leading-tight mb-0.5'>
													{mentor.full_name}
												</h3>
												<p className='text-blue-300 text-xs font-semibold mb-2'>
													{isUzbek ? mentor.specialty_uz : mentor.specialty_en}
												</p>
												<div className='flex items-center justify-between'>
													<div className='flex items-center gap-1.5 text-xs text-slate-400'>
														<Users className='w-3 h-3' />
														<span>
															{mentor.total_students?.toLocaleString() || '0'}
														</span>
													</div>
													<span className='text-xs text-slate-400 italic'>
														{mentor.experience}
													</span>
												</div>

												{/* Hover reveal */}
												<div className='overflow-hidden max-h-0 group-hover:max-h-16 transition-all duration-500 ease-in-out'>
													<div className='pt-3 flex items-center justify-between'>
														<span className='text-[11px] text-slate-400 italic truncate max-w-[120px]'>
															{mentor.former_company}
														</span>
														<span className='text-[11px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-lg shrink-0'>
															View →
														</span>
													</div>
												</div>
											</div>
										</div>
									))}
						</div>

						{!loading && mentors.length === 0 && (
							<div className='text-center py-16 text-slate-400'>
								<GraduationCap className='w-12 h-12 mx-auto mb-3 opacity-30' />
								<p className='text-sm'>Hali mentor qo'shilmagan</p>
							</div>
						)}
					</div>
				</section>

				{/* ── TEACHING PHILOSOPHY ── */}
				<section className='py-16 bg-white dark:bg-slate-950'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center mb-12'>
							<p className='text-blue-600 text-xs font-bold tracking-widest uppercase mb-3'>
								Our Approach / Yondashuvimiz
							</p>
							<h2 className='text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2'>
								Our Teaching Philosophy
							</h2>
							<p className='text-slate-400 italic text-sm'>
								O'qitish falsafamiz
							</p>
						</div>
						<div className='grid md:grid-cols-3 gap-6'>
							{[
								{
									metric: '1:1',
									title: 'Personalized Mentorship',
									titleUz: 'Shaxsiy Mentorlik',
									desc: 'One-on-one guidance from industry experts tailored to your learning goals and pace.',
									descUz:
										"O'rganish maqsadlaringiz va sur'atingizga moslashtirilgan sanoat ekspertlaridan individual ko'rsatma.",
								},
								{
									metric: '100%',
									title: 'Project-Based Learning',
									titleUz: "Loyihaga Asoslangan Ta'lim",
									desc: 'Build real-world applications and portfolios that demonstrate your expertise to employers.',
									descUz:
										"Ish beruvchilarga o'z tajribangizni namoyish etadigan real ilova va portfoliolar yarating.",
								},
								{
									metric: '24/7',
									title: 'Community Support',
									titleUz: "Hamjamiyat Qo'llab-quvvatlash",
									desc: 'Access to our global alumni network and peer support community round the clock.',
									descUz:
										"Bizning global bitiruvchilar tarmog'i va tengdoshlar qo'llab-quvvatlash hamjamiyatiga kechayu kunduz kirish.",
								},
							].map((item, idx) => (
								<div
									key={idx}
									className='group bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 rounded-2xl p-7 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
								>
									<div className='w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform'>
										<span className='text-xl font-black text-white'>
											{item.metric}
										</span>
									</div>
									<h3 className='font-bold text-lg text-slate-900 dark:text-white mb-0.5'>
										{item.title}
									</h3>
									<p className='text-blue-600 text-xs italic font-medium mb-3'>
										{item.titleUz}
									</p>
									<p className='text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-1.5'>
										{item.desc}
									</p>
									<p className='text-slate-400 dark:text-slate-600 text-xs italic leading-relaxed'>
										{item.descUz}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ── CTA ── */}
				<section className='py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden'>
					<div
						className='absolute inset-0 opacity-10'
						style={{
							backgroundImage:
								'radial-gradient(circle, #fff 1px, transparent 1px)',
							backgroundSize: '30px 30px',
						}}
					/>
					<div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
						<h2 className='text-3xl md:text-5xl font-black text-white mb-4 leading-tight'>
							Are you a Technical Expert?
						</h2>
						<p className='text-blue-100 text-base italic mb-2'>
							Texnik mutaxassismisiz?
						</p>
						<p className='text-blue-200/80 mb-10 max-w-xl mx-auto text-sm leading-relaxed'>
							We're always looking for passionate industry veterans to join our
							elite faculty and help shape the next generation of global tech
							talent.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button className='bg-white hover:bg-blue-50 text-blue-700 font-black h-13 px-10 rounded-xl shadow-xl transition-all hover:scale-105'>
								Apply to Teach / O'qituvchi bo'l
							</Button>
							<Button
								variant='outline'
								className='border-white/30 text-white hover:bg-white/10 h-13 px-10 font-bold rounded-xl backdrop-blur-sm transition-all hover:border-white'
							>
								Refer a Colleague / Hamkasb tavsiya et
							</Button>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}
