import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  imageUrl: z.string().nonempty(),
  categoryId: z.string().nonempty(),
  priority: z.number().nonnegative(),
  category: z.object({
    name: z.string().nonempty(),
    // categoryId: z.string().nonempty(),
  }),
})

export type SubCategory = z.infer<typeof categorySchema>