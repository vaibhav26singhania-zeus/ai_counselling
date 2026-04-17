import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../utils/translations'

export default function BottomNav() {
  const { t } = useLanguage()
  
  const navItems = [
    { path: '/dashboard', label: t(translations.nav.home), icon: '🏠' },
    { path: '/savings', label: t(translations.nav.savings), icon: '💰' },
    { path: '/chat', label: t(translations.nav.chat), icon: '💬' },
    { path: '/goals', label: t(translations.nav.goals), icon: '🎯' },
    { path: '/quiz', label: 'Quiz', icon: '🧠' },
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-text">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
