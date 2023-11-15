import { Loader2, PlusCircle, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import ChapterList from './ChapterList'
import { Chapter } from '@prisma/client'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  CourseWithChapters,
  editFormSchema,
} from '@/app/course/edit/[courseId]/editForm'
import * as z from 'zod'

export default function EditFormChapterSection({
  course,
  form,
}: {
  course: CourseWithChapters
  form: any
}) {
  const [chapters, setChapters] = useState<Chapter[]>(course.chapters)
  const [chapterCreateFormActive, setChapterCreateFormActive] = useState(false)
  const [isCreatingChapter, setIsCreatingChapter] = useState(false)

  async function createChapter(values: z.infer<typeof editFormSchema>) {
    setIsCreatingChapter(true)
    const { chapterAccess, chapterName, chapterVideo } = values

    if (!chapterName) {
      setIsCreatingChapter(false)
      return form.setError('chapterName', {
        type: 'required',
        message: 'Title is required',
      })
    }
    if (!chapterVideo) {
      setIsCreatingChapter(false)
      return form.setError('chapterVideo', {
        type: 'required',
        message: 'Please upload a video',
      })
    }

    const chapterVideoFormData = new FormData()
    chapterVideoFormData.append('file', chapterVideo)
    chapterVideoFormData.append('upload_preset', 'coursex_uploads')
    let { data: chapterVideoData } = await axios.post(
      'https://api.cloudinary.com/v1_1/manethye/video/upload',
      chapterVideoFormData
    )
    if (!chapterVideoData) {
      setIsCreatingChapter(false)
      return toast.error('Something went wrong while uploading the video')
    }

    const chapterData = {
      title: chapterName,
      accessWithoutPurchase: chapterAccess || false,
      videoUrl: chapterVideoData.secure_url,
      courseId: course.id,
      chapterPosition: chapters.length + 1,
    }

    try {
      const res = await axios.post('/api/chapters/new', chapterData)
      setIsCreatingChapter(false)
      if (res.status !== 201) return toast.error('Something went wrong')
      setChapters(prev => {
        return [...prev, res.data]
      })
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='col-starts-2 col-ends-3 row-start-1 row-end-2'>
      <div className='flex gap-2 justify-between items-center'>
        <h1 className='text-3xl text-cyan-600 font-bold my-4 flex items-center'>
          <VideoIcon className='mr-2 ' /> Chapters
        </h1>

        <Button
          variant='ghost'
          onClick={() => setChapterCreateFormActive(prev => !prev)}>
          <PlusCircle />
        </Button>
      </div>

      {chapterCreateFormActive && (
        <form className='mb-4' onSubmit={form.handleSubmit(createChapter)}>
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
                <FormLabel>Chapter Video</FormLabel>
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
                <FormLabel className='mr-2'>Access without purchase</FormLabel>
                <FormControl>
                  <Checkbox
                    defaultChecked={false}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='mt-4'
            disabled={isCreatingChapter}
            variant='secondary'>
            {isCreatingChapter && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            {isCreatingChapter ? 'Creating' : 'Create chapter'}
          </Button>
        </form>
      )}
      <div className='chapters bg-muted p-4 rounded-md shadow-sm'>
        <ChapterList chapters={chapters} setChapters={setChapters} />
      </div>
    </div>
  )
}
