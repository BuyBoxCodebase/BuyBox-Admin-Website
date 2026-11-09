import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DashboardRecentSale } from '@/hooks/dashboard/useGetDashboard'
import { formatUsd } from '../format'

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'
  )
}

export function RecentSales({ sales }: { sales: DashboardRecentSale[] }) {
  if (sales.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>
        No completed orders in this period.
      </p>
    )
  }

  return (
    <div className='space-y-8'>
      {sales.map((sale) => (
        <div key={sale.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            {sale.profilePic && <AvatarImage src={sale.profilePic} alt={sale.name} />}
            <AvatarFallback>{initials(sale.name)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium leading-none'>{sale.name}</p>
              <p className='text-sm text-muted-foreground'>{sale.email}</p>
            </div>
            <div className='font-medium'>+{formatUsd(sale.amount)}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
