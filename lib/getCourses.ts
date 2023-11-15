import prisma from '@/db'
import { cache } from 'react'

export const revalidate = 1 // revalidate the data at most every hour

export const getCourses = cache(async (userId: string) => {
  const courses = await prisma.course.findMany({ where: { author: userId } })
  return courses
})
