import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// Helper per ottenere i post del blog (da adattare se necessario)
async function getBlogPosts() {
  try {
    // Per ora restituiamo un array vuoto, ma qui si può integrare con WordPress API o altro CMS
    // const response = await fetch('https://api.puntifurbi.com/posts', { cache: 'no-store' })
    // if (response.ok) {
    //   const posts = await response.json()
    //   return posts
    // }
    return []
  } catch (error) {
    console.error('Errore caricamento posts blog:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://puntifurbi.com'
  
  // Static pages con priorità ottimizzate per SEO
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/voli-economici/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/come-funziona/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/premium/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8, // Aumentato per pagine di conversione
    },
    {
      url: `${baseUrl}/elite/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8, // Aumentato per pagine di conversione
    },
    {
      url: `${baseUrl}/checkout/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Dynamic blog posts
  const blogPosts = await getBlogPosts()
  const blogSitemapEntries: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...blogSitemapEntries,
  ]
}