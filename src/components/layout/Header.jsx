import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Menu, X, User, LogOut, Settings, MessageSquare, ChevronDown, Briefcase } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Dynamic header styling based on page and scroll
  const headerBg = isHomePage && !scrolled 
    ? 'bg-transparent' 
    : 'bg-white shadow-sm'
  
  const textColor = isHomePage && !scrolled 
    ? 'text-white' 
    : 'text-gray-700'
  
  const logoColor = isHomePage && !scrolled 
    ? 'text-white' 
    : 'text-primary-700'

  const hoverColor = isHomePage && !scrolled
    ? 'hover:text-white/80'
    : 'hover:text-primary-600'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isHomePage && !scrolled ? 'bg-white/20' : 'bg-primary-600'}`}>
                <Briefcase className={`h-5 w-5 ${isHomePage && !scrolled ? 'text-white' : 'text-white'}`} />
              </div>
              <span className={`font-display text-xl tracking-wide ${logoColor}`}>
                Skills2Hire
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link 
              to="/" 
              className={`${textColor} ${hoverColor} px-4 py-2 rounded-lg font-medium transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className={`${textColor} ${hoverColor} px-4 py-2 rounded-lg font-medium transition-colors`}
            >
              Find Jobs
            </Link>
            <Link 
              to="/companies" 
              className={`${textColor} ${hoverColor} px-4 py-2 rounded-lg font-medium transition-colors`}
            >
              Companies
            </Link>
            
            {isAuthenticated ? (
              <>
                {user?.is_employer ? (
                  <>
                    <Link 
                      to="/employer/dashboard" 
                      className={`${textColor} ${hoverColor} px-4 py-2 rounded-lg font-medium transition-colors`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/employer/jobs/new" 
                      className="btn-primary ml-2"
                    >
                      Post a Job
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className={`${textColor} ${hoverColor} px-4 py-2 rounded-lg font-medium transition-colors`}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/applications" 
                      className={`${textColor} ${hoverColor} px-4 py-2 rounded-lg font-medium transition-colors`}
                    >
                      Applications
                    </Link>
                  </>
                )}
                
                <Link 
                  to="/messages" 
                  className={`${textColor} ${hoverColor} p-2 rounded-lg transition-colors relative`}
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className={`flex items-center space-x-2 ${textColor} ${hoverColor} px-3 py-2 rounded-lg transition-colors`}
                  >
                    <div className="h-9 w-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium text-sm">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">{user?.user_type?.replace('_', ' ')}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/profile/settings"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link 
                  to="/login" 
                  className={`${textColor} ${hoverColor} px-4 py-2 rounded-lg font-medium transition-colors`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary rounded-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${textColor} p-2 rounded-lg`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 bg-white rounded-2xl shadow-lg mt-2 px-2">
            <Link
              to="/"
              className="block text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className="block text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Companies
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link
                  to={user?.is_employer ? '/employer/dashboard' : '/dashboard'}
                  className="block text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/messages"
                  className="block text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                </Link>
                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block bg-primary-600 text-white px-4 py-3 rounded-xl font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
