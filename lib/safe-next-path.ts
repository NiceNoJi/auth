export const safeNextPath = (path: unknown, fallback?: string) => {
  const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001'
  const defaultFallback = fallback || homeUrl

  if (typeof path !== 'string' || !path.trim()) return defaultFallback

  const trimmed = path.trim()

  // ถ้าเป็น root หรือ path ภายใน auth เอง ให้ redirect ข้ามไปที่ Home URL
  if (
    trimmed === '/' ||
    trimmed === '/auth/login' ||
    trimmed === '/auth/logout' ||
    trimmed === '/protected'
  ) {
    return homeUrl
  }

  // 1. Relative path เช่น /dashboard (ถ้ามี)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  // 2. Absolute URL ข้ามโดเมน เช่น http://home.tnc.local:3001 หรือ http://main.tnc.local:3002
  try {
    const url = new URL(trimmed)
    const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN?.replace(/^\./, '')
    const allowedHostnames = ['localhost', '127.0.0.1']

    const isAllowed =
      (cookieDomain && (url.hostname === cookieDomain || url.hostname.endsWith(`.${cookieDomain}`))) ||
      allowedHostnames.includes(url.hostname) ||
      (homeUrl && url.origin === new URL(homeUrl).origin)

    if (isAllowed && (url.protocol === 'http:' || url.protocol === 'https:')) {
      return url.toString()
    }
  } catch {
    // URL ไม่ถูกต้อง
  }

  return defaultFallback
}
