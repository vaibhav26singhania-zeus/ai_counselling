import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export async function sendChatMessage(message, authToken) {
  const response = await api.post(
    '/chat',
    { message },
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
