'use client'

import { Button } from '@/components/ui/button'
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
	start_date: string
}

interface GroupFormProps {
	group?: {
		id: string
		name: string
		course_id: string
		mentor_id: string
		max_students: number
		start_date: string | null
	} | null
	onSuccess?: () => void
}

export function GroupForm({ group, onSuccess }: GroupFormProps) {
	const [formData, setFormData] = useState<GroupFormData>({
		name: group?.name || '',
		course_id: group?.course_id || '',
		mentor_id: group?.mentor_id || '',
		max_students: group?.max_students || 30,
		start_date: group?.start_date ? group.start_date.split('T')[0] : '',
	})
	const [courses, setCourses] = useState<Course[]>([])
	const [mentors, setMentors] = useState<Mentor[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingOptions, setIsLoadingOptions] = useState(true)
	const { toast } = useToast()

	useEffect(() => {
		loadOptions()
	}, [])

	const loadOptions = async () => {
		try {
			setIsLoadingOptions(true)

			const [coursesResult, mentorsResult] = await Promise.all([
				supabase.from('courses').select('id, name').order('name'),
				supabase.from('mentors').select('id, full_name').order('full_name'),
			])

			if (coursesResult.error) throw coursesResult.error
			if (mentorsResult.error) throw mentorsResult.error

			setCourses(coursesResult.data || [])
			setMentors(mentorsResult.data || [])
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
			[name]:
				name === 'max_students' ? Math.max(1, parseInt(value) || 0) : value,
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
			const dataToSubmit = {
				name: formData.name,
				course_id: formData.course_id,
				mentor_id: formData.mentor_id,
				max_students: formData.max_students,
				start_date: formData.start_date || null,
			}

			if (group?.id) {
				// Update existing group
				const { error } = await supabase
					.from('groups')
					.update(dataToSubmit)
					.eq('id', group.id)

				if (error) throw error

				toast({
					title: 'Muvaffaqiyat',
					description: 'Guruh muvaffaqiyatli yangilandi',
				})
			} else {
				// Create new group
				const { error } = await supabase.from('groups').insert(dataToSubmit)

				if (error) throw error

				toast({
					title: 'Muvaffaqiyat',
					description: 'Guruh muvaffaqiyatli yaratildi',
				})
			}

			onSuccess?.()
		} catch (error) {
			console.error('Error saving group:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error
						? error.message
						: 'Guruhni saqlashda xato yuz berdi',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
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
				<Label htmlFor='mentor_id'>O&apos;qituvchi</Label>
				<Select
					value={formData.mentor_id}
					onValueChange={value => handleSelectChange('mentor_id', value)}
					disabled={isLoading || isLoadingOptions}
				>
					<SelectTrigger id='mentor_id'>
						<SelectValue placeholder="O'qituvchini tanlang" />
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
				<Label htmlFor='max_students'>Maksimal O&apos;quvchi Soni</Label>
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

			<div className='space-y-2'>
				<Label htmlFor='start_date'>Boshlanish Sanasi (ixtiyoriy)</Label>
				<Input
					id='start_date'
					name='start_date'
					type='date'
					value={formData.start_date}
					onChange={handleChange}
					disabled={isLoading || isLoadingOptions}
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
				) : group?.id ? (
					'Yangilash'
				) : (
					'Yaratish'
				)}
			</Button>
		</form>
	)
}
