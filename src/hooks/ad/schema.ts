import { z } from "zod";

export const adSchema = z.object({
    id: z.string().nonempty(),
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    type: z.string().nonempty(),
    placement: z.string().nonempty(),
    content: z.record(z.any()),
    targetType: z.string().nonempty(),
    targetConfig: z.record(z.any()).optional(),
    status: z.string().nonempty(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    priority: z.string().optional(),
    maxImpressions: z.string().optional(),
    maxClicks: z.string().optional(),
    budget: z.number().optional(),
    productId: z.string().optional(),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    mediaUrls: z.array(z.string()).optional(),
    scheduleConfig: z.record(z.any()).optional(),
    displayConditions: z.record(z.any()).optional(),
    isAbTest: z.boolean().optional(),
    abTestGroup: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    product: z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty(),
        images: z.array(z.string()).optional(),
        basePrice: z.number().optional()
    }),
    category: z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty()
    }),
    brand: z.object({
        id: z.string().nonempty(),
        name: z.string().nonempty(),
        brandPic: z.string().optional()
    }),
    metrics: z.array(z.any()).optional(),
    performance: z.object({
        summary: z.object({
            totalImpressions: z.number().optional(),
            totalClicks: z.number().optional(),
            totalConversions: z.number().optional(),
            totalRevenue: z.number().optional(),
            totalCost: z.number().optional(),
            overallCTR: z.number().optional(),
            conversionRate: z.number().optional(),
            cpc: z.number().optional(),
            cpm: z.number().optional(),
            roi: z.number().optional()
        }),
        averages: z.object({
            impressions: z.number().optional(),
            clicks: z.number().optional(),
            conversions: z.number().optional()
        }),
        trends: z.object({
            impressions: z.number().optional(),
            clicks: z.number().optional()
        }),
        demographics: z.object({
            ageGroups: z.record(z.any()).optional(),
            genders: z.record(z.any()).optional(),
            locations: z.record(z.any()).optional(),
            devices: z.record(z.any()).optional()
        }),
        dailyData: z.array(z.any()).optional(),
        reachedLimits: z.object({
            budget: z.boolean().optional(),
            impressions: z.boolean().optional(),
            clicks: z.boolean().optional()
        })
    })
})

export type Ad = z.infer<typeof adSchema>
//         "demographics": {
//             "ageGroups": {},
//             "genders": {},
//             "locations": {},
//             "devices": {}
//         },
//         "dailyData": [],
//         "reachedLimits": {
//             "budget": false,
//             "impressions": false,
//             "clicks": false
//         }
//     }
// }