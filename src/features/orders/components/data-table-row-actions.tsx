import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconBan, IconCheck} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useOrders } from '../context/orders-context'
import { orderSchema } from '@/hooks/orders/schema'
import { Order } from '@/hooks/orders/schema'


interface DataTableRowActionsProps {
  row: Row<Order>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useOrders()
  const order = orderSchema.parse(row.original)
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
         {order.status === 'PENDING' ? <DropdownMenuItem
            onClick={() => {
              setCurrentRow(order)
              setOpen('assign')
            }}
          >
            Assign
            <DropdownMenuShortcut>
              <IconCheck size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>:
          <DropdownMenuItem
          onClick={() => {
            setCurrentRow(order)
            setOpen('delete')
          }}
          className='!text-red-500'
        >
          Cancel
          <DropdownMenuShortcut>
            <IconBan size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
