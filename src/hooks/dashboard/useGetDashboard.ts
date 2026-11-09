import { useEffect, useState } from 'react'
import { handleUnauthorized } from '@/utils/handle-unauthorized'

export interface DashboardChartPoint {
  key: string
  label: string
  gmv: number
  orders: number
}

export interface DashboardRecentSale {
  id: string
  name: string
  email: string
  profilePic: string | null
  amount: number
  createdAt: string
}

export interface DashboardData {
  range: {
    start: string
    end: string
    days: number
    previousStart: string
    previousEnd: string
  }
  gmv: { value: number; previous: number; completedOrders: number }
  orders: { value: number; previous: number }
  sellers: { total: number; new: number; previousNew: number }
  pendingOrders: { inRange: number; total: number }
  chart: { bucket: 'day' | 'month'; points: DashboardChartPoint[] }
  recentSales: DashboardRecentSale[]
}

// start and end are YYYY-MM-DD, both inclusive
export default function useGetDashboard(start: string, end: string) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ start, end })
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admin/control/dashboard?${params}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        if (handleUnauthorized(response)) return
        const body = await response.json()
        if (!response.ok) {
          throw new Error(body?.message ?? 'Could not load dashboard')
        }
        if (!cancelled) setData(body)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        if (!cancelled) {
          setData(null)
          setError(err instanceof Error ? err.message : 'Could not load dashboard')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [start, end])

  return { data, loading, error }
}
