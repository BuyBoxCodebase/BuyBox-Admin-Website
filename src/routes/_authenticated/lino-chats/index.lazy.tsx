import { createLazyFileRoute } from '@tanstack/react-router'
import LinoChats from '@/features/lino-chats'

export const Route = createLazyFileRoute('/_authenticated/lino-chats/')({
  component: LinoChats,
})
