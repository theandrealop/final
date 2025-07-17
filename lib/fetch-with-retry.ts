interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  shouldRetry?: (error: any, attempt: number) => boolean
}

interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

// Cache globale per le richieste durante il build
const requestCache = new Map<string, Promise<any>>()
const responseCache = new Map<string, CacheEntry>()

/**
 * Implementa exponential backoff con jitter per evitare rate limiting
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number, backoffMultiplier: number): number {
  const exponentialDelay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt), maxDelay)
  // Aggiungi jitter (±25%) per evitare thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5)
  return Math.max(100, exponentialDelay + jitter)
}

/**
 * Aggiunge delay artificiale durante il build per ridurre rate limiting
 */
async function addBuildDelay(): Promise<void> {
  // Solo durante build di produzione e se non siamo già in cache
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
    const delay = 800 + Math.random() * 400 // 800-1200ms random delay
    console.log(`🕒 Build delay: ${Math.round(delay)}ms per ridurre rate limiting`)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

/**
 * Verifica se un errore è dovuto a rate limiting
 */
function isRateLimitError(error: any): boolean {
  if (error.status === 429) return true
  if (error.message?.includes('429')) return true
  if (error.message?.includes('Too Many Requests')) return true
  if (error.message?.includes('rate limit')) return true
  return false
}

/**
 * Verifica se un errore è temporaneo e può essere risolto con retry
 */
function isTemporaryError(error: any): boolean {
  // Rate limiting
  if (isRateLimitError(error)) return true
  
  // Network errors
  if (error.code === 'ECONNRESET') return true
  if (error.code === 'ENOTFOUND') return true
  if (error.code === 'ECONNREFUSED') return true
  
  // HTTP temporary errors
  if (error.status >= 500 && error.status < 600) return true
  if (error.status === 408) return true // Request Timeout
  if (error.status === 503) return true // Service Unavailable
  if (error.status === 504) return true // Gateway Timeout
  
  return false
}

/**
 * Gestisce la cache delle risposte per evitare richieste duplicate
 */
function getCachedResponse(cacheKey: string): any | null {
  const cached = responseCache.get(cacheKey)
  if (!cached) return null
  
  const isExpired = Date.now() - cached.timestamp > cached.ttl
  if (isExpired) {
    responseCache.delete(cacheKey)
    return null
  }
  
  console.log(`📦 Cache hit per ${cacheKey}`)
  return cached.data
}

/**
 * Salva una risposta nella cache
 */
function setCachedResponse(cacheKey: string, data: any, ttl: number = 300000): void {
  responseCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

/**
 * Fetch con retry logic, exponential backoff e cache intelligente
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 4,
    baseDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    shouldRetry = isTemporaryError
  } = retryOptions

  // Crea chiave cache basata su URL e opzioni rilevanti
  const cacheKey = url + JSON.stringify({
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers
  })

  // Verifica cache delle richieste in corso (deduplication)
  if (requestCache.has(cacheKey)) {
    console.log(`🔄 Request deduplication per ${url}`)
    return requestCache.get(cacheKey)!
  }

  // Verifica cache delle risposte
  const cached = getCachedResponse(cacheKey)
  if (cached) {
    return new Response(JSON.stringify(cached), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const requestPromise = async (): Promise<Response> => {
    let lastError: any

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Aggiungi delay durante build per primo tentativo
        if (attempt === 0) {
          await addBuildDelay()
        }

        console.log(`🔍 Tentativo ${attempt + 1}/${maxRetries + 1} per ${url}`)

        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent': 'PuntiFurbi-Bot/1.0',
            'Accept': 'application/json',
            ...options.headers,
          }
        })

        // Se la risposta è OK, salva in cache e ritorna
        if (response.ok) {
          // Per le risposte JSON, salviamo anche in cache
          const contentType = response.headers.get('content-type')
          if (contentType?.includes('application/json')) {
            const cloned = response.clone()
            try {
              const data = await cloned.json()
              setCachedResponse(cacheKey, data)
            } catch (e) {
              // Ignore cache errors
            }
          }
          
          console.log(`✅ Successo al tentativo ${attempt + 1} per ${url}`)
          return response
        }

        // Gestione specifica per rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After')
          const rateLimitDelay = retryAfter ? 
            parseInt(retryAfter) * 1000 : 
            calculateDelay(attempt, baseDelay * 2, maxDelay, backoffMultiplier)
          
          console.log(`🚫 Rate limited (429) su ${url}, retry dopo ${rateLimitDelay}ms`)
          
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, rateLimitDelay))
            continue
          }
        }

        // Crea errore per altri status codes
        const error = new Error(`HTTP error! status: ${response.status}`)
        ;(error as any).status = response.status
        
        if (!shouldRetry(error, attempt) || attempt === maxRetries) {
          throw error
        }
        
        lastError = error

      } catch (error) {
        console.error(`❌ Errore tentativo ${attempt + 1}:`, error)
        lastError = error

        // Se non dobbiamo fare retry o abbiamo esaurito i tentativi
        if (!shouldRetry(error, attempt) || attempt === maxRetries) {
          throw error
        }
      }

      // Calcola delay per prossimo tentativo
      if (attempt < maxRetries) {
        const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffMultiplier)
        console.log(`⏳ Attendo ${delay}ms prima del prossimo tentativo...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError
  }

  // Salva promessa in cache per deduplication
  const promise = requestPromise()
  requestCache.set(cacheKey, promise)

  try {
    const result = await promise
    return result
  } finally {
    // Rimuovi dalla cache delle richieste in corso
    requestCache.delete(cacheKey)
  }
}

/**
 * Helper specifico per GraphQL con retry e cache
 */
export async function fetchGraphQLWithRetry(
  url: string,
  query: string,
  variables: any = {},
  retryOptions: RetryOptions = {}
): Promise<any> {
  const response = await fetchWithRetry(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    body: JSON.stringify({ query, variables })
  }, {
    maxRetries: 5, // Più tentativi per GraphQL
    baseDelay: 1500, // Delay più lungo per GraphQL
    maxDelay: 45000,
    ...retryOptions
  })

  if (!response.ok) {
    const text = await response.text()
    console.error("❌ GraphQL Response error:", text.substring(0, 200))
    throw new Error(`GraphQL HTTP error! status: ${response.status}`)
  }

  const text = await response.text()
  
  // Verifica se la risposta è HTML invece di JSON
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    console.error("❌ Received HTML instead of JSON:", text.substring(0, 200))
    throw new Error("GraphQL endpoint returned HTML instead of JSON")
  }

  let json
  try {
    json = JSON.parse(text)
  } catch (parseError) {
    console.error("❌ JSON parse error:", parseError)
    console.error("❌ Raw response:", text.substring(0, 200))
    throw new Error("Invalid JSON response from GraphQL endpoint")
  }

  if (json.errors) {
    console.error("❌ GraphQL errors:", json.errors)
    throw new Error("GraphQL query failed: " + JSON.stringify(json.errors))
  }

  return json.data
}

/**
 * Pulisce le cache (utile per testing)
 */
export function clearCaches(): void {
  requestCache.clear()
  responseCache.clear()
  console.log("🧹 Cache pulite")
}

/**
 * Fornisce dati di fallback per il blog quando le API non sono disponibili
 */
export function getFallbackBlogData(): any {
  return {
    posts: {
      nodes: [
        {
          id: 'fallback-1',
          title: 'Benvenuti nel nostro blog!',
          slug: 'benvenuti-blog',
          excerpt: 'Il blog si sta caricando. Tornate presto per leggere i nostri ultimi articoli su viaggi e punti fedeltà.',
          date: new Date().toISOString(),
          author: { node: { name: 'Team Punti Furbi' } },
          categories: { nodes: [{ name: 'Generale', slug: 'generale' }] },
          featuredImage: null
        }
      ],
      pageInfo: {
        hasNextPage: false,
        endCursor: null
      }
    }
  }
}