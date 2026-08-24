'use server'

import { createClient } from '@/lib/server'
import { safeNextPath } from '@/lib/safe-next-path'

export async function loginWithEmailAction(formData: {
  email: string
  password: string
  next?: string | null
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email.trim(),
    password: formData.password,
  })

  if (error) {
    return {
      error:
        error.message === 'Invalid login credentials'
          ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
          : error.message,
    }
  }

  const targetUrl = safeNextPath(
    formData.next,
    process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001'
  )

  return { success: true, redirectTo: targetUrl }
}
