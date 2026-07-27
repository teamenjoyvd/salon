'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { DocumentViewer } from '@/components/DocumentViewer'

interface Document {
  id: string
  name: string
  title: string
  description: string
  order: number
}

const documents: Document[] = [
  {
    id: 'master',
    name: 'master-registar-produkti-protokoli',
    title: 'Мастер-регистър',
    description:
      'Продукти, 7 протокола, 4 допълнения, сделката 50/50 — източник на истина',
    order: 1,
  },
  {
    id: 'predlozhenie',
    name: 'predlozhenie-salon',
    title: 'Предложение към салона',
    description: 'ЗА СОБСТВЕНИКА — партньорство 50/50, дял на час стая',
    order: 2,
  },
  {
    id: 'cenorazpis',
    name: 'cenorazpis',
    title: 'Ценоразпис',
    description: 'ЗА КЛИЕНТА — 7 процедури и 4 допълнения, без икономика',
    order: 3,
  },
  {
    id: 'cheklist',
    name: 'startov-cheklist',
    title: 'Стартов чеклист',
    description: 'Какво трябва да е готово преди първи клиент',
    order: 4,
  },
  {
    id: 'risk',
    name: 'risk-registar-artistry',
    title: 'Риск-регистър',
    description: '10 риска в 3 нива, с ранни сигнали',
    order: 5,
  },
  {
    id: 'protokoli',
    name: 'protokoli-artistry',
    title: 'Кабинетни протоколи',
    description: 'Стъпките на процедурите, с разход и печалба',
    order: 6,
  },
  {
    id: 'finansi',
    name: 'finansov-model-artistry',
    title: 'Финансов модел',
    description: 'Себестойност и капацитет при дял 50%',
    order: 7,
  },
  {
    id: 'pazar',
    name: 'pazarno-prouchvane-sofia',
    title: 'Пазарно проучване',
    description: '90+ цени от 37 обекта, с пакетна икономика',
    order: 8,
  },
  {
    id: 'benchmark',
    name: 'benchmark-uredi',
    title: 'Бенчмарк на уредите',
    description: 'Кой с какво работи и как се сравняваш',
    order: 9,
  },
  {
    id: 'higiena',
    name: 'protokol-higiena-DRAFT',
    title: 'Хигиенен протокол',
    description: 'ПРОЕКТ — за потвърждение от Amway BG',
    order: 10,
  },
  {
    id: 'saglasie',
    name: 'informirano-saglasie-DRAFT',
    title: 'Информирано съгласие',
    description: 'ПРОЕКТ — за адвокатски преглед',
    order: 11,
  },
  {
    id: 'promt',
    name: 'optimalen-promt-artistry',
    title: 'Оптимизиран промпт',
    description: 'Изходното задание, преработено',
    order: 12,
  },
]

const BASE_TITLE = 'ARTISTRY Derma-Architect'

function docFromHash(): string | null {
  if (typeof window === 'undefined') return null
  const id = window.location.hash.replace(/^#\/?/, '')
  return documents.some((d) => d.id === id) ? id : null
}

export default function Home() {
  const [currentDoc, setCurrentDoc] = useState<string | null>(null)
  const [docContent, setDocContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  // Documents never change during a session, so cache each one after first fetch.
  const cache = useRef<Record<string, string>>({})

  const loadDocument = useCallback(async (docId: string) => {
    const doc = documents.find((d) => d.id === docId)
    if (!doc) return

    const cached = cache.current[docId]
    if (cached) {
      setDocContent(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    setDocContent('')
    try {
      const response = await fetch(`/docs/${doc.name}.md`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const content = await response.text()
      cache.current[docId] = content
      setDocContent(content)
    } catch (error) {
      console.error('Error loading document:', error)
      setDocContent(
        '# Документът не се зареди\n\nПроверката на връзката и презареждането на страницата обикновено решават проблема.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  // The URL hash is the source of truth, so the browser's own Back button works.
  useEffect(() => {
    const sync = () => setCurrentDoc(docFromHash())
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  useEffect(() => {
    if (currentDoc) {
      loadDocument(currentDoc)
    } else {
      setDocContent('')
      setLoading(false)
    }
  }, [currentDoc, loadDocument])

  const activeDoc = documents.find((d) => d.id === currentDoc) || null

  useEffect(() => {
    document.title = activeDoc ? `${activeDoc.title} · ${BASE_TITLE}` : BASE_TITLE
  }, [activeDoc])

  // Scroll to the top on navigation, otherwise you land mid-document.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentDoc])

  const openDoc = (id: string) => {
    if (id === currentDoc) return
    window.location.hash = id
  }

  const goBack = () => {
    // Prefer real history so Back and this button stay in sync; fall back to a
    // fresh entry when the document was opened directly from a shared link.
    if (window.history.length > 1) {
      window.history.back()
    } else {
      goHome()
    }
  }

  // Distinct from goBack: one step to the menu, however deep the browsing got.
  const goHome = () => {
    if (window.location.hash) {
      window.location.hash = ''
    } else {
      setCurrentDoc(null)
    }
  }

  const index = activeDoc ? documents.indexOf(activeDoc) : -1
  const prevDoc = index > 0 ? documents[index - 1] : null
  const nextDoc =
    index >= 0 && index < documents.length - 1 ? documents[index + 1] : null

  return (
    <>
      <header>
        <div className="hbar">
          {activeDoc && (
            <div className="navrow">
              <button id="back" type="button" onClick={goBack}>
                <span aria-hidden="true">‹</span> Назад
              </button>
              <a
                className="homelink"
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  goHome()
                }}
              >
                <span aria-hidden="true">⌂</span> Начало
              </a>
            </div>
          )}
          <a
            className="brandlink"
            href="#"
            onClick={(e) => {
              e.preventDefault()
              goHome()
            }}
          >
            <h1 className="brand">{BASE_TITLE}</h1>
          </a>
          <div className="meta">
            {activeDoc
              ? `${activeDoc.order} от ${documents.length} · ${activeDoc.title}`
              : `Работна папка · 27 юли 2026 · ${documents.length} документа`}
          </div>
        </div>
      </header>

      <main>
        {!activeDoc ? (
          <nav id="menu" aria-label="Документи">
            {documents.map((doc) => (
              <a
                key={doc.id}
                className="navbtn"
                href={`#${doc.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  openDoc(doc.id)
                }}
              >
                <span className="n">{doc.order}</span>
                <span className="tt">{doc.title}</span>
                <span className="ss">{doc.description}</span>
              </a>
            ))}
          </nav>
        ) : (
          <>
            <DocumentViewer
              content={docContent}
              loading={loading}
              title={activeDoc.title}
            />

            {!loading && (
              <nav className="docnav" aria-label="Съседни документи">
                {prevDoc ? (
                  <a
                    className="docnav-item prev"
                    href={`#${prevDoc.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      openDoc(prevDoc.id)
                    }}
                  >
                    <span className="dir">‹ Предишен</span>
                    <span className="ttl">{prevDoc.title}</span>
                  </a>
                ) : (
                  <span />
                )}
                {nextDoc && (
                  <a
                    className="docnav-item next"
                    href={`#${nextDoc.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      openDoc(nextDoc.id)
                    }}
                  >
                    <span className="dir">Следващ ›</span>
                    <span className="ttl">{nextDoc.title}</span>
                  </a>
                )}
              </nav>
            )}

            {!loading && (
              <p className="homerow">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    goHome()
                  }}
                >
                  <span aria-hidden="true">⌂</span> Всички документи
                </a>
              </p>
            )}
          </>
        )}
      </main>

      <footer>© 2026 ARTISTRY Derma-Architect · Всички права запазени</footer>
    </>
  )
}
