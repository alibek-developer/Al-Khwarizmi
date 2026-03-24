import { supabase } from './supabase'

export type DashboardStats = {
  totalXP: number
  rank: number
  coursesCompleted: number
  coursesInProgress: number
  homeworkDone: number
  homeworkPending: number
  streak: number
  avgScore: number
}

export const dashboardApi = {
  getStats: async (studentId: number): Promise<DashboardStats> => {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('total_points')
      .eq('id', studentId)
      .single()
    
    if (studentError) throw studentError
    
    const { data: enrollments } = await supabase
      .from('group_enrollments')
      .select('group_id')
      .eq('student_id', studentId)
    
    const { data: submissions } = await supabase
      .from('homework_submissions')
      .select('status, grade')
      .eq('student_id', studentId)
    
    const checkedSubmissions = submissions?.filter(s => s.status === 'checked') || []
    const avgScore = checkedSubmissions.length > 0
      ? Math.round(checkedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / checkedSubmissions.length)
      : 0
    
    return {
      totalXP: student?.total_points || 0,
      rank: 0,
      coursesCompleted: 0,
      coursesInProgress: enrollments?.length || 0,
      homeworkDone: checkedSubmissions.length,
      homeworkPending: submissions?.filter(s => s.status === 'pending').length || 0,
      streak: 0,
      avgScore
    }
  },

  getCourseProgress: async (studentId: number) => {
    const { data: enrollments, error } = await supabase
      .from('group_enrollments')
      .select(`
        group:groups (
          id,
          name,
          course:courses (
            title_uz,
            lessons_count
          )
        )
      `)
      .eq('student_id', studentId)
    
    if (error) throw error
    return enrollments
  },

  getLeaderboard: async (limit: number = 10) => {
    const { data, error } = await supabase
      .from('students')
      .select('id, first_name, last_name, total_points')
      .order('total_points', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data.map((s, index) => ({
      rank: index + 1,
      name: `${s.first_name} ${s.last_name}`,
      xp: s.total_points,
      avatar: `${s.first_name[0]}${s.last_name[0]}`
    }))
  },
}
