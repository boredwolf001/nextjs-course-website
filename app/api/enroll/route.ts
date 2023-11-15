import prisma from '@/db'
import { auth } from '@clerk/nextjs'

export async function POST(req: Request) {
  const { courseId } = await req.json()
  if (!courseId)
    return Response.json({ message: 'Course id is required' }, { status: 400 })
  const { userId } = auth()
  const purchases = await prisma.purchase.findMany({
    where: { userId: userId! },
  })
  const purchase = purchases.filter(purchase =>
    purchase.courseId === courseId ? true : false
  )
  if (purchase.length !== 0)
    return Response.json(
      { message: 'Already enrolled this course' },
      { status: 400 }
    )

  await prisma.purchase.create({ data: { courseId, userId: userId! } })

  return Response.json({ message: 'Successfully enrolled' }, { status: 201 })
}
