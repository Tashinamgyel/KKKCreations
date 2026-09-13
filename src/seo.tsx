import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import seo from './data/seo.json'

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }

  element.content = content
}

/** Keep client-side navigation in sync with the metadata emitted at build time. */
export function SeoMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/'
    const page = Object.prototype.hasOwnProperty.call(seo.pages, path)
      ? seo.pages[path as keyof typeof seo.pages]
      : undefined
    const metadata = page ?? seo.notFound

    document.title = metadata.title
    setMeta('name', 'description', metadata.description)
    setMeta('name', 'robots', page ? 'index, follow' : 'noindex, follow')
    setMeta('property', 'og:title', metadata.title)
    setMeta('property', 'og:description', metadata.description)
    setMeta('name', 'twitter:title', metadata.title)
    setMeta('name', 'twitter:description', metadata.description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (page) {
      const url = new URL(path, seo.origin).href
      setMeta('property', 'og:url', url)
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.append(canonical)
      }
      canonical.href = url
    } else {
      canonical?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }
  }, [pathname])

  return null
}
