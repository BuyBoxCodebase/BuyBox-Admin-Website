import Admin from '@/features/admin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/admin')({
  component: Admin,
})

