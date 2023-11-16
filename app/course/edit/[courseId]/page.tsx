import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import EditForm from './editForm'

export default async function CourseEditPage({
  params,
}: {
  params: { courseId: string }
}) {
  const { userId } = auth()

  const course = await prisma.course.findFirst({
    where: { id: params.courseId },
    include: {
      chapters: {
        orderBy: {
          chapterPosition: 'asc',
        },
        include: {
          chapterCompletes: true,
        },
      },
    },
  })

  if (course?.author !== userId)
    return (
      <div className='container'>
        <h1 className='text-2xl font-bold'>
          Not authenticated to edit this course
        </h1>
      </div>
    )
  if (!course)
    return (
      <div className='container'>
        <h1 className='text-2xl font-bold'>No course with this ID</h1>
      </div>
    )

  return (
    <div className='mt-10 container'>
      <EditForm course={course} />
    </div>
  )
}
