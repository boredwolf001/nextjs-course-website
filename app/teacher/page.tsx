import { auth } from '@clerk/nextjs'
import { CourseTable } from './table'
import { Course } from '@prisma/client'
import { getCourses } from '@/lib/getCourses'

export default async function TeacherPage() {
  const { userId }: { userId: string | null } = auth()
  const courses: Course[] = await getCourses(userId!)

  return (
    <div className='container'>
      <CourseTable data={courses} />
    </div>
  )
}
