import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function ProtectedLayout() {
  return (
    <div className="protected-layout">
      <Outlet />
      <BottomNav />
    </div>
  )
}
