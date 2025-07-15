# Sistema di Cache Busting per Blog - Punti Furbi

## Panoramica

Questo sistema implementa una soluzione completa di cache busting per il blog del sito puntifurbi.com, garantendo che gli articoli aggiornati vengano sempre visualizzati fresh ai lettori.

## Componenti Implementati

### 1. Configurazione Next.js (`next.config.mjs`)
- **Header HTTP**: Disabilita la cache per tutte le route `/blog/*`
- **Cache Assets**: Mantiene cache ottimizzata per assets statici
- **Sicurezza**: Aggiunge header di sicurezza standard

### 2. Utility Cache Busting (`lib/cache-busting.ts`)
- **Versioning**: Genera hash di versione automatici
- **Timestamp**: Crea timestamp unici per ogni richiesta
- **URL Params**: Aggiunge parametri cache-busting agli URL
- **Meta Tags**: Genera meta tag no-cache
- **ETag**: Gestisce ETag per controllo cache
- **Cache Invalidator**: Classe per invalidazione cache programmata

### 3. Middleware (`middleware.ts`)
- **Route Detection**: Identifica automaticamente le route blog
- **Header Injection**: Aggiunge header cache-busting in tempo reale
- **Asset Optimization**: Ottimizza cache per assets statici
- **Security Headers**: Aggiunge header di sicurezza

### 4. Layout Blog (`app/blog/layout.tsx`)
- **Meta Tags**: Include meta tag no-cache nel layout
- **Versioning**: Aggiunge versione corrente ai meta tag
- **Last-Modified**: Timestamp di ultima modifica

### 5. Pagine Articoli (`app/blog/[slug]/page.tsx`)
- **Article Versioning**: Hash specifico per contenuto articolo
- **Cache Busting URLs**: URL con parametri cache-busting per articoli correlati
- **Fresh Content**: Meta tag specifici per ogni articolo

### 6. Componente Invalidatore (`components/cache-invalidator.tsx`)
- **Manual Invalidation**: Pulsante per invalidazione manuale
- **Auto Invalidation**: Controllo automatico per nuovi articoli
- **Hook React**: Hook per gestire stato invalidazione
- **localStorage**: Persistenza stato cache

## Funzionalità Principali

### Cache Disabilitata per Blog
```typescript
// Tutte le route /blog/* hanno questi header:
'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0'
'Pragma': 'no-cache'
'Expires': '0'
```

### Cache Ottimizzata per Assets
```typescript
// Assets statici (CSS, JS, immagini) hanno:
'Cache-Control': 'public, max-age=31536000, immutable'
```

### Versioning Automatico
```typescript
// Ogni articolo ha un hash unico basato sul contenuto
const articleVersion = generateVersionHash(post.content)
```

### URL Cache-Busting
```typescript
// URL con parametri automatici
const urlWithCacheBust = addCacheBustingParams('/blog/articolo/')
// Risultato: /blog/articolo/?v=abc123&t=1634567890
```

## Utilizzo

### Implementazione Base
Il sistema è già attivo su tutte le pagine blog. Non richiede configurazione aggiuntiva.

### Invalidazione Manuale
```tsx
import { CacheInvalidatorComponent } from '@/components/cache-invalidator'

// In un componente admin
<CacheInvalidatorComponent 
  onInvalidate={() => console.log('Cache invalidated')}
  autoInvalidate={true}
  checkInterval={30000}
/>
```

### Hook per Controllo Cache
```tsx
import { useCacheInvalidation } from '@/components/cache-invalidator'

function BlogPage() {
  const { shouldRefresh, clearRefreshFlag } = useCacheInvalidation()
  
  useEffect(() => {
    if (shouldRefresh) {
      // Mostra notifica o ricarica pagina
      clearRefreshFlag()
    }
  }, [shouldRefresh, clearRefreshFlag])
}
```

### Utility Functions
```typescript
import { 
  addCacheBustingParams, 
  generateVersionHash, 
  getCurrentVersion 
} from '@/lib/cache-busting'

// Aggiunge cache busting a un URL
const freshUrl = addCacheBustingParams('/blog/articolo/')

// Genera hash di versione per contenuto
const version = generateVersionHash(content)

// Ottiene versione corrente del build
const currentVersion = getCurrentVersion()
```

## Configurazione Avanzata

### Per Nuovi Articoli
Quando pubblichi un nuovo articolo, il sistema:
1. Genera automaticamente un nuovo hash di versione
2. Invalida la cache esistente
3. Forza il refresh delle pagine blog aperte
4. Aggiorna i meta tag con nuovi timestamp

### Per Hosting Provider
Se usi un hosting provider che supporta header personalizzati, aggiungi:
```
# Per /blog/*
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0

# Per assets statici
Cache-Control: public, max-age=31536000, immutable
```

### Service Worker (Opzionale)
```javascript
// In un service worker
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_INVALIDATE') {
    // Invalida cache specifica
    caches.delete('blog-cache')
  }
})
```

## Monitoraggio

### Header di Debug
Il sistema aggiunge header utili per debugging:
```
X-Cache-Busted: true
X-Timestamp: 1634567890
X-Fresh-Content: true
X-Static-Asset: true (per assets)
```

### Verifiche Browser
```javascript
// In console browser
console.log('Cache headers:', document.querySelector('meta[name="cache-control"]'))
console.log('Version:', document.querySelector('meta[name="version"]'))
```

## Best Practices

1. **Verifica Header**: Controlla sempre i header nelle DevTools
2. **Test Multi-Browser**: Testa su Chrome, Firefox, Safari
3. **Mobile Testing**: Verifica su dispositivi mobile
4. **CDN Config**: Configura CDN per rispettare header no-cache
5. **Monitoring**: Monitora performance dopo implementazione

## Troubleshooting

### Cache Ancora Attiva
1. Controlla che middleware sia attivo
2. Verifica configurazione hosting
3. Testa in modalità incognito
4. Forza refresh con Ctrl+F5

### Performance Issues
1. Verifica che assets statici abbiano cache abilitata
2. Controlla dimensioni immagini
3. Monitora tempi di caricamento
4. Usa compression gzip

### Errori di Build
1. Verifica importazioni in `lib/cache-busting.ts`
2. Controlla sintassi `next.config.mjs`
3. Verifica compatibilità TypeScript
4. Controlla dipendenze mancanti

## Compatibilità

- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers
- ✅ Next.js 13+ con App Router

## Conclusione

Il sistema di cache busting implementato garantisce che:
- Gli articoli blog vengano sempre serviti fresh
- Le performance rimangano ottimali per assets statici
- Il sistema sia compatibile con tutti i browser moderni
- La gestione sia automatica e trasparente per gli utenti

Per domande o problemi, controlla la documentazione tecnica nei file sorgente o i log di debug nei browser.