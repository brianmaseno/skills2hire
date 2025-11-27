import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { jobsApi } from '../../api'
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ArrowLeft,
  Loader2,
  Star,
  MessageSquare,
  Eye,
  Download
} from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  interview: 'bg-purple-100 text-purple-700',
  offer: 'bg-green-100 text-green-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
]

export default function CandidatesPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    fetchData()
  }, [jobId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [jobRes, appsRes] = await Promise.all([
        jobId ? jobsApi.getJob(jobId) : Promise.resolve(null),
        jobsApi.getApplications(jobId ? { job: jobId } : {})
      ])
      setJob(jobRes)
      setApplications(appsRes.results || appsRes || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (appId, newStatus) => {
    try {
      await jobsApi.updateApplicationStatus(appId, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter(app => app.status === filter)

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
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            <span className="gradient-text">Candidates</span>
            {job && <span className="text-2xl font-normal text-gray-600"> for {job.title}</span>}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {applications.length} total applicants
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({applications.length})
          </button>
          {STATUS_OPTIONS.map(status => {
            const count = applications.filter(a => a.status === status.value).length
            return (
              <button
                key={status.value}
                onClick={() => setFilter(status.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  filter === status.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Candidates List */}
        {filteredApplications.length === 0 ? (
          <div className="card glass-effect p-12 text-center animate-fade-in">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'No one has applied to this job yet' 
                : `No candidates with status "${filter}"`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
            {filteredApplications.map((app) => (
              <div 
                key={app.id}
                className="card glass-effect p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Candidate Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {app.applicant_name?.charAt(0) || app.applicant_email?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {app.applicant_name || 'Unknown'}
                      </h3>
                      <p className="text-gray-600 mb-2">{app.job_title}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-1" />
                          {app.applicant_email}
                        </span>
                        {app.applicant_phone && (
                          <span className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-1" />
                            {app.applicant_phone}
                          </span>
                        )}
                        <span className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`px-4 py-2 rounded-lg font-semibold border-2 ${STATUS_COLORS[app.status]} cursor-pointer`}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(app.id, 'accepted')}
                        className="btn-primary px-4 py-2 text-sm rounded-lg flex items-center gap-2"
                        disabled={app.status === 'accepted'}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => updateStatus(app.id, 'rejected')}
                        className="px-4 py-2 text-sm rounded-lg border-2 border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        disabled={app.status === 'rejected'}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {app.cover_letter && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {selectedApp === app.id ? 'Hide' : 'View'} Cover Letter
                    </button>
                    {selectedApp === app.id && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-700 text-sm">
                        {app.cover_letter}
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Info Box - shown when accepted */}
                {(app.status === 'accepted' || app.status === 'interview') && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <h4 className="font-bold text-green-800 mb-2 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Contact Information
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        <a 
                          href={`mailto:${app.applicant_email}`}
                          className="flex items-center text-green-700 hover:text-green-900"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          {app.applicant_email}
                        </a>
                        {app.applicant_phone && (
                          <a 
                            href={`tel:${app.applicant_phone}`}
                            className="flex items-center text-green-700 hover:text-green-900"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            {app.applicant_phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
