import CreateAdvertisementForm from '@/features/ad/components/ad-create-form'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/ad/create')({
  component: CreateAdvertisementForm

})

