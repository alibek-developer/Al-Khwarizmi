import { supabase } from './supabase'

export type Homework = {
  id: number
  group_id: number
  title: string
  description?: string
  due_date?: string
  file_url?: string
  group?: { name: string }
}

export type HomeworkSubmission = {
  id: number
  homework_id: number
  student_id: number
  file_url?: string
  comment?: string
  status: 'pending' | 'accepted' | 'rejected'
  grade?: number
  mentor_feedback?: string
  submitted_at: string
}

export const homeworkApi = {
  getByStudentId: async (studentId: number) => {
    const { data: enrollments, error: enrollError } = await supabase
      .from('group_enrollments')
      .select('group_id')
      .eq('student_id', studentId)
    
    if (enrollError) throw enrollError
    if (!enrollments.length) return []
    
    const groupIds = enrollments.map((e: { group_id: number }) => e.group_id)
    
    const { data: homeworks, error: homeworksError } = await supabase
      .from('homeworks')
      .select('*, group:groups(name)')
      .in('group_id', groupIds)
      .order('due_date', { ascending: true })
    
    if (homeworksError) throw homeworksError
    
    const { data: submissions, error: submissionsError } = await supabase
      .from('homework_submissions')
      .select('*')
      .eq('student_id', studentId)
    
    if (submissionsError) throw submissionsError
    
    const homeworksWithStatus = homeworks.map((hw: Homework) => {
      const submission = submissions?.find((s: HomeworkSubmission) => s.homework_id === hw.id)
      return {
        ...hw,
        submission: submission || null
      }
    })
    
    return homeworksWithStatus
  },

  submit: async (
    homeworkId: number,
    studentId: number,
    fileUrl: string,
    comment?: string
  ) => {
    const { data, error } = await supabase
      .from('homework_submissions')
      .insert({
        homework_id: homeworkId,
        student_id: studentId,
        file_url: fileUrl,
        comment: comment,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  resubmit: async (
    submissionId: number,
    fileUrl: string,
    comment?: string
  ) => {
    const { data, error } = await supabase
      .from('homework_submissions')
      .update({
        file_url: fileUrl,
        comment: comment,
        status: 'pending'
      })
      .eq('id', submissionId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
}
