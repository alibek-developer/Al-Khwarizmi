import { supabase } from './supabase'

export type Certificate = {
  id: number
  student_id: number
  course_id: number
  certificate_url: string
  issue_date: string
  expiry_date?: string
  course?: {
    title_uz: string
    title_en: string
  }
}

export const certificateApi = {
  getByStudentId: async (studentId: number) => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, course:courses(title_uz, title_en)')
      .eq('student_id', studentId)
      .order('issue_date', { ascending: false })
    
    if (error) throw error
    return data as Certificate[]
  },
}
