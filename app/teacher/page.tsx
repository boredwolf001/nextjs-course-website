import { auth } from '@clerk/nextjs'
import { CourseTable } from './TeacherCourseTable'
import { Course } from '@prisma/client'
import prisma from '@/db'

export default async function TeacherPage() {
  const { userId }: { userId: string | null } = auth()
  const courses: Course[] = await prisma.course.findMany({
    where: { author: userId! },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className='container'>
      <CourseTable data={courses} />
    </div>
  )
}
