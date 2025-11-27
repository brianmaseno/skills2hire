import { Link } from 'react-router-dom'
import { Briefcase, Github, Twitter, Linkedin, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl tracking-wide text-white">Skills2Hire</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              Connect job seekers with employers based on skills and qualifications. 
              Building better careers through intelligent matching technology.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@skills2hire.com" className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors">
                <Mail className="h-4 w-4" />
                <span>hello@skills2hire.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors">
                <Phone className="h-4 w-4" />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-display text-white text-lg mb-6 tracking-wide">For Job Seekers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-gray-400 hover:text-primary-400 transition-colors">Browse Jobs</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors">Create Profile</Link>
              </li>
              <li>
                <Link to="/matches" className="text-gray-400 hover:text-primary-400 transition-colors">Job Matches</Link>
              </li>
              <li>
                <Link to="/applications" className="text-gray-400 hover:text-primary-400 transition-colors">Applications</Link>
              </li>
              <li>
                <Link to="/salary-guide" className="text-gray-400 hover:text-primary-400 transition-colors">Salary Guide</Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-display text-white text-lg mb-6 tracking-wide">For Employers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/employer/jobs/new" className="text-gray-400 hover:text-primary-400 transition-colors">Post a Job</Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/register?type=employer" className="text-gray-400 hover:text-primary-400 transition-colors">Employer Sign Up</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-primary-400 transition-colors">Pricing Plans</Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-primary-400 transition-colors">Hiring Resources</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display text-white text-lg mb-6 tracking-wide">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-primary-400 transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/press" className="text-gray-400 hover:text-primary-400 transition-colors">Press</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              {currentYear} Skills2Hire. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
