import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/sellers-columns'
import { UsersDialogs } from './components/sellers-dialogs'
import { UsersPrimaryButtons } from './components/sellers-primary-buttons'
import { SellersTable } from './components/sellers-table'
import UsersProvider from './context/seller-context'
import useGetAllSellers from '@/hooks/users/useGetSellers'

export default function Sellers() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  
  // Parse user list, now with pagination parameters
  const { seller, loading, totalPages, total } = useGetAllSellers({
    page: pageIndex + 1, // API uses 1-indexed pages, but table uses 0-indexed
    limit: pageSize
  })

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    // Check if pageSize changed
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setPageIndex(0) // Reset to first page when changing page size
    } else {
      setPageIndex(newPageIndex)
    }
  }

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Seller List</h2>
            <p className='text-muted-foreground'>
              Manage your sellers here
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <SellersTable 
            data={seller} 
            columns={columns} 
            isLoading={loading}
            pagination={{
              pageIndex,
              pageSize,
              totalPages,
              total
            }}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}