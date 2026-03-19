'use client'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function TeacherPanelPage() {
	const router = useRouter()
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [mounted, setMounted] = useState(false) // Hydration xatosi uchun

	const [formData, setFormData] = useState({
		fullName: 'ZUHRA OTAXONOVA',
		courseName: 'Computer basic knowledge',
		certId: '24/110-1',
		date: '22.01.2024',
	})

	// 1. Auth tekshiruvi (Login bilan bir xil kalitlar)
	useEffect(() => {
		setMounted(true)
		const checkAuth = () => {
			const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true' // Kalit nomi tuzatildi
			const userRole = localStorage.getItem('userRole')

			if (!isLoggedIn || userRole !== 'teacher') {
				router.replace('/login')
			} else {
				setIsLoading(false)
			}
		}
		checkAuth()
	}, [router])

	// 2. Canvas chizish funksiyasi (Optimallashtirilgan)
	const drawCertificate = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const image = new Image()
		image.src = '/certificate-bg.png' // Public papkasida ekanligiga ishonch hosil qiling

		image.onload = () => {
			// Tozalash va fonni chizish
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

			// Ism-sharif
			ctx.font = 'bold 60px sans-serif'
			ctx.fillStyle = '#000000'
			ctx.textAlign = 'center'
			ctx.fillText(formData.fullName.toUpperCase(), canvas.width / 2, 580)

			// Kurs nomi
			ctx.font = 'italic 35px serif'
			ctx.fillStyle = '#1e40af'
			ctx.fillText(`<<${formData.courseName}>> course`, canvas.width / 2, 720)

			// ID
			ctx.font = '25px monospace'
			ctx.textAlign = 'left'
			ctx.fillStyle = '#000000'
			ctx.fillText(`ID: ${formData.certId}`, 150, canvas.height - 150)

			// Sana
			ctx.textAlign = 'right'
			ctx.fillText(formData.date, canvas.width - 150, canvas.height - 150)
		}
	}, [formData])

	useEffect(() => {
		if (mounted && !isLoading) {
			drawCertificate()
		}
	}, [drawCertificate, mounted, isLoading])

	const handleSaveAndGenerate = async () => {
		setError('')
		setSuccess('')
		setIsSaving(true)

		try {
			// Supabase-da student borligini tekshirish va yangilash
			const { data, error: updateError } = await supabase
				.from('students')
				.update({ is_graduated: true })
				.eq('certificate_id', formData.certId)
				.select()

			if (updateError) throw updateError

			if (data && data.length > 0) {
				setSuccess('Sertifikat muvaffaqiyatli saqlandi!')
				// 3 soniyadan keyin xabarni o'chirish
				setTimeout(() => setSuccess(''), 3000)
			} else {
				setError(
					'Bunday ID ga ega o’quvchi topilmadi. Avval o’quvchini qo’shing.',
				)
			}
		} catch (err: any) {
			setError(err.message || 'Xatolik yuz berdi')
		} finally {
			setIsSaving(false)
		}
	}

	const handleLogout = () => {
		localStorage.removeItem('adminLoggedIn')
		localStorage.removeItem('userRole')
		router.replace('/login')
	}

	if (!mounted || isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen bg-gray-50'>
				<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600'></div>
			</div>
		)
	}

	return (
		<div className='flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4 lg:p-8 gap-8'>
			{/* Chap taraf: Form */}
			<div className='lg:w-1/3 bg-white p-6 rounded-2xl shadow-lg border border-gray-200'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-xl font-bold text-slate-800'>
						Sertifikat Paneli
					</h2>
					<button
						onClick={handleLogout}
						className='px-3 py-1.5 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition'
					>
						Chiqish
					</button>
				</div>

				{error && (
					<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm'>
						{error}
					</div>
				)}
				{success && (
					<div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm'>
						{success}
					</div>
				)}

				<div className='space-y-4 text-black'>
					<div>
						<label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
							O'quvchi FISH
						</label>
						<input
							type='text'
							value={formData.fullName}
							className='w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all'
							onChange={e =>
								setFormData({ ...formData, fullName: e.target.value })
							}
						/>
					</div>

					<div>
						<label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
							Kurs nomi
						</label>
						<input
							type='text'
							value={formData.courseName}
							className='w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all'
							onChange={e =>
								setFormData({ ...formData, courseName: e.target.value })
							}
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
								Sertifikat ID
							</label>
							<input
								type='text'
								value={formData.certId}
								className='w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all'
								onChange={e =>
									setFormData({ ...formData, certId: e.target.value })
								}
							/>
						</div>
						<div>
							<label className='block text-xs font-bold text-gray-500 uppercase mb-1'>
								Sana
							</label>
							<input
								type='text'
								value={formData.date}
								className='w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all'
								onChange={e =>
									setFormData({ ...formData, date: e.target.value })
								}
							/>
						</div>
					</div>

					<button
						onClick={handleSaveAndGenerate}
						disabled={isSaving}
						className='w-full bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition disabled:bg-gray-400'
					>
						{isSaving ? 'Saqlanmoqda...' : 'BAZAGA SAQLASH'}
					</button>
				</div>
			</div>

			{/* O'ng taraf: Preview */}
			<div className='lg:w-2/3 flex flex-col items-center'>
				<div className='w-full bg-white p-4 rounded-2xl shadow-xl border border-gray-200'>
					<p className='text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest'>
						Sertifikat Ko'rinishi
					</p>
					<canvas
						ref={canvasRef}
						width={1600}
						height={1131}
						className='w-full h-auto rounded-lg border border-gray-100 shadow-inner'
					/>
				</div>
			</div>
		</div>
	)
}
