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
    const [studentResult, enrollmentsResult, submissionsResult, certsResult, gamesResult] =
      await Promise.all([
        supabase.from('students').select('total_points').eq('id', studentId).single(),
        supabase.from('group_enrollments').select('group_id').eq('student_id', studentId),
        supabase.from('homework_submissions').select('status, grade').eq('student_id', studentId),
        supabase.from('certificates').select('id').eq('student_id', studentId),
        supabase.from('game_results').select('played_at').eq('student_id', studentId).order('played_at', { ascending: false }),
      ])

    if (studentResult.error) throw studentResult.error

    const student = studentResult.data
    const enrollments = enrollmentsResult.data
    const submissions = submissionsResult.data
    const certificates = certsResult.data
    const games = gamesResult.data || []

    // Rank: nechta student ko'proq XP ga ega
    const { count: rankCount } = await supabase
      .from('students')
      .select('id', { count: 'exact', head: true })
      .gt('total_points', student?.total_points || 0)

    const checkedSubmissions = submissions?.filter(s => s.status === 'checked') || []
    const avgScore = checkedSubmissions.length > 0
      ? Math.round(checkedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / checkedSubmissions.length)
      : 0

    let streak = 0
    if (games.length > 0) {
      const dates = [...new Set(games.map(g => g.played_at?.split('T')[0]))].sort((a, b) => b.localeCompare(a))
      streak = 1
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1])
        const curr = new Date(dates[i])
        const diff = (prev.getTime() - curr.getTime()) / 86400000
        if (Math.abs(diff - 1) < 0.1) streak++
        else break
      }
    }

    return {
      totalXP: student?.total_points || 0,
      rank: (rankCount || 0) + 1,
      coursesCompleted: certificates?.length || 0,
      coursesInProgress: enrollments?.length || 0,
      homeworkDone: checkedSubmissions.length,
      homeworkPending: submissions?.filter(s => s.status === 'pending').length || 0,
      streak,
      avgScore,
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
      avatar: `${s.first_name[0]}${s.last_name[0]}`,
    }))
  },
}
