import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { DataTableColumnHeader } from './data-table-column-header'
import { Customer } from '@/hooks/users/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const columns: ColumnDef<Customer>[] = [
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
      const { profilePic,name } = row.original
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
    meta: { className: 'w-42' },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
    enableSorting: false,
  },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const { isCompleted } = row.original
  //     const status = isCompleted ? 'active' : 'inactive'
  //     const badgeColor = callTypes.get(status)
  //     return (
  //       <div className='flex space-x-2'>
  //         <Badge variant='outline' className={cn('capitalize', badgeColor)}>
  //           {status}
  //         </Badge>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  //   enableHiding: false,
  //   enableSorting: false,
  // },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ }) => {
      // const { role } = row.original
      // const userType = userTypes.find(({ value }) => value === role)

      // if (!userType) {
      //   return null
      // }

      return (
        <div className='flex items-center gap-x-2'>
          {/* {userType.icon && (
            <userType.icon size={16} className='text-muted-foreground' />
          )} */}
          <span className='text-sm capitalize'>Customer</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   id: 'actions',
  //   cell: DataTableRowActions,
  // },
]
