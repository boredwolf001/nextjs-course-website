import { CourseWithChapters } from '@/app/course/edit/[courseId]/editForm'
import Link from 'next/link'
import React from 'react'
import { buttonVariants } from './ui/button'
import { CheckCheckIcon, CheckCircle2, Lock, UnlockIcon } from 'lucide-react'
import { Purchase } from '@prisma/client'

export default function ChapterViewSideBar({
  course,
  chapterId,
  purchase,
}: {
  course: CourseWithChapters
  chapterId: string
  purchase: Purchase
}) {
  return (
    <div className='h-screen top-0 left-0 sticky w-[300px] p-2 bg-muted bg-opacity-0 shadow-md rounded-md'>
      <h2 className='my-4 text-xl text-center font-bold'>Chapters</h2>
      <div className='flex-col gap-x-2'>
        {course?.chapters.map(mapChapter => (
          <Link
            href={`/course/${mapChapter.courseId}/chapter/${mapChapter.id}`}
            className={`${buttonVariants({
              variant: 'ghost',
            })} ${
              chapterId === mapChapter.id &&
              'text-black bg-slate-200 cursor-not-allowed hover:bg-slate-200 hover:text-black'
            } text-muted-foreground flex justify-between w-full p-4`}
            key={mapChapter.id}>
            <span className='text-md'>{mapChapter?.title}</span>
            {mapChapter.chapterCompletes.length === 0 &&
              (!mapChapter?.accessWithoutPurchase && !purchase ? (
                <Lock className='ml-2 w-5' />
              ) : (
                <UnlockIcon className='ml-2 w-5' />
              ))}
            {mapChapter.chapterCompletes.length !== 0 && (
              <CheckCircle2 className='ml-2 w-5' />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
