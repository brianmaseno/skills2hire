import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi } from '../../api'
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Building2, 
  Calendar,
  Phone,
  Mail,
  User,
  Loader2,
  FileText,
  ArrowRight,
  Filter
} from 'lucide-react'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  reviewing: 'bg-blue-100 text-blue-700 border-blue-300',
  interview: 'bg-purple-100 text-purple-700 border-purple-300',
  offer: 'bg-green-100 text-green-700 border-green-300',
  accepted: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  rejected: 'bg-red-100 text-red-700 border-red-300',
  withdrawn: 'bg-gray-100 text-gray-700 border-gray-300',
}

const STATUS_LABELS = {
  pending: 'Pending Review',
  reviewing: 'Under Review',
  interview: 'Interview Scheduled',
  offer: 'Offer Extended',
  accepted: 'Accepted',
  rejected: 'Not Selected',
  withdrawn: 'Withdrawn',
}

const STATUS_ICONS = {
  pending: Clock,
  reviewing: FileText,
  interview: Calendar,
  offer: CheckCircle,
  accepted: CheckCircle,
  rejected: XCircle,
  withdrawn: XCircle,
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const response = await jobsApi.getApplications()
      setApplications(response.results || response || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter)

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing' || a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted' || a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
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
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My <span className="gradient-text">Applications</span>
          </h1>
          <p className="text-lg text-gray-600">Track the status of all your job applications</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <button
            onClick={() => setFilter('all')}
            className={`card p-4 text-center transition-all duration-300 hover:shadow-lg ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
          >
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`card p-4 text-center transition-all duration-300 hover:shadow-lg ${filter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
          >
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </button>
          <button
            onClick={() => setFilter('reviewing')}
            className={`card p-4 text-center transition-all duration-300 hover:shadow-lg ${filter === 'reviewing' ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-600">{stats.reviewing}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </button>
          <button
            onClick={() => setFilter('accepted')}
            className={`card p-4 text-center transition-all duration-300 hover:shadow-lg ${filter === 'accepted' ? 'ring-2 ring-green-500' : ''}`}
          >
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`card p-4 text-center transition-all duration-300 hover:shadow-lg ${filter === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
          >
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
          {filteredApplications.length === 0 ? (
            <div className="card glass-effect p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start applying to jobs to track your applications here'
                  : 'No applications match this filter'}
              </p>
              {filter === 'all' && (
                <Link to="/jobs" className="btn-primary">
                  Browse Jobs
                </Link>
              )}
            </div>
          ) : (
            filteredApplications.map((application) => {
              const StatusIcon = STATUS_ICONS[application.status] || Clock
              return (
                <div 
                  key={application.id}
                  className="card glass-effect p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {application.job_title?.charAt(0) || 'J'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {application.job_title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1" />
                              {application.company_name || 'Company'}
                            </span>
                            {application.job_location && (
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {application.job_location}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied on {new Date(application.applied_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-end gap-3">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${STATUS_COLORS[application.status]}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="font-semibold text-sm">
                          {STATUS_LABELS[application.status] || application.status}
                        </span>
                      </div>
                      <Link 
                        to={`/jobs/${application.job}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                      >
                        View Job <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Employer Contact Info - Only shown when accepted */}
                  {application.status === 'accepted' && application.employer_contact && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <h4 className="font-bold text-green-800 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Congratulations! You've been accepted
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                          Contact the employer to discuss next steps:
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <User className="h-5 w-5 text-green-600 mr-2" />
                            <div>
                              <div className="text-xs text-gray-500">Contact Person</div>
                              <div className="font-semibold text-gray-900">{application.employer_contact.name}</div>
                            </div>
                          </div>
                          <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                            <Mail className="h-5 w-5 text-green-600 mr-2" />
                            <div>
                              <div className="text-xs text-gray-500">Email</div>
                              <a 
                                href={`mailto:${application.employer_contact.email}`}
                                className="font-semibold text-primary-600 hover:underline"
                              >
                                {application.employer_contact.email}
                              </a>
                            </div>
                          </div>
                          {application.employer_contact.phone && (
                            <div className="flex items-center bg-white rounded-lg p-3 shadow-sm">
                              <Phone className="h-5 w-5 text-green-600 mr-2" />
                              <div>
                                <div className="text-xs text-gray-500">Phone</div>
                                <a 
                                  href={`tel:${application.employer_contact.phone}`}
                                  className="font-semibold text-primary-600 hover:underline"
                                >
                                  {application.employer_contact.phone}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cover Letter Preview */}
                  {application.cover_letter && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Cover Letter:</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
