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

  const data = await fetchGraphQL(query, { first, after })
  
  if (!data || !data.posts) {
    console.error("No posts data received")
    return {
      posts: [],
      hasNextPage: false,
      endCursor: null,
    }
  }

  // Sort posts by date (most recent first) on client side
  const posts = (data.posts.nodes || []).sort((a: BlogPost, b: BlogPost) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return {
    posts,
    hasNextPage: data.posts.pageInfo?.hasNextPage || false,
    endCursor: data.posts.pageInfo?.endCursor || null,
  }
}

async function fetchGraphQL(query: string, variables: any = {}) {
  console.log("🔍 Fetching from:", WORDPRESS_API_URL)
  
  try {
    const response = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: { revalidate: 60 }, // Cache for 1 minute
    })

    console.log("📡 Response status:", response.status)

    if (!response.ok) {
      console.error("❌ HTTP error! status:", response.status)
      // Try to get the response text to see what we received
      const text = await response.text()
      console.error("❌ Response body:", text.substring(0, 200) + "...")
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    
    // Check if response is HTML (error page) instead of JSON
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.error("❌ Received HTML instead of JSON:", text.substring(0, 200) + "...")
      throw new Error("GraphQL endpoint returned HTML instead of JSON - check your WordPress API URL")
    }

    let json
    try {
      json = JSON.parse(text)
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError)
      console.error("❌ Raw response:", text.substring(0, 200) + "...")
      throw new Error("Invalid JSON response from GraphQL endpoint")
    }
    
    console.log("📄 Response received:", json.data ? "✅ Data found" : "❌ No data")

    if (json.errors) {
      console.error("❌ GraphQL errors:", json.errors)
      throw new Error("GraphQL query failed: " + JSON.stringify(json.errors))
    }

    return json.data
  } catch (error) {
    console.error("💥 GraphQL fetch error:", error)
    throw error
  }
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
    const data = await fetchGraphQL(query, { first })
    // Sort posts by date (most recent first) on client side
    const posts = (data?.posts?.nodes || []).sort((a: BlogPost, b: BlogPost) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    return posts
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
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
    const data = await fetchGraphQL(query, { slug })
    return data?.post || null
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
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

    console.log('🔍 Fetching related posts for category:', categoryIds[0])
    const data = await fetchGraphQL(query, variables)
    
    if (data?.category?.posts?.nodes) {
      console.log('✅ Related posts found:', data.category.posts.nodes.length)
      return data.category.posts.nodes
    }
    
    console.log('❌ No related posts found')
    return []
  } catch (error) {
    console.error('💥 Error fetching related posts:', error)
    return []
  }
}