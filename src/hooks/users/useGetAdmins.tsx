// Modified useGetAlladminss hook
import { useEffect, useState } from 'react'
import { Admins } from './schema'



export default function useGetAlladminss() {
  const [admins, setAdmins] = useState<Admins[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/control/get/admins`,
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
      setAdmins(data)
    } catch (err) {
      console.error('Error fetching adminss:', err)
      setAdmins([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])


  return { 
    admins, 
    loading, 
  }
}