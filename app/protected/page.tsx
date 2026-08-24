import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  redirect(process.env.NEXT_PUBLIC_HOME_URL || 'http://home.tnc.local:3001')
}
