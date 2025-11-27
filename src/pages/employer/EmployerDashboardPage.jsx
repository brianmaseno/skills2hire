import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { jobsApi } from '../../api'
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Plus,
  Search,
  BarChart3,
  Calendar,
  Star,
  Loader2,
  Phone,
  Mail
} from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-green-100 text-green-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-700',
}

export default function EmployerDashboardPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviews: 0,
    hired: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [jobsRes, appsRes] = await Promise.all([
        jobsApi.getMyJobs(),
        jobsApi.getApplications()
      ])
      
      const jobData = jobsRes.results || jobsRes || []
      const appData = appsRes.results || appsRes || []
      
      setJobs(jobData)
      setApplications(appData)
      
      const activeJobs = jobData.filter(j => j.status === 'active').length
      const interviews = appData.filter(a => a.status === 'interview').length
      const hired = appData.filter(a => a.status === 'accepted').length
      
      setStats({
        activeJobs,
        totalApplications: appData.length,
        interviews,
        hired
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      await jobsApi.updateApplicationStatus(appId, { status: newStatus })
      toast.success(`Application ${newStatus}`)
      fetchData()
    } catch (error) {
      toast.error('Failed to update application')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="gradient-text">{user?.full_name || user?.first_name || 'Employer'}!</span>
              </h1>
              <p className="text-lg text-gray-600">Manage your job postings and find top talent</p>
            </div>
            <Link 
              to="/employer/jobs/new" 
              className="btn-primary px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Post New Job
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeJobs}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalApplications}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.interviews}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hired</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.hired}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Job Postings */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Briefcase className="h-6 w-6 text-primary-600 mr-2" />
                  My Job Postings
                </h2>
                <Link to="/employer/jobs" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Manage All →
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500 mb-4">No jobs posted yet</p>
                  <Link to="/employer/jobs/new" className="btn-primary">
                    Post Your First Job
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job) => (
                    <div 
                      key={job.id} 
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-primary-300 bg-white group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {job.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              job.status === 'active' ? 'bg-green-100 text-green-700' :
                              job.status === 'closed' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location || (job.is_remote ? 'Remote' : 'Not specified')}
                            </span>
                            <span className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.employment_type?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex gap-6">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{job.applications_count || 0}</div>
                            <div className="text-xs text-gray-600">Applications</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{job.views_count || 0}</div>
                            <div className="text-xs text-gray-600">Views</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            to={`/employer/jobs/${job.id}/candidates`}
                            className="btn-primary py-2 px-4 text-sm rounded-lg"
                          >
                            View Applicants
                          </Link>
                          <Link 
                            to={`/employer/jobs/${job.id}/edit`}
                            className="btn-secondary py-2 px-4 text-sm rounded-lg"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  to="/employer/jobs/new" 
                  className="flex items-center p-4 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="h-8 w-8 mr-3" />
                  <div>
                    <div className="font-bold">Post New Job</div>
                    <div className="text-sm opacity-90">Create a job listing</div>
                  </div>
                </Link>

                <Link 
                  to="/employer/jobs" 
                  className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <BarChart3 className="h-8 w-8 mr-3" />
                  <div>
                    <div className="font-bold">Manage Jobs</div>
                    <div className="text-sm opacity-90">View all postings</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                Recent Applications
              </h2>
              {applications.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div 
                      key={app.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {app.applicant_name?.charAt(0) || app.applicant_email?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">
                            {app.applicant_name || app.applicant_email}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 truncate">{app.job_title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(app.applied_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                          {app.status}
                        </span>
                        {app.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'accepted')}
                              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'rejected')}
                              className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Show applicant contact info */}
                      {(app.status === 'accepted' || app.status === 'interview') && (
                        <div className="mt-3 pt-3 border-t border-gray-100 bg-blue-50 rounded-lg p-2">
                          <p className="text-xs font-semibold text-blue-800 mb-1">Contact Info:</p>
                          <div className="space-y-1 text-xs text-blue-700">
                            <p className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {app.applicant_email}
                            </p>
                            {app.applicant_phone && (
                              <p className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {app.applicant_phone}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {user?.full_name || 'Name not set'}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {user?.phone_number || 'Phone not set'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
