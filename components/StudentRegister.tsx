'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { sendToGoogleSheets } from '@/lib/google-sheets'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface StudentFormData {
	full_name: string
	father_name: string
	phone: string
	email: string
	certificate_id: string
}

export function StudentRegister() {
	const [formData, setFormData] = useState<StudentFormData>({
		full_name: '',
		father_name: '',
		phone: '',
		email: '',
		certificate_id: '',
	})
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const validateForm = (): boolean => {
		if (!formData.full_name.trim()) {
			toast({
				title: 'Xato',
				description: 'Ism-familya kiriting',
				variant: 'destructive',
			})
			return false
		}

		if (!formData.father_name.trim()) {
			toast({
				title: 'Xato',
				description: 'Otasining ismi kiriting',
				variant: 'destructive',
			})
			return false
		}

		if (!formData.phone.trim()) {
			toast({
				title: 'Xato',
				description: 'Telefon raqami kiriting',
				variant: 'destructive',
			})
			return false
		}

		if (!formData.email.trim() || !formData.email.includes('@')) {
			toast({
				title: 'Xato',
				description: "Elektron pochtani to'g'ri kiriting",
				variant: 'destructive',
			})
			return false
		}

		return true
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		setIsLoading(true)

		try {
			// Insert into Supabase
			const { data, error } = await supabase
				.from('students')
				.insert({
					full_name: formData.full_name,
					father_name: formData.father_name,
					phone: formData.phone,
					email: formData.email,
					certificate_id: formData.certificate_id || null,
				})
				.select()

			if (error) {
				throw error
			}

			// Send to Google Sheets
			await sendToGoogleSheets({
				full_name: formData.full_name,
				father_name: formData.father_name,
				phone: formData.phone,
				email: formData.email,
				certificate_id: formData.certificate_id,
			})

			toast({
				title: 'Muvaffaqiyat',
				description: "O'quvchi muvaffaqiyatli ro'yxatdan o'tdi",
			})

			// Reset form
			setFormData({
				full_name: '',
				father_name: '',
				phone: '',
				email: '',
				certificate_id: '',
			})
		} catch (error) {
			console.error('Registration error:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error
						? error.message
						: "Ro'yxatdan o'tishda xato yuz berdi",
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>O\'quvchi Ro\'yxatdan O\'tkazish</CardTitle>
				<CardDescription>
					Yangi o\'quvchi ma\'lumotlarini kiriting
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='full_name'>Ism-Familya</Label>
						<Input
							id='full_name'
							name='full_name'
							placeholder='John Doe'
							value={formData.full_name}
							onChange={handleChange}
							disabled={isLoading}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='father_name'>Otasining Ismi</Label>
						<Input
							id='father_name'
							name='father_name'
							placeholder='Otasining ismi'
							value={formData.father_name}
							onChange={handleChange}
							disabled={isLoading}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='phone'>Telefon Raqami</Label>
						<Input
							id='phone'
							name='phone'
							type='tel'
							placeholder='+998 99 123 45 67'
							value={formData.phone}
							onChange={handleChange}
							disabled={isLoading}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='email'>Elektron Pochta</Label>
						<Input
							id='email'
							name='email'
							type='email'
							placeholder='example@mail.com'
							value={formData.email}
							onChange={handleChange}
							disabled={isLoading}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='certificate_id'>Sertifikat ID (ixtiyoriy)</Label>
						<Input
							id='certificate_id'
							name='certificate_id'
							placeholder='CERT-12345'
							value={formData.certificate_id}
							onChange={handleChange}
							disabled={isLoading}
						/>
					</div>

					<Button type='submit' disabled={isLoading} className='w-full'>
						{isLoading ? (
							<>
								<Spinner className='mr-2 h-4 w-4' />
								Yuklanyapti...
							</>
						) : (
							"Ro'yxatdan O't"
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
