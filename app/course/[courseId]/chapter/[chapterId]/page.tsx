import VideoPlayer from '@/components/VideoPlayer'
import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import ChapterViewSideBar from '@/components/ChapterViewSideBar'

export default async function CoursePage({
  params: { chapterId, courseId },
}: {
  params: { courseId: string; chapterId: string }
}) {
  const { userId } = auth()
  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId },
    include: {
      chapterCompletes: {
        where: { userId: userId! },
      },
    },
  })

  const course = await prisma.course.findFirst({
    where: { id: courseId },
    include: {
      chapters: {
        include: {
          chapterCompletes: {
            where: { userId: userId! },
          },
        },
        orderBy: {
          chapterPosition: 'asc',
        },
      },
      purchases: {
        where: { userId: userId! },
      },
    },
  })

  const purchase = course?.purchases[0]
  if (!chapter)
    return (
      <div className='container mt-8'>
        <h1 className='text-2xl font-bold'>Chapter not available</h1>
      </div>
    )

  return (
    <main className='flex flex-row'>
      <ChapterViewSideBar
        purchase={purchase!}
        chapterId={chapterId}
        course={course!}
      />
      {!purchase && !chapter.accessWithoutPurchase ? (
        <div className='container mt-8'>
          <h1 className='text-2xl font-bold'>
            Please purchase this course to watch this chapter
          </h1>
        </div>
      ) : (
        <div className='container mt-8 flex flex-row w-full gap-2'>
          <div className='w-full'>
            <VideoPlayer chapter={chapter!} />
          </div>
        </div>
      )}
    </main>
  )
}
