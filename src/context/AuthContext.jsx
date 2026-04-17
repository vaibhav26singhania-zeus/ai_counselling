import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as apiLogin } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken') || ''
  })
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken)
    } else {
      localStorage.removeItem('authToken')
    }
  }, [authToken])

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail)
    } else {
      localStorage.removeItem('userEmail')
    }
  }, [userEmail])

  const login = async (email, password) => {
    setError('')
    const result = await apiLogin(email, password)
    if (!result?.token) {
      throw new Error('Invalid login response')
    }
    setAuthToken(result.token)
    setUserEmail(email)
    return result
  }

  const logout = () => {
    setAuthToken('')
    setUserEmail('')
    setError('')
  }

  const value = useMemo(
    () => ({
      authToken,
      userEmail,
      error,
      login,
      logout,
      isAuthenticated: Boolean(authToken),
    }),
    [authToken, userEmail, error],
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
