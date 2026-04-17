import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../utils/translations'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const auth = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await auth.signup(email, password, name)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page login-page">
      <div className="mobile-panel">
        <header className="dashboard-header">
          <div>
            <h1>{t(translations.login.title)}</h1>
            <p>{t(translations.login.createAccount)}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            {t(translations.login.name)}
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="John Doe"
            />
          </label>
          <label>
            {t(translations.login.email)}
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </label>
          <label>
            {t(translations.login.password)}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? t(translations.login.signingUp) : t(translations.login.signUp)}
          </button>
          <div className="auth-link">
            {t(translations.login.haveAccount)}{' '}
            <Link to="/login">{t(translations.login.backToLogin)}</Link>
          </div>
        </form>
      </div>
    </section>
  )
}
