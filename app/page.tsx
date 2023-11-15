import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import CourseCard from '@/components/CourseCard'
import CoursesPageSideBar from '@/components/CoursesPageSideBar'

export default async function Home() {
  const { userId } = auth()
  const courses = await prisma.course.findMany({
    where: { status: 'published' },
    include: {
      chapters: {
        orderBy: {
          chapterPosition: 'asc',
        },
        include: {
          chapterCompletes: { where: { userId: userId! } },
        },
      },
      purchases: true,
    },
  })
  const purchases = await prisma.purchase.findMany({
    where: { userId: userId! },
  })

  return (
    <main className='flex'>
      <CoursesPageSideBar />
      <div className='container flex flex-wrap gap-8 justify-even align-center mt-8 '>
        {courses.map(course => (
          <CourseCard purchases={purchases} course={course} />
        ))}
      </div>
    </main>
  )
}
