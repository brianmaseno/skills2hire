import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { jobsApi } from '../api'
import { Search, MapPin, Briefcase, DollarSign, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/helpers'

export default function JobSearchPage() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    employment_type: '',
    ordering: '-created_at',
  })

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getJobs(filters),
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title or keywords..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-semibold text-lg mb-4">Filters</h3>
            
            <div className="space-y-6">
              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={filters.employment_type}
                  onChange={(e) => handleFilterChange('employment_type', e.target.value)}
                  className="input"
                >
                  <option value="">All Types</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  className="input"
                >
                  <option value="-created_at">Newest First</option>
                  <option value="created_at">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="-title">Title (Z-A)</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({
                  search: '',
                  location: '',
                  employment_type: '',
                  ordering: '-created_at',
                })}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : jobs?.results?.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs?.results?.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="card p-6 hover:shadow-md transition block"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.employer_name || 'Company Name'}</p>
                    </div>
                    {job.match_score && (
                      <div className="ml-4">
                        <div className="badge-primary text-sm font-semibold">
                          {Math.round(job.match_score * 100)}% Match
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {job.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                    )}
                    {job.employment_type && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.employment_type.replace('_', ' ')}
                      </div>
                    )}
                    {(job.salary_min || job.salary_max) && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {job.salary_min && formatCurrency(job.salary_min)}
                        {job.salary_min && job.salary_max && ' - '}
                        {job.salary_max && formatCurrency(job.salary_max)}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.skills_required?.slice(0, 5).map((skill) => (
                      <span key={skill.id} className="badge-primary text-xs">
                        {skill.name}
                      </span>
                    ))}
                    {job.skills_required?.length > 5 && (
                      <span className="badge text-xs bg-gray-100 text-gray-600">
                        +{job.skills_required.length - 5} more
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-500">
                    Posted {formatDate(job.created_at, 'relative')}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {jobs?.count > 10 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <button className="btn-secondary px-4 py-2">Previous</button>
                <button className="btn-secondary px-4 py-2">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
