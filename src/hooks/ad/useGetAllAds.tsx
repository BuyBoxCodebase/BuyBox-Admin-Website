
import { useEffect, useState } from 'react'
import { Ad } from './schema'

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
        const data = await response.json()
       // console.log(data)
        setAds(data)
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
