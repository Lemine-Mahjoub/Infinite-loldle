'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: number
  username: string
  email: string
  score: number
  champ: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Update API base URL - make sure it matches your backend port
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Ensure we're on the client side before accessing localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only run after component is mounted (client-side only)
    if (!mounted) return

    // Check if user is logged in on app start
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      verifyToken(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [mounted])

  const verifyToken = async (tokenToVerify: string) => {
    try {
      console.log('Verifying token at:', `${API_BASE_URL}/auth/verify`)
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Verify response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Verify response data:', data)
        setUser(data.user)
        setToken(tokenToVerify)
      } else {
        const errorData = await response.text()
        console.log('Verify error:', errorData)
        // Token is invalid, remove it
        if (mounted && typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Token verification error:', error)
      if (mounted && typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login at:', `${API_BASE_URL}/auth/login`)
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      console.log('Login response status:', response.status)
      const data = await response.json()
      console.log('Login response data:', data)

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        if (mounted && typeof window !== 'undefined') {
          localStorage.setItem('token', data.token)
        }
        return true
      } else {
        console.error('Login error:', data.error)
        return false
      }
    } catch (error) {
      console.error('Login network error:', error)
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting registration at:', `${API_BASE_URL}/auth/register`)
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })

      console.log('Register response status:', response.status)
      const data = await response.json()
      console.log('Register response data:', data)

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        if (mounted && typeof window !== 'undefined') {
          localStorage.setItem('token', data.token)
        }
        return true
      } else {
        console.error('Registration error:', data.error)
        return false
      }
    } catch (error) {
      console.error('Registration network error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (mounted && typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    token
  }

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        user: null,
        login: async () => false,
        register: async () => false,
        logout: () => {},
        isLoading: true,
        token: null
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}