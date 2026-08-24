'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { safeNextPath } from '@/lib/safe-next-path'
import { createClient } from '@/lib/client'
import { loginWithEmailAction } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const next = new URLSearchParams(window.location.search).get('next')
      const result = await loginWithEmailAction({
        email,
        password,
        next,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result?.redirectTo) {
        window.location.href = result.redirectTo
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      setIsLoading(false)
    }
  }

  const handleMicrosoftLogin = async () => {
    const supabase = createClient()
    setIsOAuthLoading(true)
    setError(null)

    try {
      const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001'
      const nextParam = new URLSearchParams(window.location.search).get('next')
      const next = safeNextPath(nextParam, homeUrl)
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo,
          scopes: 'email profile openid',
        },
      })
      if (oauthError) throw oauthError
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการล็อกอินด้วย Microsoft 365')
      setIsOAuthLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="shadow-lg border border-gray-200/80 bg-white">
        <CardHeader className="text-center pb-4 pt-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold text-xl shadow-md">
            TNC
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            เข้าสู่ระบบ
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 mt-1">
            ศูนย์กลางการยืนยันตัวตน TNC Central Auth (SSO)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="flex flex-col gap-4">
            {/* 1. ปุ่มล็อกอิน Microsoft 365 */}
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2.5 h-11 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-all shadow-sm"
              onClick={handleMicrosoftLogin}
              disabled={isLoading || isOAuthLoading}
            >
              {isOAuthLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
              ) : (
                <svg className="size-4 shrink-0" viewBox="0 0 23 23" aria-hidden="true">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
              )}
              <span className="text-xs font-semibold">
                {isOAuthLoading ? 'กำลังเชื่อมต่อ Microsoft 365...' : 'เข้าสู่ระบบด้วย Microsoft 365'}
              </span>
            </Button>

            {/* ตัวแบ่งเส้น (Divider) */}
            <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
              <span className="relative z-10 bg-white px-2.5 text-gray-400 font-normal">
                หรือเข้าสู่ระบบด้วยอีเมล
              </span>
            </div>

            {/* 2. ฟอร์มล็อกอินด้วย Email / Password */}
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-3.5">
                <div className="grid gap-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                    อีเมล (Email)
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@tnc.local"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 text-xs pl-9"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-medium text-gray-700">
                      รหัสผ่าน (Password)
                    </Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-[11px] text-amber-600 hover:text-amber-700 hover:underline"
                    >
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 text-xs pl-9 pr-9"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-2.5 text-xs text-red-600 border border-red-200">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition-all mt-1"
                  disabled={isLoading || isOAuthLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      กำลังเข้าสู่ระบบ...
                    </span>
                  ) : (
                    'เข้าสู่ระบบด้วยอีเมล'
                  )}
                </Button>
              </div>

              <div className="mt-4 text-center text-xs text-gray-500">
                ยังไม่มีบัญชีผู้ใช้?{' '}
                <Link
                  href="/auth/sign-up"
                  className="font-medium text-amber-600 hover:text-amber-700 underline underline-offset-2"
                >
                  สมัครสมาชิก (Sign up)
                </Link>
              </div>
            </form>

            <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-gray-400 border-t pt-3">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              <span>ระบบรักษาความปลอดภัย Single Sign-On (*.tnc.local)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
