import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import MyCourseCard from '@/components/MyCourseCard'
import { Purchase as PrismaPurchase } from '@prisma/client'
import { CourseWithChapters } from '../course/edit/[courseId]/editForm'
import CoursesPageSideBar from '@/components/CoursesPageSideBar'

interface Purchase extends PrismaPurchase {
  course: CourseWithChapters
}

export default async function Home() {
  const { userId } = auth()
  const purchases: Purchase[] = await prisma.purchase.findMany({
    where: { userId: userId! },
    include: {
      course: {
        include: {
          chapters: {
            include: { chapterCompletes: true },
          },
        },
      },
    },
  })

  return (
    <main className='flex'>
      <CoursesPageSideBar />
      <div className='container flex flex-wrap gap-8 justify-even align-center mt-8 '>
        {purchases.length === 0 && (
          <h1 className='text-2xl font-bold'>
            Bruh! Purchase some courses man.
          </h1>
        )}
        {purchases.length !== 0 &&
          purchases.map(purchase => (
            <MyCourseCard
              key={purchase.id}
              purchases={purchases}
              course={purchase.course}
            />
          ))}
      </div>
    </main>
  )
}
