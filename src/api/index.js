import apiClient from './client'

export const authApi = {
  // Register new user
  register: async (data) => {
    const response = await apiClient.post('/auth/register/', data)
    return response.data
  },

  // Login - returns tokens and user data
  login: async (email, password) => {
    const response = await apiClient.post('/auth/token/', { email, password })
    return response.data
  },

  // Refresh token
  refreshToken: async (refresh) => {
    const response = await apiClient.post('/auth/token/refresh/', { refresh })
    return response.data
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile/')
    return response.data
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile/', data)
    return response.data
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await apiClient.post('/auth/verify-email/', { token })
    return response.data
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/password/reset/', { email })
    return response.data
  },

  // Confirm password reset
  confirmPasswordReset: async (data) => {
    const response = await apiClient.post('/auth/password/reset/confirm/', data)
    return response.data
  },

  // Simple password reset - check if account exists
  checkAccountExists: async (data) => {
    const response = await apiClient.post('/auth/password/reset/check/', data)
    return response.data
  },

  // Simple password reset - set new password
  simplePasswordReset: async (data) => {
    const response = await apiClient.post('/auth/password/reset/simple/', data)
    return response.data
  },
}

export const profileApi = {
  // Get profile by ID or 'me'
  getProfile: async (id = 'me') => {
    const response = await apiClient.get(`/profiles/${id}/`)
    return response.data
  },

  // Update profile
  updateProfile: async (id = 'me', data) => {
    const response = await apiClient.put(`/profiles/${id}/`, data)
    return response.data
  },

  // Get all skills
  getSkills: async (search = '') => {
    const response = await apiClient.get('/profiles/skills/', {
      params: { search }
    })
    return response.data
  },

  // Get profile skills (for current user)
  getProfileSkills: async (profileId) => {
    const response = await apiClient.get('/profiles/profile-skills/')
    return response.data
  },

  // Get experiences (for current user)
  getExperiences: async (profileId) => {
    const response = await apiClient.get('/profiles/experiences/')
    return response.data
  },

  // Get education (for current user)
  getEducation: async (profileId) => {
    const response = await apiClient.get('/profiles/education/')
    return response.data
  },

  // Add skill to profile
  addSkill: async (data) => {
    const response = await apiClient.post('/profiles/profile-skills/', data)
    return response.data
  },

  // Remove skill from profile
  removeSkill: async (id) => {
    await apiClient.delete(`/profiles/profile-skills/${id}/`)
  },

  // Add experience
  addExperience: async (data) => {
    const response = await apiClient.post('/profiles/experiences/', data)
    return response.data
  },

  // Update experience
  updateExperience: async (id, data) => {
    const response = await apiClient.put(`/profiles/experiences/${id}/`, data)
    return response.data
  },

  // Delete experience
  deleteExperience: async (id) => {
    await apiClient.delete(`/profiles/experiences/${id}/`)
  },

  // Add education
  addEducation: async (data) => {
    const response = await apiClient.post('/profiles/education/', data)
    return response.data
  },

  // Update education
  updateEducation: async (id, data) => {
    const response = await apiClient.put(`/profiles/education/${id}/`, data)
    return response.data
  },

  // Delete education
  deleteEducation: async (id) => {
    await apiClient.delete(`/profiles/education/${id}/`)
  },

  // Add certification
  addCertification: async (data) => {
    const response = await apiClient.post('/profiles/certifications/', data)
    return response.data
  },

  // Update certification
  updateCertification: async (id, data) => {
    const response = await apiClient.put(`/profiles/certifications/${id}/`, data)
    return response.data
  },

  // Delete certification
  deleteCertification: async (id) => {
    await apiClient.delete(`/profiles/certifications/${id}/`)
  },
}

export const jobsApi = {
  // Get jobs list with filters
  getJobs: async (params = {}) => {
    const response = await apiClient.get('/jobs/jobs/', { params })
    return response.data
  },

  // Get job detail
  getJob: async (id) => {
    const response = await apiClient.get(`/jobs/jobs/${id}/`)
    return response.data
  },

  // Create job (employer)
  createJob: async (data) => {
    const response = await apiClient.post('/jobs/jobs/', data)
    return response.data
  },

  // Update job
  updateJob: async (id, data) => {
    const response = await apiClient.put(`/jobs/jobs/${id}/`, data)
    return response.data
  },

  // Partial update job
  patchJob: async (id, data) => {
    const response = await apiClient.patch(`/jobs/jobs/${id}/`, data)
    return response.data
  },

  // Delete job
  deleteJob: async (id) => {
    await apiClient.delete(`/jobs/jobs/${id}/`)
  },

  // Get my jobs (employer)
  getMyJobs: async () => {
    const response = await apiClient.get('/jobs/jobs/my_jobs/')
    return response.data
  },

  // Apply to job
  applyToJob: async (data) => {
    const response = await apiClient.post('/jobs/applications/', data)
    return response.data
  },

  // Get applications
  getApplications: async (params = {}) => {
    const response = await apiClient.get('/jobs/applications/', { params })
    return response.data
  },

  // Get single application
  getApplication: async (id) => {
    const response = await apiClient.get(`/jobs/applications/${id}/`)
    return response.data
  },

  // Update application status (employer)
  updateApplicationStatus: async (id, data) => {
    const response = await apiClient.patch(`/jobs/applications/${id}/update_status/`, data)
    return response.data
  },

  // Save job
  saveJob: async (jobId) => {
    const response = await apiClient.post('/jobs/saved/', { job_id: jobId })
    return response.data
  },

  // Unsave job
  unsaveJob: async (jobId) => {
    await apiClient.delete(`/jobs/saved/unsave/`, { data: { job_id: jobId } })
  },

  // Get saved jobs
  getSavedJobs: async () => {
    const response = await apiClient.get('/jobs/saved/')
    return response.data
  },
}

export const matchingApi = {
  // Get matching candidates for a job (employer)
  getMatchingCandidates: async (jobId, params = {}) => {
    const response = await apiClient.get(`/matching/candidates/${jobId}/`, { params })
    return response.data
  },

  // Get matching jobs for current user (job seeker)
  getMatchingJobs: async (params = {}) => {
    const response = await apiClient.get('/matching/jobs/', { params })
    return response.data
  },

  // Get skill gap analysis
  getSkillGap: async (jobId) => {
    const response = await apiClient.get(`/matching/skill-gap/${jobId}/`)
    return response.data
  },

  // Calculate match score
  calculateMatchScore: async (data) => {
    const response = await apiClient.post('/matching/calculate/', data)
    return response.data
  },
}

export const messagingApi = {
  // Get conversations
  getConversations: async () => {
    const response = await apiClient.get('/messages/conversations/')
    return response.data
  },

  // Create conversation
  createConversation: async (data) => {
    const response = await apiClient.post('/messages/conversations/', data)
    return response.data
  },

  // Get conversation messages
  getMessages: async (conversationId, params = {}) => {
    const response = await apiClient.get(
      `/messages/conversations/${conversationId}/messages/`,
      { params }
    )
    return response.data
  },

  // Send message
  sendMessage: async (conversationId, content) => {
    const response = await apiClient.post(
      `/messages/conversations/${conversationId}/send_message/`,
      { content }
    )
    return response.data
  },
}

export default apiClient
