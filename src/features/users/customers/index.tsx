import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/customers-columns'
import { UsersDialogs } from './components/customers-dialogs'
import { UsersPrimaryButtons } from './components/customers-primary-buttons'
import { CustomersTable } from './components/customers-table'
import UsersProvider from './context/customer-context'
import useGetAllCustomers from '@/hooks/users/useGetCustomers'

export default function Customers() {
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const { customers, loading, totalPages, total } = useGetAllCustomers({
    page: pageIndex + 1, 
    limit: pageSize
  })

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize)
      setPageIndex(0) 
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
            <h2 className='text-2xl font-bold tracking-tight'>Customers List</h2>
            <p className='text-muted-foreground'>
              Manage your customers here
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CustomersTable 
            data={customers} 
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