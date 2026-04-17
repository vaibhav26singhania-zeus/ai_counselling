import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedLayout from './components/ProtectedLayout'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Home from './pages/Home'
import Savings from './pages/Savings'
import Goals from './pages/Goals'
import Quiz from './pages/Quiz'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Home />} />
                <Route path="/savings" element={<Savings />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

function Header() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="brand">ArthBot</div>
      <nav className="topnav">
        {isAuthenticated ? (
          <button type="button" className="link-button" onClick={logout}>
            Sign out
          </button>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  )
}

export default App
