import { z } from 'zod'

export const sellerSchema = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    profilePic: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    isCompleted: z.boolean(),
    createdAt: z.string().nonempty(),
    brand: z.object(
        {
            id: z.string().nonempty(),
            name: z.string().nonempty(),
            description: z.string(),
            brandPic: z.string().nullable(),
            createdAt: z.string().nonempty(),
        }
    ).nullable()

})

export type Seller = z.infer<typeof sellerSchema>

export const metaSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean()
})
export type Meta = z.infer<typeof metaSchema>

export const customerSchema = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    profilePic: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    isCompleted: z.boolean(),
    createdAt: z.string().nonempty()
})
export type Customer = z.infer<typeof customerSchema>

export const adminSchema = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    profilePic: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    role: z.string().nonempty(),
    createdAt: z.string().nonempty(),
    isVerified: z.boolean()
})
export type Admins = z.infer<typeof adminSchema>

export const deliveryAgentSchema = z.object({
    id: z.string().nonempty(),
    name: z.string().nonempty(),
    email: z.string().nonempty(),
    profilePic: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    isCompleted: z.boolean(),
    createdAt: z.string().nonempty(),
    isAssigned: z.boolean()
})
export type DeliveryAgent = z.infer<typeof deliveryAgentSchema>

// {
//     "id": "67f3b2c1d1a1babac8e7f1dc",
//     "name": "Palad Sa",
//     "email": "palasda@gmail.com",
//     "password": "$argon2id$v=19$m=65536,t=3,p=4$Pao2AQOhmlzGJ/T3UICBBQ$Ozl2835b9mpUyWDX9HzmSqjEPttO/ib/uNEwE173qRk",
//     "profilePic": null,
//     "phoneNumber": null,
//     "googleId": null,
//     "facebookId": null,
//     "isCompleted": false,
//     "createdAt": "2025-04-07T11:10:57.803Z",
//     "updatedAt": "2025-04-07T11:10:57.803Z"
// }