import { useCallback, useEffect, useState } from 'react'

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ReviewVariant {
  id: string
  name?: string | null
  description?: string | null
  price: number
  isDefault: boolean
  images: string[]
  quantity: number
  approvalStatus: ApprovalStatus
  rejectionReason?: string | null
  reviewedAt?: string | null
  createdAt: string
  options: { name: string; value: string }[]
  product: {
    id: string
    name: string
    description: string
    brand?: string | null
    modelName?: string | null
    images: string[]
    category?: { name: string } | null
    subCategory?: { name: string } | null
    seller: { id: string; name: string; email: string }
  }
}

export interface StatusCounts {
  pending: number
  approved: number
  rejected: number
}

const baseUrl = () => import.meta.env.VITE_BASE_URL
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export default function useVariantApprovals(status: ApprovalStatus, page: number, limit = 10) {
  const [variants, setVariants] = useState<ReviewVariant[]>([])
  const [counts, setCounts] = useState<StatusCounts>({ pending: 0, approved: 0, rejected: 0 })
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl()}/admin/variants?status=${status}&page=${page}&limit=${limit}`, {
        headers: headers(),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message ?? 'Failed to load variants')
      setVariants(data.variants)
      setCounts(data.counts)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error('Error fetching variants:', err)
      setVariants([])
    } finally {
      setLoading(false)
    }
  }, [status, page, limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { variants, counts, totalPages, loading, refetch }
}

async function review(path: 'approve' | 'reject', body: Record<string, unknown>) {
  const response = await fetch(`${baseUrl()}/admin/variants/${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(Array.isArray(data?.message) ? data.message.join(', ') : data?.message ?? 'Request failed')
  return data
}

export const approveVariants = (variantIds: string[]) => review('approve', { variantIds })
export const rejectVariants = (variantIds: string[], reason: string) => review('reject', { variantIds, reason })
