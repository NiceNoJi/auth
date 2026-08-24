import { LoginForm } from '@/components/login-form'
import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import { safeNextPath } from '@/lib/safe-next-path'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ถ้าล็อกอินอยู่แล้ว ให้ redirect ไปที่ ny_web (Home) หรือ URL ที่ส่งมาใน ?next=
  if (user) {
    const params = await searchParams
    const targetUrl = safeNextPath(
      params?.next,
      process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001'
    )
    redirect(targetUrl)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
