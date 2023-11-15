import prisma from '@/db'
import { auth } from '@clerk/nextjs'

export async function POST(req: Request) {
  const { courseId } = await req.json()
  if (!courseId)
    return Response.json({ message: 'Course id is required' }, { status: 400 })
  const { userId } = auth()
  const purchase = await prisma.purchase.findFirst({
    where: { userId: userId!, courseId },
  })
  if (purchase)
    return Response.json(
      { message: 'Already enrolled this course' },
      { status: 400 }
    )

  await prisma.purchase.create({ data: { courseId, userId: userId! } })

  return Response.json({ message: 'Successfully enrolled' }, { status: 201 })
}
