'use client'
import Link from 'next/link'
import { BarChart4, LayoutDashboard } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function TeacherPageSideBar() {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className='h-screen top-0 left-0 sticky w-[350px] p-2 bg-muted bg-opacity-0 shadow-md rounded-md'>
      <div className='flex-col gap-x-2'>
        <Link href='/teacher'>
          <h2
            className={`px-2 py-4 text-center rounded-md hover:bg-slate-200 ml-2 text-lg font-semibold my-4 flex items-center- justify-center transition-all duration-150 ease-in-out gap-2 ${
              pathname === '/teacher' && 'bg-slate-200 cursor-not-allowed'
            }`}>
            Dashboard <LayoutDashboard className='mr-2' />
          </h2>
        </Link>
        <Link href='/teacher/analytics'>
          <h2
            className={`px-2 py-4 text-center rounded-md hover:bg-slate-200 ml-2 text-lg font-semibold my-4 flex items-center- justify-center transition-all duration-150 ease-in-out gap-2 ${
              pathname === '/teacher/analytics' &&
              'bg-slate-200 cursor-not-allowed'
            }`}>
            Analytics <BarChart4 className='mr-2' />
          </h2>
        </Link>
      </div>
    </div>
  )
}
