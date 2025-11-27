import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Building2, 
  Code, 
  Palette, 
  BarChart3, 
  Headphones,
  ChevronRight,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Star,
  Upload,
  FileText
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

// Import images
import heroImage from '../assets/young-woman-holding-tablet-work.jpg'
import employerImage from '../assets/business-leader-consulting-hr-expert.jpg'
import candidateImage from '../assets/female-employee-happy-smiling-with-colleagues-blurred-shade.jpg'
import jobSearchImage from '../assets/woman-looking-through-magnifying-glass.jpg'
import hiringImage from '../assets/we-are-hiring-digital-collage.jpg'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?search=${searchQuery}&location=${location}`)
  }

  const categories = [
    { name: 'Development & IT', count: 1205, icon: Code, color: 'bg-blue-50 text-blue-600' },
    { name: 'Marketing & Sales', count: 847, icon: BarChart3, color: 'bg-green-50 text-green-600' },
    { name: 'Design & Creative', count: 562, icon: Palette, color: 'bg-purple-50 text-purple-600' },
    { name: 'Customer Service', count: 423, icon: Headphones, color: 'bg-amber-50 text-amber-600' },
    { name: 'Finance', count: 315, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Human Resources', count: 289, icon: Users, color: 'bg-pink-50 text-pink-600' },
  ]

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full Time',
      salary: '$120K - $150K',
      posted: '2 days ago',
      tags: ['React', 'TypeScript', 'Node.js'],
      logo: 'TC'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'DesignStudio',
      location: 'Remote',
      type: 'Full Time',
      salary: '$90K - $120K',
      posted: '1 day ago',
      tags: ['Figma', 'Adobe XD', 'Prototyping'],
      logo: 'DS'
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'New York, NY',
      type: 'Full Time',
      salary: '$130K - $160K',
      posted: '3 days ago',
      tags: ['Agile', 'Strategy', 'Leadership'],
      logo: 'IT'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'DataDriven Co.',
      location: 'Austin, TX',
      type: 'Full Time',
      salary: '$140K - $180K',
      posted: '1 day ago',
      tags: ['Python', 'ML', 'TensorFlow'],
      logo: 'DD'
    },
  ]

  const companies = [
    { name: 'Google', logo: 'G' },
    { name: 'Microsoft', logo: 'M' },
    { name: 'Amazon', logo: 'A' },
    { name: 'Meta', logo: 'F' },
    { name: 'Apple', logo: 'A' },
    { name: 'Netflix', logo: 'N' },
  ]

  const stats = [
    { value: '25,478', label: 'Jobs Available' },
    { value: '12,000+', label: 'Companies Hiring' },
    { value: '50,000+', label: 'Active Candidates' },
    { value: '98%', label: 'Success Rate' },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 min-h-[90vh] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white animate-fade-in-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-medium">
                      {i}K
                    </div>
                  ))}
                </div>
                <span className="text-white/80 text-sm ml-2">Join 50K+ professionals</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 tracking-wide">
                Find Your Perfect
                <span className="block text-secondary-400">Career Match</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
                Connect with top employers based on your skills. Discover opportunities 
                that match your expertise and take your career to new heights.
              </p>

              {/* Search Box */}
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 bg-gray-50 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary rounded-xl px-8 py-3.5 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Search Jobs
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 px-2">
                  <span className="text-gray-500 text-sm">Popular:</span>
                  {['Remote', 'Full Time', 'Software Engineer', 'Marketing'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>

              {/* Trust Badges */}
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                <span className="text-white/60 text-sm">Trusted by:</span>
                <div className="flex items-center gap-4">
                  {companies.slice(0, 4).map((company) => (
                    <div 
                      key={company.name} 
                      className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-display text-sm"
                    >
                      {company.logo}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative hidden lg:block animate-fade-in delay-200">
              <div className="relative">
                {/* Main Image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={heroImage} 
                    alt="Professional at work" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl animate-fade-in-up delay-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-display text-2xl text-gray-900">10K+</div>
                      <div className="text-gray-500 text-sm">Jobs Posted Monthly</div>
                    </div>
                  </div>
                </div>

                {/* Floating Success Card */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-fade-in-up delay-400">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">98% Success</div>
                      <div className="text-gray-500 text-xs">Match Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Employers & Candidates Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Employers */}
            <div className="relative rounded-3xl overflow-hidden group">
              <img 
                src={employerImage} 
                alt="For Employers" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-2xl text-white mb-2">For Employers</h3>
                <p className="text-white/80 mb-4">Find top talent from around the world and across all industries.</p>
                <Link 
                  to="/register?type=employer" 
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  Post Jobs for Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* For Candidates */}
            <div className="relative rounded-3xl overflow-hidden group">
              <img 
                src={candidateImage} 
                alt="For Candidates" 
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-2xl text-white mb-2">For Candidates</h3>
                <p className="text-white/80 mb-4">Build your professional profile and find new job opportunities.</p>
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  Upload Your CV
                  <Upload className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="section-title mb-3">Popular Categories</h2>
              <p className="section-subtitle">Explore opportunities in your field of expertise</p>
            </div>
            <Link 
              to="/jobs" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-4 md:mt-0"
            >
              View All Categories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link 
                key={category.name}
                to={`/jobs?category=${category.name}`}
                className="category-card animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`category-icon ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                <p className="text-gray-500 text-xs">{category.count} jobs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="section-title mb-3">Featured Job Offers</h2>
              <p className="section-subtitle">Hand-picked opportunities from top companies</p>
            </div>
            <Link 
              to="/jobs" 
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-4 md:mt-0"
            >
              View All Jobs
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map((job, index) => (
              <Link 
                key={job.id}
                to={`/jobs/${job.id}`}
                className="job-card animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center font-display text-primary-700">
                    {job.logo}
                  </div>
                  <span className="badge-info">{job.type}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{job.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{job.company}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-semibold text-primary-600">{job.salary}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {job.posted}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Hiring Companies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Top Hiring Companies</h2>
            <p className="section-subtitle mx-auto">Join leading organizations actively seeking talent</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {companies.map((company, index) => (
              <div 
                key={company.name}
                className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center hover:border-primary-200 hover:shadow-md transition-all cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-display text-lg text-gray-700 mb-2">
                  {company.logo}
                </div>
                <span className="text-xs text-gray-600">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-3">How It Works</h2>
            <p className="section-subtitle mx-auto">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up and build your professional profile with your skills, experience, and career preferences.',
                icon: FileText
              },
              {
                step: '02',
                title: 'Get Matched',
                description: 'Our intelligent algorithm matches you with opportunities that align with your unique skill set.',
                icon: Search
              },
              {
                step: '03',
                title: 'Land Your Dream Job',
                description: 'Apply to matched positions, connect with employers, and start your new career journey.',
                icon: Briefcase
              }
            ].map((item, index) => (
              <div 
                key={item.step}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-600 text-white mb-6">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 -z-10 hidden md:block" 
                     style={{ display: index === 2 ? 'none' : undefined }}></div>
                <span className="font-display text-5xl text-primary-100 absolute top-0 right-0 md:right-8">{item.step}</span>
                <h3 className="font-display text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <h2 className="section-title mb-6">
                Why Choose
                <span className="block text-primary-600">Skills2Hire</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'Skill-Based Matching',
                    description: 'Get matched based on your actual skills and expertise, not just keywords on a resume.'
                  },
                  {
                    title: 'Direct Communication',
                    description: 'Connect directly with employers and hiring managers without intermediaries.'
                  },
                  {
                    title: 'Transparent Process',
                    description: 'See your match score and skill gaps to know exactly where you stand.'
                  },
                  {
                    title: 'Free for Job Seekers',
                    description: 'No hidden costs or premium features locked away. 100% free forever.'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <img 
                src={jobSearchImage} 
                alt="Job Search" 
                className="rounded-3xl shadow-xl w-full h-[500px] object-cover"
              />
              
              {/* Stats Overlay */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="font-display text-3xl text-primary-600">160+</div>
                    <div className="text-gray-500 text-sm">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-3xl text-primary-600">500+</div>
                    <div className="text-gray-500 text-sm">Companies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={hiringImage} 
            alt="Get Started" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-900/90"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6 tracking-wide">
            Ready to Take the Next Step in Your Career
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs through Skills2Hire. 
            Your perfect opportunity is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="btn-white rounded-xl px-10 py-4 text-lg font-semibold"
            >
              Create Free Account
            </Link>
            <Link 
              to="/jobs" 
              className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 rounded-xl px-10 py-4 text-lg font-semibold transition-all"
            >
              Browse Jobs
            </Link>
          </div>
          <p className="mt-8 text-white/60 text-sm">
            No credit card required. Get started in under 2 minutes.
          </p>
        </div>
      </section>
    </div>
  )
}
