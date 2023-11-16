'use client'

import { Chapter as PrismaChapter, ChapterComplete } from '@prisma/client'
import { useState } from 'react'
import { ControlBar, Player } from 'video-react'
import 'video-react/dist/video-react.css'
import { Button } from './ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Chapter extends PrismaChapter {
  chapterCompletes: ChapterComplete[]
}

export default function VideoPlayer({ chapter }: { chapter: Chapter }) {
  const [isFinished, setIsFinished] = useState(() => {
    if (chapter.chapterCompletes.length === 0) return false
    else return true
  })

  async function makeChapterFinish(chapterId: string) {
    const res = await axios.post('/api/chapter-complete', {
      chapterId: chapter.id,
    })
    if (res.status !== 200) return toast.error('Something went wrong')
    else {
      setIsFinished(true)
    }
  }

  return (
    <div key={chapter.id} className='my-2'>
      <h1 className='text-3xl font-bold mb-4'>{chapter.title}</h1>
      <Player src={chapter.videoUrl}>
        <ControlBar />
      </Player>

      <Button
        onClick={() => makeChapterFinish(chapter.id)}
        className='my-4'
        variant='default'
        disabled={isFinished}>
        Mark as completed
      </Button>
    </div>
  )
}
