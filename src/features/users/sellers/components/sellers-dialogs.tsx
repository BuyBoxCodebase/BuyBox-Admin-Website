
import { useUsers } from '../context/seller-context'
import { UsersInviteDialog } from './sellers-invite-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow} = useUsers()
  return (
    <>

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>

        </>
      )}
    </>
  )
}
