'use client'

import { gameApi } from '@/lib/api'
import {
	ArrowLeft,
	Brain,
	CheckCircle2,
	ChevronRight,
	Clock,
	Flame,
	RotateCcw,
	Trophy,
	XCircle,
	Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const QUESTIONS = [
	{
		question: 'Quyidagi kodning natijasi nima?\nconsole.log(0.1 + 0.2 === 0.3)',
		options: ['true', 'false', 'undefined', 'NaN'],
		correct: 1,
		explanation:
			'Floating point xatoligi tufayli 0.1 + 0.2 = 0.30000000000000004',
	},
	{
		question: 'Big O notatsiyasida eng yaxshi qidiruv algoritmi qaysi?',
		options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
		correct: 2,
		explanation:
			"Binary search O(log n) — har qadamda massiv yarmiga bo'linadi",
	},
	{
		question: 'Recursion muammosini hal qiluvchi eng muhim narsa nima?',
		options: [
			'Loop ishlatish',
			"Base case (to'xtash sharti)",
			'Stack overflow',
			"Global o'zgaruvchi",
		],
		correct: 1,
		explanation:
			"Base case bo'lmasa, funksiya cheksiz o'zini chaqiradi — stack overflow!",
	},
	{
		question: "Python'da list va tuple orasidagi asosiy farq nima?",
		options: [
			'Tuple tezroq ishlaydi',
			'List faqat sonlarni saqlaydi',
			"Tuple o'zgartirib bo'lmaydi (immutable)",
			'List faqat bitta element saqlaydi',
		],
		correct: 2,
		explanation:
			"Tuple immutable — yaratilgandan keyin uning elementlari o'zgartirilmaydi",
	},
	{
		question: "SQL'da PRIMARY KEY va UNIQUE qanday farqlanadi?",
		options: [
			"Farqi yo'q",
			"PRIMARY KEY NULL bo'la olmaydi, UNIQUE bo'lishi mumkin",
			'UNIQUE faqat bitta jadvalda ishlatiladi',
			"PRIMARY KEY ko'p bo'lishi mumkin",
		],
		correct: 1,
		explanation:
			"PRIMARY KEY = UNIQUE + NOT NULL. Jadvalda faqat bitta PRIMARY KEY bo'ladi",
	},
	{
		question: "Git'da 'merge' va 'rebase' qanday farqlanadi?",
		options: [
			"Farqi yo'q, bir xil natija",
			"Rebase commit tarixini qayta yozadi, merge esa yo'q",
			'Merge tezroq ishlaydi',
			"Rebase faqat remote branch'larda ishlaydi",
		],
		correct: 1,
		explanation:
			"Rebase linear tarix yaratadi, merge esa merge commit qo'shadi",
	},
	{
		question: 'Deadlock qachon yuzaga keladi?',
		options: [
			"Server juda ko'p so'rov olganda",
			'Ikki jarayon bir-birining resursini kutganda',
			"RAM to'lganda",
			'CPU 100% yuklanganda',
		],
		correct: 1,
		explanation:
			"Deadlock: A B ni, B esa A ni kutadi — ikkalasi ham to'xtab qoladi",
	},
	{
		question: "RESTful API'da PATCH va PUT qanday farqlanadi?",
		options: [
			"Farqi yo'q",
			'PUT tezroq ishlaydi',
			"PATCH faqat ba'zi maydonlarni yangilaydi, PUT esa to'liq",
			'PATCH faqat POST bilan ishlaydi',
		],
		correct: 2,
		explanation:
			"PUT: to'liq resursni almashtiradi. PATCH: faqat ko'rsatilgan maydonlarni yangilaydi",
	},
	{
		question: "JavaScript'da event loop qanday ishlaydi?",
		options: [
			'Multithreading bilan',
			"Call stack bo'sh bo'lganda callback queue dan vazifa oladi",
			'Har 1 sekundda bir marta ishlaydi',
			'Faqat async funksiyalar uchun',
		],
		correct: 1,
		explanation:
			"Event loop: call stack → bo'sh? → callback queue'dan oladi → bajaradi",
	},
	{
		question: "Hash table'ning o'rtacha qidirish vaqti qanday?",
		options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
		correct: 3,
		explanation:
			"Hash table: key → hash → to'g'ridan-to'g'ri elementga. O'rtacha O(1)",
	},
]

const XP_PER_CORRECT = 5
const BONUS_XP = 10
const TIME_PER_QUESTION = 30
const GAME_NAME = 'Logic Puzzles'

type GamePhase = 'intro' | 'playing' | 'result'

export default function LogicPuzzlesPage() {
	const router = useRouter()
	const [phase, setPhase] = useState<GamePhase>('intro')
	const [currentQ, setCurrentQ] = useState(0)
	const [selected, setSelected] = useState<number | null>(null)
	const [showExplanation, setShowExplanation] = useState(false)
	const [correctCount, setCorrectCount] = useState(0)
	const [answers, setAnswers] = useState<(number | null)[]>(
		Array(QUESTIONS.length).fill(null),
	)
	const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)

	const totalXP =
		correctCount * XP_PER_CORRECT +
		(correctCount === QUESTIONS.length ? BONUS_XP : 0)
	const percentage = Math.round((correctCount / QUESTIONS.length) * 100)

	const goNext = useCallback(() => {
		if (currentQ < QUESTIONS.length - 1) {
			setCurrentQ(q => q + 1)
			setSelected(null)
			setShowExplanation(false)
			setTimeLeft(TIME_PER_QUESTION)
		} else {
			setPhase('result')
		}
	}, [currentQ])

	// Timer
	useEffect(() => {
		if (phase !== 'playing' || selected !== null) return
		if (timeLeft <= 0) {
			// Time's up — mark as wrong
			const newAnswers = [...answers]
			newAnswers[currentQ] = -1
			setAnswers(newAnswers)
			setSelected(-1)
			setShowExplanation(true)
			return
		}
		const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
		return () => clearTimeout(t)
	}, [phase, selected, timeLeft, currentQ, answers])

	const handleAnswer = (idx: number) => {
		if (selected !== null) return
		setSelected(idx)
		setShowExplanation(true)
		const newAnswers = [...answers]
		newAnswers[currentQ] = idx
		setAnswers(newAnswers)
		if (idx === QUESTIONS[currentQ].correct) {
			setCorrectCount(c => c + 1)
		}
	}

	const saveResult = async () => {
		if (saving || saved) return
		setSaving(true)
		try {
			const studentId = localStorage.getItem('studentId')
			if (!studentId) return
			await gameApi.saveResult(Number(studentId), GAME_NAME, totalXP)
			setSaved(true)
		} catch (e) {
			console.error(e)
		} finally {
			setSaving(false)
		}
	}

	useEffect(() => {
		if (phase === 'result') {
			saveResult()
		}
	}, [phase])

	const restart = () => {
		setPhase('intro')
		setCurrentQ(0)
		setSelected(null)
		setShowExplanation(false)
		setCorrectCount(0)
		setAnswers(Array(QUESTIONS.length).fill(null))
		setTimeLeft(TIME_PER_QUESTION)
		setSaved(false)
	}

	const timerColor =
		timeLeft > 20
			? 'text-emerald-400'
			: timeLeft > 10
				? 'text-amber-400'
				: 'text-red-400'
	const timerBg =
		timeLeft > 20
			? 'bg-emerald-500'
			: timeLeft > 10
				? 'bg-amber-500'
				: 'bg-red-500'

	// ─── INTRO ───────────────────────────────────────────────
	if (phase === 'intro') {
		return (
			<div className='min-h-[70vh] flex flex-col items-center justify-center space-y-6 pb-8'>
				<button
					onClick={() => router.back()}
					className='self-start flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'
				>
					<ArrowLeft className='w-4 h-4' /> O'yinlarga qaytish
				</button>

				<div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50'>
					<div className='w-20 h-20 bg-violet-100 dark:bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5'>
						<Brain className='w-10 h-10 text-violet-600 dark:text-violet-400' />
					</div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white mb-2'>
						Logic Puzzles
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mb-6'>
						Dasturlash bo'yicha mantiqiy savollar — har to'g'ri javob uchun XP
						yig'ing!
					</p>

					<div className='grid grid-cols-3 gap-3 mb-6'>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-xl font-black text-slate-800 dark:text-slate-200'>
								{QUESTIONS.length}
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>Savol</p>
						</div>
						<div className='bg-violet-50 dark:bg-violet-500/10 rounded-2xl p-3'>
							<p className='text-xl font-black text-violet-600 dark:text-violet-400'>
								+{XP_PER_CORRECT}
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>XP / javob</p>
						</div>
						<div className='bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-3'>
							<p className='text-xl font-black text-amber-600 dark:text-amber-400'>
								{TIME_PER_QUESTION}s
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>Har savol</p>
						</div>
					</div>

					<div className='bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-2xl px-4 py-3 mb-6 text-left'>
						<div className='flex items-center gap-2 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-1'>
							<Flame className='w-3.5 h-3.5' /> Bonus
						</div>
						<p className='text-xs text-slate-500 dark:text-slate-400'>
							Barcha savolga to'g'ri javob berish = qo'shimcha{' '}
							<span className='font-bold text-violet-600 dark:text-violet-400'>
								+{BONUS_XP} XP
							</span>
						</p>
					</div>

					<button
						onClick={() => {
							setPhase('playing')
							setTimeLeft(TIME_PER_QUESTION)
						}}
						className='w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-violet-600/30'
					>
						Boshlash
					</button>
				</div>
			</div>
		)
	}

	// ─── RESULT ──────────────────────────────────────────────
	if (phase === 'result') {
		const isPerfect = correctCount === QUESTIONS.length
		const isGood = percentage >= 70

		return (
			<div className='min-h-[70vh] flex flex-col items-center justify-center space-y-4 pb-8'>
				<div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl'>
					<div
						className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
							isPerfect
								? 'bg-amber-100 dark:bg-amber-500/20'
								: isGood
									? 'bg-violet-100 dark:bg-violet-500/20'
									: 'bg-slate-100 dark:bg-slate-800'
						}`}
					>
						<Trophy
							className={`w-10 h-10 ${isPerfect ? 'text-amber-500' : isGood ? 'text-violet-500' : 'text-slate-400'}`}
						/>
					</div>

					<h2 className='text-2xl font-black text-slate-900 dark:text-white mb-1'>
						{isPerfect
							? 'Mukammal! 🎉'
							: isGood
								? "Zo'r natija!"
								: 'Yaxshi harakat!'}
					</h2>
					<p className='text-sm text-slate-400 mb-6'>
						{correctCount}/{QUESTIONS.length} savolga to'g'ri javob
					</p>

					{/* Score ring */}
					<div className='relative w-32 h-32 mx-auto mb-6'>
						<svg className='w-full h-full -rotate-90' viewBox='0 0 120 120'>
							<circle
								cx='60'
								cy='60'
								r='50'
								fill='none'
								stroke='currentColor'
								strokeWidth='10'
								className='text-slate-100 dark:text-slate-800'
							/>
							<circle
								cx='60'
								cy='60'
								r='50'
								fill='none'
								strokeWidth='10'
								strokeDasharray={`${2 * Math.PI * 50}`}
								strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
								strokeLinecap='round'
								className={
									isPerfect
										? 'text-amber-500'
										: isGood
											? 'text-violet-500'
											: 'text-blue-500'
								}
								stroke='currentColor'
							/>
						</svg>
						<div className='absolute inset-0 flex flex-col items-center justify-center'>
							<span className='text-3xl font-black text-slate-900 dark:text-white'>
								{percentage}%
							</span>
						</div>
					</div>

					{/* XP earned */}
					<div className='flex items-center justify-center gap-2 mb-6'>
						<div className='flex items-center gap-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-xl px-4 py-2'>
							<Zap className='w-4 h-4 text-violet-500' />
							<span className='font-black text-violet-700 dark:text-violet-400'>
								+{totalXP} XP
							</span>
							{isPerfect && (
								<span className='text-[10px] font-bold text-amber-500 ml-1'>
									(+{BONUS_XP} bonus!)
								</span>
							)}
						</div>
					</div>

					{/* Answer breakdown */}
					<div className='grid grid-cols-5 gap-1.5 mb-6'>
						{answers.map((ans, idx) => {
							const isCorrect = ans === QUESTIONS[idx].correct
							const isTimeout = ans === -1
							return (
								<div
									key={idx}
									className={`h-2 rounded-full ${
										isCorrect
											? 'bg-violet-500'
											: isTimeout
												? 'bg-slate-300 dark:bg-slate-700'
												: 'bg-red-400'
									}`}
								/>
							)
						})}
					</div>

					<div className='flex gap-3'>
						<button
							onClick={restart}
							className='flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
						>
							<RotateCcw className='w-4 h-4' /> Qayta o'ynash
						</button>
						<button
							onClick={() => router.back()}
							className='flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl text-sm transition-colors shadow-lg shadow-violet-600/20'
						>
							Chiqish
						</button>
					</div>

					{saved && (
						<p className='text-xs text-emerald-500 mt-4 font-semibold'>
							✓ Natija saqlandi
						</p>
					)}
				</div>
			</div>
		)
	}

	// ─── PLAYING ─────────────────────────────────────────────
	const q = QUESTIONS[currentQ]
	const isLast = currentQ === QUESTIONS.length - 1

	return (
		<div className='max-w-2xl mx-auto space-y-4 pb-8'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<button
					onClick={() => router.back()}
					className='flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'
				>
					<ArrowLeft className='w-4 h-4' /> Chiqish
				</button>
				<div className='flex items-center gap-3'>
					<div className='flex items-center gap-1.5 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-xl px-3 py-1.5'>
						<Zap className='w-3.5 h-3.5 text-violet-500' />
						<span className='text-xs font-bold text-violet-700 dark:text-violet-400'>
							{correctCount * XP_PER_CORRECT} XP
						</span>
					</div>
					<div
						className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${timerColor} bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700`}
					>
						<Clock className='w-3.5 h-3.5' />
						<span className='text-xs font-black tabular-nums'>{timeLeft}s</span>
					</div>
				</div>
			</div>

			{/* Progress */}
			<div className='space-y-2'>
				<div className='flex items-center justify-between text-xs text-slate-400'>
					<span>
						Savol {currentQ + 1} / {QUESTIONS.length}
					</span>
					<span>{correctCount} to'g'ri</span>
				</div>
				<div className='h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
					<div
						className='h-full bg-violet-500 rounded-full transition-all duration-500'
						style={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}
					/>
				</div>
				{/* Timer bar */}
				<div className='h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
					<div
						className={`h-full ${timerBg} rounded-full transition-all duration-1000`}
						style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
					/>
				</div>
			</div>

			{/* Question card */}
			<div className='bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm'>
				<div className='flex items-start gap-3 mb-6'>
					<div className='w-8 h-8 bg-violet-100 dark:bg-violet-500/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5'>
						<Brain className='w-4 h-4 text-violet-600 dark:text-violet-400' />
					</div>
					<h2 className='text-base font-bold text-slate-900 dark:text-white leading-snug whitespace-pre-line'>
						{q.question}
					</h2>
				</div>

				{/* Options */}
				<div className='space-y-2.5'>
					{q.options.map((option, idx) => {
						const isCorrect = idx === q.correct
						const isSelected = idx === selected
						const answered = selected !== null

						let cls =
							'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10'
						if (answered) {
							if (isCorrect)
								cls =
									'border-violet-500 bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300'
							else if (isSelected)
								cls =
									'border-red-400 bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300'
							else
								cls =
									'border-slate-200 dark:border-slate-800 opacity-40 text-slate-500'
						}

						return (
							<button
								key={idx}
								onClick={() => handleAnswer(idx)}
								disabled={answered}
								className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold transition-all flex items-center gap-3 ${cls}`}
							>
								<span
									className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
										answered && isCorrect
											? 'bg-violet-500 text-white'
											: answered && isSelected && !isCorrect
												? 'bg-red-400 text-white'
												: 'bg-slate-100 dark:bg-slate-800 text-slate-500'
									}`}
								>
									{String.fromCharCode(65 + idx)}
								</span>
								<span className='flex-1'>{option}</span>
								{answered && isCorrect && (
									<CheckCircle2 className='w-4 h-4 text-violet-500 shrink-0' />
								)}
								{answered && isSelected && !isCorrect && (
									<XCircle className='w-4 h-4 text-red-400 shrink-0' />
								)}
							</button>
						)
					})}
				</div>

				{/* Explanation */}
				{showExplanation && (
					<div
						className={`mt-4 rounded-2xl px-4 py-3 text-xs font-medium ${
							selected === q.correct
								? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20'
								: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/20'
						}`}
					>
						💡 {q.explanation}
					</div>
				)}
			</div>

			{/* Next button */}
			{selected !== null && (
				<button
					onClick={goNext}
					className='w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20'
				>
					{isLast ? (
						<>
							<Trophy className='w-4 h-4' /> Natijani ko'rish
						</>
					) : (
						<>
							Keyingi savol <ChevronRight className='w-4 h-4' />
						</>
					)}
				</button>
			)}
		</div>
	)
}
