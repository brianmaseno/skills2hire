import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jobsApi } from '../../api'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  FileText, 
  Clock, 
  Building2,
  Save,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

export default function CreateJobPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    is_remote: false,
    skills_required: '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const jobData = {
        ...formData,
        status: 'active', // Set job as active so it's visible to job seekers
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        skills_required: formData.skills_required.split(',').map(s => s.trim()).filter(Boolean)
      }
      await jobsApi.createJob(jobData)
      toast.success('Job posted successfully!')
      navigate('/employer/jobs')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            Post a <span className="gradient-text">New Job</span>
          </h1>
          <p className="text-lg text-gray-600 mt-2">Fill in the details to create your job posting</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card glass-effect p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Briefcase className="h-4 w-4 inline mr-2" />
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-2" />
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List the requirements and qualifications..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Location & Remote */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_remote"
                    checked={formData.is_remote}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm font-semibold text-gray-700">
                    This is a remote position
                  </span>
                </label>
              </div>
            </div>

            {/* Employment Type & Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="h-4 w-4 inline mr-2" />
                  Experience Level
                </label>
                <select
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Salary Range (Optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  placeholder="Minimum"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  placeholder="Maximum"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                name="skills_required"
                value={formData.skills_required}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, TypeScript"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Post Job
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
