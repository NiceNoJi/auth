'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const logout = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/auth/logout')
    } catch (error) {
      console.error('Error logging out:', error)
      router.push('/auth/logout')
    }
  }

  return (
    <Button onClick={logout} disabled={isLoading} variant="outline" className="gap-2">
      <LogOut className="h-4 w-4" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
