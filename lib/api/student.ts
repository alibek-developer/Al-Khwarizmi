import { supabase } from './supabase'

export type Student = {
  id: number
  first_name: string
  last_name: string
  father_name?: string
  email: string
  phone?: string
  parent_phone?: string
  birth_date?: string
  total_points: number
  avatar?: string
  color?: string
  status: string
  created_at: string
}

export const studentApi = {
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as Student
  },

  getByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single()
    if (error) throw error
    return data as Student
  },

  update: async (id: number, updates: Partial<Student>) => {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Student
  },

  updatePassword: async (id: number, newPassword: string) => {
    const { error } = await supabase
      .from('students')
      .update({ password: newPassword })
      .eq('id', id)
    if (error) throw error
  },
}
