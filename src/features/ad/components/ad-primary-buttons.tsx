import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useCategory } from '../context/ad-context'
import { useNavigate } from '@tanstack/react-router'

export function TasksPrimaryButtons() {
  const { setOpen } = useCategory()
  const navigate = useNavigate()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <IconDownload size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => navigate({to:'/ad/create'})}>
        <span>Create</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
