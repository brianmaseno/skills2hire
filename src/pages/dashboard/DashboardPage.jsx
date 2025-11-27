import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { jobsApi } from '../../api'
import { 
  Briefcase, 
  Search, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  MapPin,
  DollarSign,
  Users,
  BookmarkPlus,
  Send,
  Award,
  Target,
  Loader2,
  Phone,
  Mail,
  Building2
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

const STATUS_LABELS = {
  pending: 'Pending',
  reviewing: 'Under Review',
  interview: 'Interview',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({
    applications: 0,
    matches: 0,
    saved: 0,
    views: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [applicationsRes, jobsRes] = await Promise.all([
        jobsApi.getApplications(),
        jobsApi.getJobs({ status: 'active' })
      ])
      
      const appData = applicationsRes.results || applicationsRes || []
      const jobData = jobsRes.results || jobsRes || []
      
      setApplications(appData)
      setJobs(jobData.slice(0, 5)) // Show only first 5 jobs
      setStats({
        applications: appData.length,
        matches: jobData.length,
        saved: 0,
        views: 0
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (jobId) => {
    try {
      await jobsApi.applyToJob({ job: jobId, cover_letter: '' })
      toast.success('Application submitted successfully!')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="gradient-text">{user?.full_name || user?.first_name || user?.email?.split('@')[0] || 'User'}!</span>
          </h1>
          <p className="text-lg text-gray-600">Here's what's happening with your job search today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.applications}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4">
                <Send className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.matches}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.saved}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4">
                <BookmarkPlus className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="card glass-effect p-6 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.views}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Jobs */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Star className="h-6 w-6 text-yellow-500 mr-2" />
                  Available Jobs
                </h2>
                <Link to="/jobs" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  View All →
                </Link>
              </div>

              {jobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No jobs available at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <div 
                      key={job.id} 
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-primary-300 bg-white group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 font-medium">{job.employer_company || job.employer_name}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location || (job.is_remote ? 'Remote' : 'Not specified')}
                        </span>
                        {job.salary_min && (
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.employment_type?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {job.has_applied ? (
                          <button className="btn-secondary flex-1 py-2 text-sm rounded-lg" disabled>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Applied
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApply(job.id)}
                            className="btn-primary flex-1 py-2 text-sm rounded-lg"
                          >
                            Apply Now
                          </button>
                        )}
                        <Link to={`/jobs/${job.id}`} className="btn-secondary py-2 px-4 text-sm rounded-lg">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link 
                  to="/jobs" 
                  className="flex items-center p-4 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Search className="h-8 w-8 mr-3" />
                  <div>
                    <div className="font-bold">Search Jobs</div>
                    <div className="text-sm opacity-90">Find your perfect match</div>
                  </div>
                </Link>

                <Link 
                  to="/applications" 
                  className="flex items-center p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Award className="h-8 w-8 mr-3" />
                  <div>
                    <div className="font-bold">My Applications</div>
                    <div className="text-sm opacity-90">Track your progress</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary-600" />
                My Applications
              </h2>
              {applications.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Send className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No applications yet</p>
                  <Link to="/jobs" className="text-primary-600 text-sm hover:underline">
                    Browse jobs →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 4).map((app) => (
                    <div 
                      key={app.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-white"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{app.job_title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{app.job_company}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[app.status]}`}>
                          {STATUS_LABELS[app.status]}
                        </span>
                      </div>
                      
                      {/* Show employer contact if accepted */}
                      {app.status === 'accepted' && app.employer_contact && (
                        <div className="mt-3 pt-3 border-t border-gray-100 bg-green-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-green-800 mb-2 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Congratulations! Contact Employer:
                          </p>
                          <div className="space-y-1 text-xs text-green-700">
                            <p className="flex items-center">
                              <Building2 className="h-3 w-3 mr-2" />
                              {app.employer_contact.company_name || app.employer_contact.full_name}
                            </p>
                            <p className="flex items-center">
                              <Mail className="h-3 w-3 mr-2" />
                              {app.employer_contact.email}
                            </p>
                            {app.employer_contact.phone_number && (
                              <p className="flex items-center">
                                <Phone className="h-3 w-3 mr-2" />
                                {app.employer_contact.phone_number}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Link 
                to="/applications" 
                className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                View All Applications →
              </Link>
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
