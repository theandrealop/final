// lib/cache-busting.ts
import { createHash } from 'crypto'

// Genera un timestamp basato su quando il server è stato avviato
const BUILD_TIMESTAMP = Date.now().toString()

// Genera un hash del timestamp per il versioning
const VERSION_HASH = createHash('md5').update(BUILD_TIMESTAMP).digest('hex').substring(0, 8)

/**
 * Genera un timestamp unico per ogni richiesta
 */
export function generateCacheBustingTimestamp(): string {
  return Date.now().toString()
}

/**
 * Genera un hash di versione basato sul contenuto o timestamp
 */
export function generateVersionHash(content?: string): string {
  if (content) {
    return createHash('md5').update(content).digest('hex').substring(0, 8)
  }
  return VERSION_HASH
}

/**
 * Aggiunge parametri di cache busting a un URL
 */
export function addCacheBustingParams(url: string, useTimestamp: boolean = true): string {
  const separator = url.includes('?') ? '&' : '?'
  const timestamp = useTimestamp ? generateCacheBustingTimestamp() : ''
  const version = generateVersionHash()
  
  let params = `v=${version}`
  if (useTimestamp) {
    params += `&t=${timestamp}`
  }
  
  return `${url}${separator}${params}`
}

/**
 * Genera meta tag per disabilitare la cache
 */
export function generateNoCacheMetaTags(): Array<{
  name?: string
  httpEquiv?: string
  content: string
}> {
  return [
    { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
    { httpEquiv: 'Pragma', content: 'no-cache' },
    { httpEquiv: 'Expires', content: '0' },
    { name: 'cache-control', content: 'no-cache' },
    { name: 'expires', content: '0' },
    { name: 'pragma', content: 'no-cache' },
  ]
}

/**
 * Genera un ETag basato sul contenuto
 */
export function generateETag(content: string): string {
  return `"${createHash('md5').update(content).digest('hex')}"`
}

/**
 * Ottiene la versione corrente del build
 */
export function getCurrentVersion(): string {
  return VERSION_HASH
}

/**
 * Verifica se l'URL è una route blog che necessita cache busting
 */
export function isBlogRoute(pathname: string): boolean {
  return pathname.startsWith('/blog/')
}

/**
 * Genera headers HTTP per disabilitare la cache
 */
export function generateNoCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': generateETag(BUILD_TIMESTAMP),
  }
}

/**
 * Invalidazione della cache per nuovi articoli
 */
export class CacheInvalidator {
  private static lastInvalidation: number = Date.now()
  
  static invalidateAll(): void {
    this.lastInvalidation = Date.now()
  }
  
  static getLastInvalidation(): number {
    return this.lastInvalidation
  }
  
  static shouldInvalidate(lastModified: number): boolean {
    return lastModified > this.lastInvalidation
  }
}

export default {
  generateCacheBustingTimestamp,
  generateVersionHash,
  addCacheBustingParams,
  generateNoCacheMetaTags,
  generateETag,
  getCurrentVersion,
  isBlogRoute,
  generateNoCacheHeaders,
  CacheInvalidator,
}