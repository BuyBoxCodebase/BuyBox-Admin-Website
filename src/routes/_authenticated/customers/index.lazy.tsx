import Customers from '@/features/users/customers'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/customers/')({
  component: Customers,
})

