// Modified useGetAllSellers hook
import { useEffect, useState } from 'react'
import { Meta, Seller } from './schema'

interface GetSellerProps {
  limit?: number
  page?: number
}

export default function useGetAllSellers({ limit = 10, page = 1 }: GetSellerProps) {
  const [seller, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta | null>(null)

  const fetchSellers = async (pageNum: number, pageLimit: number) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/control/get/sellers?limit=${pageLimit}&page=${pageNum}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      )
      const data = await response.json()
      //console.log(data)
      setSellers(data.data)
      setMeta(data.meta)
    } catch (err) {
      console.error('Error fetching sellers:', err)
      setSellers([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers(page, limit)
  }, [page, limit])

  return { 
    seller, 
    loading, 
    meta, 
    fetchSellers, 
    totalPages: meta?.totalPages || 1,
    total: meta?.total || 0
  }
}