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

  if (loading) {
    return (
      <section className="doc" aria-busy="true" aria-label={title}>
        <p className="loading">Зареждане…</p>
      </section>
    )
  }

  return (
    <section
      className="doc"
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
