'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, LogOut } from 'lucide-react'

import { createClient } from '@/lib/client'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    const performLogout = async () => {
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Error during sign out:', error)
      } finally {
        setIsLoggingOut(false)
      }
    }

    performLogout()
  }, [])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="text-center">
            <CardHeader className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                {isLoggingOut ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isLoggingOut ? 'Logging out...' : 'You have been logged out'}
              </CardTitle>
              <CardDescription>
                {isLoggingOut
                  ? 'Please wait while we safely sign you out.'
                  : 'Your session has ended. Thank you for using the system.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isLoggingOut && (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/login"
                    className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log In Again
                  </Link>
                  <Link
                    href="/"
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                  >
                    Return to Home
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
