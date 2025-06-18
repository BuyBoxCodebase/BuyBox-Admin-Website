import { z } from 'zod'

export const categorySchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  imageUrl: z.string().nonempty(),
  priority: z.number().nonnegative(),
  subCategories: z.array(z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    imageUrl: z.string().nonempty(),
    categoryId: z.string().nonempty(),
    priority: z.number().nonnegative(),
  })),
})

export type Category = z.infer<typeof categorySchema>