import { createLazyFileRoute } from '@tanstack/react-router'
import VariantApprovals from '@/features/variants'

export const Route = createLazyFileRoute('/_authenticated/variants/')({
  component: VariantApprovals,
})
