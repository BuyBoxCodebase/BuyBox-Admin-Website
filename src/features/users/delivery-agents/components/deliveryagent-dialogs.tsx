
import { useUsers } from '../context/deliveryagent-context'
import { UsersInviteDialog } from './deliveryagent-invite-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow } = useUsers()
  return (
    <>
      {/* <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      /> */}

      <UsersInviteDialog
        key='user-invite'
        open={open === 'invite'}
        onOpenChange={() => setOpen('invite')}
      />

      {currentRow && (
        <>
          {/* <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow as Seller}
          /> */}

          {/* <UsersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow as Seller}
          /> */}
        </>
      )}
    </>
  )
}
