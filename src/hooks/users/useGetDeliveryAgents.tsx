// Modified useGetAllSellers hook
import { useEffect, useState } from 'react'
import { Meta, DeliveryAgent } from './schema'

interface GetDeliveryAgentProps {
  limit?: number
  page?: number
}

export default function useGetAllDeliveryAgents({ limit = 10, page = 1 }: GetDeliveryAgentProps) {
  const [deliveryAgents, setDeliveryAgents] = useState<DeliveryAgent[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta | null>(null)

  const fetchDeliveryAgents = async (pageNum: number, pageLimit: number) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/control/get/delivery-agents?limit=${pageLimit}&page=${pageNum}`,
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
      setDeliveryAgents(data.data)
      setMeta(data.meta)
    } catch (err) {
      console.error('Error fetching delivery agents:', err)
      setDeliveryAgents([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeliveryAgents(page, limit)
  }, [page, limit])

  return { 
    deliveryAgents, 
    loading, 
    meta, 
    fetchDeliveryAgents, 
    totalPages: meta?.totalPages || 1,
    total: meta?.total || 0
  }
}