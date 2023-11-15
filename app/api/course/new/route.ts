import prisma from '@/db'
import { auth } from '@clerk/nextjs'
import { create } from 'domain'

export async function POST(request: Request) {
  const { name, description, price, secure_url, chapters } =
    await request.json()
  const { userId } = auth()

  if (
    name?.toString().length === 0 ||
    description?.toString().length === 0 ||
    price.toString().length === 0
  ) {
    return Response.json({ error: 'Missing fields' })
  }

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const newCourse = await prisma.course.create({
    data: {
      name,
      description,
      purchasePrice: USDollar.format(price).toString(),
      coverImgUrl: secure_url,
      author: userId!,
      status: 'draft',
      chapters: {
        create: chapters.map(
          (chapter: {
            chapterName: string
            chapterVideo: string
            access: boolean
            chapterPosition: number
          }) => {
            return {
              title: chapter.chapterName,
              videoUrl: chapter.chapterVideo,
              accessWithoutPurchase: chapter.access,
              chapterPosition: chapter.chapterPosition,
            }
          }
        ),
      },
    },
  })
  return Response.json(newCourse)
}
