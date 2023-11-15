import VideoPlayer from '@/components/VideoPlayer'
import { buttonVariants } from '@/components/ui/button'
import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import { Lock, UnlockIcon } from 'lucide-react'
import Link from 'next/link'

export default async function CoursePage({
  params: { chapterId, courseId },
}: {
  params: { courseId: string; chapterId: string }
}) {
  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId },
  })
  const course = await prisma.course.findFirst({
    where: { id: courseId },
    include: { chapter: true, customers: true },
  })
  const { userId } = auth()
  const customer = course?.customers.filter(
    customer => customer.userId === userId
  )
  if (!chapter)
    return (
      <div className='container mt-8'>
        <h1 className='text-2xl font-bold'>Chapter not available</h1>
      </div>
    )

  return (
    <main className='flex flex-row'>
      <div className='h-screen top-0 left-0 sticky w-[250px] bg-muted bg-opacity-0 shadow-md rounded-r-md flex gap-4'>
        {course?.chapter.map(mapChapter => (
          <Link
            href={`/course/${mapChapter.courseId}/chapter/${mapChapter.id}`}
            className={`${buttonVariants({
              variant: 'ghost',
            })} my-4 ml-2 text-muted-foreground`}
            key={mapChapter.id}>
            {mapChapter?.title}{' '}
            {!mapChapter?.accessWithoutPurchase ? (
              <Lock className='ml-2 text-sm w-5' />
            ) : (
              <UnlockIcon className='ml-2 text-sm w-5' />
            )}
          </Link>
        ))}
      </div>
      {customer!.length === 0 ? (
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
