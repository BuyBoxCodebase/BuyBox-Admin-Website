import { createLazyFileRoute } from '@tanstack/react-router'
import DeliveryPricing from '@/features/delivery-pricing'

export const Route = createLazyFileRoute('/_authenticated/delivery-pricing/')({
  component: DeliveryPricing,
})
