'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getCurrentVersion } from '@/lib/cache-busting'

export function ClientCacheBuster() {
  const pathname = usePathname()
  const isBlogRoute = pathname.startsWith('/blog/')

  useEffect(() => {
    if (isBlogRoute) {
      // Aggiungiamo un delay per permettere il caricamento iniziale dei dati
      const timer = setTimeout(() => {
        forceCacheRefresh()
      }, 2000) // 2 secondi di delay per permettere il caricamento

      return () => clearTimeout(timer)
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

    // Cache busting più selettivo - solo per cache statiche, non per API calls
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          // Solo cache statiche, non quelle delle API
          if (name.includes('blog-static') || name.includes('next-static') || name.includes('webpack')) {
            caches.delete(name)
          }
        })
      })
    }

    // Meta tag meno aggressivi - solo se non stiamo caricando dati
    if (typeof window !== 'undefined') {
      // Controlla se ci sono fetch in corso prima di aggiungere meta tag
      const isLoading = document.querySelector('[data-loading="true"]') || 
                       document.querySelector('.loading') ||
                       document.querySelector('[data-testid="loading"]')
      
      if (!isLoading) {
        const meta = document.querySelector('meta[http-equiv="Cache-Control"]')
        if (!meta) {
          const newMeta = document.createElement('meta')
          newMeta.setAttribute('http-equiv', 'Cache-Control')
          newMeta.setAttribute('content', 'no-cache, no-store, must-revalidate')
          document.head.appendChild(newMeta)
        }
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

    // Delay anche per il check automatico
    const timer = setTimeout(() => {
      const shouldRefresh = checkCacheVersion()
      
      if (shouldRefresh) {
        // Invalida solo cache statiche
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              if (name.includes('blog-static') || name.includes('next-static')) {
                caches.delete(name)
              }
            })
          })
        }
      }
    }, 1500) // Delay di 1.5 secondi

    return () => clearTimeout(timer)
  }, [isBlogRoute, pathname])

  return {
    isBlogRoute,
    version: getCurrentVersion()
  }
}

// Componente per meta tag dinamici - meno aggressivo
export function DynamicBlogMetaTags() {
  const { isBlogRoute } = useBlogCacheBuster()

  useEffect(() => {
    if (!isBlogRoute) return

    // Delay significativo per non interferire con il caricamento
    const timer = setTimeout(() => {
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

      // Meta tag meno aggressivi - solo se il blog è già caricato
      const blogContent = document.querySelector('[data-blog-content]') || 
                         document.querySelector('.blog-list') ||
                         document.querySelector('h1')

      if (blogContent) {
        addMetaTag('cache-control', 'max-age=300, must-revalidate') // 5 minuti invece di no-cache
        addMetaTag('cache-bust', Date.now().toString())
        addMetaTag('version', getCurrentVersion())
      }
    }, 3000) // 3 secondi di delay

    return () => clearTimeout(timer)
  }, [isBlogRoute])

  return null
}

export default ClientCacheBuster