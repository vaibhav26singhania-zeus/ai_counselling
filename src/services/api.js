import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export async function signup(email, password, name) {
  const response = await api.post('/auth/register', { email, password, name })
  return response.data
}

export async function sendChatMessage(message, authToken, language = 'hi') {
  const response = await api.post(
    '/chat',
    { message, language },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  )
  return response.data
}

export async function fetchDashboardData(authToken) {
  const response = await api.get('/dashboard', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
  return response.data
}
