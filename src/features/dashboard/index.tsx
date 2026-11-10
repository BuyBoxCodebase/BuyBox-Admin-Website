import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import {
  DateRangeFilter,
  DayRange,
  RangePreset,
  presetRange,
} from './components/date-range-filter'
import { formatChange, formatUsd } from './format'
import useGetDashboard from '@/hooks/dashboard/useGetDashboard'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'

const toDay = (date: Date) => format(date, 'yyyy-MM-dd')
const showDay = (day: string) => format(parseISO(day), 'MMM d, y')

export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    const isVerified = localStorage.getItem('isVerified')
    isVerified === 'false' ? navigate({ to: '/401' }) : null
    const token = localStorage.getItem('token')
    token==null ? navigate({ to: '/sign-in' }) : navigate({ to: '/' })
  }, [navigate])

  const [preset, setPreset] = useState<RangePreset>('this-month')
  const [range, setRange] = useState<DayRange>(() => presetRange('this-month'))
  const { data, loading, error } = useGetDashboard(toDay(range.from), toDay(range.to))
  const ready = !loading && data

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-2 space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex flex-wrap items-center gap-2'>
            <DateRangeFilter
              preset={preset}
              range={range}
              onChange={(nextPreset, nextRange) => {
                setPreset(nextPreset)
                setRange(nextRange)
              }}
            />
            <Button>Download</Button>
          </div>
        </div>
        {data && (
          <p className='mb-2 text-sm text-muted-foreground'>
            {showDay(data.range.start)} – {showDay(data.range.end)}, compared with{' '}
            {showDay(data.range.previousStart)} – {showDay(data.range.previousEnd)}
          </p>
        )}
        {error && (
          <p className='mb-2 text-sm text-destructive'>{error}</p>
        )}
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <StatCard
                title='GMV'
                loading={!ready}
                value={data ? formatUsd(data.gmv.value) : ''}
                note={data ? formatChange(data.gmv.value, data.gmv.previous) : ''}
                icon={<path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />}
              />
              <StatCard
                title='Total Sellers'
                loading={!ready}
                value={data ? data.sellers.total.toLocaleString() : ''}
                note={data ? `+${data.sellers.new.toLocaleString()} joined in this period` : ''}
                icon={
                  <>
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </>
                }
              />
              <StatCard
                title='Orders'
                loading={!ready}
                value={data ? data.orders.value.toLocaleString() : ''}
                note={data ? formatChange(data.orders.value, data.orders.previous) : ''}
                icon={
                  <>
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </>
                }
              />
              <StatCard
                title='Total Customers'
                loading={!ready}
                value={data ? data.customers.total.toLocaleString() : ''}
                note={data ? `+${data.customers.new.toLocaleString()} joined in this period` : ''}
                icon={
                  <>
                    <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                    <circle cx='12' cy='7' r='4' />
                  </>
                }
              />
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    GMV from completed orders, per {data?.chart.bucket ?? 'day'}.
                  </CardDescription>
                </CardHeader>
                <CardContent className='pl-2'>
                  {ready ? (
                    <Overview data={data.chart.points} />
                  ) : (
                    <Skeleton className='h-[350px] w-full' />
                  )}
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    {data
                      ? `${data.gmv.completedOrders.toLocaleString()} completed orders in this period.`
                      : ' '}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ready ? (
                    <RecentSales sales={data.recentSales} />
                  ) : (
                    <Skeleton className='h-[300px] w-full' />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

function StatCard({
  title,
  value,
  note,
  icon,
  loading,
}: {
  title: string
  value: string
  note: string
  icon: ReactNode
  loading: boolean
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          className='h-4 w-4 text-muted-foreground'
        >
          {icon}
        </svg>
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='mt-2 h-3 w-32' />
          </>
        ) : (
          <>
            <div className='text-2xl font-bold'>{value}</div>
            <p className='text-xs text-muted-foreground'>{note}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
