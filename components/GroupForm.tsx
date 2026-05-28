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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

interface Course {
	id: string
	name: string
}

interface Mentor {
	id: string
	full_name: string
}

interface GroupFormData {
	name: string
	course_id: string
	mentor_id: string
	max_students: number
}

interface GroupFormProps {
	onSuccess?: () => void
}

export function GroupForm({ onSuccess }: GroupFormProps) {
	const [formData, setFormData] = useState<GroupFormData>({
		name: '',
		course_id: '',
		mentor_id: '',
		max_students: 30,
	})
	const [courses, setCourses] = useState<Course[]>([])
	const [mentors, setMentors] = useState<Mentor[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingOptions, setIsLoadingOptions] = useState(true)
	const { toast } = useToast()

	// Load courses and mentors
	useEffect(() => {
		loadOptions()
	}, [])

	const loadOptions = async () => {
		try {
			setIsLoadingOptions(true)

			// Load courses
			const { data: coursesData, error: coursesError } = await supabase
				.from('courses')
				.select('id, name')
				.order('name')

			if (coursesError) throw coursesError
			setCourses(coursesData || [])

			// Load mentors
			const { data: mentorsData, error: mentorsError } = await supabase
				.from('mentors')
				.select('id, full_name')
				.order('full_name')

			if (mentorsError) throw mentorsError
			setMentors(mentorsData || [])
		} catch (error) {
			console.error('Error loading options:', error)
			toast({
				title: 'Xato',
				description: "Kurslar va o'qituvchilarni yuklashda xato",
				variant: 'destructive',
			})
		} finally {
			setIsLoadingOptions(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: name === 'max_students' ? parseInt(value) || 0 : value,
		}))
	}

	const handleSelectChange = (name: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const validateForm = (): boolean => {
		if (!formData.name.trim()) {
			toast({
				title: 'Xato',
				description: 'Guruh nomini kiriting',
				variant: 'destructive',
			})
			return false
		}

		if (!formData.course_id) {
			toast({
				title: 'Xato',
				description: 'Kursni tanlang',
				variant: 'destructive',
			})
			return false
		}

		if (!formData.mentor_id) {
			toast({
				title: 'Xato',
				description: "O'qituvchini tanlang",
				variant: 'destructive',
			})
			return false
		}

		if (formData.max_students <= 0) {
			toast({
				title: 'Xato',
				description: "Maksimal o'quvchi soni 0 dan katta bo'lishi kerak",
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
			const { error } = await supabase.from('groups').insert({
				name: formData.name,
				course_id: formData.course_id,
				mentor_id: formData.mentor_id,
				max_students: formData.max_students,
			})

			if (error) throw error

			toast({
				title: 'Muvaffaqiyat',
				description: 'Guruh muvaffaqiyatli yaratildi',
			})

			// Reset form
			setFormData({
				name: '',
				course_id: '',
				mentor_id: '',
				max_students: 30,
			})

			onSuccess?.()
		} catch (error) {
			console.error('Error creating group:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error
						? error.message
						: 'Guruhni yaratishda xato yuz berdi',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle>Yangi Guruh Yaratish</CardTitle>
				<CardDescription>Guruh ma\'lumotlarini kiriting</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Guruh Nomi</Label>
						<Input
							id='name'
							name='name'
							placeholder='Masalan: Web Development 101'
							value={formData.name}
							onChange={handleChange}
							disabled={isLoading || isLoadingOptions}
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='course_id'>Kurs</Label>
						<Select
							value={formData.course_id}
							onValueChange={value => handleSelectChange('course_id', value)}
							disabled={isLoading || isLoadingOptions}
						>
							<SelectTrigger id='course_id'>
								<SelectValue placeholder='Kursni tanlang' />
							</SelectTrigger>
							<SelectContent>
								{courses.map(course => (
									<SelectItem key={course.id} value={course.id}>
										{course.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='mentor_id'>O\'qituvchi</Label>
						<Select
							value={formData.mentor_id}
							onValueChange={value => handleSelectChange('mentor_id', value)}
							disabled={isLoading || isLoadingOptions}
						>
							<SelectTrigger id='mentor_id'>
								<SelectValue placeholder="O\'qituvchini tanlang" />
							</SelectTrigger>
							<SelectContent>
								{mentors.map(mentor => (
									<SelectItem key={mentor.id} value={mentor.id}>
										{mentor.full_name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='max_students'>Maksimal O\'quvchi Soni</Label>
						<Input
							id='max_students'
							name='max_students'
							type='number'
							min='1'
							value={formData.max_students}
							onChange={handleChange}
							disabled={isLoading || isLoadingOptions}
							required
						/>
					</div>

					<Button
						type='submit'
						disabled={isLoading || isLoadingOptions}
						className='w-full'
					>
						{isLoading ? (
							<>
								<Spinner className='mr-2 h-4 w-4' />
								Yuklanyapti...
							</>
						) : (
							'Guruh Yaratish'
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
