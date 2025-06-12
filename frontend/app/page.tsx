'use client'

import React from 'react'
import ProtectedLayout from '@/components/protected-layout'
import Header from '@/components/header'
import { GuessTheChampion } from '@/components/guess-the-champion'
import { AuthProvider } from "@/components/auth-provider"

export default function HomePage() {
  return (
    <AuthProvider>
      <ProtectedLayout>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <GuessTheChampion />
          </div>
        </div>
      </ProtectedLayout>
    </AuthProvider>
  )
}
