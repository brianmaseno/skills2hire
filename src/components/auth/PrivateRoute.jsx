import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function PrivateRoute({ requireEmployer = false, requireAdmin = false }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireEmployer && !user?.is_employer) {
    return <Navigate to="/dashboard" replace />
  }

  if (requireAdmin && !user?.is_staff) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
