import { supabase } from './supabase'

export type GameResult = {
  id: number
  student_id: number
  game_name: string
  points_earned: number
  played_at: string
}

export const gameApi = {
  saveResult: async (studentId: number, gameName: string, pointsEarned: number) => {
    const { data, error } = await supabase
      .from('game_results')
      .insert({
        student_id: studentId,
        game_name: gameName,
        points_earned: pointsEarned
      })
      .select()
      .single()
    
    if (error) throw error
    
    await supabase.rpc('increment_student_points', {
      student_id: studentId,
      points: pointsEarned
    })
    
    return data
  },

  getByStudentId: async (studentId: number) => {
    const { data, error } = await supabase
      .from('game_results')
      .select('*')
      .eq('student_id', studentId)
      .order('played_at', { ascending: false })
    
    if (error) throw error
    return data as GameResult[]
  },

  getStats: async (studentId: number) => {
    const { data, error } = await supabase
      .from('game_results')
      .select('game_name, points_earned')
      .eq('student_id', studentId)
    
    if (error) throw error
    
    const stats: Record<string, { count: number; totalPoints: number }> = {}
    
    data.forEach((result) => {
      if (!stats[result.game_name]) {
        stats[result.game_name] = { count: 0, totalPoints: 0 }
      }
      stats[result.game_name].count += 1
      stats[result.game_name].totalPoints += result.points_earned
    })
    
    return stats
  },
}
