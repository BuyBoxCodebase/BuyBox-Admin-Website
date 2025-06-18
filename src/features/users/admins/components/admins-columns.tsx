import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Admins } from '@/hooks/users/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { callTypes } from '../data/data'

export const columns: ColumnDef<Admins>[] = [
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
    id: 'profilePic',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Profile Pic' />
    ),
    cell: ({ row }) => {
      const { profilePic, name } = row.original
      return (
        <Avatar className='h-8 w-8'>
          <AvatarImage src={profilePic!} alt='@shadcn' />
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      )
    },
    meta: { className: 'w-36' },
  },
  {
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const { name } = row.original
      return <LongText className='max-w-36'>{name}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-42'>{row.getValue('email')}</LongText>
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber') ? row.getValue('phoneNumber') : 'N/A'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'isVerified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Verified' />
    ),
    cell: ({ row }) => {
      const { isVerified } = row.original
      const badgeColor = callTypes.get(isVerified ? 'COMPLETED' : 'CANCELLED')
      return (
        <div className='flex space-x-2'>
          {row.getValue('role') === 'ADMIN' ?
            <Badge variant='outline' className={cn('capitalize', badgeColor)}>
              {row.getValue('isVerified') ? 'Verified' : 'Not Verified'}
            </Badge> : null
          }
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {

      return (
        <div className='flex items-center gap-x-2'>
          <span className='text-sm capitalize'>{row.getValue('role')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
