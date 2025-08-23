import { useState } from 'react'
import type { Chapter } from '@/types/chapter'

export function usePreview() {
  const [previewChapter, setPreviewChapter] = useState<Chapter | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const openPreview = (chapter: Chapter) => {
    setPreviewChapter(chapter)
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setPreviewChapter(null)
  }

  return {
    previewChapter,
    isPreviewOpen,
    openPreview,
    closePreview
  }
}
