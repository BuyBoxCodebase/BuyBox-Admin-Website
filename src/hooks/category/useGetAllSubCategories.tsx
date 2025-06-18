
import { SubCategory } from '@/features/subcategories/data/schema'
import { useEffect, useState } from 'react'

// interface CategoryProps {
//   id: string
//   name: string
//   imageUrl: string
//   categoryId?:string,
//   subCategories?: CategoryProps[]
// }

export default function useGetAllSubCategories() {
  const [categories, setCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        // console.log('here')
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/category/get/sub-categories`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const data = await response.json()
       // console.log(data)
        setCategories(data)
      } catch (err) {
        console.error('Error fetching products:', err)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading }
}
