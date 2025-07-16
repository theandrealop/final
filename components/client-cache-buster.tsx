'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getCurrentVersion } from '@/lib/cache-busting'

export function ClientCacheBuster() {
  const pathname = usePathname()
  const isBlogRoute = pathname.startsWith('/blog/')

  useEffect(() => {
    if (isBlogRoute) {
      // Forza il refresh della cache per le pagine blog
      forceCacheRefresh()
    }
  }, [isBlogRoute, pathname])

  const forceCacheRefresh = () => {
    // Aggiorna la versione nella localStorage
    const currentVersion = getCurrentVersion()
    const storedVersion = localStorage.getItem('cache-version')
    
    if (storedVersion !== currentVersion) {
      localStorage.setItem('cache-version', currentVersion)
      localStorage.setItem('last-refresh', Date.now().toString())
    }

    // Disabilita cache del browser per questa sessione
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('blog') || name.includes('next')) {
            caches.delete(name)
          }
        })
      })
    }

    // Imposta header no-cache per richieste future
    if (typeof window !== 'undefined') {
      const meta = document.querySelector('meta[http-equiv="Cache-Control"]')
      if (!meta) {
        const newMeta = document.createElement('meta')
        newMeta.setAttribute('http-equiv', 'Cache-Control')
        newMeta.setAttribute('content', 'no-cache, no-store, must-revalidate')
        document.head.appendChild(newMeta)
      }
    }
  }

  // Il componente ora opera solo automaticamente, senza UI
  return null
}

// Hook per gestire cache busting automatico
export function useBlogCacheBuster() {
  const pathname = usePathname()
  const isBlogRoute = pathname.startsWith('/blog/')

  useEffect(() => {
    if (!isBlogRoute) return

    const checkCacheVersion = () => {
      const currentVersion = getCurrentVersion()
      const storedVersion = localStorage.getItem('cache-version')
      const lastRefresh = localStorage.getItem('last-refresh')
      
      // Se non c'è versione salvata o è diversa, forza refresh
      if (!storedVersion || storedVersion !== currentVersion) {
        localStorage.setItem('cache-version', currentVersion)
        localStorage.setItem('last-refresh', Date.now().toString())
        return true
      }
      
      // Se l'ultima refresh è stata più di 1 ora fa, forza refresh
      if (lastRefresh && Date.now() - parseInt(lastRefresh) > 3600000) {
        localStorage.setItem('last-refresh', Date.now().toString())
        return true
      }
      
      return false
    }

    const shouldRefresh = checkCacheVersion()
    
    if (shouldRefresh) {
      // Invalida cache esistente
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (name.includes('blog')) {
              caches.delete(name)
            }
          })
        })
      }
    }
  }, [isBlogRoute, pathname])

  return {
    isBlogRoute,
    version: getCurrentVersion()
  }
}

// Componente per meta tag dinamici
export function DynamicBlogMetaTags() {
  const { isBlogRoute } = useBlogCacheBuster()

  useEffect(() => {
    if (!isBlogRoute) return

    const addMetaTag = (name: string, content: string, httpEquiv?: string) => {
      const selector = httpEquiv ? `meta[http-equiv="${httpEquiv}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      
      if (!meta) {
        meta = document.createElement('meta')
        if (httpEquiv) {
          meta.setAttribute('http-equiv', httpEquiv)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Aggiunge meta tag cache busting
    addMetaTag('', 'no-cache, no-store, must-revalidate', 'Cache-Control')
    addMetaTag('', 'no-cache', 'Pragma')
    addMetaTag('', '0', 'Expires')
    addMetaTag('cache-control', 'no-cache')
    addMetaTag('expires', '0')
    addMetaTag('cache-bust', Date.now().toString())
    addMetaTag('version', getCurrentVersion())
  }, [isBlogRoute])

  return null
}

export default ClientCacheBuster