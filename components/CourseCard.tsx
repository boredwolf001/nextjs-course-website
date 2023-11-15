'use client'

import { useState } from 'react'
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
import { Button, buttonVariants } from './ui/button'
import { Chapter, Course as PrismaCourse, Purchase } from '@prisma/client'
import { ShoppingCartIcon, Tv2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

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
  const [isEnrolling, setIsEnrolling] = useState(false)

  function checkIfUserIsEnrolled() {
    const purchase = purchases.filter(purchase =>
      purchase.courseId === course.id ? true : false
    )
    if (purchase.length === 0) return false
    else return true
  }

  async function enrollUser() {
    const purchase = await axios.post('/api/enroll', {
      courseId: course.id,
    })
    if (purchase.status !== 200) {
      toast.error('Error occured while enrolling the course')
    } else {
      toast.success('You can now access the full course')
    }
  }

  return (
    <Card className='w-[400px] ' key={course.id}>
      <CardHeader>
        <AspectRatio ratio={16 / 9}>
          <Link href={`/course/${course.id}`}>
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
      </CardHeader>

      <CardFooter className='flex gap-2 justify-between '>
        <p className='text-lg block'>{course.purchasePrice}</p>

        {!checkIfUserIsEnrolled() && (
          <Button
            className='uppercase'
            variant='secondary'
            disabled={isEnrolling}
            onClick={() => {
              setIsEnrolling(true)
              enrollUser()
              setIsEnrolling(false)
            }}>
            <ShoppingCartIcon className='mr-2' />
            {isEnrolling ? 'Enrolling' : 'Enroll'}
          </Button>
        )}
        {checkIfUserIsEnrolled() && (
          <Link
            href={`/course/${course.id}/chapter/${course.chapters[0].id}`}
            className={`uppercase ${buttonVariants({ variant: 'default' })}`}>
            <Tv2 className='mr-2' />
            Watch course
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
