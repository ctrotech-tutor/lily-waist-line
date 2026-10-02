import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/lib/react-query/query-keys'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const { login } = await import('@/server/actions/auth')
      const result = await login(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to sign in')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: async (formData: {
      firstName: string
      lastName: string
      email: string
      password: string
      confirmPassword: string
      agreeToTerms: boolean
    }) => {
      const { signup } = await import('@/server/actions/auth')
      const result = await signup(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to create account')
      }
      return result
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { logout } = await import('@/server/actions/auth')
      await logout()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (formData: { email: string }) => {
      const { forgotPassword } = await import('@/server/actions/auth')
      const result = await forgotPassword(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to send reset email')
      }
      return result
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (formData: { password: string; confirmPassword: string }) => {
      const { resetPassword } = await import('@/server/actions/auth')
      const result = await resetPassword(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to reset password')
      }
      return result
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (formData: { email: string }) => {
      const { resendVerification } = await import('@/server/actions/auth')
      const result = await resendVerification(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to resend verification')
      }
      return result
    },
  })
}