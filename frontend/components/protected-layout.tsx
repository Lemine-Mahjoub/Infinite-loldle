'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useMounted } from '@/hooks/use-mounted'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const mounted = useMounted()

  React.useEffect(() => {
    // Only redirect after component is mounted and not loading
    if (mounted && !isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router, mounted])

  // Show loading during SSR and while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // If no user after loading, show loading (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return <>{children}</>
}