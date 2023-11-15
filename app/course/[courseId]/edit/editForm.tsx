import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Course } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

export default function Form({ course }: { course: Course }) {
  return (
    <div>
      <Label htmlFor='name' className='mb-2 block'>
        Name
      </Label>
      <Input
        onChange={handleOnChange}
        name='name'
        className='mb-4'
        id='name'
        placeholder='Edit course name'
        defaultValue={course?.name}
      />
      <Label htmlFor='description' className='mb-2 block'>
        Description
      </Label>
      <Input
        onChange={handleOnChange}
        name='description'
        id='description'
        className='mb-4'
        placeholder='Edit description'
        defaultValue={course?.description}
      />

      <Label htmlFor='description' className='mb-2 block'>
        Image
      </Label>
      <AspectRatio ratio={16 / 9}>
        <Image
          alt={course.id}
          fill
          className='shadow-md rounded-md object-cover'
          src={course.coverImgUrl}
        />
      </AspectRatio>
      <Input type='file' name='image' id='image' className='mb-4' />
    </div>
  )
}
