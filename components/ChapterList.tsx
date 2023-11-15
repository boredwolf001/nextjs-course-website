'use client'

import { Chapter } from '@prisma/client'
import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Grid, Hand, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ChapterList({
  chapters,
  setChapters,
}: {
  chapters: Chapter[]
  setChapters: any
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const startIndex = result.source.index
    const endIndex = result.destination.index
    const copyChapters = [...chapters]
    const [reorderChapter] = copyChapters.splice(startIndex, 1)
    copyChapters.splice(endIndex, 0, reorderChapter)
    setChapters(copyChapters)
  }

  async function reorderChapters() {
    setIsReordering(true)
    Promise.all(
      chapters.map(async (chapter, index) => {
        try {
          const res = await axios.patch(`/api/chapters/${chapter.id}`, {
            chapterPosition: index + 1,
          })

          if (res.status !== 200) return toast.error('Something went wrong')
        } catch (error) {
          toast.error('Something went wrong')
        }
        const res = await axios.patch(`/api/chapters/${chapter.id}`, {
          chapterPosition: index + 1,
        })
      })
    ).then(r => {
      toast.success('Reordered successfully')
      setIsReordering(false)
    })
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='chapters'>
          {droppableProvider => (
            <ul
              ref={droppableProvider.innerRef}
              {...droppableProvider.droppableProps}>
              {chapters.map((chapter, index) => (
                <Draggable
                  index={index}
                  key={chapter.id}
                  draggableId={`${chapter.id}`}>
                  {draggableProvider => (
                    <li
                      className='flex gap-2 items-center border-solid border my-2  rounded-md border-l-slate-300 border-l-2'
                      ref={draggableProvider.innerRef}
                      {...draggableProvider.draggableProps}>
                      <div
                        {...draggableProvider.dragHandleProps}
                        className='mr-2 outline-none hover:bg-slate-200 p-2 text-lg rounded-md transition-all duration-150'>
                        <Grid />
                      </div>

                      {chapter.title}
                    </li>
                  )}
                </Draggable>
              ))}
              {droppableProvider.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        disabled={isReordering}
        onClick={reorderChapters}
        variant={'outline'}
        className='mt-2'>
        {isReordering && <Loader2 className='animate-spin mr-2' />}
        {isReordering ? 'Reordering' : 'Reorder chapters'}
      </Button>
    </>
  )
}
