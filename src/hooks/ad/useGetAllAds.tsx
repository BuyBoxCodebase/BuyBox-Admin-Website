
import { useEffect, useState } from 'react'
import { Ad } from './schema'
import { handleUnauthorized } from '@/utils/handle-unauthorized'

export default function useGetAllAds() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchads = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/ads/get`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (!response.ok) {
          handleUnauthorized(response)
          throw new Error(`Failed to fetch ads: ${response.status}`)
        }
        const data = await response.json()
        setAds(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching products:', err)
        setAds([])
      } finally {
        setLoading(false)
      }
    }

    fetchads()
  }, [])

  return { ads, loading }
}
