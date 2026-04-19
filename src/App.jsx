import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { ChatHistoryProvider } from './context/ChatHistoryContext'
import ProtectedLayout from './components/ProtectedLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import Savings from './pages/Savings'

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ChatHistoryProvider>
          <BrowserRouter>
            <div className="app-shell">
              <Header />
              <main className="app-main">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route element={<ProtectedLayout />}>
                    <Route path="/savings" element={<Savings />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/" element={<Navigate to="/savings" replace />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </ChatHistoryProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

function Header() {
  const { isAuthenticated, logout } = useAuth()
  const { language, toggleLanguage } = useLanguage()

  return (
    <header className="topbar">
      <div className="brand">ArthBot</div>
      <nav className="topnav">
        <button 
          type="button" 
          className="link-button lang-toggle" 
          onClick={toggleLanguage}
          title="Change Language"
        >
          {language === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
        </button>
        {isAuthenticated ? (
          <button type="button" className="link-button" onClick={logout}>
            {language === 'hi' ? 'साइन आउट' : 'Sign out'}
          </button>
        ) : (
          <NavLink to="/login">{language === 'hi' ? 'लॉगिन' : 'Login'}</NavLink>
        )}
      </nav>
    </header>
  )
}

export default App
