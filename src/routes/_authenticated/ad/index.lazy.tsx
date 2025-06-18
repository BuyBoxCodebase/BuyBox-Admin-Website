import Ad from '@/features/ad'

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/ad/')({
  component: Ad
})


