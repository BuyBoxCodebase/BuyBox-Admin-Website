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
import { Admins, adminSchema} from '@/hooks/users/schema'
//import { useUsers } from '../context/admins-context'

interface DataTableRowActionsProps {
  row: Row<Admins>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  //const { setOpen, setCurrentRow } = useUsers()
  const admin = adminSchema.parse(row.original)
  const baseUrl = import.meta.env.VITE_BASE_URL as string
  const token = localStorage.getItem('token')
  async function handleApprove() {
    const response = await fetch(`${baseUrl}/admin/control/grant/admin/${admin.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    console.log('Approve response:', data)
  }
  async function handleRevoke() {
    const response = await fetch(`${baseUrl}/admin/control/revoke/admin/${admin.id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    console.log('Revoke response:', data)
  }

if(admin.role === 'SUPER_ADMIN') {
    return null
  }
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
         {!admin.isVerified ? <DropdownMenuItem
            onClick={() => {
              //setCurrentRow(admin)
             // setOpen('edit')
              handleApprove()
            }}
          >
            Approve
            <DropdownMenuShortcut>
              <IconCheck size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>:
          <DropdownMenuItem
          onClick={() => {
            handleRevoke()
            // setCurrentRow(admin)
            // setOpen('delete')
          }}
          className='!text-red-500'
        >
          Revoke
          <DropdownMenuShortcut>
            <IconBan size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
