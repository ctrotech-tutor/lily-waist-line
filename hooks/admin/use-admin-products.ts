import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, toggleProductStatus } from '@/server/actions/admin/products'
import type { GetAllProductsInput } from '@/server/actions/admin/products'
import type { CreateProductInput } from '@/server/actions/admin/products/create-product'
import type { UpdateProductInput } from '@/server/actions/admin/products/update-product'
import { adminKeys } from '@/lib/react-query/query-keys'

export function useAdminProduct(productId: string) {
  return useQuery({
    queryKey: adminKeys.products.detail(productId),
    queryFn: async () => {
      const result = await getProductById({ productId })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!productId,
  })
}

export function useAdminProducts(filters: GetAllProductsInput = {}) {
  return useQuery({
    queryKey: adminKeys.products.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const result = await getAllProducts(filters)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 30,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const result = await createProduct(data)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products.all() })
      toast.success('Product created successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProductInput) => {
      const result = await updateProduct(data)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products.all() })
      toast.success('Product updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await deleteProduct({ productId })
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products.all() })
      toast.success('Product deleted')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    },
  })
}

export function useToggleProductStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ productId, status }: { productId: string; status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' }) => {
      const result = await toggleProductStatus({ productId, status })
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.products.all() })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update status')
    },
  })
}