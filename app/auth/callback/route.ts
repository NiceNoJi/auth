import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { safeNextPath } from '@/lib/safe-next-path'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next')
  const defaultRedirect = process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001'
  const next = safeNextPath(nextParam, defaultRedirect)
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error || errorDescription) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(errorDescription || error || 'OAuth authentication failed')}`
    )
  }

  if (code) {
    const redirectUrl =
      next.startsWith('http://') || next.startsWith('https://') ? next : `${origin}${next}`
    const response = NextResponse.redirect(redirectUrl)
    const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.tnc.local'

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
      {
        cookieOptions: {
          domain: cookieDomain,
          path: '/',
          sameSite: 'lax',
        },
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                domain: cookieDomain,
                path: '/',
                sameSite: 'lax',
              })
            })
          },
        },
      }
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return response
    } else {
      console.error('OAuth code exchange error:', exchangeError)
      return NextResponse.redirect(
        `${origin}/auth/error?error=${encodeURIComponent(exchangeError.message)}`
      )
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent('No code found in OAuth callback')}`
  )
}
