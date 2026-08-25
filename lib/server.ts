import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'
import { getCookieDomain } from './cookie-domain'

export async function createClient() {
  const cookieStore = await cookies()
  const headerList = await headers()
  const host = headerList.get('host')?.split(':')[0]
  const cookieDomain = getCookieDomain(host)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookieOptions: {
        ...(cookieDomain ? { domain: cookieDomain } : {}),
        path: '/',
        sameSite: 'lax',
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                ...(cookieDomain ? { domain: cookieDomain } : {}),
                path: '/',
                sameSite: 'lax',
              })
            )
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )
}
