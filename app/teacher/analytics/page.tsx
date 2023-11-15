import React from 'react'
import { auth } from '@clerk/nextjs'
import prisma from '@/db'
import { Course } from '@prisma/client'
import { Overview } from './BarChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Analytics() {
  const { userId }: { userId: string | null } = auth()
  const courses: Course[] = await prisma.course.findMany({
    where: { author: userId! },
    orderBy: { createdAt: 'desc' },
    include: {
      purchases: true,
    },
  })

  function getTotalRevenue() {
    let revenue = 0
    courses.forEach(course => {
      revenue =
        revenue +
        +course.purchasePrice.replace('$', '') * +course.purchases.length
    })
    return revenue
  }

  const data = courses.map(course => {
    return {
      name: course.name,
      total: +course.purchasePrice.replace('$', '') * +course.purchases.length,
    }
  })
  console.log(data)

  return (
    <div className='container'>
      <Card className='mt-6'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            className='h-4 w-4 text-muted-foreground'>
            <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
          </svg>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>${getTotalRevenue()}</div>
          <p className='text-xs text-muted-foreground'>
            +20.1% from last month
          </p>
        </CardContent>
      </Card>
      <Overview data={data} />
    </div>
  )
}
