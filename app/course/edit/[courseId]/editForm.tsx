'use client'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Chapter, Course as PrismaCourse } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Image from 'next/image'
import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { CircleDollarSign, EditIcon, ImageIcon } from 'lucide-react'
import EditFormField from '@/components/EditFormField'
import EditFormChapterSection from '@/components/EditFormChapterSection'

export interface CourseWithChapters extends PrismaCourse {
  chapters: Chapter[]
}

export const editFormSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().min(10).max(300).optional(),
  purchasePrice: z.string().optional(),
  image: z.any().optional(),
  chapterName: z.string().optional(),
  chapterVideo: z.any().optional(),
  chapterAccess: z.boolean().optional(),
})

export default function EditForm({ course }: { course: CourseWithChapters }) {
  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: course.name,
      description: course.description,
      purchasePrice: course.purchasePrice.replace('$', ''),
      chapterAccess: false,
    },
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [image, setImage] = useState<string>(() => course.coverImgUrl)

  async function uploadImage(image: any) {
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', image)
    cloudinaryFormData.append('upload_preset', 'coursex_uploads')
    const { data: imageData } = await axios.post(
      'https://api.cloudinary.com/v1_1/manethye/image/upload',
      cloudinaryFormData
    )

    return imageData
  }

  async function editField(editingField: any, value: string) {
    let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })

    // if editingField is purchasePrice check whether if it is the same as the database field
    if (editingField === 'purchasePrice') {
      if (USDollar.format(+value) === course['purchasePrice']) {
        setIsUpdating(false)
        return toast.error('Nothing to be edited')
      }
    }

    // if value is the same as a database field
    // @eslint-disable-next-line
    if (value == course[editingField]) {
      setIsUpdating(false)
      return toast.error('Nothing to be edited')
    }

    // check whether the editing field is coverImgUrl
    if (editingField === 'coverImgUrl') {
      setIsUpdating(true)
      if (!value) {
        setIsUpdating(false)
        return toast.error('Please upload an valid image')
      }
      const imageData = await uploadImage(value)

      const res = await axios.patch(`/api/course/${course.id}`, {
        [editingField]: imageData.secure_url,
      })

      setIsUpdating(false)
      if (res.status === 200)
        return toast.success(`Cover image edited successfully`)
      return toast.error('Something went wrong while updating the image')
    }

    const res = await axios.patch(`/api/course/${course.id}`, {
      [editingField]: value,
    })
    if (res.status === 200) toast.success(`${editingField} edited successfully`)
  }

  return (
    <Form {...form}>
      <div className='inline-grid auto-rows-auto auto-cols-auto grid-cols-2 grid-rows-1 gap-x-8 gap-y-2'>
        <div className='col-start-1 col-end-2 row-start-1 row-end-3'>
          <h1 className='text-3xl text-cyan-600 font-bold my-4 flex items-center'>
            <EditIcon className='mr-2 ' /> Customize
          </h1>
          {/* Name form */}
          <EditFormField
            form={form}
            editField={editField}
            fieldDescription='You can edit your course name here. Choose a good name for
                    your course.'
            fieldDisplayName='Course name'
            fieldName='name'
          />
          {/* description form */}
          <EditFormField
            form={form}
            editField={editField}
            fieldDescription='Description must have some basic introduction for your
                    course and what it includes.'
            fieldDisplayName='Course description'
            fieldName='description'
          />
        </div>

        <div className='col-start-1 col-end-2 row-start-3 row-end-4 '>
          <h1 className='text-3xl text-cyan-600 font-bold my-4 flex items-center'>
            <ImageIcon className='mr-2' />
            Better look
          </h1>
          {/* image form */}

          <form
            onSubmit={form.handleSubmit((values: any) =>
              editField('coverImgUrl', values.image)
            )}
            className='bg-muted w-full my-4 p-4 rounded-md shadow-sm'>
            <h1 className='text-md font-semibold my-2'>Cover Image</h1>
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='file'
                      onChange={(e: any) => {
                        const image = e?.target?.files[0]
                        setImage(URL.createObjectURL(image))
                        field.onChange(image)
                      }}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  {image && (
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        alt={course.id}
                        fill
                        className='shadow-md rounded-md object-cover'
                        src={image}
                      />
                    </AspectRatio>
                  )}
                  <FormDescription>
                    Upload an attractive cover image to your course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isUpdating}
              type='submit'
              variant='outline'
              className='mt-4'>
              {isUpdating ? 'Updating image' : 'Update image'}
            </Button>
          </form>
        </div>

        <div className='col-starts-2 col-ends-3 row-start-2 row-end-3'>
          <h1 className='text-3xl text-cyan-600 font-bold my-4 flex items-center'>
            <CircleDollarSign className='mr-2 ' /> Sell your course
          </h1>
          {/* price form */}
          <EditFormField
            form={form}
            editField={editField}
            fieldDescription="Choose a affordable price for your course. Don't put any
                    currency symbol here."
            fieldDisplayName='Price'
            fieldName='purchasePrice'
          />
        </div>

        <EditFormChapterSection course={course} form={form} />
      </div>
    </Form>
  )
}
