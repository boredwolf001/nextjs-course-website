import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

export async function DELETE(req: Request, route: { params: { id: string } }) {
  const { userId } = auth()
  const id = route.params.id

  const course = await prisma.course.findFirst({ where: { id } })
  if (course?.author !== userId)
    return Response.json('Not authenticated to delete this course', {
      status: 401,
    })

  await prisma.course.delete({ where: { id } })
  revalidatePath('/teacher')
  return Response.json({ status: 201 })
}

export async function PATCH(req: Request, route: { params: { id: string } }) {
  const { userId } = auth()
  const id = route.params.id
  const reqBody = await req.json()
  if (!reqBody)
    return Response.json('Fields are empty', {
      status: 400,
    })

  const course = await prisma.course.findFirst({ where: { id } })
  if (course?.author !== userId)
    return Response.json('Not authenticated to edit this course', {
      status: 401,
    })

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  if (reqBody.purchasePrice) {
    reqBody.purchasePrice = USDollar.format(+reqBody.purchasePrice)
  }

  const updatedCourse = await prisma.course.update({
    where: { id: id! },
    data: {
      ...reqBody,
    },
  })
  return Response.json(updatedCourse)
}
