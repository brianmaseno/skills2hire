import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, Loader2, CheckCircle, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { authApi } from '../../api'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: verify, 2: reset password, 3: success
  const [identifier, setIdentifier] = useState('')
  const [identifierType, setIdentifierType] = useState('email') // 'email' or 'phone'
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accountData, setAccountData] = useState(null)

  const handleCheckAccount = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const data = identifierType === 'email' 
        ? { email: identifier } 
        : { phone_number: identifier }
      
      const response = await authApi.checkAccountExists(data)
      
      if (response.exists) {
        setAccountData(response)
        setStep(2)
        toast.success('Account found! You can now reset your password.')
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('No account found with that ' + (identifierType === 'email' ? 'email' : 'phone number'))
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setIsLoading(true)
    
    try {
      const data = {
        new_password: newPassword,
        new_password_confirm: confirmPassword,
        ...(identifierType === 'email' ? { email: identifier } : { phone_number: identifier })
      }
      
      await authApi.simplePasswordReset(data)
      setStep(3)
      toast.success('Password reset successfully!')
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.new_password?.[0] || 'Failed to reset password'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Success screen
  if (step === 3) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-md w-full text-center card glass-effect p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been changed successfully. You can now login with your new password.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary w-full py-3"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Reset password form (Step 2)
  if (step === 2) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="card glass-effect p-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Set New Password
              </h2>
              <p className="text-gray-600">
                Create a strong password for your account
              </p>
              {accountData?.email && (
                <p className="text-sm text-primary-600 mt-2 font-medium">
                  {accountData.email}
                </p>
              )}
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="Confirm new password"
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2 inline" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Verify account form (Step 1)
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="card glass-effect p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600">
              Enter your email or phone number to verify your account
            </p>
          </div>

          {/* Toggle between email and phone */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setIdentifierType('email')
                setIdentifier('')
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                identifierType === 'email'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifierType('phone')
                setIdentifier('')
              }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                identifierType === 'phone'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
          </div>

          <form onSubmit={handleCheckAccount} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {identifierType === 'email' ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                {identifierType === 'email' ? (
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                )}
                <input
                  type={identifierType === 'email' ? 'email' : 'tel'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input pl-10"
                  placeholder={identifierType === 'email' ? 'you@example.com' : '+1234567890'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !identifier}
              className="btn-primary w-full py-3 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2 inline" />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
