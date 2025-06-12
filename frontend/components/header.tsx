'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Trophy, Home } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              Loldle
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Jeu</span>
              </Link>
              <Link
                href="/leaderboard"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors"
              >
                <Trophy className="h-4 w-4" />
                <span>Classement</span>
              </Link>
            </nav>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-medium">{user.username}</div>
                <div className="text-slate-400 text-sm">{user.score} points</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}