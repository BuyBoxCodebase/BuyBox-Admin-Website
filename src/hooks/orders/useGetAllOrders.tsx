// Modified useGetAllSellers hook
import { useEffect, useState } from 'react'
import { Order } from './schema'
import { Meta } from '../users/schema'

interface GetOrderProps {
  limit?: number
  page?: number
}

export default function useGetAllOrders({ limit = 10, page = 1 }: GetOrderProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta | null>(null)

  const fetchOrders = async (pageNum: number, pageLimit: number) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/control/get/orders?limit=${pageLimit}&page=${pageNum}`,
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
      setOrders(data.data)
      setMeta(data.meta)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setOrders([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(page, limit)
  }, [page, limit])

  return { 
    orders, 
    loading, 
    meta, 
    fetchOrders, 
    totalPages: meta?.totalPages || 1,
    total: meta?.total || 0
  }
}