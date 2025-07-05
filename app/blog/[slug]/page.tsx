// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPostBySlug, getRelatedPosts } from '@/lib/graphql-api'
import { Metadata } from 'next'
import { BlogPostContent } from '@/components/blog-post-content'

// ✅ AGGIUNGI QUESTA FUNZIONE
export async function generateStaticParams() {
  try {
    // Qui devi recuperare tutti gli slug dei tuoi post
    // Opzione 1: Se hai una funzione getAllPosts()
    // const posts = await getAllPosts()
    // return posts.map((post: any) => ({ slug: post.slug }))
    
    // Opzione 2: Query GraphQL diretta
    const query = `
      query GetAllPosts {
        posts(first: 100) {
          nodes {
            slug
          }
        }
      }
    `
    
    const response = await fetch('https://pff-815f04.ingress-florina.ewp.live/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
    
    const data = await response.json()
    
    if (data.data?.posts?.nodes) {
      return data.data.posts.nodes.map((post: any) => ({
        slug: post.slug,
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error generating static params:', error)
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
      <BlogPostContent post={post} />
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Post Correlati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <div key={relatedPost.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{relatedPost.title}</h3>
                <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
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
      description: 'Il post richiesto non esiste.'
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featuredImage ? [post.featuredImage.node.sourceUrl] : [],
    },
  }
}

export default BlogPostPageContent
