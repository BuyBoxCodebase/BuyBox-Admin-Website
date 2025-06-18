import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
} from '@tabler/icons-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: IconExclamationCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: IconCircle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: IconStopwatch,
  },
  {
    value: 'done',
    label: 'Done',
    icon: IconCircleCheck,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: IconCircleX,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
]

export const AdType = [
  {
    value: 'BANNER',
    label: 'Banner',
  },
  {
    value: 'POPUP',
    label: 'Popup',
  },
  {
    value: 'CAROUSEL',
    label: 'Carousel',
  },
  {
    value: 'SIDEBAR',
    label: 'Sidebar',
  },
  {
    value: 'FEATURED_PRODUCT',
    label: 'Featured Product',
  },
  {
    value: 'CATEGORY_HIGHLIGHT',
    label: 'Category Highlight',
  },
  {
    value: 'PROMOTIONAL',
    label: 'Promotional',
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
  },
]

export const AdPlacement = [
  {
    value: 'HOME_PAGE',
    label: 'Home Page',
  },
  {
    value: 'PRODUCT_PAGE',
    label: 'Product Page',
  },
  {
    value: 'CATEGORY_PAGE',
    label: 'Category Page',
  },
  {
    value: 'CHECKOUT_PAGE',
    label: 'Checkout Page',
  },
  {
    value: 'SEARCH_RESULTS',
    label: 'Search Results',
  },
  {
    value: 'PROFILE_PAGE',
    label: 'Profile Page',
  },
  {
    value: 'SIDEBAR',
    label: 'Sidebar',
  },
  {
    value: 'FOOTER',
    label: 'Footer',
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
  },
]

export const AdStatus = [
  {
    value: 'DRAFT',
    label: 'Draft',
  },
  {
    value: 'SCHEDULED',
    label: 'Scheduled',
  },
  {
    value: 'ACTIVE',
    label: 'Active',
  },
  {
    value: 'PAUSED',
    label: 'Paused',
  },
  {
    value: 'ENDED',
    label: 'Ended',
  },
  {
    value: 'ARCHIVED',
    label: 'Archived',
  },
]

export const AdTargetType = [
  {
    value: 'ALL_USERS',
    label: 'All Users',
  },
  {
    value: 'SPECIFIC_USERS',
    label: 'Specific Users',
  },
  {
    value: 'NEW_USERS',
    label: 'New Users',
  },
  {
    value: 'RETURNING_USERS',
    label: 'Returning Users',
  },
  {
    value: 'INTEREST_BASED',
    label: 'Interest Based',
  },
  {
    value: 'LOCATION_BASED',
    label: 'Location Based',
  },
  {
    value: 'CUSTOM',
    label: 'Custom',
  },
]
