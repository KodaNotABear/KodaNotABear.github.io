import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getRouteMeta, siteUrl } from '../data/siteMeta'

function setMetaAttribute(selector, attr, value) {
  const tag = document.querySelector(selector)
  if (tag) tag.setAttribute(attr, value)
}

export default function PageMeta() {
  const location = useLocation()

  useEffect(() => {
    const meta = getRouteMeta(location.pathname)
    const canonicalUrl = `${siteUrl}${meta.path === '/' ? '/' : meta.path}`

    document.title = meta.title
    setMetaAttribute('meta[name="description"]', 'content', meta.description)
    setMetaAttribute('link[rel="canonical"]', 'href', canonicalUrl)
    setMetaAttribute('meta[property="og:title"]', 'content', meta.title)
    setMetaAttribute('meta[property="og:description"]', 'content', meta.description)
    setMetaAttribute('meta[property="og:url"]', 'content', canonicalUrl)
    setMetaAttribute('meta[name="twitter:title"]', 'content', meta.title)
    setMetaAttribute('meta[name="twitter:description"]', 'content', meta.description)
  }, [location.pathname])

  return null
}
