import TeacherPageSideBar from '@/components/TeacherPageSideBar'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex'>
      <TeacherPageSideBar />
      {children}
    </main>
  )
}
