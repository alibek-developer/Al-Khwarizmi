'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
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
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GroupDetailsModal } from './group-details-modal'
import { GroupForm } from './group-form'

interface Group {
	id: string
	name: string
	course_id: string
	mentor_id: string
	max_students: number
	start_date: string | null
	course: {
		name: string
	}
	mentor: {
		full_name: string
	}
	group_enrollments: {
		id: string
	}[]
}

export default function GroupsPage() {
	const [groups, setGroups] = useState<Group[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
	const [editingGroup, setEditingGroup] = useState<Group | null>(null)
	const { toast } = useToast()

	useEffect(() => {
		loadGroups()
	}, [])

	const loadGroups = async () => {
		try {
			setIsLoading(true)

			const { data, error } = await supabase
				.from('groups')
				.select(
					`
          id,
          name,
          course_id,
          mentor_id,
          max_students,
          start_date,
          course:courses(name),
          mentor:mentors(full_name),
          group_enrollments(id)
        `,
				)
				.order('created_at', { ascending: false })

			if (error) throw error

			setGroups(data || [])
		} catch (error) {
			console.error('Error loading groups:', error)
			toast({
				title: 'Xato',
				description: 'Guruhlarni yuklashda xato yuz berdi',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleDeleteGroup = async (groupId: string) => {
		try {
			// First delete all enrollments
			const { error: deleteEnrollmentsError } = await supabase
				.from('group_enrollments')
				.delete()
				.eq('group_id', groupId)

			if (deleteEnrollmentsError) throw deleteEnrollmentsError

			// Then delete the group
			const { error: deleteGroupError } = await supabase
				.from('groups')
				.delete()
				.eq('id', groupId)

			if (deleteGroupError) throw deleteGroupError

			toast({
				title: 'Muvaffaqiyat',
				description: "Guruh o'chirildi",
			})

			loadGroups()
		} catch (error) {
			console.error('Error deleting group:', error)
			toast({
				title: 'Xato',
				description:
					error instanceof Error ? error.message : "Guruhni o'chirishda xato",
				variant: 'destructive',
			})
		}
	}

	const handleGroupSaved = () => {
		setIsDialogOpen(false)
		setEditingGroup(null)
		loadGroups()
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>Guruhlar</h1>
					<p className='text-muted-foreground mt-2'>
						Barcha guruhlar va ularning ma'lumotlarini boshqaring
					</p>
				</div>

				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setEditingGroup(null)} size='lg'>
							+ Yangi Guruh Qo'shish
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-md'>
						<DialogHeader>
							<DialogTitle>
								{editingGroup ? 'Guruhni Tahrirlash' : 'Yangi Guruh Yaratish'}
							</DialogTitle>
							<DialogDescription>
								{editingGroup
									? "Guruh ma'lumotlarini yangilang"
									: "Yangi guruh yaratish uchun ma'lumotlarni kiriting"}
							</DialogDescription>
						</DialogHeader>
						<GroupForm group={editingGroup} onSuccess={handleGroupSaved} />
					</DialogContent>
				</Dialog>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Barcha Guruhlar</CardTitle>
					<CardDescription>
						{isLoading ? 'Yuklanyapti...' : `Jami ${groups.length} ta guruh`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className='flex items-center justify-center h-64'>
							<Spinner className='h-8 w-8' />
						</div>
					) : groups.length === 0 ? (
						<div className='text-center h-64 flex items-center justify-center'>
							<div>
								<p className='text-muted-foreground mb-4'>
									Hali guruhlar mavjud emas
								</p>
								<Button onClick={() => setIsDialogOpen(true)} variant='outline'>
									Birinchi guruhni yaratish
								</Button>
							</div>
						</div>
					) : (
						<div className='border rounded-lg overflow-hidden'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Guruh Nomi</TableHead>
										<TableHead>Kurs</TableHead>
										<TableHead>Mentor</TableHead>
										<TableHead className='text-center'>Talabalar</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className='text-right'>Amallar</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{groups.map(group => (
										<TableRow key={group.id} className='hover:bg-muted/50'>
											<TableCell className='font-medium'>
												<button
													onClick={() => setSelectedGroup(group)}
													className='hover:underline text-blue-600 dark:text-blue-400'
												>
													{group.name}
												</button>
											</TableCell>
											<TableCell>
												{Array.isArray(group.course)
													? group.course[0]?.name
													: (group.course as any)?.name}
											</TableCell>
											<TableCell>
												{Array.isArray(group.mentor)
													? group.mentor[0]?.full_name
													: (group.mentor as any)?.full_name}
											</TableCell>
											<TableCell className='text-center'>
												<Badge variant='secondary'>
													{group.group_enrollments?.length || 0}/
													{group.max_students}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant={
														(group.group_enrollments?.length || 0) >=
														group.max_students
															? 'destructive'
															: 'default'
													}
												>
													{(group.group_enrollments?.length || 0) >=
													group.max_students
														? "To'iq"
														: 'Ochiq'}
												</Badge>
											</TableCell>
											<TableCell className='text-right space-x-2'>
												<Button
													size='sm'
													variant='ghost'
													onClick={() => setEditingGroup(group)}
													className='inline-flex'
												>
													<Pencil className='h-4 w-4' />
												</Button>
												<Button
													size='sm'
													variant='ghost'
													onClick={() => handleDeleteGroup(group.id)}
													className='inline-flex text-red-600 hover:text-red-700'
												>
													<Trash2 className='h-4 w-4' />
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

			{selectedGroup && (
				<GroupDetailsModal
					group={selectedGroup}
					open={!!selectedGroup}
					onOpenChange={open => !open && setSelectedGroup(null)}
					onRefresh={loadGroups}
				/>
			)}
		</div>
	)
}
