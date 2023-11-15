import prisma from '@/db'

export async function GET() {
  const courses = await prisma.course.findMany()
  return Response.json(courses)
}
