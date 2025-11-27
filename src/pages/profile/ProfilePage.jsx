import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { profileApi } from '../../api'
import { 
  User, 
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
  Star,
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

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await profileApi.getProfile('me')
      setProfile(data)
      
      // Load related data
      if (data.id) {
        const [skillsData, expData, eduData] = await Promise.all([
          profileApi.getProfileSkills(data.id).catch(() => []),
          profileApi.getExperiences(data.id).catch(() => []),
          profileApi.getEducation(data.id).catch(() => [])
        ])
        setSkills(skillsData)
        setExperiences(expData)
        setEducation(eduData)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

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

  const isEmployer = user?.user_type === 'employer'

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
          {/* Left Column - Skills & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Skills */}
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
                        <span className="ml-2 opacity-75">• {skillItem.level}</span>
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
              </div>
            </div>
          </div>

          {/* Right Column - Experience & Education */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience */}
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
