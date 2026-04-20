'use client'

import { useEffect } from 'react'
import { EditorLayout } from '@/components/editor/editor-layout'

export default function EditorPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return <EditorLayout />
}
