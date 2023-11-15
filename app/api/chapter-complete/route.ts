import prisma from '@/db'
import { auth } from '@clerk/nextjs'

export async function POST(req: Request) {
  const body = await req.json()
  const { userId } = auth()

  if (!body.chapterId || body.chapterId.length === 0) {
    return Response.json({ message: 'ChapterId is required' }, { status: 400 })
  }
  try {
    const newCompletedChapter = await prisma.chapterComplete.create({
      data: { userId: userId!, chapterId: body.chapterId },
    })
    return Response.json(newCompletedChapter)
  } catch (e) {
    console.log(e)
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
