import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

export default async function CourseEditPage({
  params,
}: {
  params: { id: string }
}) {
  const { userId } = auth()

  const course = await prisma.course.findFirst({ where: { id: params.id } })
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

  return <div className='mt-10 container'>Hello Edit</div>
}
