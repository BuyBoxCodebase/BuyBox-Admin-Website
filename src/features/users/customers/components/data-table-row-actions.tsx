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
import { useUsers } from '../context/customer-context'
import { Customer, customerSchema } from '@/hooks/users/schema'

interface DataTableRowActionsProps {
  row: Row<Customer>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useUsers()
  const seller = customerSchema.parse(row.original)
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
         {!seller.isCompleted ? <DropdownMenuItem
            onClick={() => {
              //setCurrentRow(seller)
             // setOpen('edit')
            }}
          >
            Approve
            <DropdownMenuShortcut>
              <IconCheck size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>:
          <DropdownMenuItem
          onClick={() => {
            setCurrentRow(seller)
            setOpen('delete')
          }}
          className='!text-red-500'
        >
          Ban
          <DropdownMenuShortcut>
            <IconBan size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
