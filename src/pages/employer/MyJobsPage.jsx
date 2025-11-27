import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi } from '../../api'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users,
  Eye,
  Plus,
  Edit,
  Trash2,
  Loader2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-700',
  paused: 'bg-yellow-100 text-yellow-700',
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await jobsApi.getMyJobs()
      setJobs(response.results || response || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await jobsApi.deleteJob(jobId)
      toast.success('Job deleted successfully')
      fetchJobs()
    } catch (error) {
      toast.error('Failed to delete job')
    }
  }

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active'
    try {
      await jobsApi.updateJob(jobId, { status: newStatus })
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'closed'}`)
      fetchJobs()
    } catch (error) {
      toast.error('Failed to update job status')
    }
  }

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              My <span className="gradient-text">Job Postings</span>
            </h1>
            <p className="text-lg text-gray-600 mt-2">Manage your job listings</p>
          </div>
          <Link 
            to="/employer/jobs/new"
            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="h-5 w-5" />
            Post New Job
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in" style={{animationDelay: '0.1s'}}>
          {['all', 'active', 'closed', 'draft'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                  {jobs.filter(j => j.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="card glass-effect p-12 text-center animate-fade-in">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No jobs posted yet' : `No ${filter} jobs`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? 'Start by posting your first job' : 'No jobs match this filter'}
            </p>
            {filter === 'all' && (
              <Link to="/employer/jobs/new" className="btn-primary">
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            {filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="card glass-effect p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {job.title?.charAt(0) || 'J'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status]}`}>
                            {job.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location || (job.is_remote ? 'Remote' : 'Not specified')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.employment_type?.replace('_', ' ')}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.applications_count || 0} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/employer/jobs/${job.id}/candidates`}
                      className="btn-primary px-4 py-2 text-sm rounded-lg flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      View Applicants
                    </Link>
                    <Link
                      to={`/employer/jobs/${job.id}/edit`}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(job.id, job.status)}
                      className={`p-2 rounded-lg transition-all ${
                        job.status === 'active' 
                          ? 'text-yellow-600 hover:bg-yellow-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={job.status === 'active' ? 'Close job' : 'Activate job'}
                    >
                      {job.status === 'active' ? <Pause className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Posted on {new Date(job.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      {job.views_count || 0} views
                    </span>
                    <span className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applications_count || 0} applications
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
