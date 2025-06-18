import Subcategories from '@/features/subcategories'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/subcategories/')({
  component: Subcategories,
})
