import prisma from '@/db'
import { auth } from '@clerk/nextjs'

export async function PATCH(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  const data = await req.json()
  const { userId } = auth()

  const chapter = await prisma.chapter.findFirst({
    where: { id: params.chapterId },
    include: { course: true },
  })

  if (chapter?.course.author !== userId)
    return Response.json(
      { message: 'Not autherized to edit this chapter' },
      { status: 401 }
    )

  try {
    const updatedChapter = await prisma.chapter.update({
      where: { id: params.chapterId },
      data: {
        ...data,
      },
    })
    return Response.json(updatedChapter, { status: 200 })
  } catch (e) {
    return Response.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
