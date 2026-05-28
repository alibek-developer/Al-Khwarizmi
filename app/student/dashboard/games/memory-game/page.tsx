'use client'

import { gameApi } from '@/lib/api'
import {
	ArrowLeft,
	CheckCircle2,
	Clock,
	Gamepad2,
	RotateCcw,
	Trophy,
	Zap,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const GAME_NAME = 'Memory Game'
const XP_PER_PAIR = 4
const BONUS_XP = 20
const TIME_LIMIT = 120

type Card = {
	id: number
	value: string
	emoji: string
	isFlipped: boolean
	isMatched: boolean
}

const ALL_ITEMS = [
	{ value: 'JavaScript', emoji: '🟨' },
	{ value: 'Python', emoji: '🐍' },
	{ value: 'React', emoji: '⚛️' },
	{ value: 'Database', emoji: '🗄️' },
	{ value: 'API', emoji: '🔌' },
	{ value: 'Git', emoji: '🌿' },
	{ value: 'CSS', emoji: '🎨' },
	{ value: 'Node.js', emoji: '🟢' },
	{ value: 'TypeScript', emoji: '🔷' },
	{ value: 'Docker', emoji: '🐳' },
	{ value: 'Linux', emoji: '🐧' },
	{ value: 'Algorithm', emoji: '🧮' },
]

function shuffle<T>(arr: T[]): T[] {
	return [...arr].sort(() => Math.random() - 0.5)
}

function buildCards(items: { value: string; emoji: string }[]): Card[] {
	const doubled = [...items, ...items].map((item, idx) => ({
		id: idx,
		value: item.value,
		emoji: item.emoji,
		isFlipped: false,
		isMatched: false,
	}))
	return shuffle(doubled)
}

type GamePhase = 'intro' | 'playing' | 'result'
type Difficulty = 'easy' | 'medium' | 'hard'

const DIFFICULTY_CONFIG = {
	easy: {
		pairs: 6,
		cols: 3,
		label: 'Oson',
		color: 'text-emerald-500',
		xpMult: 1,
	},
	medium: {
		pairs: 8,
		cols: 4,
		label: "O'rta",
		color: 'text-amber-500',
		xpMult: 1.5,
	},
	hard: {
		pairs: 12,
		cols: 4,
		label: 'Qiyin',
		color: 'text-red-500',
		xpMult: 2,
	},
}

export default function MemoryGamePage() {
	const router = useRouter()
	const [phase, setPhase] = useState<GamePhase>('intro')
	const [difficulty, setDifficulty] = useState<Difficulty>('medium')
	const [cards, setCards] = useState<Card[]>([])
	const [flippedIds, setFlippedIds] = useState<number[]>([])
	const [matchedCount, setMatchedCount] = useState(0)
	const [moves, setMoves] = useState(0)
	const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
	const [isChecking, setIsChecking] = useState(false)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [lastMatchId, setLastMatchId] = useState<number | null>(null)

	const config = DIFFICULTY_CONFIG[difficulty]
	const totalPairs = config.pairs
	const isComplete = matchedCount === totalPairs
	const earnedXP =
		Math.round(matchedCount * XP_PER_PAIR * config.xpMult) +
		(isComplete ? BONUS_XP : 0)
	const percentage = Math.round((matchedCount / totalPairs) * 100)

	// Timer
	useEffect(() => {
		if (phase !== 'playing' || isComplete) return
		if (timeLeft <= 0) {
			setPhase('result')
			return
		}
		const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
		return () => clearTimeout(t)
	}, [phase, timeLeft, isComplete])

	// Auto finish
	useEffect(() => {
		if (phase === 'playing' && isComplete) {
			setTimeout(() => setPhase('result'), 800)
		}
	}, [isComplete, phase])

	const handleFlip = useCallback(
		(cardId: number) => {
			if (isChecking) return
			const card = cards.find(c => c.id === cardId)
			if (!card || card.isFlipped || card.isMatched) return
			if (flippedIds.length === 2) return

			const newFlipped = [...flippedIds, cardId]
			setFlippedIds(newFlipped)
			setCards(prev =>
				prev.map(c => (c.id === cardId ? { ...c, isFlipped: true } : c)),
			)

			if (newFlipped.length === 2) {
				setIsChecking(true)
				setMoves(m => m + 1)
				const [firstId, secondId] = newFlipped
				const first = cards.find(c => c.id === firstId)!
				const second = cards.find(c => c.id === secondId)!

				if (first.value === second.value) {
					// Match!
					setTimeout(() => {
						setCards(prev =>
							prev.map(c =>
								c.id === firstId || c.id === secondId
									? { ...c, isMatched: true }
									: c,
							),
						)
						setMatchedCount(m => m + 1)
						setLastMatchId(Date.now())
						setFlippedIds([])
						setIsChecking(false)
					}, 500)
				} else {
					// No match
					setTimeout(() => {
						setCards(prev =>
							prev.map(c =>
								c.id === firstId || c.id === secondId
									? { ...c, isFlipped: false }
									: c,
							),
						)
						setFlippedIds([])
						setIsChecking(false)
					}, 900)
				}
			}
		},
		[isChecking, cards, flippedIds],
	)

	const saveResult = async () => {
		if (saving || saved) return
		setSaving(true)
		try {
			const studentId = localStorage.getItem('studentId')
			if (!studentId) return
			await gameApi.saveResult(Number(studentId), GAME_NAME, earnedXP)
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
		const items = shuffle(ALL_ITEMS).slice(0, config.pairs)
		setCards(buildCards(items))
		setFlippedIds([])
		setMatchedCount(0)
		setMoves(0)
		setTimeLeft(TIME_LIMIT)
		setIsChecking(false)
		setSaved(false)
		setLastMatchId(null)
		setPhase('playing')
	}

	const timerColor =
		timeLeft > 60
			? 'text-emerald-400'
			: timeLeft > 30
				? 'text-amber-400'
				: 'text-red-400'
	const timerBg =
		timeLeft > 60
			? 'bg-emerald-500'
			: timeLeft > 30
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

				<div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl'>
					<div className='text-center mb-6'>
						<div className='w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5'>
							<Gamepad2 className='w-10 h-10 text-indigo-600 dark:text-indigo-400' />
						</div>
						<h1 className='text-2xl font-black text-slate-900 dark:text-white mb-2'>
							Memory Game
						</h1>
						<p className='text-slate-500 dark:text-slate-400 text-sm'>
							Kartochkalarni ag'darib juftlarini toping!
						</p>
					</div>

					{/* Difficulty selector */}
					<div className='mb-6'>
						<p className='text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3'>
							Qiyinlik darajasi
						</p>
						<div className='grid grid-cols-3 gap-2'>
							{(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(d => {
								const cfg = DIFFICULTY_CONFIG[d]
								return (
									<button
										key={d}
										onClick={() => setDifficulty(d)}
										className={`py-3 rounded-2xl border text-sm font-bold transition-all ${
											difficulty === d
												? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
												: 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
										}`}
									>
										<span className={difficulty === d ? '' : cfg.color}>
											{cfg.label}
										</span>
										<p className='text-[10px] font-normal text-slate-400 mt-0.5'>
											{cfg.pairs} juft
										</p>
									</button>
								)
							})}
						</div>
					</div>

					<div className='grid grid-cols-3 gap-3 mb-6'>
						<div className='bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-3 text-center'>
							<p className='text-xl font-black text-indigo-600 dark:text-indigo-400'>
								+{XP_PER_PAIR}
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>XP / juft</p>
						</div>
						<div className='bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-3 text-center'>
							<p className='text-xl font-black text-amber-500'>{TIME_LIMIT}s</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>Vaqt</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 text-center'>
							<p className='text-xl font-black text-slate-700 dark:text-slate-200'>
								x{config.xpMult}
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>XP mult</p>
						</div>
					</div>

					<button
						onClick={start}
						className='w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-indigo-600/30'
					>
						Boshlash
					</button>
				</div>
			</div>
		)
	}

	// ─── RESULT ──────────────────────────────────────────────
	if (phase === 'result') {
		const isPerfect = matchedCount === totalPairs
		const timeUsed = TIME_LIMIT - timeLeft
		const accuracy = moves > 0 ? Math.round((matchedCount / moves) * 100) : 0

		return (
			<div className='min-h-[70vh] flex flex-col items-center justify-center space-y-4 pb-8'>
				<div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl'>
					<div
						className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
							isPerfect
								? 'bg-indigo-100 dark:bg-indigo-500/20'
								: 'bg-slate-100 dark:bg-slate-800'
						}`}
					>
						<Trophy
							className={`w-10 h-10 ${isPerfect ? 'text-indigo-500' : 'text-slate-400'}`}
						/>
					</div>

					<h2 className='text-2xl font-black text-slate-900 dark:text-white mb-1'>
						{isPerfect
							? 'Ajoyib xotira! 🧠'
							: timeLeft <= 0
								? 'Vaqt tugadi!'
								: 'Yaxshi!'}
					</h2>
					<p className='text-sm text-slate-400 mb-6'>
						{matchedCount}/{totalPairs} juft topildi
					</p>

					{/* Ring */}
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
								className={isPerfect ? 'text-indigo-500' : 'text-indigo-400'}
								stroke='currentColor'
							/>
						</svg>
						<div className='absolute inset-0 flex flex-col items-center justify-center'>
							<span className='text-3xl font-black text-slate-900 dark:text-white'>
								{percentage}%
							</span>
						</div>
					</div>

					<div className='grid grid-cols-4 gap-2 mb-6'>
						<div className='bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-3'>
							<div className='flex items-center justify-center gap-1 mb-1'>
								<Zap className='w-3 h-3 text-indigo-500' />
								<span className='font-black text-indigo-600 dark:text-indigo-400 text-sm'>
									+{earnedXP}
								</span>
							</div>
							<p className='text-[9px] text-slate-400'>XP</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-lg font-black text-slate-800 dark:text-slate-200'>
								{moves}
							</p>
							<p className='text-[9px] text-slate-400'>Harakat</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-lg font-black text-slate-800 dark:text-slate-200'>
								{accuracy}%
							</p>
							<p className='text-[9px] text-slate-400'>Aniqlik</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-lg font-black text-slate-800 dark:text-slate-200'>
								{timeUsed}s
							</p>
							<p className='text-[9px] text-slate-400'>Vaqt</p>
						</div>
					</div>

					{isPerfect && (
						<div className='bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl px-4 py-2 mb-4'>
							<p className='text-xs font-bold text-indigo-600 dark:text-indigo-400'>
								🎊 Barcha juft topildi! +{BONUS_XP} XP bonus qo'shildi
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
							className='flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-colors'
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
	const gridCols = config.cols === 3 ? 'grid-cols-3' : 'grid-cols-4'

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
					<div className='flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-xl px-3 py-1.5'>
						<CheckCircle2 className='w-3.5 h-3.5 text-indigo-500' />
						<span className='text-xs font-bold text-indigo-600 dark:text-indigo-400'>
							{matchedCount}/{totalPairs}
						</span>
					</div>
					<div className='flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5'>
						<Zap className='w-3.5 h-3.5 text-slate-400' />
						<span className='text-xs font-bold text-slate-500'>{moves}</span>
					</div>
					<div
						className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${timerColor}`}
					>
						<Clock className='w-3.5 h-3.5' />
						<span className='text-xs font-black tabular-nums'>{timeLeft}s</span>
					</div>
				</div>
			</div>

			{/* Timer + progress bars */}
			<div className='space-y-1.5'>
				<div className='h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
					<div
						className='h-full bg-indigo-500 rounded-full transition-all duration-500'
						style={{ width: `${percentage}%` }}
					/>
				</div>
				<div className='h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
					<div
						className={`h-full ${timerBg} rounded-full transition-all duration-1000`}
						style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
					/>
				</div>
			</div>

			{/* Cards grid */}
			<div className={`grid ${gridCols} gap-2.5`}>
				{cards.map(card => {
					const isFlipped = card.isFlipped || card.isMatched
					return (
						<button
							key={card.id}
							onClick={() => handleFlip(card.id)}
							disabled={card.isMatched || isChecking}
							className={`aspect-square rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-1 select-none ${
								card.isMatched
									? 'border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-500/10 opacity-60 cursor-default'
									: isFlipped
										? 'border-indigo-400 dark:border-indigo-500 bg-white dark:bg-slate-800 shadow-md'
										: 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 cursor-pointer active:scale-95'
							}`}
						>
							{isFlipped ? (
								<>
									<span className='text-2xl leading-none'>{card.emoji}</span>
									<span className='text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight px-1 text-center'>
										{card.value}
									</span>
								</>
							) : (
								<span className='text-2xl text-slate-300 dark:text-slate-600'>
									?
								</span>
							)}
						</button>
					)
				})}
			</div>

			{/* XP preview */}
			<div className='flex items-center justify-center gap-2 pt-1'>
				<Zap className='w-3.5 h-3.5 text-indigo-400' />
				<span className='text-xs font-bold text-slate-400'>
					Hozircha: +{Math.round(matchedCount * XP_PER_PAIR * config.xpMult)} XP
					{isComplete && (
						<span className='text-indigo-500 ml-1'>(+{BONUS_XP} bonus!)</span>
					)}
				</span>
			</div>
		</div>
	)
}
