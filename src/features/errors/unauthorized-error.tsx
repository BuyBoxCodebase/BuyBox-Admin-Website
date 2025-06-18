import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {  useEffect } from 'react'

export default function UnauthorisedError() {
  const navigate = useNavigate()
 // const { history } = useRouter()
 useEffect(() => {
localStorage.removeItem('isVerified')
 }, [navigate])
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>401</h1>
        <span className='font-medium'>Unauthorized Access</span>
        <p className='text-center text-muted-foreground'>
          Please wait for the super admin to verify your account. <br />
          If you are the super admin, please contact support for assistance.
          <br />
          <span className='text-sm text-muted-foreground'>
            If you are not the super admin, please contact the super admin for assistance.
          </span>
        </p>
        <div className='mt-6 flex gap-4'>
          {/* <Button variant='outline' onClick={() => history.go(-1)}>
            Go Back
          </Button> */}
          <Button onClick={() => navigate({ to: '/sign-in' })}>Back to sign in</Button>
        </div>
      </div>
    </div>
  )
}
