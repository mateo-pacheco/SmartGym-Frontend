import { useEffect } from 'react'

/* SEO por ruta en una SPA: título del documento y meta descripción
   sincronizados con la vista activa. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }
  }, [title, description])
}
