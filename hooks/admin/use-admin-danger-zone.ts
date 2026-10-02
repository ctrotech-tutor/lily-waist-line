import { useMutation } from '@tanstack/react-query'
import { resetSystem } from '@/server/actions/admin/settings/reset-system'
import { clearAllStoreData } from '@/server/actions/admin/settings/clear-all-data'
import { exportStoreData } from '@/server/actions/admin/settings/export-data'
import { toast } from 'sonner'

export function useResetSystem() {
  return useMutation({
    mutationFn: async () => {
      const result = await resetSystem()
      if (!result.success) throw new Error(result.error ?? 'Failed to reset system')
    },
    onSuccess: () => {
      toast.success('System settings reset to defaults')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useClearAllStoreData() {
  return useMutation({
    mutationFn: async () => {
      const result = await clearAllStoreData()
      if (!result.success) throw new Error(result.error ?? 'Failed to clear store data')
    },
    onSuccess: () => {
      toast.success('All store data has been cleared')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useExportStoreData() {
  return useMutation({
    mutationFn: async () => {
      const result = await exportStoreData()
      if (!result.success) throw new Error(result.error ?? 'Failed to export data')
      return result.data
    },
    onSuccess: (jsonData) => {
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lilywaistline-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}