'use client'

import { useState, useEffect } from 'react'
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
    id: 'cheklist',
    name: 'startov-cheklist',
    title: 'Стартов чеклист',
    description: 'Какво трябва да е готово преди първи клиент',
    order: 1,
  },
  {
    id: 'risk',
    name: 'risk-registar-artistry',
    title: 'Риск-регистър',
    description: '10 риска в 3 нива, с ранни сигнали',
    order: 2,
  },
  {
    id: 'protokoli',
    name: 'protokoli-artistry',
    title: 'Кабинетни протоколи',
    description: '3 протокола с разход и марж',
    order: 3,
  },
  {
    id: 'finansi',
    name: 'finansov-model-artistry',
    title: 'Финансов модел',
    description: 'ABO цени, себестойност, break-even',
    order: 4,
  },
  {
    id: 'pazar',
    name: 'pazarno-prouchvane-sofia',
    title: 'Пазарно проучване',
    description: '47 цени от 27 обекта в София',
    order: 5,
  },
  {
    id: 'benchmark',
    name: 'benchmark-uredi',
    title: 'Бенчмарк на уредите',
    description: 'Кой с какво работи и как се сравняваш',
    order: 6,
  },
  {
    id: 'higiena',
    name: 'protokol-higiena-DRAFT',
    title: 'Хигиенен протокол',
    description: 'ПРОЕКТ — за потвърждение от Amway BG',
    order: 7,
  },
  {
    id: 'saglasie',
    name: 'informirano-saglasie-DRAFT',
    title: 'Информирано съгласие',
    description: 'ПРОЕКТ — за адвокатски преглед',
    order: 8,
  },
  {
    id: 'promt',
    name: 'optimalen-promt-artistry',
    title: 'Оптимизиран промпт',
    description: 'Изходното задание, преработено',
    order: 9,
  },
]

export default function Home() {
  const [currentDoc, setCurrentDoc] = useState<string | null>(null)
  const [docContent, setDocContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentDoc) {
      loadDocument(currentDoc)
    }
  }, [currentDoc])

  const loadDocument = async (docId: string) => {
    setLoading(true)
    try {
      const doc = documents.find((d) => d.id === docId)
      if (doc) {
        const response = await fetch(`/docs/${doc.name}.md`)
        const content = await response.text()
        setDocContent(content)
      }
    } catch (error) {
      console.error('Error loading document:', error)
      setDocContent('Грешка при зареждането на документа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header>
        <button
          id="back"
          className={currentDoc ? 'show' : ''}
          onClick={() => {
            setCurrentDoc(null)
            setDocContent('')
          }}
        >
          ‹ Всички документи
        </button>
        <h1 className="brand" id="ttl">
          ARTISTRY Derma-Architect
        </h1>
        <div className="meta" id="sub">
          Работна папка · 27 юли 2026 · {documents.length} документа
        </div>
      </header>

      <main>
        {!currentDoc ? (
          <div id="menu">
            {documents.map((doc) => (
              <button
                key={doc.id}
                className="navbtn"
                onClick={() => setCurrentDoc(doc.id)}
              >
                <span className="n">{doc.order}</span>
                <span className="tt">{doc.title}</span>
                <span className="ss">{doc.description}</span>
              </button>
            ))}
          </div>
        ) : (
          <DocumentViewer
            content={docContent}
            loading={loading}
            title={documents.find((d) => d.id === currentDoc)?.title || ''}
          />
        )}
      </main>

      <footer>
        © 2026 ARTISTRY Derma-Architect · Всички права запазени
      </footer>
    </>
  )
}
