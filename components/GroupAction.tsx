'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface GroupActionProps {
	groupId: string
	studentId: string
	isEnrolled: boolean
	onActionComplete?: () => void
}

export function GroupAction({
	groupId,
	studentId,
	isEnrolled,
	onActionComplete,
}: GroupActionProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [showDialog, setShowDialog] = useState(false)
	const { toast } = useToast()

	const handleAddStudent = async () => {
		setIsLoading(true)

		try {
			// Check if student is already enrolled
			const { data: existingEnrollment, error: checkError } = await supabase
				.from('group_enrollments')
				.select('id')
				.eq('group_id', groupId)
				.eq('student_id', studentId)
				.single()

			if (checkError && checkError.code !== 'PGRST116') {
				throw checkError
			}

			if (existingEnrollment) {
				toast({
					title: 'Ogohlantirish',
					description: "O'quvchi allaqachon bu guruhga qo'shilgan",
					variant: 'destructive',
				})
				return
			}

			// Check group max students
			const { data: groupData, error: groupError } = await supabase
				.from('groups')
				.select('max_students')
				.eq('id', groupId)
				.single()

			if (groupError) throw groupError

			const { data: enrollmentCount, error: countError } = await supabase
				.from('group_enrollments')
				.select('id')
				.eq('group_id', groupId)

			if (countError) throw countError

			if (enrollmentCount && enrollmentCount.length >= groupData.max_students) {
				toast({
					title: 'Xato',
					description: "Guruhda o'quvchilari soni to'lib ketgan",
					variant: 'destructive',
				})
				return
			}

			// Add student to group
			const { error } = await supabase.from('group_enrollments').insert({
				group_id: groupId,
				student_id: studentId,
			})

			if (error) throw error

			toast({
				title: 'Muvaffaqiyat',
				description: "O'quvchi guruhga muvaffaqiyatli qo'shildi",
			})

			onActionComplete?.()
		} catch (error) {
			console.error('Error adding student to group:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error
						? error.message
						: "O'quvchini guruhga qo'shishda xato yuz berdi",
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleRemoveStudent = async () => {
		setIsLoading(true)

		try {
			const { error } = await supabase
				.from('group_enrollments')
				.delete()
				.eq('group_id', groupId)
				.eq('student_id', studentId)

			if (error) throw error

			toast({
				title: 'Muvaffaqiyat',
				description: "O'quvchi guruhdan muvaffaqiyatli chiqarildi",
			})

			setShowDialog(false)
			onActionComplete?.()
		} catch (error) {
			console.error('Error removing student from group:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error
						? error.message
						: "O'quvchini guruhdan chiqarishda xato yuz berdi",
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			{isEnrolled ? (
				<>
					<Button
						onClick={() => setShowDialog(true)}
						disabled={isLoading}
						variant='destructive'
						size='sm'
					>
						{isLoading ? (
							<>
								<Spinner className='mr-2 h-4 w-4' />
								Yuklanyapti...
							</>
						) : (
							'Guruhdan Chiqar'
						)}
					</Button>

					<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									O\'quvchini guruhdan chiqarish
								</AlertDialogTitle>
								<AlertDialogDescription>
									Bu amalni qaytarib bo\'lmaydi. O\'quvchi guruhdan chiqariladi.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<div className='flex gap-2'>
								<AlertDialogCancel disabled={isLoading}>
									Bekor Qilish
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleRemoveStudent}
									disabled={isLoading}
									className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
								>
									{isLoading ? (
										<>
											<Spinner className='mr-2 h-4 w-4' />
											Chiqarilmoqda...
										</>
									) : (
										'Chiqar'
									)}
								</AlertDialogAction>
							</div>
						</AlertDialogContent>
					</AlertDialog>
				</>
			) : (
				<Button
					onClick={handleAddStudent}
					disabled={isLoading}
					variant='default'
					size='sm'
				>
					{isLoading ? (
						<>
							<Spinner className='mr-2 h-4 w-4' />
							Yuklanyapti...
						</>
					) : (
						"Guruhga Qo'sh"
					)}
				</Button>
			)}
		</>
	)
}
