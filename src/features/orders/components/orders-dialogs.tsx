import { useOrders } from '../context/orders-context'
import { OrdersAssignDialog } from './orders-assign-dialog'


export function OrdersDialogs() {
  const { open, setOpen, currentRow } = useOrders()
  return (
    <>
      {/* <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      /> */}


      {currentRow && (
        <>
          <OrdersAssignDialog
            key='order-assign'
            open={open === 'assign'}
            onOpenChange={() => setOpen('assign')}
            currentRow={currentRow}
          />

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
