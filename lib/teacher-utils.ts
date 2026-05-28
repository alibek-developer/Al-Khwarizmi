import { supabase } from '@/lib/supabase'

export async function getMentorId(): Promise<number | null> {
  const stored = localStorage.getItem('teacherMentorId')
  if (stored && parseInt(stored) > 0) return parseInt(stored)
  const env = process.env.NEXT_PUBLIC_MENTOR_ID
  if (env && parseInt(env) > 0) return parseInt(env)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null
  const { data } = await supabase
    .from('mentors')
    .select('id')
    .eq('email', user.email)
    .single()
  if (data?.id) {
    localStorage.setItem('teacherMentorId', String(data.id))
    return data.id
  }
  return null
}
