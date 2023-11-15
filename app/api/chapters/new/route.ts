import prisma from '@/db'

export async function POST(req: Request) {
  const body = await req.json()
  if (
    !body.title ||
    !body.videoUrl ||
    !body.courseId ||
    !body.chapterPosition
  ) {
    return Response.json({ message: 'Fields cannot be empty' }, { status: 400 })
  }

  const newChapter = await prisma.chapter.create({
    data: {
      title: body.title,
      accessWithoutPurchase: body.accessWithoutPurchase || false,
      courseId: body.courseId,
      videoUrl: body.videoUrl,
      chapterPosition: body.chapterPosition,
    },
  })

  return Response.json(newChapter, { status: 201 })
}
