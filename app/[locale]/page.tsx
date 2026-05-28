'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
	ArrowRight,
	Award,
	BookOpen,
	Brain,
	CheckCircle2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Code,
	Database,
	GraduationCap,
	Minus,
	Play,
	Plus,
	Shield,
	Star,
	TrendingUp,
	Users,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useEffect, useRef, useState } from 'react'

// ─── Supabase ──────────────────────────────────────────────────────────────
import { supabase } from '@/lib/supabase'

// ─── Types ─────────────────────────────────────────────────────────────────
type CourseDB = {
	id: number
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
}

type MentorDB = {
	id: number
	full_name: string
	specialty_en: string
	specialty_uz: string
	experience: string
	former_company: string
	total_students: number
	rating: number
	image_url: string
}

type ReviewDB = {
	id: number
	student_name: string
	course_id: number
	rating: number
	comment: string
	is_approved: boolean
	created_at: string
}

// ─── Static data ───────────────────────────────────────────────────────────
const stats = [
	{
		number: '5,000+',
		key: 'active_students',
		icon: Users,
	},
	{
		number: '120+',
		key: 'expert_teachers',
		icon: GraduationCap,
	},
	{
		number: '45+',
		key: 'premium_courses',
		icon: BookOpen,
	},
	{
		number: '98%',
		key: 'job_placement',
		icon: TrendingUp,
	},
]

const whyChoose = [
	{
		icon: Code,
		key: '1',
	},
	{
		icon: Users,
		key: '2',
	},
	{
		icon: Award,
		key: '3',
	},
	{
		icon: Brain,
		key: '4',
	},
	{
		icon: Shield,
		key: '5',
	},
	{
		icon: Database,
		key: '6',
	},
]

const faqs = [
	{
		key: '1',
	},
	{
		key: '2',
	},
	{
		key: '3',
	},
	{
		key: '4',
	},
	{
		key: '5',
	},
]

const badgeColors: Record<string, string> = {
	HOT: 'bg-red-500',
	NEW: 'bg-blue-500',
	POPULAR: 'bg-purple-500',
	TRENDING: 'bg-orange-500',
	BESTSELLER: 'bg-emerald-500',
}

// Avatar rengi (student_name dan)
const avatarColors = [
	'from-blue-500 to-indigo-600',
	'from-pink-500 to-rose-600',
	'from-emerald-500 to-teal-600',
	'from-violet-500 to-purple-600',
	'from-cyan-500 to-blue-600',
	'from-amber-500 to-orange-600',
]

export default function Home() {
	const isUzbek = useLocale() === 'uz'
	const t = useTranslations('landing')
	const [activeTestimonial, setActiveTestimonial] = useState(0)
	const [openFaq, setOpenFaq] = useState<number | null>(null)

	// Supabase data
	const [courses, setCourses] = useState<CourseDB[]>([])
	const [mentors, setMentors] = useState<MentorDB[]>([])
	const [reviews, setReviews] = useState<ReviewDB[]>([])

	// Instructor carousel
	const trackRef = useRef<HTMLDivElement>(null)
	const posRef = useRef(0)
	const isPausedRef = useRef(false)
	const CARD_W = 300
	const GAP = 24
	const STEP = CARD_W + GAP
	const TOTAL = mentors.length
	const [activeInstructor, setActiveInstructor] = useState(0)

	// Reviews auto timer
	const reviewTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

	// ── Fetch ──
	useEffect(() => {
		supabase
			.from('courses')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(3)
			.then(({ data }) => setCourses(data || []))

		supabase
			.from('mentors')
			.select(
				'id, full_name, specialty_en, specialty_uz, experience, former_company, total_students, rating, image_url',
			)
			.order('created_at', { ascending: false })
			.then(({ data }) => setMentors(data || []))

		supabase
			.from('reviews')
			.select('*')
			.eq('is_approved', true)
			.order('created_at', { ascending: false })
			.then(({ data }) => setReviews(data || []))
	}, [])

	// ── Reviews auto-scroll ──
	useEffect(() => {
		if (reviews.length === 0) return
		reviewTimerRef.current = setInterval(() => {
			setActiveTestimonial(p => (p + 1) % reviews.length)
		}, 5000)
		return () => {
			if (reviewTimerRef.current) clearInterval(reviewTimerRef.current)
		}
	}, [reviews.length])

	const goReview = (idx: number) => {
		setActiveTestimonial(idx)
		if (reviewTimerRef.current) clearInterval(reviewTimerRef.current)
		if (reviews.length > 0) {
			reviewTimerRef.current = setInterval(
				() => setActiveTestimonial(p => (p + 1) % reviews.length),
				5000,
			)
		}
	}

	// ── Instructor carousel ──
	useEffect(() => {
		const speed = 0.5
		const totalWidth = TOTAL * STEP
		let raf: number
		const animate = () => {
			if (!isPausedRef.current) {
				posRef.current += speed
				if (posRef.current >= totalWidth) posRef.current -= totalWidth
				if (trackRef.current)
					trackRef.current.style.transform = `translateX(-${posRef.current}px)`
				setActiveInstructor(Math.round(posRef.current / STEP) % TOTAL)
			}
			raf = requestAnimationFrame(animate)
		}
		raf = requestAnimationFrame(animate)
		return () => cancelAnimationFrame(raf)
	}, [TOTAL, STEP])

	const scrollInstructor = (dir: number) => {
		posRef.current = Math.max(0, posRef.current + dir * STEP)
	}

	// Helper: avatar initials
	const getInitials = (name: string) =>
		name
			.split(' ')
			.map(w => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase()

	return (
		<>
			<Header />
			<main className='flex-1 overflow-x-hidden'>
				{/* ══ HERO — dizayn o'ZGARMAYDI, faqat kurs ma'lumotlari Supabase dan ══ */}
				<section className='relative min-h-[92vh] flex items-center bg-white dark:bg-slate-950 overflow-hidden'>
					<div
						className='absolute inset-0 opacity-[0.04] dark:opacity-[0.06]'
						style={{
							backgroundImage:
								'linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)',
							backgroundSize: '60px 60px',
						}}
					/>
					<div className='absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none' />
					<div className='absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none' />

					<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full'>
						<div className='grid lg:grid-cols-2 gap-16 items-center'>
							{/* Left */}
							<div>
								<div className='inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 tracking-widest uppercase'>
									<span className='w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse' />
									{t('hero_badge')}
								</div>
								<h1 className='text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.05] tracking-tight'>
									{t('hero_heading_1')}
									<br />
									<span className='relative'>
										<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500'>
											{t('hero_heading_2')}
										</span>
									</span>
									<br />
									{t('hero_heading_3')}
								</h1>
								<p className='text-slate-600 dark:text-slate-400 text-lg mb-4 leading-relaxed max-w-lg'>
									{t('hero_sub')}
								</p>
								<p className='text-slate-400 dark:text-slate-500 text-base mb-10 leading-relaxed max-w-lg font-light italic'>
									{t('hero_sub')}
								</p>
								<div className='flex flex-col sm:flex-row gap-4 mb-12'>
									<Link href='/courses'>
										<Button className='bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 font-bold text-base rounded-xl shadow-2xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40'>
											{t('hero_cta')}{' '}
											<ArrowRight className='w-4 h-4 ml-2' />
										</Button>
									</Link>
									<Button
										variant='ghost'
										className='text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 h-14 px-8 font-semibold text-base rounded-xl transition-all group'
									>
										<div className='w-9 h-9 rounded-full bg-blue-100 dark:bg-white/10 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-colors'>
											<Play className='w-3.5 h-3.5 fill-blue-600 dark:fill-white ml-0.5' />
										</div>
										{t('hero_demo')}
									</Button>
								</div>
								<div className='flex gap-8'>
									{[
										{ n: '5,000+', key: 'students' },
										{ n: '98%', key: 'job_placement' },
										{ n: '45+', key: 'courses' },
									].map(item => (
										<div key={item.n}>
											<div className='text-2xl font-black text-slate-900 dark:text-white'>
												{item.n}
											</div>
											<div className='text-xs text-slate-500 mt-0.5'>
												{t('hero_stat_' + item.key)}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Right — Supabase kurs ma'lumotlari bilan, lekin XUDDI shu dizayn */}
							<div className='hidden lg:block relative h-[520px]'>
								{/* Main card — 1-kurs */}
								<div className='absolute top-8 right-0 w-72 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl'>
									{courses[0]?.image_url ? (
										<img
											src={courses[0].image_url}
											alt=''
											className='w-full h-36 object-cover'
										/>
									) : (
										<img
											src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop'
											alt=''
											className='w-full h-36 object-cover'
										/>
									)}
									<div className='p-4'>
										{courses[0]?.badge ? (
											<span
												className={`text-xs font-bold text-white ${badgeColors[courses[0].badge] || 'bg-emerald-500'} px-2 py-0.5 rounded`}
											>
												{courses[0].badge}
											</span>
										) : (
											<span className='text-xs font-bold text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10 px-2 py-0.5 rounded'>
												BESTSELLER
											</span>
										)}
										<h3 className='text-slate-900 dark:text-white font-bold mt-2 text-sm'>
											{courses[0]
												? isUzbek
													? courses[0].title_uz || courses[0].title_en
													: courses[0].title_en
												: 'Full-Stack Web Development'}
										</h3>
										<div className='flex items-center justify-between mt-3'>
											<span className='text-blue-600 font-bold'>
												${courses[0]?.price || 499}
											</span>
											<div className='flex items-center gap-1'>
												<Star className='w-3.5 h-3.5 fill-yellow-400 text-yellow-400' />
												<span className='text-slate-700 dark:text-white text-xs font-semibold'>
													{courses[0]?.rating || 4.9}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Floating badge 1 */}
								<div
									className='absolute top-0 left-8 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce'
									style={{ animationDuration: '3s' }}
								>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center'>
											<Users className='w-5 h-5 text-blue-600 dark:text-blue-400' />
										</div>
										<div>
											<div className='text-slate-900 dark:text-white font-bold text-sm'>
												{t('hero_teachers_badge')}
											</div>
											<div className='text-slate-500 text-xs'>
												{t('hero_teachers_badge')}
											</div>
										</div>
									</div>
								</div>

								{/* Floating badge 2 */}
								<div
									className='absolute bottom-24 left-0 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 animate-bounce'
									style={{ animationDuration: '4s', animationDelay: '1s' }}
								>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center'>
											<CheckCircle2 className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
										</div>
										<div>
											<div className='text-slate-900 dark:text-white font-bold text-sm'>
												{t('hero_certified_badge')}
											</div>
											<div className='text-slate-500 text-xs'>
												{t('hero_certified_badge')}
											</div>
										</div>
									</div>
								</div>

								{/* Floating badge 3 */}
								<div className='absolute bottom-4 right-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 shadow-2xl'>
									<div className='text-white text-center'>
										<div className='text-3xl font-black'>98%</div>
										<div className='text-blue-200 text-xs mt-0.5'>
											{t('hero_stat_job_placement')}
										</div>
									</div>
								</div>

								{/* 2-kurs (orqa karta) */}
								<div className='absolute top-44 left-12 w-64 bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl opacity-50'>
									{courses[1]?.image_url ? (
										<img
											src={courses[1].image_url}
											alt=''
											className='w-full h-28 object-cover'
										/>
									) : (
										<img
											src='https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=160&fit=crop'
											alt=''
											className='w-full h-28 object-cover'
										/>
									)}
									<div className='p-3'>
										<h3 className='text-slate-900 dark:text-white font-semibold text-xs'>
											{courses[1]
												? isUzbek
													? courses[1].title_uz || courses[1].title_en
													: courses[1].title_en
												: 'Advanced UI/UX Design'}
										</h3>
										<div className='text-blue-600 font-bold text-sm mt-1'>
											${courses[1]?.price || 299}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-600 animate-bounce'>
						<ChevronDown className='w-6 h-6' />
					</div>
				</section>

				{/* ══ STATS ══ */}
				<section className='py-16 bg-white dark:bg-slate-950'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
							{stats.map((stat, idx) => {
								const Icon = stat.icon
								return (
									<div
										key={idx}
										className='group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
									>
										<div className='w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors'>
											<Icon className='w-5 h-5 text-blue-600' />
										</div>
										<div className='text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1'>
											{stat.number}
										</div>
										<p className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
											{t('stats_' + stat.key)}
										</p>
										<p className='text-xs text-slate-400 dark:text-slate-600 italic mt-0.5'>
											{t('stats_' + stat.key)}
										</p>
									</div>
								)
							})}
						</div>
					</div>
				</section>

				{/* ══ FEATURED COURSES — Supabase dan 3 ta ══ */}
				<section className='py-20 bg-slate-50 dark:bg-slate-900'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4'>
							<div>
								<p className='text-blue-600 text-sm font-bold tracking-widest uppercase mb-2'>
									{t('featured_label')}
								</p>
								<h2 className='text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight'>
									{t('featured_heading')}
									<br />
									<span className='text-slate-400 dark:text-slate-600 font-light text-2xl'>
										{t('featured_heading')}
									</span>
								</h2>
							</div>
							<Link
								href='/courses'
								className='flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all group'
							>
								{t('featured_view_all')}
								<ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
							</Link>
						</div>

						<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
							{(courses.length > 0 ? courses : [null, null, null]).map(
								(course, idx) => (
									<div
										key={idx}
										className='group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer'
										style={{ animationDelay: `${idx * 100}ms` }}
									>
										<div className='relative h-48 overflow-hidden'>
											{course?.image_url ? (
												<img
													src={course.image_url}
													alt={course.title_en}
													className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
												/>
											) : (
												<div className='w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 animate-pulse' />
											)}
											<div className='absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent' />
											{course?.badge && (
												<span
													className={`absolute top-3 left-3 ${badgeColors[course.badge] || 'bg-blue-500'} text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider`}
												>
													{course.badge}
												</span>
											)}
											{course && (
												<div className='absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1'>
													<Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
													<span className='text-xs font-bold text-slate-800 dark:text-white'>
														{course.rating}
													</span>
												</div>
											)}
										</div>

										<div className='p-5'>
											{course ? (
												<>
													<h3 className='font-bold text-slate-900 dark:text-white mb-0.5 leading-snug'>
														{isUzbek
															? course.title_uz || course.title_en
															: course.title_en}
													</h3>
													<p className='text-slate-400 text-xs mb-4 italic'>
														{isUzbek
															? course.title_en
															: course.title_uz || course.title_en}
													</p>
													<div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4'>
														{course.duration && (
															<span className='flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg'>
																<BookOpen className='w-3 h-3' />{' '}
																{course.duration}
															</span>
														)}
														{course.level && (
															<span className='flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg'>
																<TrendingUp className='w-3 h-3' />{' '}
																{course.level}
															</span>
														)}
														<span className='flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg'>
															<Users className='w-3 h-3' />{' '}
															{course.total_students}
														</span>
													</div>
													<div className='flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700'>
														<Link
															href='/courses'
															className='flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-500 transition-colors group/link'
														>
															{t('course_card_view')}
															<ArrowRight className='w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform' />
														</Link>
														<span className='font-black text-slate-900 dark:text-white text-lg'>
															${course.price}
														</span>
													</div>
												</>
											) : (
												<div className='space-y-2 animate-pulse'>
													<div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4' />
													<div className='h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2' />
												</div>
											)}
										</div>
									</div>
								),
							)}
						</div>

						<div className='text-center mt-10'>
							<Link href='/courses'>
								<Button className='bg-blue-600 hover:bg-blue-500 text-white h-12 px-8 font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105'>
									{t('featured_view_all')}{' '}
									<ArrowRight className='w-4 h-4 ml-2' />
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* ══ WHY CHOOSE ══ */}
				<section className='py-20 bg-white dark:bg-slate-950'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center mb-14'>
							<p className='text-blue-600 text-sm font-bold tracking-widest uppercase mb-3'>
								{t('why_us_label')}
							</p>
							<h2 className='text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3'>
								{t('why_us_heading')}
							</h2>
							<p className='text-slate-400 text-base italic'>
								{t('why_us_heading')}
							</p>
						</div>
						<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{whyChoose.map((item, idx) => {
								const Icon = item.icon
								return (
									<div
										key={idx}
										className='group relative bg-slate-50 dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden'
									>
										<div className='absolute top-4 right-5 text-7xl font-black text-slate-100 dark:text-slate-800 select-none leading-none'>
											{String(idx + 1).padStart(2, '0')}
										</div>
										<div className='w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30'>
											<Icon className='w-5 h-5 text-white' />
										</div>
										<h3 className='font-bold text-slate-900 dark:text-white mb-1 text-base'>
											{t('why_feature_' + item.key + '_title')}
										</h3>
										<p className='text-blue-600 text-xs font-medium mb-3 italic'>
											{t('why_feature_' + item.key + '_title')}
										</p>
										<p className='text-slate-500 dark:text-slate-400 text-sm leading-relaxed'>
											{t('why_feature_' + item.key + '_desc')}
										</p>
									</div>
								)
							})}
						</div>
					</div>
				</section>

				{/* ══ INSTRUCTORS CAROUSEL ══ */}
				<section className='py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12'>
						<div className='flex items-end justify-between'>
							<div>
								<p className='text-blue-600 text-sm font-bold tracking-widest uppercase mb-3'>
									{t('team_label')}
								</p>
								<h2 className='text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1'>
									{t('team_heading')}
								</h2>
								<p className='text-slate-400 text-base italic'>
									{t('team_heading')}
								</p>
							</div>
							<div className='flex gap-2'>
								<button
									onClick={() => scrollInstructor(-1)}
									className='w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm'
								>
									<ChevronLeft className='w-5 h-5' />
								</button>
								<button
									onClick={() => scrollInstructor(1)}
									className='w-11 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm'
								>
									<ChevronRight className='w-5 h-5' />
								</button>
							</div>
						</div>
					</div>

					<div className='relative'>
						<div className='absolute left-0 top-0 bottom-0 w-28 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent pointer-events-none' />
						<div className='absolute right-0 top-0 bottom-0 w-28 z-10 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent pointer-events-none' />
						<div
							className='overflow-hidden'
							onMouseEnter={() => {
								isPausedRef.current = true
							}}
							onMouseLeave={() => {
								isPausedRef.current = false
							}}
						>
							<div
								ref={trackRef}
								className='flex will-change-transform'
								style={{
									gap: `${GAP}px`,
									width: `${Math.max(TOTAL, 1) * 2 * STEP + GAP}px`,
								}}
							>
								{mentors.length === 0
									? Array.from({ length: 6 }).map((_, idx) => (
											<div
												key={idx}
												className='shrink-0 animate-pulse'
												style={{ width: `${CARD_W}px` }}
											>
												<div className='bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700'>
													<div className='h-60 bg-slate-200 dark:bg-slate-700' />
													<div className='p-5 space-y-2'>
														<div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4' />
														<div className='h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2' />
													</div>
												</div>
											</div>
										))
									: [...mentors, ...mentors].map((inst, idx) => (
											<div
												key={idx}
												className='shrink-0 group cursor-pointer'
												style={{ width: `${CARD_W}px` }}
											>
												<div className='bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 shadow-sm'>
													<div className='relative h-60 overflow-hidden bg-slate-200'>
														{inst.image_url ? (
															<img
																src={inst.image_url}
																alt={inst.full_name}
																className='w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500'
															/>
														) : (
															<div className='w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center'>
																<span className='text-white text-4xl font-black'>
																	{getInitials(inst.full_name)}
																</span>
															</div>
														)}
														<div className='absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
														<div className='absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 shadow-sm'>
															<Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
															<span className='text-xs font-bold text-slate-800 dark:text-white'>
																{inst.rating}
															</span>
														</div>
													</div>
													<div className='p-5'>
														<h3 className='font-bold text-slate-900 dark:text-white mb-0.5'>
															{inst.full_name}
														</h3>
														<p className='text-blue-600 text-xs font-semibold mb-0.5'>
															{isUzbek ? inst.specialty_uz : inst.specialty_en}
														</p>
														<p className='text-slate-400 text-xs italic mb-4'>
															{inst.former_company}
														</p>
														<div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700'>
															<div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400'>
																<span className='flex items-center gap-1'>
																	<Users className='w-3.5 h-3.5' />{' '}
																	{inst.total_students}
																</span>
																<span className='flex items-center gap-1'>
																	<TrendingUp className='w-3.5 h-3.5' />{' '}
																	{inst.experience}
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
							</div>
						</div>
					</div>

					<div className='flex justify-center gap-2 mt-8'>
						{mentors.map((_, idx) => (
							<button
								key={idx}
								onClick={() => {
									posRef.current = idx * STEP
								}}
								className={`rounded-full transition-all duration-300 ${activeInstructor === idx ? 'w-7 h-2.5 bg-blue-600' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-blue-400'}`}
							/>
						))}
					</div>
				</section>

				{/* ══ TESTIMONIALS — dizayn O'ZGARMAYDI, Supabase dan + student cardlari animatsiya ══ */}
				<section className='py-20 bg-white dark:bg-slate-950 relative overflow-hidden'>
					<div
						className='absolute inset-0 opacity-[0.03] dark:opacity-5'
						style={{
							backgroundImage:
								'radial-gradient(circle, #93c5fd 1px, transparent 1px)',
							backgroundSize: '40px 40px',
						}}
					/>

					<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center mb-14'>
							<p className='text-blue-600 text-sm font-bold tracking-widest uppercase mb-3'>
								{t('testimonials_label')}
							</p>
							<h2 className='text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2'>
								{t('testimonials_heading')}
							</h2>
							<p className='text-slate-400 italic'>
								{t('testimonials_heading')}
							</p>
						</div>

						{reviews.length === 0 ? (
							/* Skeleton */
							<div className='max-w-4xl mx-auto'>
								<div className='bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-10 md:p-14 animate-pulse'>
									<div className='flex justify-center gap-1 mb-6'>
										{Array.from({ length: 5 }).map((_, i) => (
											<div
												key={i}
												className='w-5 h-5 rounded bg-slate-200 dark:bg-slate-700'
											/>
										))}
									</div>
									<div className='space-y-3 mb-10'>
										<div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto' />
										<div className='h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto' />
									</div>
									<div className='flex items-center justify-center gap-4'>
										<div className='w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-700' />
										<div className='space-y-2'>
											<div className='h-4 bg-slate-200 dark:bg-slate-700 rounded w-32' />
											<div className='h-3 bg-slate-100 dark:bg-slate-800 rounded w-24' />
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='max-w-4xl mx-auto'>
								{/* Katta aktiv sharh — XUDDI shu dizayn */}
								<div className='relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-10 md:p-14 mb-8 overflow-hidden'>
									<div className='text-8xl text-blue-400/20 font-serif leading-none absolute top-6 left-10 select-none'>
										"
									</div>

									<div className='flex justify-center gap-1 mb-6'>
										{Array.from({
											length: reviews[activeTestimonial]?.rating || 5,
										}).map((_, i) => (
											<Star
												key={i}
												className='w-5 h-5 fill-yellow-400 text-yellow-400'
											/>
										))}
									</div>

									<p className='text-slate-900 dark:text-white text-xl md:text-2xl text-center leading-relaxed font-medium mb-10 transition-all duration-500'>
										"{reviews[activeTestimonial]?.comment}"
									</p>

									<div className='flex items-center justify-center gap-4'>
										{/* Avatar — Supabase da rasm yo'q, shuning uchun initials */}
										<div
											className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarColors[activeTestimonial % avatarColors.length]} flex items-center justify-center border-2 border-blue-200 dark:border-blue-500/30 shrink-0`}
										>
											<span className='text-white font-black text-base'>
												{getInitials(
													reviews[activeTestimonial]?.student_name || 'AJ',
												)}
											</span>
										</div>
										<div>
											<p className='text-slate-900 dark:text-white font-bold'>
												{reviews[activeTestimonial]?.student_name}
											</p>
											<p className='text-slate-500 dark:text-slate-400 text-sm'>
												{new Date(
													reviews[activeTestimonial]?.created_at || '',
												).toLocaleDateString('uz-UZ', {
													day: 'numeric',
													month: 'long',
													year: 'numeric',
												})}
											</p>
										</div>
									</div>

									{/* Progress bar animatsiya */}
									<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700'>
										<div
											key={activeTestimonial}
											className='h-full bg-blue-600 rounded-full'
											style={{ animation: 'reviewProgress 5s linear forwards' }}
										/>
									</div>
								</div>

								{/* Pastda kichik student cardlari — animatsiya bilan, ko'payganda ham chiroyli */}
								<div className='flex justify-center gap-3 flex-wrap'>
									{reviews.map((review, idx) => (
										<button
											key={review.id}
											onClick={() => goReview(idx)}
											className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
												activeTestimonial === idx
													? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-md shadow-blue-500/10 scale-105'
													: 'border-slate-200 dark:border-white/10 text-slate-400 hover:border-blue-300 dark:hover:border-blue-500/30 hover:scale-102'
											}`}
										>
											{/* Mini avatar */}
											<div
												className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center shrink-0`}
											>
												<span className='text-white text-[10px] font-black'>
													{getInitials(review.student_name)}
												</span>
											</div>
											<div className='text-left hidden sm:block'>
												<p
													className={`text-xs font-bold leading-none ${activeTestimonial === idx ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
												>
													{review.student_name.split(' ')[0]}
												</p>
												<div className='flex items-center gap-0.5 mt-0.5'>
													{Array.from({ length: review.rating }).map((_, i) => (
														<Star
															key={i}
															className='w-2.5 h-2.5 fill-amber-400 text-amber-400'
														/>
													))}
												</div>
											</div>
										</button>
									))}
								</div>
							</div>
						)}
					</div>

					<style jsx>{`
						@keyframes reviewProgress {
							from {
								width: 0%;
							}
							to {
								width: 100%;
							}
						}
					`}</style>
				</section>

				{/* ══ FAQ ══ */}
				<section className='py-20 bg-white dark:bg-slate-950'>
					<div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='text-center mb-14'>
							<p className='text-blue-600 text-sm font-bold tracking-widest uppercase mb-3'>
								{t('faq_label')}
							</p>
							<h2 className='text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2'>
								{t('faq_heading')}
							</h2>
							<p className='text-slate-400 italic'>
								{t('faq_heading')}
							</p>
						</div>
						<div className='space-y-3'>
							{faqs.map((faq, idx) => (
								<div
									key={idx}
									className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === idx ? 'border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
								>
									<button
										onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
										className='w-full flex items-center justify-between p-6 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
									>
										<div className='pr-4'>
											<p className='font-bold text-slate-900 dark:text-white text-sm'>
												{t('faq_' + faq.key + '_q')}
											</p>
											<p className='text-slate-400 text-xs italic mt-0.5'>
												{t('faq_' + faq.key + '_q')}
											</p>
										</div>
										<div
											className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${openFaq === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
										>
											{openFaq === idx ? (
												<Minus className='w-4 h-4' />
											) : (
												<Plus className='w-4 h-4' />
											)}
										</div>
									</button>
									{openFaq === idx && (
										<div className='px-6 pb-6 bg-white dark:bg-slate-900'>
											<p className='text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-2'>
												{t('faq_' + faq.key + '_a')}
											</p>
											<p className='text-slate-400 text-xs italic leading-relaxed'>
												{t('faq_' + faq.key + '_a')}
											</p>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ══ CTA ══ */}
				<section className='py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden'>
					<div
						className='absolute inset-0 opacity-10'
						style={{
							backgroundImage:
								'linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%)',
							backgroundSize: '20px 20px',
							backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
						}}
					/>
					<div className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
						<div className='inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase'>
							<span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse' />
							{t('cta_badge')}
						</div>
						<h2 className='text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight'>
							{t('cta_heading')}
						</h2>
						<p className='text-blue-100 text-lg mb-2 max-w-xl mx-auto'>
							{t('cta_sub')}
						</p>
						<p className='text-blue-200/70 text-base italic mb-12 max-w-xl mx-auto'>
							{t('cta_sub')}
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
							<Button className='bg-white text-blue-700 hover:bg-blue-50 h-14 px-10 font-black text-base rounded-xl shadow-2xl shadow-blue-900/30 transition-all hover:scale-105'>
								{t('cta_btn_1')}
							</Button>
							<Button className='bg-white/10 hover:bg-white/20 text-white border border-white/20 h-14 px-10 font-bold text-base rounded-xl backdrop-blur-sm transition-all'>
								{t('cta_btn_2')}
							</Button>
						</div>
						<p className='text-blue-200/60 text-sm'>
							{t('cta_disclaimer')}
						</p>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}
