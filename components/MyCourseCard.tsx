'use client'

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { AspectRatio } from './ui/aspect-ratio'
import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from './ui/button'
import { Chapter, Course as PrismaCourse, Purchase } from '@prisma/client'
import { Tv2 } from 'lucide-react'
import { Progress } from './ui/progress'

interface Course extends PrismaCourse {
  chapters: Chapter[]
}

export default function CourseCard({
  course,
  purchases,
}: {
  course: Course
  purchases: Purchase[]
}) {
  function getProgressValue() {
    let chapterCompleteCount = 0
    let chapterCount = 0
    course.chapters.forEach(chapter => {
      chapterCount++
      chapterCompleteCount =
        chapterCompleteCount + chapter.chapterCompletes.length
    })
    return (chapterCompleteCount / chapterCount) * 100
  }

  return (
    <Card className='w-[400px] ' key={course.id}>
      <CardHeader>
        <AspectRatio ratio={16 / 9}>
          <Link href={`/course/${course.id}/chapter/${course.chapters[0].id}`}>
            <Image
              alt={course.id}
              fill
              className='cursor-pointer shadow-md rounded-md object-cover'
              src={course.coverImgUrl}
            />
          </Link>
        </AspectRatio>
        <CardTitle className='pt-4 font-bold'>{course.name}</CardTitle>

        <CardDescription className='pt-2 truncate'>
          {course.description}
        </CardDescription>

        <Progress
          indColor='cyan-500'
          className='h-[10px]'
          value={getProgressValue()}
        />
      </CardHeader>

      <CardFooter className='flex gap-2 justify-between '>
        <p className='text-lg block'>{course.purchasePrice}</p>

        <Link
          href={`/course/${course.id}/chapter/${course.chapters[0].id}`}
          className={`uppercase ${buttonVariants({ variant: 'default' })}`}>
          <Tv2 className='mr-2' />
          Watch course
        </Link>
      </CardFooter>
    </Card>
  )
}
