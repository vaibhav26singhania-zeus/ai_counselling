import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', label: 'होम', icon: '🏠' },
  { path: '/savings', label: 'बचत', icon: '💰' },
  { path: '/chat', label: 'चैट', icon: '💬' },
  { path: '/goals', label: 'लक्ष्य', icon: '🎯' },
  { path: '/quiz', label: 'क्विज़', icon: '🧠' },
]

export default function BottomNav() {
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
