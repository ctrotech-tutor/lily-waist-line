import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountKeys, authKeys } from '@/lib/react-query/query-keys'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { updateProfile } = await import('@/server/actions/account')
      const result = await updateProfile(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.profile() })
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { changePassword } = await import('@/server/actions/account')
      const result = await changePassword(formData)
      if (!result.success) {
        throw new Error(result.error || 'Failed to change password')
      }
      return result
    },
  })
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: async () => {
      const { resendVerificationEmail } = await import('@/server/actions/account')
      const result = await resendVerificationEmail()
      if (!result.success) {
        throw new Error(result.error || 'Failed to resend verification email')
      }
      return result
    },
  })
}

export function useLogoutAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { logout } = await import('@/server/actions/account')
      const result = await logout()
      if (!result.success) {
        throw new Error(result.error || 'Failed to logout')
      }
      return result
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ url, storagePath }: { url: string; storagePath: string }) => {
      const { updateAvatar } = await import('@/server/actions/account/update-avatar')
      const result = await updateAvatar(url, storagePath)
      if (!result.success) {
        throw new Error(result.error || 'Failed to update avatar')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.profile() })
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { deleteAvatar } = await import('@/server/actions/account/update-avatar')
      const result = await deleteAvatar()
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete avatar')
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.profile() })
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
    },
  })
}