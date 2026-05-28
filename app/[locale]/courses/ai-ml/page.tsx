'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useTranslations, useLocale } from 'next-intl'
import {
	ArrowRight,
	BookOpen,
	CheckCircle2,
	Clock,
	GraduationCap,
	Loader2,
	Send,
	Star,
	Users,
} from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const curriculum = [
	{
		week: '1–3',
		topic: 'Math Foundations for AI',
		topicUz: 'AI uchun matematik asos',
		desc: 'Linear algebra, calculus, probability, statistics',
	},
	{
		week: '4–6',
		topic: 'Machine Learning Core',
		topicUz: "Mashinali o'qitish asoslari",
		desc: 'Supervised, unsupervised, reinforcement learning',
	},
	{
		week: '7–9',
		topic: 'Deep Learning & Neural Nets',
		topicUz: "Chuqur o'qitish va neyron tarmoqlar",
		desc: 'CNNs, RNNs, backpropagation, PyTorch',
	},
	{
		week: '10–12',
		topic: 'Natural Language Processing',
		topicUz: 'Tabiiy tilni qayta ishlash',
		desc: 'Transformers, BERT, GPT, text classification',
	},
	{
		week: '13–15',
		topic: 'Computer Vision',
		topicUz: "Kompyuter ko'rish",
		desc: 'Image classification, object detection, GANs',
	},
	{
		week: '16–18',
		topic: 'MLOps & Deployment',
		topicUz: 'MLOps va deployment',
		desc: 'Model serving, monitoring, Docker, cloud APIs',
	},
	{
		week: '19–20',
		topic: 'Capstone AI Project',
		topicUz: 'Yakuniy AI loyiha',
		desc: 'Build and deploy a production-ready AI application',
	},
]
const skills = [
	'Python',
	'PyTorch',
	'TensorFlow',
	'Scikit-learn',
	'OpenCV',
	'HuggingFace',
	'BERT',
	'LangChain',
	'Docker',
	'FastAPI',
	'NumPy',
	'MLflow',
]
const prices = [
	{
		name: 'Basic',
		nameUz: "Boshlang'ich",
		price: '$349',
		features: ['20 dars', "Online o'qish", 'Sertifikat', '2 oy support'],
		featuresUz: ["20 dars", "Online o'qish", 'Sertifikat', '2 oy support'],
		highlight: false,
	},
	{
		name: 'Standard',
		nameUz: 'Standart',
		price: '$599',
		features: [
			"40 dars (to'liq)",
			'Mentor support',
			'Sertifikat',
			'6 oy kirish',
			'AI portfolio loyiha',
		],
		featuresUz: [
			"40 dars (to'liq)",
			'Mentor support',
			'Sertifikat',
			'6 oy kirish',
			'AI portfolio loyiha',
		],
		highlight: true,
	},
	{
		name: 'Premium',
		nameUz: 'Premium',
		price: '$899',
		features: [
			'40 dars + bonus',
			'1:1 mentorlik',
			'CV tayyorlash',
			'Ish joylashtirishga yordam',
			'Umrbod kirish',
		],
		featuresUz: [
			'40 dars + bonus',
			'1:1 mentorlik',
			'CV tayyorlash',
			'Ish joylashtirishga yordam',
			'Umrbod kirish',
		],
		highlight: false,
	},
]

export default function AiMlPage() {
	const t = useTranslations('course_aiml')
	const locale = useLocale()
	const [form, setForm] = useState({
		name: '',
		phone: '',
		email: '',
		plan: 'Standard',
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
			.eq("title_en", "AI & Machine Learning")
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

	return (
		<>
			<Header />
			<main className='flex-1'>
				<section className='relative min-h-[500px] flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950'>
					<div
						className='absolute inset-0 opacity-[0.04] dark:opacity-[0.07]'
						style={{
							backgroundImage:
								'linear-gradient(#f59e0b 1px,transparent 1px),linear-gradient(90deg,#f59e0b 1px,transparent 1px)',
							backgroundSize: '48px 48px',
						}}
					/>
					<div className='absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none' />
					<div className='absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[100px] pointer-events-none' />
					<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full'>
						<div className='max-w-3xl'>
							<div className='flex flex-wrap items-center gap-2 mb-6'>
								<span className='bg-amber-100 dark:bg-amber-600/20 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase'>
									{t('badge_name')}
								</span>
								<span className='bg-amber-100 dark:bg-amber-600/20 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase'>
									{t('badge_duration')}
								</span>
								<span className='bg-red-100 dark:bg-red-600/20 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase'>
									{t('badge_level')}
								</span>
							</div>
							<h1 className='text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 leading-[1.02]'>
								{t('hero_title_1')}
								<br />
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500'>
									{t('hero_title_2')}
								</span>
							</h1>
							<p className='text-slate-700 dark:text-slate-300 text-lg mb-2 max-w-xl leading-relaxed'>
								{t('hero_desc')}
							</p>
							<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
								{[
									{ icon: Clock, value: '5 ' + t('stat_duration').toLowerCase(), key: 'stat_duration' },
									{ icon: BookOpen, value: '40', key: 'stat_lessons' },
									{ icon: Users, value: '654+', key: 'stat_students' },
									{ icon: Star, value: '4.9', key: 'stat_rating' },
								].map(({ icon: Icon, value, key }) => (
									<div
										key={key}
										className='bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4'
									>
										<Icon className='w-4 h-4 text-amber-600 dark:text-amber-400 mb-2' />
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

				<section className='py-10 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<p className='text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4'>
							{t('skills_heading')}
						</p>
						<div className='flex flex-wrap gap-2'>
							{skills.map(s => (
								<span
									key={s}
									className='flex items-center gap-1.5 text-sm font-semibold bg-amber-100 dark:bg-amber-600/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 px-3.5 py-1.5 rounded-xl'
								>
									<CheckCircle2 className='w-3 h-3' /> {s}
								</span>
							))}
						</div>
					</div>
				</section>

				<section className='py-20 bg-white dark:bg-slate-950'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='grid lg:grid-cols-2 gap-12 items-start'>
							<div>
								<p className='text-amber-600 dark:text-amber-400 text-xs font-black tracking-widest uppercase mb-3'>
									{t('curriculum_label')}
								</p>
								<h2 className='text-3xl font-black text-slate-900 dark:text-white mb-8'>
									{t('curriculum_heading')}
								</h2>
								<div className='space-y-3'>
									{curriculum.map((item, idx) => (
										<div
											key={idx}
											className='flex gap-4 p-4 bg-slate-50 dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-2xl hover:border-amber-300 dark:hover:border-amber-500/30 transition-colors'
										>
											<div className='w-12 h-12 bg-amber-100 dark:bg-amber-600/20 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-400 text-xs font-black'>
												{String(idx + 1).padStart(2, '0')}
											</div>
											<div>
												<div className='text-[10px] text-slate-400 font-bold mb-0.5'>
													WEEK {item.week}
												</div>
												<h3 className='font-black text-slate-900 dark:text-white text-sm mb-0.5'>
													{locale === 'uz' ? item.topicUz : item.topic}
												</h3>
												<p className='text-slate-500 dark:text-slate-400 text-xs'>
													{item.desc}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className='space-y-6 lg:sticky lg:top-24'>
								<div>
									<p className='text-amber-600 dark:text-amber-400 text-xs font-black tracking-widest uppercase mb-3'>
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
												className={`w-full text-left p-5 rounded-2xl border transition-all ${form.plan === p.name ? 'border-amber-500 bg-amber-50 dark:bg-amber-600/15' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/4 hover:border-slate-300 dark:hover:border-white/20'}`}
											>
												<div className='flex items-center justify-between mb-2'>
													<div className='flex items-center gap-2'>
														<div
															className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.plan === p.name ? 'border-amber-500 bg-amber-500' : 'border-slate-400 dark:border-slate-500'}`}
														>
															{form.plan === p.name && (
																<div className='w-1.5 h-1.5 rounded-full bg-white' />
															)}
														</div>
														<span className='font-black text-slate-900 dark:text-white text-sm'>
															{locale === 'uz' ? p.nameUz : p.name}
														</span>
														{p.highlight && (
															<span className='bg-amber-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md'>
																{t('pricing_popular')}
															</span>
														)}
													</div>
													<span className='text-lg font-black text-amber-600 dark:text-amber-400'>
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
										{t('form_plan_selected')}{' '}
										<span className='text-amber-600 dark:text-amber-400 font-bold'>
											{locale === 'uz'
												? (prices.find(p => p.name === form.plan)?.nameUz || form.plan)
												: form.plan}
										</span>
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
														className='w-full h-11 px-4 text-sm bg-white dark:bg-white/8 border border-slate-200 dark:border-white/15 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-50'
													/>
												</div>
											))}
											<button
												type='submit'
												disabled={submitting || !form.name || !form.phone}
												className='w-full flex items-center justify-center gap-2 h-12 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/25'
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

				<section className='py-14 bg-gradient-to-r from-amber-600 to-orange-600'>
					<div className='max-w-4xl mx-auto px-4 text-center'>
						<h2 className='text-3xl font-black text-white mb-2'>
							{t('cta_heading')}
						</h2>
						<p className='text-amber-100 italic text-sm mb-8'>
							{t('cta_sub')}
						</p>
						<button
							onClick={() => window.scrollTo({ top: 9999, behavior: 'smooth' })}
							className='inline-flex items-center gap-2 bg-white text-amber-700 font-black px-8 py-3.5 rounded-xl hover:scale-105 transition-all shadow-xl'
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
