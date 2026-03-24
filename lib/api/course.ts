import { supabase } from './supabase'

export type Course = {
  id: number
  category_id: number
  mentor_id: number
  title_en: string
  title_uz: string
  duration?: string
  level?: string
  lessons_count: number
  total_students: number
  price: number
  image_url?: string
  badge?: string
  rating: number
}

export type Group = {
  id: number
  name: string
  course_id: number
  mentor_id: number
  price: number
  duration?: string
  duration_type?: string
  schedule_days?: string
  class_time?: string
  start_date?: string
  max_students: number
  status: string
}

export type Material = {
  id: number
  group_id: number
  title: string
  file_url?: string
  link_url?: string
  category: string
}

export const courseApi = {
  getByStudentId: async (studentId: number) => {
    const { data, error } = await supabase
      .from('group_enrollments')
      .select(`
        groups (
          *,
          course:courses (*),
          mentor:mentors (*)
        )
      `)
      .eq('student_id', studentId)
    
    if (error) throw error
    return data
  },

  getByGroupId: async (groupId: number) => {
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('*, courses (*), mentors (*)')
      .eq('id', groupId)
      .single()
    
    if (groupError) throw groupError
    
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
    
    if (materialsError) throw materialsError
    
    return { group, materials }
  },

  getMaterials: async (groupId: number) => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Material[]
  },
}
