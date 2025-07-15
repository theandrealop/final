// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts, getAllPosts } from '@/lib/graphql-api'
import { Metadata } from 'next'
import { BlogPostContent } from '@/components/blog-post-content'
import { generateVersionHash, getCurrentVersion, addCacheBustingParams } from '@/lib/cache-busting'

// Genera i parametri statici per il build
export async function generateStaticParams() {
  try {
    // Ottieni tutti i post per la generazione statica
    const posts = await getAllPosts(1000) // Ottieni fino a 1000 post
    return posts.posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for blog posts:', error)
    // In caso di errore, ritorna array vuoto per evitare che il build fallisca
    return []
  }
}

// Resto del tuo codice esistente...
async function BlogPostPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    notFound()
  }

  let relatedPosts = []
  try {
    relatedPosts = await getRelatedPosts(post.categories?.nodes || [])
  } catch (error) {
    console.error('Error fetching related posts:', error)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Cache busting meta tags specifici per l'articolo */}
      <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
      <meta httpEquiv="Pragma" content="no-cache" />
      <meta httpEquiv="Expires" content="0" />
      <meta name="article-version" content={generateVersionHash(post.content)} />
      <meta name="article-modified" content={post.modifiedDate || new Date().toISOString()} />
      <meta name="cache-bust" content={Date.now().toString()} />
      
      <BlogPostContent post={post} />
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Post Correlati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <div key={relatedPost.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                <a 
                  href={addCacheBustingParams(`/blog/${relatedPost.slug}/`)}
                  className="text-blue-600 hover:underline"
                >
                  Leggi di più
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: 'Post non trovato',
      description: 'Il post richiesto non esiste.',
      other: {
        'cache-control': 'no-cache, no-store, must-revalidate',
        'pragma': 'no-cache',
        'expires': '0',
      },
    }
  }

  const articleVersion = generateVersionHash(post.content)
  const lastModified = post.modifiedDate || new Date().toISOString()

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage ? [post.featuredImage.node.sourceUrl] : [],
      modifiedTime: lastModified,
    },
    // Cache busting metadata
    other: {
      'cache-control': 'no-cache, no-store, must-revalidate',
      'pragma': 'no-cache',
      'expires': '0',
      'version': getCurrentVersion(),
      'article-version': articleVersion,
      'last-modified': lastModified,
      'cache-bust': Date.now().toString(),
    },
  }
}

export default BlogPostPageContent
