'use client'
import Link from 'next/link'
import { BarChart4, LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SidebarLink } from './CoursesPageSideBar'

export default function TeacherPageSideBar() {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className='p-0 h-screen top-0 left-0 sticky w-[300px] bg-muted'>
      <div className='m-0 p-0 flex-col'>
        <SidebarLink pathname='/teacher' activePath={pathname}>
          Dashboard <LayoutDashboard className='mr-2' />
        </SidebarLink>
        <SidebarLink pathname='/teacher/analytics' activePath={pathname}>
          Analytics <BarChart4 className='mr-2' />
        </SidebarLink>
      </div>
    </div>
  )
}
