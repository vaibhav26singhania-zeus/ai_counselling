import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin, signup as apiSignup } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken') || ''
  })
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken)
    } else {
      localStorage.removeItem('authToken')
    }
  }, [authToken])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (authToken) {
        try {
          // Try to fetch profile to validate token
          const response = await fetch('http://localhost:4000/auth/profile', {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })
          
          if (!response.ok) {
            // Token is invalid
            console.log('Token validation failed, clearing auth')
            setAuthToken('')
            setUser(null)
          }
        } catch (err) {
          console.error('Token validation error:', err)
          setAuthToken('')
          setUser(null)
        }
      }
      setLoading(false)
    }

    validateToken()
  }, [])

  const login = async (email, password) => {
    setError('')
    try {
      const result = await apiLogin(email, password)
      if (!result?.token) {
        throw new Error('Invalid login response')
      }
      setAuthToken(result.token)
      setUser(result.user)
      return result
    } catch (err) {
      setError(err.message || 'Login failed')
      throw err
    }
  }

  const signup = async (email, password, name) => {
    setError('')
    try {
      const result = await apiSignup(email, password, name)
      if (!result?.token) {
        throw new Error('Invalid signup response')
      }
      setAuthToken(result.token)
      setUser(result.user)
      return result
    } catch (err) {
      setError(err.message || 'Signup failed')
      throw err
    }
  }

  const logout = () => {
    setAuthToken('')
    setUser(null)
    setError('')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const value = useMemo(
    () => ({
      authToken,
      user,
      error,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: Boolean(authToken && user),
    }),
    [authToken, user, error, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
