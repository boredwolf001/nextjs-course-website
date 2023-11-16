'use client'

import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className='container flex justify-between items-center bg-accent py-4'>
      <Link href='/'>
        <h1 className='scroll-m-20 text-2xl text-primary font-black tracking-tight lg:text-3xl'>
          CourseX
        </h1>
      </Link>

      <div className='flex flex-row gap-4 justify-center items-center'>
        {pathname === '/teacher' && (
          <Link
            href='/course/new'
            className={buttonVariants({ variant: 'default' })}>
            Create Course <PlusCircleIcon className='ml-2' />
          </Link>
        )}
        <Link
          href={pathname === '/teacher' ? '/' : '/teacher'}
          className={`${buttonVariants({
            variant: 'ghost',
          })} font-medium text-muted-foreground cursor-pointer`}>
          {pathname === '/teacher' ? 'Student Mode' : 'Teacher Mode'}
        </Link>
        <UserButton afterSignOutUrl='/sign-in' />
      </div>
    </nav>
  )
}
