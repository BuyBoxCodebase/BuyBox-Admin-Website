import DeliveryAgents from '@/features/users/delivery-agents'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/delivery-agents/')({
  component: DeliveryAgents,
})

