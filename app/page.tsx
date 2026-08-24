import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ถ้าล็อกอินแล้ว ให้ไปที่ ny_web (Home)
  if (user) {
    redirect(process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001')
  }

  // ถ้ายังไม่ล็อกอิน ให้ไปที่หน้า Login ทันที
  redirect('/auth/login')
}
