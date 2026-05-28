'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useTranslations, useLocale } from 'next-intl'
import {
	ArrowRight,
	Award,
	BookOpen,
	CheckCircle2,
	Clock,
	GraduationCap,
	Loader2,
	MessageCircle,
	Send,
	Users,
} from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const levels = [
	{
		code: 'A1',
		name: 'Beginner',
		nameUz: "Boshlang'ich",
		color: 'emerald',
		duration: '2 oy',
		lessons: 24,
		topics: [
			'Alfabit va talaffuz',
			'Salomlashish',
			'Raqamlar va ranglar',
			'Kundalik jumlalar',
			"Oila va do'stlar",
		],
	},
	{
		code: 'A2',
		name: 'Elementary',
		nameUz: 'Elementar',
		color: 'teal',
		duration: '2 oy',
		lessons: 28,
		topics: [
			'Hozirgi zamon',
			"Do'konlar va bozor",
			'Sayohat va transport',
			'Oziq-ovqat',
			'Kichik dialoglar',
		],
	},
	{
		code: 'B1',
		name: 'Intermediate',
		nameUz: "O'rta daraja",
		color: 'blue',
		duration: '3 oy',
		lessons: 36,
		topics: [
			"O'tgan va kelajak zamon",
			'Ish va martaba',
			'Yangiliklar',
			'Email yozish',
			'Taqdimot',
		],
	},
	{
		code: 'B2',
		name: 'Upper-Intermediate',
		nameUz: "Yuqori o'rta",
		color: 'indigo',
		duration: '3 oy',
		lessons: 40,
		topics: [
			'Murakkab grammatika',
			"Akademik o'qish",
			'Rasmiy yozishmalar',
			'Debatlar',
			'IELTS tayyorgarlik',
		],
	},
	{
		code: 'C1',
		name: 'Advanced',
		nameUz: 'Yuqori daraja',
		color: 'violet',
		duration: '3 oy',
		lessons: 44,
		topics: [
			'Murakkab idiomallar',
			'Akademik yozish',
			'Konferentsiyalar',
			'Professional muloqot',
			'IELTS 7.0+ maqsad',
		],
	},
]

const colorMap = {
	emerald: {
		bg: 'bg-emerald-50 dark:bg-emerald-600/20',
		border: 'border-emerald-200 dark:border-emerald-500/30',
		text: 'text-emerald-700 dark:text-emerald-400',
		badge: 'bg-emerald-600',
		btn: 'bg-emerald-600 hover:bg-emerald-500',
		activeBorder: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-600/15',
	},
	teal: {
		bg: 'bg-teal-50 dark:bg-teal-600/20',
		border: 'border-teal-200 dark:border-teal-500/30',
		text: 'text-teal-700 dark:text-teal-400',
		badge: 'bg-teal-600',
		btn: 'bg-teal-600 hover:bg-teal-500',
		activeBorder: 'border-teal-500 bg-teal-50 dark:bg-teal-600/15',
	},
	blue: {
		bg: 'bg-blue-50 dark:bg-blue-600/20',
		border: 'border-blue-200 dark:border-blue-500/30',
		text: 'text-blue-700 dark:text-blue-400',
		badge: 'bg-blue-600',
		btn: 'bg-blue-600 hover:bg-blue-500',
		activeBorder: 'border-blue-500 bg-blue-50 dark:bg-blue-600/15',
	},
	indigo: {
		bg: 'bg-indigo-50 dark:bg-indigo-600/20',
		border: 'border-indigo-200 dark:border-indigo-500/30',
		text: 'text-indigo-700 dark:text-indigo-400',
		badge: 'bg-indigo-600',
		btn: 'bg-indigo-600 hover:bg-indigo-500',
		activeBorder: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-600/15',
	},
	violet: {
		bg: 'bg-violet-50 dark:bg-violet-600/20',
		border: 'border-violet-200 dark:border-violet-500/30',
		text: 'text-violet-700 dark:text-violet-400',
		badge: 'bg-violet-600',
		btn: 'bg-violet-600 hover:bg-violet-500',
		activeBorder: 'border-violet-500 bg-violet-50 dark:bg-violet-600/15',
	},
} as const

const prices = [
	{
		name: 'Basic',
		nameUz: "Boshlang'ich",
		price: "800,000 so'm",
		features: ['1 daraja', 'Haftada 3 marta', 'Sertifikat', '1 oy support'],
		featuresUz: ['1 daraja', 'Haftada 3 marta', 'Sertifikat', '1 oy support'],
		highlight: false,
	},
	{
		name: 'Standard',
		nameUz: 'Standart',
		price: "1,500,000 so'm",
		features: [
			'2 daraja ketma-ket',
			'Mentor support',
			'Sertifikat',
			'Speaking club',
			'IELTS tayyorgarlik',
		],
		featuresUz: [
			'2 daraja ketma-ket',
			'Mentor support',
			'Sertifikat',
			'Speaking club',
			'IELTS tayyorgarlik',
		],
		highlight: true,
	},
	{
		name: 'Premium',
		nameUz: 'Premium',
		price: "2,500,000 so'm",
		features: [
			'A1 dan C1 gacha',
			'1:1 suhbat mashqlari',
			'IELTS tayyorgarlik',
			'CV inglizchasi',
			'Umrbod kirish',
		],
		featuresUz: [
			'A1 dan C1 gacha',
			'1:1 suhbat mashqlari',
			'IELTS tayyorgarlik',
			'CV inglizchasi',
			'Umrbod kirish',
		],
		highlight: false,
	},
]

const benefitKeys = ['benefit_1', 'benefit_2', 'benefit_3', 'benefit_4', 'benefit_5', 'benefit_6']

export default function EnglishCoursePage() {
	const t = useTranslations('course_english')
	const locale = useLocale()
	const [selectedLevel, setSelectedLevel] = useState('B1')
	const [form, setForm] = useState({
		name: '',
		phone: '',
		email: '',
		plan: 'Standard',
		level: 'B1',
	})
	const [submitting, setSubmitting] = useState(false)
	const [success, setSuccess] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSubmitting(true)

		const parts = form.name.trim().split(" ")
		const first_name = parts[0]
		const last_name = parts.length > 1 ? parts.slice(1).join(" ") : ""

		const { data: course } = await supabase
			.from("courses")
			.select("id, price")
			.eq("title_en", "English")
			.single()

		const { error: dbError } = await supabase.from("students").insert([
			{
				first_name,
				last_name,
				father_name: null,
				email: form.email.trim() || null,
				birth_date: null,
				phone: form.phone.trim(),
				parent_phone: null,
				certificate_id: null,
				pinfl: null,
				course_id: course?.id ?? null,
				payment_amount: course?.price ?? 0,
				status: "pending",
			},
		])

		if (dbError) {
			console.error("Supabase error:", dbError)
			setSubmitting(false)
			return
		}

		setSubmitting(false)
		setSuccess(true)
	}

	const activeLevel = levels.find(l => l.code === selectedLevel)!
	const c = colorMap[activeLevel.color as keyof typeof colorMap]

	return (
		<>
			<Header />
			<main className='flex-1'>
				<section className='relative min-h-[500px] flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950'>
					<div
						className='absolute inset-0 opacity-[0.04] dark:opacity-[0.07]'
						style={{
							backgroundImage:
								'linear-gradient(#10b981 1px,transparent 1px),linear-gradient(90deg,#10b981 1px,transparent 1px)',
							backgroundSize: '48px 48px',
						}}
					/>
					<div className='absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none' />
					<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full'>
						<div className='max-w-3xl'>
							<div className='flex flex-wrap items-center gap-2 mb-6'>
								<span className='bg-emerald-100 dark:bg-emerald-600/20 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase'>
									{t('badge_name')}
								</span>
								<span className='bg-emerald-100 dark:bg-emerald-600/20 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase'>
									{t('badge_duration')}
								</span>
								<span className='bg-blue-100 dark:bg-blue-600/20 border border-blue-300 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase'>
									{t('badge_level')}
								</span>
							</div>
							<h1 className='text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 leading-[1.02]'>
								{t('hero_title_1')}
								<br />
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500'>
									{t('hero_title_2')}
								</span>
							</h1>
							<p className='text-slate-700 dark:text-slate-300 text-lg mb-2 max-w-xl leading-relaxed'>
								{t('hero_desc')}
							</p>
							<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
								{[
									{ icon: Clock, value: '13 Oy', key: 'stat_full' },
									{ icon: BookOpen, value: '5', key: 'stat_levels' },
									{ icon: Users, value: '500+', key: 'stat_students' },
									{ icon: Award, value: 'IELTS', key: 'stat_cert' },
								].map(({ icon: Icon, value, key }) => (
									<div
										key={key}
										className='bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4'
									>
										<Icon className='w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-2' />
										<div className='text-xl font-black text-slate-900 dark:text-white'>
											{value}
										</div>
										<div className='text-xs text-slate-500 dark:text-slate-400'>
											{t(key)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className='py-12 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<p className='text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5'>
							{t('level_tabs_label')}
						</p>
						<div className='flex flex-wrap gap-3 mb-6'>
							{levels.map(level => {
								const lc = colorMap[level.color as keyof typeof colorMap]
								const isActive = selectedLevel === level.code
								return (
									<button
										key={level.code}
										onClick={() => {
											setSelectedLevel(level.code)
											setForm(f => ({ ...f, level: level.code }))
										}}
										className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all font-bold text-sm ${isActive ? `${lc.border} ${lc.bg} ${lc.text}` : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/4 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white'}`}
									>
										<span
											className={`text-xs font-black px-2 py-0.5 rounded-lg ${isActive ? lc.badge + ' text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}
										>
											{level.code}
										</span>
										<span>{locale === 'uz' ? level.nameUz : level.name}</span>
									</button>
								)
							})}
						</div>
						<div className={`${c.bg} border ${c.border} rounded-2xl p-5`}>
							<div className='flex items-center gap-3 mb-3'>
								<span
									className={`${c.badge} text-white text-xs font-black px-3 py-1 rounded-lg`}
								>
									{activeLevel.code}
								</span>
								<span className='font-black text-slate-900 dark:text-white'>
									{locale === 'uz' ? activeLevel.nameUz : activeLevel.name}
								</span>
								<span className='ml-auto text-xs text-slate-500 dark:text-slate-400'>
									{activeLevel.duration} · {activeLevel.lessons} dars
								</span>
							</div>
							<div className='flex flex-wrap gap-2'>
								{activeLevel.topics.map(t => (
									<span
										key={t}
										className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl bg-white/60 dark:bg-white/10 ${c.text}`}
									>
										<CheckCircle2 className='w-3 h-3' /> {t}
									</span>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className='py-20 bg-white dark:bg-slate-950'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='grid lg:grid-cols-2 gap-12 items-start'>
							<div>
								<p className='text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-widest uppercase mb-3'>
									{t('curriculum_label')}
								</p>
								<h2 className='text-3xl font-black text-slate-900 dark:text-white mb-8'>
									{t('curriculum_heading')}
								</h2>
								<div className='space-y-3'>
									{levels.map(level => {
										const lc = colorMap[level.color as keyof typeof colorMap]
										const isSel = selectedLevel === level.code
										return (
											<button
												key={level.code}
												onClick={() => {
													setSelectedLevel(level.code)
													setForm(f => ({ ...f, level: level.code }))
												}}
												className={`w-full text-left flex gap-4 p-4 rounded-2xl border transition-all ${isSel ? `${lc.border} ${lc.bg}` : 'border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/4 hover:border-slate-300 dark:hover:border-white/15'}`}
											>
												<div
													className={`w-14 h-14 ${lc.bg} border ${lc.border} rounded-xl flex items-center justify-center shrink-0`}
												>
													<span className={`text-lg font-black ${lc.text}`}>
														{level.code}
													</span>
												</div>
												<div className='flex-1 min-w-0'>
													<div className='flex items-center gap-2 mb-1'>
														<span className='font-black text-slate-900 dark:text-white text-sm'>
															{locale === 'uz' ? level.nameUz : level.name}
														</span>
													</div>
													<div className='flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2'>
														<span className='flex items-center gap-1'>
															<Clock className='w-3 h-3' /> {level.duration}
														</span>
														<span className='flex items-center gap-1'>
															<BookOpen className='w-3 h-3' /> {level.lessons}{' '}
															dars
														</span>
													</div>
													<div className='flex flex-wrap gap-1'>
														{level.topics.slice(0, 3).map(t => (
															<span
																key={t}
																className='text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md'
															>
																{t}
															</span>
														))}
													</div>
												</div>
												{isSel && (
													<CheckCircle2
														className={`w-5 h-5 ${lc.text} shrink-0 self-center`}
													/>
												)}
											</button>
										)
									})}
								</div>
								<div className='mt-5 p-5 bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-2xl'>
									<h3 className='font-black text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2'>
										<MessageCircle className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />{' '}
										{t('benefits_title')}
									</h3>
									<div className='grid grid-cols-2 gap-2'>
										{benefitKeys.map(key => (
											<div
												key={key}
												className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400'
											>
												<CheckCircle2 className='w-3 h-3 text-emerald-500 shrink-0' />{' '}
												{t(key)}
											</div>
										))}
									</div>
								</div>
							</div>

							<div className='space-y-6 lg:sticky lg:top-24'>
								<div>
									<p className='text-emerald-600 dark:text-emerald-400 text-xs font-black tracking-widest uppercase mb-3'>
										{t('pricing_label')}
									</p>
									<h2 className='text-2xl font-black text-slate-900 dark:text-white mb-5'>
										{t('pricing_heading')}
									</h2>
									<div className='space-y-3'>
										{prices.map(p => (
											<button
												key={p.name}
												onClick={() => setForm(f => ({ ...f, plan: p.name }))}
												className={`w-full text-left p-5 rounded-2xl border transition-all ${form.plan === p.name ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-600/15' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/4 hover:border-slate-300 dark:hover:border-white/20'}`}
											>
												<div className='flex items-center justify-between mb-2'>
													<div className='flex items-center gap-2'>
														<div
															className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.plan === p.name ? 'border-emerald-500 bg-emerald-500' : 'border-slate-400 dark:border-slate-500'}`}
														>
															{form.plan === p.name && (
																<div className='w-1.5 h-1.5 rounded-full bg-white' />
															)}
														</div>
														<span className='font-black text-slate-900 dark:text-white text-sm'>
															{locale === 'uz' ? p.nameUz : p.name}
														</span>
														{p.highlight && (
															<span className='bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md'>
																{t('pricing_popular')}
															</span>
														)}
													</div>
													<span className='text-sm font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap'>
														{p.price}
													</span>
												</div>
												<div className='flex flex-wrap gap-x-3 gap-y-1 pl-6'>
													{(locale === 'uz' ? p.featuresUz : p.features).map(f => (
														<span
															key={f}
															className='text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1'
														>
															<CheckCircle2 className='w-3 h-3 text-emerald-500 shrink-0' />{' '}
															{f}
														</span>
													))}
												</div>
											</button>
										))}
									</div>
								</div>
								<div className='bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6'>
									<h3 className='font-black text-slate-900 dark:text-white text-lg mb-3'>
										{t('form_heading')}
									</h3>
									<p className='text-slate-500 dark:text-slate-400 text-xs italic mb-5'>
										{t('form_selected', { level: form.level, plan: form.plan })}
									</p>
									{success ? (
										<div className='text-center py-6'>
											<CheckCircle2 className='w-12 h-12 text-emerald-500 mx-auto mb-3' />
											<p className='font-black text-slate-900 dark:text-white mb-1'>
												{t('form_success_title')}
											</p>
											<p className='text-slate-500 dark:text-slate-400 text-sm italic'>
												{t('form_success_msg')}
											</p>
										</div>
									) : (
										<form onSubmit={handleSubmit} className='space-y-3'>
											{[
												{
													key: 'name',
													labelKey: 'form_name_label',
													placeholderKey: 'form_name_placeholder',
													type: 'text',
													required: true,
												},
												{
													key: 'phone',
													labelKey: 'form_phone_label',
													placeholderKey: 'form_phone_placeholder',
													type: 'tel',
													required: true,
												},
												{
													key: 'email',
													labelKey: 'form_email_label',
													placeholderKey: 'form_email_placeholder',
													type: 'email',
													required: false,
												},
											].map(field => (
												<div key={field.key}>
													<label className='block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5'>
														{t(field.labelKey)}
													</label>
													<input
														type={field.type}
														required={field.required}
														placeholder={t(field.placeholderKey)}
														value={(form as any)[field.key]}
														onChange={e =>
															setForm(f => ({
																...f,
																[field.key]: e.target.value,
															}))
														}
														disabled={submitting}
														className='w-full h-11 px-4 text-sm bg-white dark:bg-white/8 border border-slate-200 dark:border-white/15 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50'
													/>
												</div>
											))}
											<button
												type='submit'
												disabled={submitting || !form.name || !form.phone}
												className={`w-full flex items-center justify-center gap-2 h-12 ${c.btn} disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/25`}
											>
												{submitting ? (
													<>
														<Loader2 className='w-4 h-4 animate-spin' />{' '}
														{t('form_submitting')}
													</>
												) : (
													<>
														<Send className='w-4 h-4' /> {t('form_submit')}{' '}
														<ArrowRight className='w-3.5 h-3.5' />
													</>
												)}
											</button>
										</form>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className='py-14 bg-gradient-to-r from-emerald-600 to-teal-600'>
					<div className='max-w-4xl mx-auto px-4 text-center'>
						<h2 className='text-3xl font-black text-white mb-2'>
							{t('cta_heading')}
						</h2>
						<p className='text-emerald-100 italic text-sm mb-8'>
							{t('cta_sub')}
						</p>
						<button
							onClick={() => window.scrollTo({ top: 9999, behavior: 'smooth' })}
							className='inline-flex items-center gap-2 bg-white text-emerald-700 font-black px-8 py-3.5 rounded-xl hover:scale-105 transition-all shadow-xl'
						>
							<GraduationCap className='w-4 h-4' /> {t('cta_btn')}
						</button>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}
