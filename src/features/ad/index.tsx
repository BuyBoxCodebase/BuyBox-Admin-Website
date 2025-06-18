import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksPrimaryButtons } from './components/ad-primary-buttons'
import TasksProvider from './context/ad-context'
import useGetAllAds from '@/hooks/ad/useGetAllAds'
import AdsDisplay from './components/ad-display'

export default function Ad() {
  const {ads, loading} = useGetAllAds()
  
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Ads</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your ads
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <AdsDisplay ads={ads} loading={loading} />
        </div>
      </Main>
    </TasksProvider>
  )
}