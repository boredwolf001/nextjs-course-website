'use client'
import Link from 'next/link'
import { FolderSearch, Globe, MonitorDot } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function CoursesPageSideBar() {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <div className='h-screen top-0 left-0 sticky w-[350px] p-2 bg-muted bg-opacity-0 shadow-md rounded-md'>
      <div className='flex-col gap-x-2'>
        <Link href='/my-courses'>
          <h2
            className={`px-2 py-4 text-center rounded-md hover:bg-slate-200 ml-2 text-lg font-semibold my-4 flex items-center- justify-center transition-all duration-150 ease-in-out gap-2 ${
              pathname === '/my-courses' && 'bg-slate-200 cursor-not-allowed'
            }`}>
            My Courses <MonitorDot className='mr-2' />
          </h2>
        </Link>
        <Link href='/'>
          <h2
            className={`px-2 py-4 text-center rounded-md hover:bg-slate-200 ml-2 text-lg font-semibold my-4 flex items-center- justify-center transition-all duration-150 ease-in-out gap-2 ${
              pathname === '/' && 'bg-slate-200 cursor-not-allowed'
            }`}>
            Browse <Globe className='mr-2' />
          </h2>
        </Link>
      </div>
    </div>
  )
}
