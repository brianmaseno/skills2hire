import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { profileApi } from '../../api'
import { 
  MapPin, 
  Briefcase, 
  Award, 
  GraduationCap,
  Calendar,
  Link2,
  Github,
  Linkedin,
  Phone,
  Mail,
  Edit,
  Building
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [skills, setSkills] = useState([])
  const [experiences, setExperiences] = useState([])
  const [education, setEducation] = useState([])

  const isEmployer = user?.user_type === 'employer'

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const data = await profileApi.getProfile('me')
        setProfile(data)
        
        // Only load skills, experiences, education for job seekers (not employers)
        if (!isEmployer && data.id) {
          const [skillsData, expData, eduData] = await Promise.all([
            profileApi.getProfileSkills(data.id).catch(() => []),
            profileApi.getExperiences(data.id).catch(() => []),
            profileApi.getEducation(data.id).catch(() => [])
          ])
          // Handle paginated or array responses
          setSkills(Array.isArray(skillsData) ? skillsData : skillsData?.results || [])
          setExperiences(Array.isArray(expData) ? expData : expData?.results || [])
          setEducation(Array.isArray(eduData) ? eduData : eduData?.results || [])
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    loadProfile()
  }, [isEmployer])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="card glass-effect p-8 mb-6 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative group">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.display_name}
                    className="w-32 h-32 rounded-2xl object-cover shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl">
                    <span className="text-5xl font-bold text-white">
                      {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                {isEmployer && profile?.company_logo && (
                  <img 
                    src={profile.company_logo} 
                    alt="Company Logo"
                    className="absolute -bottom-2 -right-2 w-12 h-12 rounded-lg object-cover border-4 border-white shadow-lg"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {profile?.display_name || user?.email?.split('@')[0] || 'User'}
                </h1>
                {profile?.headline && (
                  <p className="text-xl text-gray-700 mb-3 font-medium">{profile.headline}</p>
                )}
                {isEmployer && profile?.company_name && (
                  <div className="flex items-center text-lg text-gray-600 mb-2">
                    <Building className="h-5 w-5 mr-2" />
                    {profile.company_name}
                    {profile.company_size && <span className="ml-2 text-sm">• {profile.company_size} employees</span>}
                  </div>
                )}
                <div className="flex flex-wrap gap-4 text-gray-600">
                  {profile?.location && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </span>
                  )}
                  {profile?.phone && (
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {profile.phone}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {user?.email}
                  </span>
                </div>

                {/* Links */}
                <div className="flex gap-3 mt-4">
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
                      <Link2 className="h-4 w-4" /> Website
                    </a>
                  )}
                  {profile?.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                  {profile?.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Link 
              to="/profile/edit" 
              className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>

          {/* Bio */}
          {profile?.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Skills & Info (Job Seekers) or Company Info (Employers) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills - Only for Job Seekers */}
            {!isEmployer && (
              <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary-600" />
                  Skills
                </h2>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skillItem) => (
                      <span 
                        key={skillItem.id}
                        className="px-4 py-2 bg-gradient-to-r from-primary-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                      >
                        {skillItem.skill?.name || skillItem.name}
                        {skillItem.level && (
                          <span className="ml-2 opacity-75">* {skillItem.level}</span>
                        )}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No skills added yet</p>
                )}
                <Link 
                  to="/profile/edit" 
                  className="block mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm text-center"
                >
                  + Add Skills
                </Link>
              </div>
            )}

            {/* Company Details - Only for Employers */}
            {isEmployer && (
              <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary-600" />
                  Company Details
                </h2>
                <div className="space-y-3">
                  {profile?.company_name && (
                    <div>
                      <span className="text-sm text-gray-500">Company Name</span>
                      <p className="font-medium text-gray-900">{profile.company_name}</p>
                    </div>
                  )}
                  {profile?.company_size && (
                    <div>
                      <span className="text-sm text-gray-500">Company Size</span>
                      <p className="font-medium text-gray-900">{profile.company_size} employees</p>
                    </div>
                  )}
                  {profile?.company_website && (
                    <div>
                      <span className="text-sm text-gray-500">Website</span>
                      <a 
                        href={profile.company_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block font-medium text-primary-600 hover:text-primary-700 truncate"
                      >
                        {profile.company_website}
                      </a>
                    </div>
                  )}
                  {!profile?.company_name && !profile?.company_size && (
                    <p className="text-gray-500 text-sm">No company details added yet</p>
                  )}
                </div>
                <Link 
                  to="/profile/edit" 
                  className="block mt-4 text-primary-600 hover:text-primary-700 font-medium text-sm text-center"
                >
                  Update Company Info
                </Link>
              </div>
            )}

            {/* Status */}
            <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Visibility</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile?.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {profile?.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
                {!isEmployer && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      profile?.is_available ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {profile?.is_available ? 'Open to Work' : 'Not Available'}
                    </span>
                  </div>
                )}
                {isEmployer && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Type</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                      Employer
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions for Employers */}
            {isEmployer && (
              <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link 
                    to="/employer/jobs/new"
                    className="block w-full btn-primary py-2 text-center rounded-lg"
                  >
                    Post a New Job
                  </Link>
                  <Link 
                    to="/employer/jobs"
                    className="block w-full btn-secondary py-2 text-center rounded-lg"
                  >
                    Manage My Jobs
                  </Link>
                  <Link 
                    to="/employer/candidates"
                    className="block w-full btn-secondary py-2 text-center rounded-lg"
                  >
                    View Candidates
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Experience & Education (Job Seekers) or About (Employers) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employer - About Company Section */}
            {isEmployer && (
              <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-primary-600" />
                  About {profile?.company_name || 'Your Company'}
                </h2>
                {profile?.bio ? (
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No company description added yet</p>
                    <Link 
                      to="/profile/edit" 
                      className="inline-block mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      + Add Company Description
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Employer - Contact Information */}
            {isEmployer && (
              <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary-600" />
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <span className="text-xs text-gray-500 block">Email</span>
                      <span className="font-medium text-gray-900">{user?.email}</span>
                    </div>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500 block">Phone</span>
                        <span className="font-medium text-gray-900">{profile.phone}</span>
                      </div>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500 block">Location</span>
                        <span className="font-medium text-gray-900">{profile.location}</span>
                      </div>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Link2 className="h-5 w-5 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500 block">Website</span>
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience - Job Seekers Only */}
            {!isEmployer && (
              <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-primary-600" />
                  Work Experience
                </h2>
                {experiences.length > 0 ? (
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-primary-500 pl-4">
                        <h3 className="font-bold text-lg text-gray-900">{exp.title}</h3>
                        <p className="text-gray-700 font-medium">{exp.company}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4" />
                          {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                        </div>
                        {exp.description && (
                          <p className="text-gray-600 mt-2 text-sm leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No work experience added yet</p>
                    <Link 
                      to="/profile/edit" 
                      className="inline-block mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      + Add Experience
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Education */}
            {!isEmployer && (
              <div className="card glass-effect p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary-600" />
                  Education
                </h2>
                {education.length > 0 ? (
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-purple-500 pl-4">
                        <h3 className="font-bold text-lg text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-700 font-medium">{edu.institution}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4" />
                          {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date}
                        </div>
                        {edu.description && (
                          <p className="text-gray-600 mt-2 text-sm">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No education added yet</p>
                    <Link 
                      to="/profile/edit" 
                      className="inline-block mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      + Add Education
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
