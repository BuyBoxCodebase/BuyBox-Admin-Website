// "id": "68a7eb9fbf162e960026bc2d",
//             "userId": "68a5a11cdbf00286e8392eba",
//             "email": "ruramaiplaxedes@gmail.com",
//             "phoneNumber": "0784780407",
//             "address": "4461 kondo close rujeko b, Masvingo , Masvingo ",
//             "status": "PENDING",
//             "totalAmount": 22.99,
//             "paymentMode": "CASH_ON_DELIVERY",
//             "deliveryAgentId": null,
//             "createdAt": "2025-08-22T04:01:34.833Z",
//             "updatedAt": "2025-08-22T04:01:34.833Z",
//             "products": [
//                 {
//                     "product": {
//                         "brand": {
//                             "name": "BuyBox",
//                             "user": {
//                                 "name": "BuyBox Inc"
//                             }
//                         }
//                     }
//                 }
//             ]

import { z } from 'zod'

export const orderSchema = z.object({
    id: z.string().nonempty(),
    userId: z.string().nonempty(),
    email: z.string().nonempty(),
    phoneNumber: z.string().nonempty(),
    address: z.string().nonempty(),
    status: z.string().nonempty(),
    totalAmount: z.number(),
    paymentMode: z.string().nonempty(),
    deliveryAgentId: z.string().nullable(),
    createdAt: z.string().nonempty(),
    products: z.array(z.object({
        product: z.object({
            brand: z.object({
                name: z.string().nonempty(),
                user: z.object({
                    name: z.string().nonempty(),
                    phoneNumber: z.string().nullable(),
                })
            })
        })
    }))
})

export type Order = z.infer<typeof orderSchema>
