import Sellers from '@/features/users/sellers'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/sellers/')({
  component: Sellers,
})

