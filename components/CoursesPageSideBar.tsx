'use client'
import Link from 'next/link'
import { Globe, MonitorDot } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function CoursesPageSideBar() {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className='p-0 h-screen top-0 left-0 sticky md:w-[300px]  lg:w-[350px] bg-muted '>
      <div className='m-0 p-0 flex-col'>
        <SidebarLink activePath={pathname} pathname='/'>
          Browse <Globe className='mr-2' />
        </SidebarLink>
        <SidebarLink activePath={pathname} pathname='/my-courses'>
          My Courses <MonitorDot className='mr-2' />
        </SidebarLink>
      </div>
    </div>
  )
}

export function SidebarLink({
  children,
  activePath,
  pathname,
}: {
  children: ReactNode
  pathname: string
  activePath: string
}) {
  return (
    <Link href={pathname}>
      <h2
        className={`container py-6 flex items-center transition-all duration-150 ease-in-out gap-2 hover:bg-slate-100 my-4 ${
          activePath === pathname &&
          'bg-slate-100 border-r-4 border-r-accent-foreground'
        }`}>
        {children}
      </h2>
    </Link>
  )
}
