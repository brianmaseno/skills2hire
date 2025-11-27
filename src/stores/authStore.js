import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api'
import { toast } from 'sonner'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Login - now gets user data directly from login response
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const data = await authApi.login(email, password)
          
          // Store tokens
          localStorage.setItem('access_token', data.access)
          localStorage.setItem('refresh_token', data.refresh)
          
          // User data is now included in login response
          const user = data.user
          
          set({ 
            user: user, 
            isAuthenticated: true,
            isLoading: false 
          })
          
          toast.success('Logged in successfully')
          return user
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // Register
      register: async (data) => {
        set({ isLoading: true })
        try {
          const response = await authApi.register(data)
          toast.success('Registration successful! Please login.')
          set({ isLoading: false })
          return response
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ 
          user: null, 
          isAuthenticated: false 
        })
        toast.info('Logged out successfully')
      },

      // Refresh user data from API
      refreshUser: async () => {
        try {
          const profile = await authApi.getProfile()
          set({ user: profile })
          return profile
        } catch (error) {
          // If refresh fails, logout
          get().logout()
          throw error
        }
      },

      // Update user profile locally
      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates }
        }))
      },

      // Initialize auth state (call on app load)
      initialize: async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
          try {
            const profile = await authApi.getProfile()
            set({ 
              user: profile, 
              isAuthenticated: true 
            })
          } catch (error) {
            // Token invalid, clear storage
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            set({ 
              user: null, 
              isAuthenticated: false 
            })
          }
        }
      },

      // Check if user is employer
      isEmployer: () => {
        const { user } = get()
        return user?.user_type === 'employer'
      },

      // Check if user is job seeker
      isJobSeeker: () => {
        const { user } = get()
        return user?.user_type === 'job_seeker'
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
