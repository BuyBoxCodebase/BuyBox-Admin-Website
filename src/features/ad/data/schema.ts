import { z } from 'zod'
import { AdPlacement, AdStatus, AdTargetType, AdType } from './data'

export const categorySchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  imageUrl: z.string().nonempty(),
  subCategories: z.array(z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    imageUrl: z.string().nonempty(),
    categoryId: z.string().nonempty(),
  })),
})

export type Category = z.infer<typeof categorySchema>

export const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  type: z.enum(AdType.map(type => type.value) as [string, ...string[]]),
  placement: z.enum(AdPlacement.map(placement => placement.value) as [string, ...string[]]),
  content: z.record(z.any()),
  targetType: z.enum(AdTargetType.map(targetType => targetType.value) as [string, ...string[]]),
  targetConfig: z.record(z.any()).optional(),
  status: z.enum(AdStatus.map(status => status.value) as [string, ...string[]]),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  priority: z.string().optional(),
  maxImpressions: z.string().optional(),
  maxClicks: z.string().optional(),
  budget: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
  scheduleConfig: z.record(z.any()).optional(),
  displayConditions: z.record(z.any()).optional(),
  isAbTest: z.boolean().optional(),
  abTestGroup: z.string().optional(),
})
export type AdsForm = z.infer<typeof formSchema>