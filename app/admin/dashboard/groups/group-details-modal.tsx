'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Student {
	id: string
	full_name: string
	email: string
	phone: string
}

interface GroupStudent extends Student {
	enrollment_id: string
}

interface Group {
	id: string
	name: string
	max_students: number
	group_enrollments: { id: string }[]
}

interface GroupDetailsModalProps {
	group: Group
	open: boolean
	onOpenChange: (open: boolean) => void
	onRefresh: () => void
}

export function GroupDetailsModal({
	group,
	open,
	onOpenChange,
	onRefresh,
}: GroupDetailsModalProps) {
	const [enrolledStudents, setEnrolledStudents] = useState<GroupStudent[]>([])
	const [availableStudents, setAvailableStudents] = useState<Student[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isAddingStudent, setIsAddingStudent] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedStudentId, setSelectedStudentId] = useState<string>('')
	const { toast } = useToast()

	useEffect(() => {
		if (open) {
			loadGroupStudents()
			loadAvailableStudents()
		}
	}, [open, group.id])

	const loadGroupStudents = async () => {
		try {
			setIsLoading(true)

			const { data, error } = await supabase
				.from('group_enrollments')
				.select(
					`
          id,
          student:students(id, full_name, email, phone)
        `,
				)
				.eq('group_id', group.id)

			if (error) throw error

			const students = (data || []).map((enrollment: any) => ({
				enrollment_id: enrollment.id,
				...enrollment.student,
			}))

			setEnrolledStudents(students)
		} catch (error) {
			console.error('Error loading group students:', error)
			toast({
				title: 'Xato',
				description: "O'quvchilarni yuklashda xato",
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const loadAvailableStudents = async () => {
		try {
			const { data, error } = await supabase
				.from('students')
				.select('id, full_name, email, phone')
				.order('full_name')

			if (error) throw error

			setAvailableStudents(data || [])
		} catch (error) {
			console.error('Error loading available students:', error)
		}
	}

	const getFilteredAvailableStudents = () => {
		const enrolledIds = new Set(enrolledStudents.map(s => s.id))
		return availableStudents
			.filter(s => !enrolledIds.has(s.id))
			.filter(
				s =>
					s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					s.email.toLowerCase().includes(searchQuery.toLowerCase()),
			)
	}

	const handleAddStudent = async () => {
		if (!selectedStudentId) {
			toast({
				title: 'Xato',
				description: "O'quvchini tanlang",
				variant: 'destructive',
			})
			return
		}

		// Check if group is full
		if (enrolledStudents.length >= group.max_students) {
			toast({
				title: 'Xato',
				description: "Guruhda o'quvchilari soni to'lib ketgan",
				variant: 'destructive',
			})
			return
		}

		setIsAddingStudent(true)

		try {
			const { error } = await supabase.from('group_enrollments').insert({
				group_id: group.id,
				student_id: selectedStudentId,
			})

			if (error) throw error

			toast({
				title: 'Muvaffaqiyat',
				description: "O'quvchi guruhga qo'shildi",
			})

			setSelectedStudentId('')
			setSearchQuery('')
			await loadGroupStudents()
			onRefresh()
		} catch (error) {
			console.error('Error adding student:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error ? error.message : "O'quvchini qo'shishda xato",
				variant: 'destructive',
			})
		} finally {
			setIsAddingStudent(false)
		}
	}

	const handleRemoveStudent = async (enrollmentId: string) => {
		try {
			const { error } = await supabase
				.from('group_enrollments')
				.delete()
				.eq('id', enrollmentId)

			if (error) throw error

			toast({
				title: 'Muvaffaqiyat',
				description: "O'quvchi guruhdan chiqarildi",
			})

			await loadGroupStudents()
			onRefresh()
		} catch (error) {
			console.error('Error removing student:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error
						? error.message
						: "O'quvchini chiqarishda xato",
				variant: 'destructive',
			})
		}
	}

	const filteredStudents = getFilteredAvailableStudents()

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>{group.name}</DialogTitle>
					<DialogDescription>
						Guruh tafsilotlari va biriktirilgan o&apos;quvchilar
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-6'>
					{/* Statistics */}
					<div className='grid grid-cols-3 gap-4'>
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle className='text-sm font-medium text-muted-foreground'>
									Biriktirilgan
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>
									{enrolledStudents.length}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle className='text-sm font-medium text-muted-foreground'>
									Maksimal
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>{group.max_students}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className='pb-3'>
								<CardTitle className='text-sm font-medium text-muted-foreground'>
									Qoldiq
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold'>
									{Math.max(0, group.max_students - enrolledStudents.length)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Add Student Section */}
					<Card>
						<CardHeader>
							<CardTitle className='text-base'>
								O&apos;quvchi Qo&apos;shish
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='student-search'>
									O&apos;quvchi izlash va tanlash
								</Label>
								<div className='flex gap-2'>
									<div className='relative flex-1'>
										<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
										<Input
											id='student-search'
											placeholder='Ism yoki pochtani kiriting...'
											value={searchQuery}
											onChange={e => setSearchQuery(e.target.value)}
											className='pl-8'
										/>
									</div>
									<Button
										onClick={handleAddStudent}
										disabled={
											!selectedStudentId ||
											isAddingStudent ||
											enrolledStudents.length >= group.max_students
										}
									>
										{isAddingStudent ? (
											<Spinner className='h-4 w-4' />
										) : (
											"Qo'shish"
										)}
									</Button>
								</div>
							</div>

							{/* Student List Dropdown */}
							{searchQuery && filteredStudents.length > 0 && (
								<div className='border rounded-lg max-h-48 overflow-y-auto'>
									{filteredStudents.map(student => (
										<button
											key={student.id}
											onClick={() => {
												setSelectedStudentId(student.id)
												setSearchQuery('')
											}}
											className='w-full text-left px-4 py-2 hover:bg-muted border-b last:border-b-0 flex items-center justify-between'
										>
											<div>
												<p className='font-medium text-sm'>
													{student.full_name}
												</p>
												<p className='text-xs text-muted-foreground'>
													{student.email}
												</p>
											</div>
											{selectedStudentId === student.id && (
												<Badge>Tanlandi</Badge>
											)}
										</button>
									))}
								</div>
							)}

							{searchQuery && filteredStudents.length === 0 && (
								<p className='text-sm text-muted-foreground text-center py-4'>
									Mavjud bo&apos;lmagan yoki allaqachon qo&apos;shilgan
									o&apos;quvchi
								</p>
							)}
						</CardContent>
					</Card>

					{/* Enrolled Students List */}
					<Card>
						<CardHeader>
							<CardTitle className='text-base'>
								Biriktirilgan O&apos;quvchilar ({enrolledStudents.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className='flex items-center justify-center h-32'>
									<Spinner className='h-6 w-6' />
								</div>
							) : enrolledStudents.length === 0 ? (
								<p className='text-center text-muted-foreground py-8'>
									Hali biriktirilgan o&apos;quvchi yo&apos;q
								</p>
							) : (
								<div className='border rounded-lg overflow-hidden'>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Ism-Familya</TableHead>
												<TableHead>Pochta</TableHead>
												<TableHead>Telefon</TableHead>
												<TableHead className='text-right'>Amallar</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{enrolledStudents.map(student => (
												<TableRow key={student.id}>
													<TableCell className='font-medium'>
														{student.full_name}
													</TableCell>
													<TableCell className='text-sm'>
														{student.email}
													</TableCell>
													<TableCell className='text-sm'>
														{student.phone}
													</TableCell>
													<TableCell className='text-right'>
														<Button
															size='sm'
															variant='ghost'
															onClick={() =>
																handleRemoveStudent(student.enrollment_id)
															}
															className='text-red-600 hover:text-red-700'
														>
															<X className='h-4 w-4' />
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	)
}
