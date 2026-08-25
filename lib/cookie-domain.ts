export function getCookieDomain(hostname?: string | null): string | undefined {
  if (!hostname && typeof window !== 'undefined') {
    hostname = window.location.hostname
  }

  if (!hostname) {
    return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined
  }

  // ถ้าเข้าผ่าน IP (เช่น 192.168.x.x) หรือ localhost ต้องไม่ใส่ domain เพื่อให้เบราว์เซอร์รับคุกกี้
  const isIpOrLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)

  if (isIpOrLocal) {
    return undefined
  }

  const configuredDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  if (configuredDomain) {
    const cleanConfigDomain = configuredDomain.replace(/^\./, '')
    if (hostname === cleanConfigDomain || hostname.endsWith(`.${cleanConfigDomain}`)) {
      return configuredDomain.startsWith('.') ? configuredDomain : `.${configuredDomain}`
    }
  }

  if (hostname.endsWith('.tnc.local')) {
    return '.tnc.local'
  }

  // บน Vercel ฟรี (*.vercel.app) ไม่สามารถเซ็ต domain ได้
  if (hostname.endsWith('.vercel.app')) {
    return undefined
  }

  return undefined
}
