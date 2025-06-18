// Modified useGetAllCUstomers hook
import { useEffect, useState } from 'react'
import { Meta, Customer } from './schema'

interface GetCustomerProps {
  limit?: number
  page?: number
}

export default function useGetAllCustomers({ limit = 10, page = 1 }: GetCustomerProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [meta, setMeta] = useState<Meta | null>(null)

  const fetchcustomers = async (pageNum: number, pageLimit: number) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/control/get/customers?limit=${pageLimit}&page=${pageNum}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      )
      const data = await response.json()
     // console.log(data)
      setCustomers(data.data)
      setMeta(data.meta)
    } catch (err) {
      console.error('Error fetching CUstomers:', err)
      setCustomers([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchcustomers(page, limit)
  }, [page, limit])

  return { 
    customers, 
    loading, 
    meta, 
    fetchcustomers, 
    totalPages: meta?.totalPages || 1,
    total: meta?.total || 0
  }
}