'use client'

import { useEffect, useState } from 'react'
import { CacheInvalidator, getCurrentVersion } from '@/lib/cache-busting'

interface CacheInvalidatorProps {
  onInvalidate?: () => void
  autoInvalidate?: boolean
  checkInterval?: number
}

export function CacheInvalidatorComponent({ 
  onInvalidate, 
  autoInvalidate = false, 
  checkInterval = 30000 // 30 secondi
}: CacheInvalidatorProps) {
  const [lastVersion, setLastVersion] = useState<string>('')
  const [isInvalidating, setIsInvalidating] = useState(false)

  useEffect(() => {
    const currentVersion = getCurrentVersion()
    setLastVersion(currentVersion)
  }, [])

  useEffect(() => {
    if (!autoInvalidate) return

    const intervalId = setInterval(() => {
      checkForUpdates()
    }, checkInterval)

    return () => clearInterval(intervalId)
  }, [autoInvalidate, checkInterval])

  const checkForUpdates = async () => {
    try {
      // Simula una chiamata API per verificare se ci sono nuovi articoli
      const response = await fetch('/api/check-updates', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.hasUpdates) {
          await invalidateCache()
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error)
    }
  }

  const invalidateCache = async () => {
    setIsInvalidating(true)
    
    try {
      // Invalida la cache
      CacheInvalidator.invalidateAll()
      
      // Forza il reload delle pagine blog in cache
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        if (registration.active) {
          registration.active.postMessage({ type: 'CACHE_INVALIDATE' })
        }
      }
      
      // Aggiorna localStorage per segnalare la necessità di refresh
      localStorage.setItem('cache-invalidated', Date.now().toString())
      localStorage.setItem('last-cache-version', getCurrentVersion())
      
      // Callback personalizzato
      if (onInvalidate) {
        onInvalidate()
      }
      
      // Ricarica la pagina se siamo su una pagina blog
      if (window.location.pathname.startsWith('/blog/')) {
        window.location.reload()
      }
      
    } catch (error) {
      console.error('Error invalidating cache:', error)
    } finally {
      setIsInvalidating(false)
    }
  }

  const handleManualInvalidate = () => {
    invalidateCache()
  }

  return (
    <div className="cache-invalidator">
      <button
        onClick={handleManualInvalidate}
        disabled={isInvalidating}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        {isInvalidating ? 'Invalidating...' : 'Force Cache Refresh'}
      </button>
      
      <div className="text-sm text-gray-500 mt-2">
        Version: {lastVersion}
      </div>
    </div>
  )
}

// Hook per utilizzare la cache invalidation
export function useCacheInvalidation() {
  const [shouldRefresh, setShouldRefresh] = useState(false)

  useEffect(() => {
    const checkCacheStatus = () => {
      const lastInvalidation = localStorage.getItem('cache-invalidated')
      const lastVersion = localStorage.getItem('last-cache-version')
      const currentVersion = getCurrentVersion()
      
      if (lastInvalidation && lastVersion !== currentVersion) {
        setShouldRefresh(true)
      }
    }

    checkCacheStatus()
    
    // Ascolta per eventi di storage (da altre tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cache-invalidated') {
        setShouldRefresh(true)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const clearRefreshFlag = () => {
    setShouldRefresh(false)
    localStorage.removeItem('cache-invalidated')
  }

  return {
    shouldRefresh,
    clearRefreshFlag,
  }
}

// Utility per forzare il refresh di tutte le pagine blog
export const forceRefreshBlogPages = () => {
  // Invalida la cache del browser
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('blog')) {
          caches.delete(name)
        }
      })
    })
  }
  
  // Rimuove tutti gli item dal localStorage relativi al blog
  Object.keys(localStorage).forEach(key => {
    if (key.includes('blog') || key.includes('cache')) {
      localStorage.removeItem(key)
    }
  })
  
  // Forza il reload se siamo su una pagina blog
  if (window.location.pathname.startsWith('/blog/')) {
    window.location.reload()
  }
}

export default CacheInvalidatorComponent