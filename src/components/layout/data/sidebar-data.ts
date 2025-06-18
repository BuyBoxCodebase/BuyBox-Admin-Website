import {
  IconAd,
  IconCheckbox,
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconMenuOrder,
  IconPackageExport,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserDollar,
  IconUsers,
  IconUserStar,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type LinkProps } from '@tanstack/react-router'
import { type SidebarData } from '../types'

const user = localStorage.getItem('user')
const userObj = user ? JSON.parse(user) : null

const typeSafeUrl = <T extends string>(url: T): LinkProps['to'] => url as LinkProps['to']

export const sidebarData: SidebarData = {
  user: {
    name: userObj?.name || 'Name Loading...',
    email: userObj?.email || 'Email Loading...',
    avatar: userObj?.profilePic || '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'BuyBox',
      logo: Command,
      plan: 'BuyBox',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: typeSafeUrl('/'),
          icon: IconLayoutDashboard,
        },
        {
          title: 'Ads',
          url: typeSafeUrl('/ad'),
          icon: IconAd,
        },
        {
          title: 'Categories',
          url: typeSafeUrl('/categories'),
          icon: IconChecklist,
        },
        {
          title: 'SubCategories',
          url: typeSafeUrl('/subcategories'),
          icon: IconCheckbox,
        },
        {
          title: 'Orders',
          url: typeSafeUrl('/orders'),
          icon: IconMenuOrder,
        },
        ...(userObj?.role === 'SUPER_ADMIN' ? [{
          title: 'Admins',
          url: typeSafeUrl('/admins'),
          icon: IconUsers,
        }] : []),
        {
          title: 'Users',
          icon: IconUsers,
          items: [
            {
              title: 'Sellers',
              url: typeSafeUrl('/sellers'),
              icon: IconUserDollar,
            },
            {
              title: 'Customers',
              url: typeSafeUrl('/customers'),
              icon: IconUserStar,
            },
            {
              title: 'Delivery Agents',
              url: typeSafeUrl('/delivery-agents'),
              icon: IconPackageExport,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: typeSafeUrl('/settings'),
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: typeSafeUrl('/settings/account'),
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: typeSafeUrl('/settings/appearance'),
              icon: IconPalette,
            },
          ],
        },
        {
          title: 'Help Center',
          url: typeSafeUrl('/help-center'),
          icon: IconHelp,
        },
      ],
    },
  ],
}