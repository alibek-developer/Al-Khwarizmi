'use client'

import { gameApi } from '@/lib/api'
import {
	ArrowLeft,
	CheckCircle2,
	ChevronRight,
	Clock,
	Lightbulb,
	RotateCcw,
	Trophy,
	XCircle,
	Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const GAME_NAME = 'Quick Math'
const TOTAL_QUESTIONS = 10
const TIME_PER_QUESTION = 15 // tezroq — qiyin
const XP_PER_CORRECT = 4
const BONUS_XP = 10

type Operation = '+' | '-' | '*'

function generateQuestion(level: number): {
	question: string
	answer: number
	options: number[]
} {
	const ops: Operation[] =
		level < 4 ? ['+', '-'] : level < 7 ? ['+', '-', '*'] : ['+', '-', '*']
	const op = ops[Math.floor(Math.random() * ops.length)]

	let a: number, b: number, answer: number

	if (op === '+') {
		a = Math.floor(Math.random() * (level * 10 + 10)) + 1
		b = Math.floor(Math.random() * (level * 10 + 10)) + 1
		answer = a + b
	} else if (op === '-') {
		a = Math.floor(Math.random() * (level * 10 + 20)) + 10
		b = Math.floor(Math.random() * a) + 1
		answer = a - b
	} else {
		a = Math.floor(Math.random() * (level + 3)) + 2
		b = Math.floor(Math.random() * (level + 3)) + 2
		answer = a * b
	}

	// 4 ta variant — biri to'g'ri, 3 tasi yaqin noto'g'ri
	const wrongSet = new Set<number>()
	while (wrongSet.size < 3) {
		const delta = Math.floor(Math.random() * 10) + 1
		const wrong = Math.random() > 0.5 ? answer + delta : answer - delta
		if (wrong !== answer && wrong >= 0) wrongSet.add(wrong)
	}
	const options = [answer, ...Array.from(wrongSet)].sort(
		() => Math.random() - 0.5,
	)

	return { question: `${a} ${op} ${b} = ?`, answer, options }
}

type GamePhase = 'intro' | 'playing' | 'result'

export default function QuickMathPage() {
	const router = useRouter()
	const [phase, setPhase] = useState<GamePhase>('intro')
	const [currentQ, setCurrentQ] = useState(0)
	const [questions, setQuestions] = useState<
		ReturnType<typeof generateQuestion>[]
	>([])
	const [selected, setSelected] = useState<number | null>(null)
	const [correctCount, setCorrectCount] = useState(0)
	const [answers, setAnswers] = useState<(number | null)[]>(
		Array(TOTAL_QUESTIONS).fill(null),
	)
	const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [combo, setCombo] = useState(0)
	const [maxCombo, setMaxCombo] = useState(0)
	const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(
		null,
	)

	const totalXP =
		correctCount * XP_PER_CORRECT +
		(correctCount === TOTAL_QUESTIONS ? BONUS_XP : 0)
	const percentage = Math.round((correctCount / TOTAL_QUESTIONS) * 100)

	const initQuestions = useCallback(() => {
		return Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
			generateQuestion(i + 1),
		)
	}, [])

	const goNext = useCallback(() => {
		setShowFeedback(null)
		if (currentQ < TOTAL_QUESTIONS - 1) {
			setCurrentQ(q => q + 1)
			setSelected(null)
			setTimeLeft(TIME_PER_QUESTION)
		} else {
			setPhase('result')
		}
	}, [currentQ])

	// Auto next after feedback
	useEffect(() => {
		if (showFeedback !== null) {
			const t = setTimeout(goNext, 800)
			return () => clearTimeout(t)
		}
	}, [showFeedback, goNext])

	// Timer
	useEffect(() => {
		if (phase !== 'playing' || selected !== null) return
		if (timeLeft <= 0) {
			const newAnswers = [...answers]
			newAnswers[currentQ] = -1
			setAnswers(newAnswers)
			setSelected(-1)
			setCombo(0)
			setShowFeedback('wrong')
			return
		}
		const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
		return () => clearTimeout(t)
	}, [phase, selected, timeLeft, currentQ, answers])

	const handleAnswer = (val: number) => {
		if (selected !== null) return
		setSelected(val)
		const newAnswers = [...answers]
		newAnswers[currentQ] = val
		setAnswers(newAnswers)

		if (val === questions[currentQ].answer) {
			setCorrectCount(c => c + 1)
			const newCombo = combo + 1
			setCombo(newCombo)
			setMaxCombo(m => Math.max(m, newCombo))
			setShowFeedback('correct')
		} else {
			setCombo(0)
			setShowFeedback('wrong')
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
		if (phase === 'result') saveResult()
	}, [phase])

	const start = () => {
		const qs = initQuestions()
		setQuestions(qs)
		setPhase('playing')
		setCurrentQ(0)
		setSelected(null)
		setCorrectCount(0)
		setAnswers(Array(TOTAL_QUESTIONS).fill(null))
		setTimeLeft(TIME_PER_QUESTION)
		setCombo(0)
		setMaxCombo(0)
		setSaved(false)
		setShowFeedback(null)
	}

	const timerColor =
		timeLeft > 10
			? 'text-emerald-400'
			: timeLeft > 5
				? 'text-amber-400'
				: 'text-red-400'
	const timerBg =
		timeLeft > 10
			? 'bg-emerald-500'
			: timeLeft > 5
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
					<div className='w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5'>
						<Lightbulb className='w-10 h-10 text-amber-600 dark:text-amber-400' />
					</div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white mb-2'>
						Quick Math
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mb-6'>
						Tez hisoblash o'yini — har savol uchun faqat {TIME_PER_QUESTION}{' '}
						soniya!
					</p>

					<div className='grid grid-cols-3 gap-3 mb-6'>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-xl font-black text-slate-800 dark:text-slate-200'>
								{TOTAL_QUESTIONS}
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>Savol</p>
						</div>
						<div className='bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-3'>
							<p className='text-xl font-black text-amber-600 dark:text-amber-400'>
								+{XP_PER_CORRECT}
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>XP / javob</p>
						</div>
						<div className='bg-red-50 dark:bg-red-500/10 rounded-2xl p-3'>
							<p className='text-xl font-black text-red-500'>
								{TIME_PER_QUESTION}s
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>Limit</p>
						</div>
					</div>

					<div className='bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl px-4 py-3 mb-6 text-left'>
						<p className='text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1'>
							⚡ Qanday ishlaydi?
						</p>
						<ul className='text-xs text-slate-500 dark:text-slate-400 space-y-1'>
							<li>• Qiyinlik asta-sekin oshib boradi</li>
							<li>• To'g'ri javobdan so'ng avtomatik keyingisiga o'tadi</li>
							<li>• Ketma-ket to'g'ri javoblar — combo!</li>
						</ul>
					</div>

					<button
						onClick={start}
						className='w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-amber-500/30'
					>
						Boshlash
					</button>
				</div>
			</div>
		)
	}

	// ─── RESULT ──────────────────────────────────────────────
	if (phase === 'result') {
		const isPerfect = correctCount === TOTAL_QUESTIONS
		const isGood = percentage >= 70

		return (
			<div className='min-h-[70vh] flex flex-col items-center justify-center space-y-4 pb-8'>
				<div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl'>
					<div
						className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
							isPerfect
								? 'bg-amber-100 dark:bg-amber-500/20'
								: isGood
									? 'bg-amber-100 dark:bg-amber-500/10'
									: 'bg-slate-100 dark:bg-slate-800'
						}`}
					>
						<Trophy
							className={`w-10 h-10 ${isPerfect ? 'text-amber-500' : isGood ? 'text-amber-400' : 'text-slate-400'}`}
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
						{correctCount}/{TOTAL_QUESTIONS} savolga to'g'ri javob
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
											? 'text-amber-400'
											: 'text-blue-400'
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

					{/* Stats */}
					<div className='grid grid-cols-3 gap-3 mb-6'>
						<div className='bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-3'>
							<div className='flex items-center justify-center gap-1 mb-1'>
								<Zap className='w-3.5 h-3.5 text-amber-500' />
								<span className='font-black text-amber-600 dark:text-amber-400'>
									+{totalXP}
								</span>
							</div>
							<p className='text-[10px] text-slate-400'>XP earned</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-xl font-black text-slate-800 dark:text-slate-200'>
								{correctCount}
							</p>
							<p className='text-[10px] text-slate-400'>To'g'ri</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-xl font-black text-slate-800 dark:text-slate-200'>
								{maxCombo}x
							</p>
							<p className='text-[10px] text-slate-400'>Max combo</p>
						</div>
					</div>

					{/* Answer breakdown */}
					<div className='grid grid-cols-10 gap-1 mb-6'>
						{answers.map((ans, idx) => {
							const isCorrect = questions[idx] && ans === questions[idx].answer
							return (
								<div
									key={idx}
									className={`h-2 rounded-full ${isCorrect ? 'bg-amber-500' : 'bg-red-400'}`}
								/>
							)
						})}
					</div>

					{isPerfect && (
						<div className='bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl px-4 py-2 mb-4'>
							<p className='text-xs font-bold text-amber-600 dark:text-amber-400'>
								🎊 Perfect score! +{BONUS_XP} XP bonus qo'shildi
							</p>
						</div>
					)}

					<div className='flex gap-3'>
						<button
							onClick={start}
							className='flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
						>
							<RotateCcw className='w-4 h-4' /> Qayta
						</button>
						<button
							onClick={() => router.back()}
							className='flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl text-sm transition-colors shadow-lg shadow-amber-500/20'
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
	const q = questions[currentQ]
	if (!q) return null

	return (
		<div className='max-w-lg mx-auto space-y-4 pb-8'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<button
					onClick={() => router.back()}
					className='flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'
				>
					<ArrowLeft className='w-4 h-4' /> Chiqish
				</button>
				<div className='flex items-center gap-3'>
					{combo >= 2 && (
						<div className='flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-2.5 py-1.5'>
							<Zap className='w-3 h-3 text-amber-500' />
							<span className='text-xs font-black text-amber-600 dark:text-amber-400'>
								{combo}x combo!
							</span>
						</div>
					)}
					<div
						className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${timerColor}`}
					>
						<Clock className='w-3.5 h-3.5' />
						<span className='text-xs font-black tabular-nums'>{timeLeft}s</span>
					</div>
				</div>
			</div>

			{/* Progress */}
			<div className='space-y-1.5'>
				<div className='flex justify-between text-xs text-slate-400'>
					<span>
						{currentQ + 1} / {TOTAL_QUESTIONS}
					</span>
					<span>{correctCount} to'g'ri</span>
				</div>
				<div className='h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
					<div
						className='h-full bg-amber-500 rounded-full transition-all duration-500'
						style={{ width: `${(currentQ / TOTAL_QUESTIONS) * 100}%` }}
					/>
				</div>
				<div className='h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
					<div
						className={`h-full ${timerBg} rounded-full transition-all duration-1000`}
						style={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
					/>
				</div>
			</div>

			{/* Question card */}
			<div
				className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm text-center transition-all ${
					showFeedback === 'correct'
						? 'border-amber-400 dark:border-amber-500'
						: showFeedback === 'wrong'
							? 'border-red-400 dark:border-red-500'
							: 'border-slate-200 dark:border-slate-800'
				}`}
			>
				<div className='w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-4'>
					<Lightbulb className='w-6 h-6 text-amber-500' />
				</div>
				<div className='text-3xl font-black text-slate-900 dark:text-white mb-1 tabular-nums'>
					{q.question}
				</div>
				<p className='text-xs text-slate-400 mb-6'>To'g'ri javobni tanlang</p>

				{/* Feedback overlay */}
				{showFeedback && (
					<div
						className={`flex items-center justify-center gap-2 mb-4 py-2 rounded-xl text-sm font-bold ${
							showFeedback === 'correct'
								? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
								: 'bg-red-50 dark:bg-red-500/10 text-red-500'
						}`}
					>
						{showFeedback === 'correct' ? (
							<>
								<CheckCircle2 className='w-4 h-4' /> To'g'ri! +{XP_PER_CORRECT}{' '}
								XP
							</>
						) : (
							<>
								<XCircle className='w-4 h-4' /> Noto'g'ri! To'g'ri javob:{' '}
								{q.answer}
							</>
						)}
					</div>
				)}

				{/* Options — 2x2 grid */}
				<div className='grid grid-cols-2 gap-3'>
					{q.options.map((opt, idx) => {
						const isCorrect = opt === q.answer
						const isSelected = opt === selected
						const answered = selected !== null

						let cls =
							'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:border-amber-500'
						if (answered) {
							if (isCorrect)
								cls =
									'border-amber-400 bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
							else if (isSelected)
								cls =
									'border-red-400 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-300'
							else
								cls =
									'border-slate-100 dark:border-slate-800 opacity-30 text-slate-400'
						}

						return (
							<button
								key={idx}
								onClick={() => handleAnswer(opt)}
								disabled={answered}
								className={`py-4 rounded-2xl border text-xl font-black transition-all ${cls}`}
							>
								{opt}
							</button>
						)
					})}
				</div>
			</div>

			{/* Manual next (fallback if auto-next fails) */}
			{selected !== null && !showFeedback && (
				<button
					onClick={goNext}
					className='w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2'
				>
					{currentQ < TOTAL_QUESTIONS - 1 ? (
						<>
							Keyingi <ChevronRight className='w-4 h-4' />
						</>
					) : (
						<>
							<Trophy className='w-4 h-4' /> Natijani ko'rish
						</>
					)}
				</button>
			)}
		</div>
	)
}
