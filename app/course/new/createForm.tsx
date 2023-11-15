'use client'

import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useState, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { revalidatePath } from 'next/cache'

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(300),
  price: z.string(),
  image: z.any(),
  chapterName: z.string().optional(),
  chapterVideo: z.any().optional(),
  chapterAccess: z.boolean().optional(),
})

type Chapter = {
  chapterName: string
  chapterVideo: any
  chapterPosition: any
  access: any
}

export async function handleUploadChapterVideo({
  form,
  setChapterVideoUploading,
  setChapters,
}: {
  form: any
  setChapterVideoUploading: any
  setChapters: any
}) {
  setChapterVideoUploading(true)
  let { chapterName, chapterVideo, chapterAccess } = form.getValues()
  const chapterVideoFormData = new FormData()
  chapterVideoFormData.append('file', chapterVideo)
  chapterVideoFormData.append('upload_preset', 'coursex_uploads')
  const { data: chapterVideoData } = await axios.post(
    'https://api.cloudinary.com/v1_1/manethye/video/upload',
    chapterVideoFormData
  )
  setChapterVideoUploading(false)
  if (!chapterVideoData)
    return toast.error('Something went wrong while uploading the video')

  setChapters((prev: Chapter[]) => [
    {
      chapterName: chapterName!,
      chapterVideo: chapterVideoData.secure_url!,
      access: chapterAccess,
      chapterPosition: prev.length + 1,
    },
    ...prev,
  ])

  toast.success(`Chapter ${chapterName} created successfully.`)
  form.setValue('chapterName', '')
  form.setValue('chapterVideo', null)
  form.setValue('chapterAccess', false)
}

export default function CreateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [loading, setLoading] = useState(false)
  const [chapterVideoUploadLoading, setChapterVideoUploading] = useState(false)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const router = useRouter()

  async function createCourse({
    name,
    description,
    price,
    image,
  }: z.infer<typeof formSchema>) {
    setLoading(true)

    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', image)
    cloudinaryFormData.append('upload_preset', 'coursex_uploads')
    const { data: imageData } = await axios.post(
      'https://api.cloudinary.com/v1_1/manethye/image/upload',
      cloudinaryFormData
    )

    const newCourse = await axios.post('/api/course/new', {
      name: name,
      description: description,
      price: price,
      secure_url: imageData.secure_url,
      chapters: chapters,
    })
    setLoading(false)
    form.reset()
    if (newCourse.status === 200) {
      // Success
      toast.success('Course created successfully!')
      router.push('/teacher')
    } else {
      toast.error('Something went wrong!')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createCourse)}>
        <div className='flex gap-10 items-start justify-even py-4'>
          <div className='col-1 grid gap-2'>
            <h1 className='text-2xl font-bold mt-4'>Basic Details</h1>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Course name' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your course name. Choose a good and suitable name
                    for your course!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Here goes your course description'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your course description. Write a good paragraph
                    about your course what chapters are included and so on.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Price goes here'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Decide a affordable price for your course! Don't put any
                    currency symbol here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e: any) => {
                        field.onChange(e?.target.files[0]!)
                      }}
                      id='image'
                      type='file'
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a attractice cover image for your course!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-2 grid gap-4'>
            <h1 className='text-2xl font-bold mt-4'>Course Chapters</h1>
            <FormField
              control={form.control}
              name='chapterName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter name</FormLabel>
                  <FormControl>
                    <Input placeholder='Chapter name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='chapterVideo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      onChange={(e: any) => field.onChange(e.target.files[0])}
                      ref={field.ref}
                      name={field.name}
                      onBlur={field.onBlur}
                      id='chapter-video'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='chapterAccess'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='mr-2'>
                    Access without purchase
                  </FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onClick={() =>
                handleUploadChapterVideo({
                  form,
                  setChapters,
                  setChapterVideoUploading,
                })
              }
              disabled={chapterVideoUploadLoading}
              variant='secondary'>
              {chapterVideoUploadLoading && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Save chapter and create new one
            </Button>

            {/* chapter list */}
            <div className='mt-4'>
              <ul>
                {chapters.map(chapter => (
                  <li
                    className='bg-muted p-4 shadow-md my-2 rounded-md border border-slate-200'
                    key={chapter.chapterPosition}>
                    {chapter.chapterName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <Button
          className='mb-8'
          disabled={loading}
          type='submit'
          variant='default'>
          {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Create course
        </Button>
      </form>
    </Form>
  )
}
