'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUploadAvatar, useDeleteAvatar } from '@/hooks/use-account-mutations'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants/routes'

interface AvatarUploadProps {
  avatarUrl: string | null
  fullName: string
}

export function AvatarUpload({ avatarUrl, fullName }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const uploadMutation = useUploadAvatar()
  const deleteMutation = useDeleteAvatar()

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate client-side
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      return
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Upload
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(ROUTES.API_UPLOADS_AVATAR, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { url, storagePath } = await res.json()
      await uploadMutation.mutateAsync({ url, storagePath })
    } catch (error) {
      console.error('Avatar upload failed:', error)
    } finally {
      URL.revokeObjectURL(objectUrl)
      setPreview(null)
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync()
  }

  const isLoading = uploadMutation.isPending || deleteMutation.isPending

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Avatar size="lg" className="size-20 sm:size-24">
          <AvatarImage
            src={preview || avatarUrl || undefined}
            alt={fullName}
          />
          <AvatarFallback className="font-heading text-lg sm:text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full',
            'bg-black/50 opacity-0 transition-opacity group-hover:opacity-100',
            isLoading && 'opacity-100'
          )}
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin text-white" />
          ) : (
            <Camera className="size-5 text-white" />
          )}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />

      {avatarUrl && !isLoading && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-medium shadow-sm hover:bg-destructive/90 transition-colors"
          title="Remove avatar"
        >
          &times;
        </button>
      )}
    </div>
  )
}