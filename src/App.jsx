import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/auth/PrivateRoute'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Public Pages
import HomePage from './pages/HomePage'
import JobSearchPage from './pages/JobSearchPage'
import JobDetailPage from './pages/JobDetailPage'

// Private Pages (Job Seekers)
import DashboardPage from './pages/dashboard/DashboardPage'
import ProfilePage from './pages/profile/ProfilePage'
import ProfileEditPage from './pages/profile/ProfileEditPage'
import ApplicationsPage from './pages/applications/ApplicationsPage'
import MatchesPage from './pages/matches/MatchesPage'
import MessagesPage from './pages/messages/MessagesPage'

// Private Pages (Employers)
import EmployerDashboardPage from './pages/employer/EmployerDashboardPage'
import MyJobsPage from './pages/employer/MyJobsPage'
import CreateJobPage from './pages/employer/CreateJobPage'
import EditJobPage from './pages/employer/EditJobPage'
import CandidatesPage from './pages/employer/CandidatesPage'

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobSearchPage />} />
        <Route path="jobs/:id" element={<JobDetailPage />} />
        
        {/* Auth Routes */}
        <Route 
          path="login" 
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="register" 
          element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
        />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Private Routes - Job Seekers */}
        <Route element={<PrivateRoute />}>
          <Route 
            path="dashboard" 
            element={
              user?.user_type === 'employer' ? (
                <Navigate to="/employer/dashboard" replace />
              ) : (
                <DashboardPage />
              )
            } 
          />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<ProfileEditPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:id" element={<MessagesPage />} />
        </Route>

        {/* Private Routes - Employers */}
        <Route element={<PrivateRoute requireEmployer />}>
          <Route path="employer/dashboard" element={<EmployerDashboardPage />} />
          <Route path="employer/jobs" element={<MyJobsPage />} />
          <Route path="employer/jobs/new" element={<CreateJobPage />} />
          <Route path="employer/jobs/:id/edit" element={<EditJobPage />} />
          <Route path="employer/jobs/:id/candidates" element={<CandidatesPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute requireAdmin />}>
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
