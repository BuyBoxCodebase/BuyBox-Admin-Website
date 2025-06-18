import Admins from '@/features/users/admins'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/admins/')({
  component: Admins,
})
