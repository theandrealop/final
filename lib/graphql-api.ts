import { fetchGraphQLWithRetry, getFallbackBlogData } from './fetch-with-retry'

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || "https://pff-815f04.ingress-florina.ewp.live/graphql"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  author: {
    node: {
      name: string
    }
  }
  categories: {
    nodes: Array<{
      name: string
      slug: string
    }>
  }
  tags: {
    nodes: Array<{
      name: string
      slug: string
    }>
  }
  featuredImage?: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
}

export interface BlogPostsResponse {
  posts: {
    nodes: BlogPost[]
  }
}

export interface SinglePostResponse {
  post: BlogPost
}

// --- types --------------------------------------------------------------
export interface PaginatedPostsResult {
  posts: BlogPost[]
  hasNextPage: boolean
  endCursor: string | null
}

// --- new util -----------------------------------------------------------
/**
 * Fetches a paginated list of published posts, mirroring the old API
 * (`getAllPosts`) that other components import.
 */
export async function getAllPosts(first = 10, after?: string): Promise<PaginatedPostsResult> {
  const query = `
    query GetAllPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          excerpt
          date
          author { node { name } }
          categories { nodes { name slug } }
          featuredImage { node { sourceUrl altText } }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `

  try {
    console.log("🚀 getAllPosts: Iniziando fetch con retry logic...")
    const data = await fetchGraphQLWithRetry(WORDPRESS_API_URL, query, { first, after })
    
    if (!data || !data.posts) {
      console.warn("⚠️ No posts data received, usando fallback")
      const fallbackData = getFallbackBlogData()
      return {
        posts: fallbackData.posts.nodes,
        hasNextPage: fallbackData.posts.pageInfo.hasNextPage,
        endCursor: fallbackData.posts.pageInfo.endCursor,
      }
    }

    // Sort posts by date (most recent first) on client side
    const posts = (data.posts.nodes || []).sort((a: BlogPost, b: BlogPost) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    console.log(`✅ getAllPosts: ${posts.length} posts caricati con successo`)
    return {
      posts,
      hasNextPage: data.posts.pageInfo?.hasNextPage || false,
      endCursor: data.posts.pageInfo?.endCursor || null,
    }
  } catch (error) {
    console.error("💥 getAllPosts: Errore durante fetch, usando fallback:", error)
    const fallbackData = getFallbackBlogData()
    return {
      posts: fallbackData.posts.nodes,
      hasNextPage: false,
      endCursor: null,
    }
  }
}

// Deprecata: ora usiamo fetchGraphQLWithRetry
async function fetchGraphQL(query: string, variables: any = {}) {
  console.log("⚠️ DEPRECATO: Uso fetchGraphQLWithRetry invece di fetchGraphQL")
  return await fetchGraphQLWithRetry(WORDPRESS_API_URL, query, variables)
}

export async function getBlogPosts(first = 10): Promise<BlogPost[]> {
  const query = `
    query GetPosts($first: Int!) {
      posts(first: $first, where: { status: PUBLISH }) {
        nodes {
          id
          title
          slug
          excerpt
          date
          author {
            node {
              name
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `

  try {
    console.log("🚀 getBlogPosts: Iniziando fetch con retry logic...")
    const data = await fetchGraphQLWithRetry(WORDPRESS_API_URL, query, { first })
    
    if (!data?.posts?.nodes) {
      console.warn("⚠️ getBlogPosts: No posts data, usando fallback")
      const fallbackData = getFallbackBlogData()
      return fallbackData.posts.nodes
    }
    
    // Sort posts by date (most recent first) on client side
    const posts = data.posts.nodes.sort((a: BlogPost, b: BlogPost) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    
    console.log(`✅ getBlogPosts: ${posts.length} posts caricati con successo`)
    return posts
  } catch (error) {
    console.error("💥 getBlogPosts: Errore durante fetch, usando fallback:", error)
    const fallbackData = getFallbackBlogData()
    return fallbackData.posts.nodes
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        title
        slug
        excerpt
        content
        date
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  `

  try {
    console.log(`🚀 getPostBySlug: Caricando post "${slug}" con retry logic...`)
    const data = await fetchGraphQLWithRetry(WORDPRESS_API_URL, query, { slug })
    
    if (data?.post) {
      console.log(`✅ getPostBySlug: Post "${slug}" caricato con successo`)
      return data.post
    }
    
    console.warn(`⚠️ getPostBySlug: Post "${slug}" non trovato`)
    return null
  } catch (error) {
    console.error(`💥 getPostBySlug: Errore caricamento post "${slug}":`, error)
    return null
  }
}

export async function getRelatedPosts(categories: any[]): Promise<any[]> {
  // Se non ci sono categorie, restituisci array vuoto
  if (!categories || categories.length === 0) {
    return []
  }

  // Estrai gli ID delle categorie
  const categoryIds = categories.map(cat => cat.id || cat.databaseId).filter(Boolean)
  
  if (categoryIds.length === 0) {
    return []
  }

  // FIX: Query GraphQL corretta per WordPress con ordinamento per data
  const query = `
    query GetRelatedPosts($categoryId: ID!) {
      category(id: $categoryId) {
        posts(first: 5) {
          nodes {
            id
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  `

  try {
    // Usa solo la prima categoria per semplicità
    const variables = {
      categoryId: categoryIds[0]
    }

    console.log('🚀 getRelatedPosts: Caricando post correlati con retry logic per categoria:', categoryIds[0])
    const data = await fetchGraphQLWithRetry(WORDPRESS_API_URL, query, variables)
    
    if (data?.category?.posts?.nodes) {
      console.log('✅ getRelatedPosts: Post correlati trovati:', data.category.posts.nodes.length)
      return data.category.posts.nodes
    }
    
    console.log('⚠️ getRelatedPosts: Nessun post correlato trovato')
    return []
  } catch (error) {
    console.error('💥 getRelatedPosts: Errore caricamento post correlati:', error)
    return []
  }
}
