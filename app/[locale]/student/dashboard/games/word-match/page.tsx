'use client'

import { gameApi } from '@/lib/api'
import {
	ArrowLeft,
	CheckCircle2,
	Clock,
	HelpCircle,
	RotateCcw,
	Trophy,
	Zap,
} from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'

const GAME_NAME = 'Word Match'
const XP_PER_PAIR = 3
const BONUS_XP = 15
const TIME_LIMIT = 90 // 1.5 daqiqa

type Card = {
	id: string
	value: string
	type: 'term' | 'definition'
	pairId: number
}

const ALL_PAIRS: { term: string; definition: string }[] = [
	{ term: 'Variable', definition: "Ma'lumot saqlovchi nom" },
	{ term: 'Function', definition: 'Qayta ishlatiladigan kod bloki' },
	{ term: 'Array', definition: "Tartibli elementlar to'plami" },
	{ term: 'Loop', definition: 'Takrorlanadigan kod' },
	{ term: 'Boolean', definition: 'true yoki false qiymat' },
	{ term: 'String', definition: "Matn ma'lumot turi" },
	{ term: 'Object', definition: 'Kalit-qiymat juftliklari' },
	{ term: 'Class', definition: 'Obyekt yaratish shabloni' },
	{ term: 'API', definition: 'Dasturlar orasidagi interfeys' },
	{ term: 'Recursion', definition: "Funksiya o'zini chaqirishi" },
	{ term: 'Null', definition: "Qiymat yo'qligini bildiradi" },
	{ term: 'Callback', definition: 'Argument sifatida berilgan funksiya' },
]

function shuffle<T>(arr: T[]): T[] {
	return [...arr].sort(() => Math.random() - 0.5)
}

function buildCards(pairs: { term: string; definition: string }[]): Card[] {
	const cards: Card[] = []
	pairs.forEach((pair, idx) => {
		cards.push({
			id: `term-${idx}`,
			value: pair.term,
			type: 'term',
			pairId: idx,
		})
		cards.push({
			id: `def-${idx}`,
			value: pair.definition,
			type: 'definition',
			pairId: idx,
		})
	})
	return shuffle(cards)
}

type GamePhase = 'intro' | 'playing' | 'result'

export default function WordMatchPage() {
	const router = useRouter()
	const [phase, setPhase] = useState<GamePhase>('intro')
	const [cards, setCards] = useState<Card[]>([])
	const [selectedIds, setSelectedIds] = useState<string[]>([])
	const [matchedPairIds, setMatchedPairIds] = useState<number[]>([])
	const [wrongIds, setWrongIds] = useState<string[]>([])
	const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
	const [moves, setMoves] = useState(0)
	const [saving, setSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [pairs, setPairs] = useState<{ term: string; definition: string }[]>([])

	const totalPairs = pairs.length
	const matchedCount = matchedPairIds.length
	const isComplete = matchedCount === totalPairs
	const earnedXP = matchedCount * XP_PER_PAIR + (isComplete ? BONUS_XP : 0)

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

	// Auto finish when all matched
	useEffect(() => {
		if (phase === 'playing' && isComplete) {
			setTimeout(() => setPhase('result'), 600)
		}
	}, [isComplete, phase])

	const handleSelect = (card: Card) => {
		if (matchedPairIds.includes(card.pairId)) return
		if (selectedIds.includes(card.id)) return
		if (wrongIds.includes(card.id)) return
		if (selectedIds.length === 2) return

		const newSelected = [...selectedIds, card.id]
		setSelectedIds(newSelected)

		if (newSelected.length === 2) {
			setMoves(m => m + 1)
			const [firstId, secondId] = newSelected
			const first = cards.find(c => c.id === firstId)!
			const second = cards.find(c => c.id === secondId)!

			if (first.pairId === second.pairId && first.type !== second.type) {
				// Match!
				setTimeout(() => {
					setMatchedPairIds(m => [...m, first.pairId])
					setSelectedIds([])
				}, 400)
			} else {
				// Wrong
				setWrongIds([firstId, secondId])
				setTimeout(() => {
					setSelectedIds([])
					setWrongIds([])
				}, 700)
			}
		}
	}

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
		const selectedPairs = shuffle(ALL_PAIRS).slice(0, 6)
		setPairs(selectedPairs)
		setCards(buildCards(selectedPairs))
		setSelectedIds([])
		setMatchedPairIds([])
		setWrongIds([])
		setTimeLeft(TIME_LIMIT)
		setMoves(0)
		setSaved(false)
		setPhase('playing')
	}

	const timerColor =
		timeLeft > 45
			? 'text-emerald-400'
			: timeLeft > 20
				? 'text-amber-400'
				: 'text-red-400'
	const timerBg =
		timeLeft > 45
			? 'bg-emerald-500'
			: timeLeft > 20
				? 'bg-amber-500'
				: 'bg-red-500'

	const getCardStyle = (card: Card) => {
		const isMatched = matchedPairIds.includes(card.pairId)
		const isSelected = selectedIds.includes(card.id)
		const isWrong = wrongIds.includes(card.id)

		if (isMatched)
			return 'border-blue-400 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 opacity-60 cursor-default scale-95'
		if (isWrong)
			return 'border-red-400 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-300 animate-shake'
		if (isSelected)
			return 'border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/20 scale-[1.02]'
		return 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 hover:scale-[1.01] cursor-pointer'
	}

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

				<div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl'>
					<div className='w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5'>
						<HelpCircle className='w-10 h-10 text-blue-600 dark:text-blue-400' />
					</div>
					<h1 className='text-2xl font-black text-slate-900 dark:text-white mb-2'>
						Word Match
					</h1>
					<p className='text-slate-500 dark:text-slate-400 text-sm mb-6'>
						Dasturlash atamalarini to'g'ri ta'rifga moslang!
					</p>

					<div className='grid grid-cols-3 gap-3 mb-6'>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-xl font-black text-slate-800 dark:text-slate-200'>
								6
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>Juft</p>
						</div>
						<div className='bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-3'>
							<p className='text-xl font-black text-blue-600 dark:text-blue-400'>
								+{XP_PER_PAIR}
							</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>XP / juft</p>
						</div>
						<div className='bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-3'>
							<p className='text-xl font-black text-amber-500'>{TIME_LIMIT}s</p>
							<p className='text-[11px] text-slate-400 mt-0.5'>Vaqt</p>
						</div>
					</div>

					<div className='bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-4 py-3 mb-6 text-left space-y-1.5'>
						<p className='text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2'>
							🎯 Qoidalar:
						</p>
						<p className='text-xs text-slate-500 dark:text-slate-400'>
							• Atama va uning ta'rifini topib bos
						</p>
						<p className='text-xs text-slate-500 dark:text-slate-400'>
							• Har o'ynaganda yangi 6 ta juft tanlanadi
						</p>
						<p className='text-xs text-slate-500 dark:text-slate-400'>
							• Hammani topish = +{BONUS_XP} XP bonus
						</p>
					</div>

					<button
						onClick={start}
						className='w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-colors text-sm shadow-lg shadow-blue-600/30'
					>
						Boshlash
					</button>
				</div>
			</div>
		)
	}

	// ─── RESULT ──────────────────────────────────────────────
	if (phase === 'result') {
		const percentage = Math.round((matchedCount / totalPairs) * 100)
		const isPerfect = matchedCount === totalPairs
		const timeUsed = TIME_LIMIT - timeLeft

		return (
			<div className='min-h-[70vh] flex flex-col items-center justify-center space-y-4 pb-8'>
				<div className='w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl'>
					<div
						className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
							isPerfect
								? 'bg-blue-100 dark:bg-blue-500/20'
								: 'bg-slate-100 dark:bg-slate-800'
						}`}
					>
						<Trophy
							className={`w-10 h-10 ${isPerfect ? 'text-blue-500' : 'text-slate-400'}`}
						/>
					</div>

					<h2 className='text-2xl font-black text-slate-900 dark:text-white mb-1'>
						{isPerfect
							? "Hammasi to'g'ri! 🎉"
							: timeLeft <= 0
								? 'Vaqt tugadi!'
								: "Zo'r!"}
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
								className={isPerfect ? 'text-blue-500' : 'text-blue-400'}
								stroke='currentColor'
							/>
						</svg>
						<div className='absolute inset-0 flex flex-col items-center justify-center'>
							<span className='text-3xl font-black text-slate-900 dark:text-white'>
								{percentage}%
							</span>
						</div>
					</div>

					<div className='grid grid-cols-3 gap-3 mb-6'>
						<div className='bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-3'>
							<div className='flex items-center justify-center gap-1 mb-1'>
								<Zap className='w-3.5 h-3.5 text-blue-500' />
								<span className='font-black text-blue-600 dark:text-blue-400'>
									+{earnedXP}
								</span>
							</div>
							<p className='text-[10px] text-slate-400'>XP</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-xl font-black text-slate-800 dark:text-slate-200'>
								{moves}
							</p>
							<p className='text-[10px] text-slate-400'>Harakat</p>
						</div>
						<div className='bg-slate-50 dark:bg-slate-800 rounded-2xl p-3'>
							<p className='text-xl font-black text-slate-800 dark:text-slate-200'>
								{timeUsed}s
							</p>
							<p className='text-[10px] text-slate-400'>Vaqt</p>
						</div>
					</div>

					{isPerfect && (
						<div className='bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl px-4 py-2 mb-4'>
							<p className='text-xs font-bold text-blue-600 dark:text-blue-400'>
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
							className='flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-colors'
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
	const terms = cards.filter(c => c.type === 'term')
	const defs = cards.filter(c => c.type === 'definition')

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
					<div className='flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl px-3 py-1.5'>
						<CheckCircle2 className='w-3.5 h-3.5 text-blue-500' />
						<span className='text-xs font-bold text-blue-600 dark:text-blue-400'>
							{matchedCount}/{totalPairs}
						</span>
					</div>
					<div
						className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${timerColor}`}
					>
						<Clock className='w-3.5 h-3.5' />
						<span className='text-xs font-black tabular-nums'>{timeLeft}s</span>
					</div>
				</div>
			</div>

			{/* Timer bar */}
			<div className='h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden'>
				<div
					className={`h-full ${timerBg} rounded-full transition-all duration-1000`}
					style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%` }}
				/>
			</div>

			{/* Instructions */}
			<p className='text-xs text-slate-400 text-center'>
				Atamani tanlang, keyin uning ta'rifini toping
			</p>

			{/* Cards — two columns */}
			<div className='grid grid-cols-2 gap-3'>
				{/* Terms column */}
				<div className='space-y-2.5'>
					<p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center'>
						Atama
					</p>
					{terms.map(card => (
						<button
							key={card.id}
							onClick={() => handleSelect(card)}
							className={`w-full px-3 py-3.5 rounded-2xl border text-sm font-bold transition-all text-center ${getCardStyle(card)}`}
						>
							{matchedPairIds.includes(card.pairId) ? (
								<span className='flex items-center justify-center gap-1.5'>
									<CheckCircle2 className='w-3.5 h-3.5 text-blue-500 shrink-0' />
									{card.value}
								</span>
							) : (
								card.value
							)}
						</button>
					))}
				</div>

				{/* Definitions column */}
				<div className='space-y-2.5'>
					<p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center'>
						Ta'rif
					</p>
					{defs.map(card => (
						<button
							key={card.id}
							onClick={() => handleSelect(card)}
							className={`w-full px-3 py-3.5 rounded-2xl border text-xs font-medium transition-all text-center leading-snug ${getCardStyle(card)}`}
						>
							{card.value}
						</button>
					))}
				</div>
			</div>

			{/* XP preview */}
			<div className='flex items-center justify-center gap-2 pt-2'>
				<Zap className='w-3.5 h-3.5 text-amber-500' />
				<span className='text-xs font-bold text-slate-500 dark:text-slate-400'>
					Hozircha: +{matchedCount * XP_PER_PAIR} XP
					{isComplete && (
						<span className='text-blue-500 ml-1'>(+{BONUS_XP} bonus!)</span>
					)}
				</span>
			</div>
		</div>
	)
}
