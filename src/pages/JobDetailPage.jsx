import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { jobsApi } from '../api'
import { useAuthStore } from '../stores/authStore'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Building2,
  Calendar,
  Users,
  Eye,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Globe,
  Send
} from 'lucide-react'
import { toast } from 'sonner'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      setLoading(true)
      const data = await jobsApi.getJob(id)
      setJob(data)
    } catch (error) {
      toast.error('Failed to load job details')
      navigate('/jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply')
      navigate('/login')
      return
    }

    if (user?.is_employer) {
      toast.error('Employers cannot apply to jobs')
      return
    }

    try {
      setApplying(true)
      await jobsApi.applyToJob({ job: id, cover_letter: coverLetter })
      toast.success('Application submitted successfully!')
      setShowApplyModal(false)
      fetchJob() // Refresh to update has_applied status
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs')
      return
    }

    try {
      if (job.is_saved) {
        await jobsApi.unsaveJob(id)
        toast.success('Job removed from saved')
      } else {
        await jobsApi.saveJob(id)
        toast.success('Job saved!')
      }
      fetchJob()
    } catch (error) {
      toast.error('Failed to save job')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!job) return null

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Not specified'
    const currency = job.salary_currency || 'USD'
    const period = job.salary_period || 'year'
    if (job.salary_min && job.salary_max) {
      return `${currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} / ${period}`
    }
    if (job.salary_min) return `From ${currency} ${job.salary_min.toLocaleString()} / ${period}`
    return `Up to ${currency} ${job.salary_max.toLocaleString()} / ${period}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 animate-fade-in"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Details - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card glass-effect p-8 animate-fade-in">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {job.title?.charAt(0) || 'J'}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-lg text-gray-600 mb-4">
                    <Building2 className="h-5 w-5 mr-2" />
                    {job.employer_company || job.employer_name || 'Company'}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location || 'Not specified'}
                    </span>
                    {job.is_remote && (
                      <span className="flex items-center text-green-600">
                        <Globe className="h-4 w-4 mr-1" />
                        Remote OK
                      </span>
                    )}
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.employment_type?.replace('_', ' ')}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.experience_level} level
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {job.views_count || 0} views
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {job.applications_count || 0} applicants
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="card glass-effect p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="card glass-effect p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="card glass-effect p-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="card glass-effect p-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="card glass-effect p-6 sticky top-24 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  <DollarSign className="h-6 w-6 inline" />
                  {formatSalary()}
                </div>
                <p className="text-sm text-gray-500">Compensation</p>
              </div>

              {job.has_applied ? (
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-800">You've Applied!</p>
                  <Link 
                    to="/applications" 
                    className="text-sm text-green-600 hover:underline"
                  >
                    View your applications
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    disabled={user?.is_employer}
                    className="btn-primary w-full py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 mb-4"
                  >
                    <Send className="h-5 w-5" />
                    Apply Now
                  </button>
                  {user?.is_employer && (
                    <p className="text-sm text-center text-gray-500">
                      Employers cannot apply to jobs
                    </p>
                  )}
                </>
              )}

              <button
                onClick={handleSaveJob}
                className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                {job.is_saved ? (
                  <>
                    <BookmarkCheck className="h-5 w-5 text-primary-600" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-5 w-5" />
                    Save Job
                  </>
                )}
              </button>
            </div>

            {/* Company Info */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">About the Company</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {job.employer_company?.charAt(0) || job.employer_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {job.employer_company || job.employer_name || 'Company'}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Apply to {job.title}
            </h2>
            <p className="text-gray-600 mb-6">
              at {job.employer_company || job.employer_name || 'Company'}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this role..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 btn-primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {applying ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
