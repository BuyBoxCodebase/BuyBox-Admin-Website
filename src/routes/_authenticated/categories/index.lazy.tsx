import Categories from '@/features/category'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/categories/')({
  component: Categories,
})

