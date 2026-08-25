export const safeNextPath = (
  path: unknown,
  fallback?: string,
  currentOrigin?: string
) => {
  let defaultFallback = fallback || process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001'

  // ถ้าเครื่องอื่นเปิดผ่าน IP หรือ Vercel แล้วไม่มี fallback ส่งมา ให้สร้าง fallback จาก origin ปัจจุบัน
  if (!fallback && typeof window !== 'undefined') {
    const origin = currentOrigin || window.location.origin
    const hostname = window.location.hostname
    const port = window.location.port

    // ถ้าเข้าผ่าน IP (เช่น 192.168.1.50:3000) ให้ส่งไปที่พอร์ต 3001
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)
    if (isIp && port === '3000') {
      defaultFallback = `${window.location.protocol}//${hostname}:3001`
    }
  }

  if (typeof path !== 'string' || !path.trim()) return defaultFallback

  const trimmed = path.trim()

  // ถ้าเป็นหน้า login หรือ auth ภายในเอง ให้ข้ามไปที่ defaultFallback
  if (
    trimmed === '/' ||
    trimmed === '/auth/login' ||
    trimmed === '/auth/logout' ||
    trimmed === '/protected'
  ) {
    return defaultFallback
  }

  // 1. Relative path เช่น /dashboard (ถ้ามี)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed
  }

  // 2. Absolute URL (เช่น http://192.168.1.50:3001 หรือ https://web-test-sable.vercel.app หรือ http://home.tnc.local:3001)
  try {
    const url = new URL(trimmed)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString()
    }
  } catch {
    // URL ไม่ถูกต้อง
  }

  return defaultFallback
}
