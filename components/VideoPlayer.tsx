'use client'

import { Chapter } from '@prisma/client'
import React from 'react'
import { ControlBar, Player } from 'video-react'
import 'video-react/dist/video-react.css'

export default function VideoPlayer({ chapter }: { chapter: Chapter }) {
  return (
    <div key={chapter.id} className='my-2'>
      <h1 className='text-2xl font-bold mb-4'>{chapter.title}</h1>
      <Player src={chapter.videoUrl}>
        <ControlBar />
      </Player>
    </div>
  )
}
