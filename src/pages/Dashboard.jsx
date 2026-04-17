import { useEffect, useState } from 'react'
import { fetchDashboardData } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { authToken } = useAuth()

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      try {
        const result = await fetchDashboardData(authToken)
        if (active) {
          setData(result)
        }
      } catch (err) {
        setError('Unable to load dashboard data. Please refresh.')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      active = false
    }
  }, [authToken])

  return (
    <section className="page dashboard-page">
      <div className="panel">
        <div className="page-heading">
          <h1>Financial Dashboard</h1>
          <p>Track your savings, goals, and progress in one place.</p>
        </div>
        {loading ? (
          <div className="status-message">Loading dashboard…</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h2>Savings</h2>
              <p className="large-text">{data?.savingsAmount ?? '—'}</p>
              <p>{data?.savingsLabel ?? 'Monthly savings progress'}</p>
            </div>
            <div className="dashboard-card">
              <h2>Goals</h2>
              <p className="large-text">{data?.goalsCompleted ?? '—'} / {data?.goalsTotal ?? '—'}</p>
              <p>{data?.goalsLabel ?? 'Goals completed'}</p>
            </div>
            <div className="dashboard-card">
              <h2>Quiz</h2>
              <p className="large-text">{data?.quizScore ?? '—'}%</p>
              <p>{data?.quizLabel ?? 'Finance readiness score'}</p>
            </div>
            <div className="dashboard-card wide-card">
              <h2>Recommendation</h2>
              <p>{data?.recommendation ?? 'No recommendation available yet.'}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
