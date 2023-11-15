import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import CourseCard from '@/components/CourseCard'

export default async function Home() {
  const { userId } = auth()
  const courses = await prisma.course.findMany({
    where: { status: 'published' },
    include: { chapters: true, purchases: true },
  })
  const purchases = await prisma.purchase.findMany({
    where: { userId: userId! },
  })

  return (
    <div className='container flex flex-wrap gap-8 justify-even align-center mt-8 '>
      {courses.map(course => (
        <CourseCard purchases={purchases} course={course} />
      ))}
    </div>
  )
}
