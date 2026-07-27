'use client'

import { useMemo } from 'react'
import { marked } from './markdownRenderer'

interface DocumentViewerProps {
  content: string
  loading: boolean
  title: string
}

export function DocumentViewer({
  content,
  loading,
  title,
}: DocumentViewerProps) {
  const html = useMemo(() => {
    if (!content) return ''
    return marked(content)
  }, [content])

  return (
    <section className="doc on">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {loading && <p>Зареждане...</p>}
    </section>
  )
}
