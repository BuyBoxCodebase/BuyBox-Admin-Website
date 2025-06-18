// {
//     "id": "67dac63d32f7ce17c4c9f85e",
//     "userId": "67acf483923b6d408ab55b75",
//     "email": "banerjeedibs@gmail.com",
//     "phoneNumber": "83370-45160",
//     "address": "68/157/A Lowland, Kolkata, banchod bag",
//     "status": "PENDING",
//     "totalAmount": 4,
//     "paymentMode": "CASH_ON_DELIVERY",
//     "deliveryAgentId": null,
//     "createdAt": "2025-03-19T13:27:25.705Z",
//     "updatedAt": "2025-03-19T13:27:25.705Z"
// }

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
})

export type Order = z.infer<typeof orderSchema>
