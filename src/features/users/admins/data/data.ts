import {
  IconCash,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from '@tabler/icons-react'
import { z } from 'zod'
const userStatusSchema = z.union([
  z.literal('PENDING'),
  z.literal('PROCESSING'),
  z.literal('COMPLETED'),
  z.literal('CANCELLED'),
])
export type UserStatus = z.infer<typeof userStatusSchema>
//PENDING,PROCESSING,COMPLETED,CANCELLED
export const callTypes = new Map<UserStatus, string>([
  ['COMPLETED', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['PROCESSING', 'bg-neutral-300/40 border-neutral-300'],
  ['PENDING', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  ['CANCELLED', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10'],
])

export const userTypes = [
  {
    label: 'Superadmin',
    value: 'superadmin',
    icon: IconShield,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: IconUserShield,
  },
  {
    label: 'Manager',
    value: 'manager',
    icon: IconUsersGroup,
  },
  {
    label: 'Cashier',
    value: 'cashier',
    icon: IconCash,
  },
] as const
