import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { Order } from '@/hooks/orders/schema'
import { Badge } from '@/components/ui/badge' 
import { callTypes, UserStatus } from '@/features/users/admins/data/data'
import { DataTableRowActions } from '@/features/orders/components/data-table-row-actions'
export const columns: ColumnDef<Order>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => {
      const { id } = row.original
      return (
        <LongText className='max-w-28'>{id}</LongText>
      )
    },
    meta: { className: 'w-28' },
  },
    {
     id: 'seller',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Seller' />
      ),
    cell: ({ row }) => {
      const { products } = row.original
      const seller = products[0]?.product?.brand?.user?.name
      return <LongText className='max-w-42'>{seller}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
     id: 'seller',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
      ),
    cell: ({ row }) => {
      const { products } = row.original
      const seller = products[0]?.product?.brand?.user?.phoneNumber
      return <LongText className='max-w-42'>{seller}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    id: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const { email } = row.original
      return <LongText className='max-w-36'>{email}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    id: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => {
      const { phoneNumber } = row.original
      return <LongText className='max-w-36'>{phoneNumber}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    id: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Address' />
      ),
    cell: ({ row }) => {
      const { address } = row.original
      return <LongText className='max-w-42'>{address}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const badgeColor = callTypes.get(status as UserStatus)
      return <Badge variant='outline' className={cn('capitalize', badgeColor)}>{status}</Badge>
    },
    enableSorting: false,
  },
  {
    id: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Amount' />
    ),
    cell: ({ row }) => {
      const { totalAmount } = row.original
      return <LongText className='max-w-36'>{totalAmount}</LongText>
    },
    meta: { className: 'w-36' },
  },
  
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
