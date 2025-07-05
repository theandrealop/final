// Legacy WordPress REST API - kept for backward compatibility
// This file is deprecated - use lib/graphql-api.ts for new implementations

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || "https://your-wordpress-site.com/wp-json/wp/v2"

export interface WordPressPost {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  slug: string
  featured_media?: number
  author: number
  categories: number[]
  tags: number[]
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
    author?: Array<{
      name: string
      avatar_urls: { [key: string]: string }
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        name: string
        slug: string
      }>
    >
  }
}

export interface WordPressCategory {
  id: number
  name: string
  slug: string
  count: number
}

export interface BlogConfig {
  apiEndpoint?: string // Legacy support
  baseUrl?: string // New preferred property
  postsPerPage?: number
  enablePagination?: boolean
  enableCategoryFilter?: boolean
}

// Helper to get the base URL from config
function getBaseUrl(config: BlogConfig): string {
  return config.baseUrl || config.apiEndpoint || WORDPRESS_API_URL
}

export async function fetchWordPressPosts(
  config: BlogConfig,
  page = 1,
  categoryId?: number,
  searchTerm?: string,
): Promise<{ posts: WordPressPost[]; totalPages: number; totalPosts: number }> {
  try {
    const baseUrl = getBaseUrl(config)
    const perPage = config.postsPerPage || 10

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      _embed: "true",
    })

    if (categoryId) {
      params.append("categories", categoryId.toString())
    }

    if (searchTerm) {
      params.append("search", searchTerm)
    }

    const response = await fetch(`${baseUrl}/posts?${params}`)

    if (!response.ok) {
      console.warn(`WordPress API returned ${response.status}`)
      return { posts: [], totalPages: 0, totalPosts: 0 }
    }

    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      console.warn("WordPress API returned non-JSON response")
      return { posts: [], totalPages: 0, totalPosts: 0 }
    }

    const posts = await response.json()
    const totalPosts = Number.parseInt(response.headers.get("X-WP-Total") || "0")
    const totalPages = Number.parseInt(response.headers.get("X-WP-TotalPages") || "0")

    return { posts, totalPages, totalPosts }
  } catch (error) {
    console.warn("fetchWordPressPosts error:", error)
    return { posts: [], totalPages: 0, totalPosts: 0 }
  }
}

export async function fetchWordPressPost(config: BlogConfig, slug: string): Promise<WordPressPost | null> {
  try {
    const baseUrl = getBaseUrl(config)
    const response = await fetch(`${baseUrl}/posts?slug=${slug}&_embed=true`)

    if (!response.ok) {
      return null
    }

    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      return null
    }

    const posts = await response.json()
    return posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.warn("fetchWordPressPost error:", error)
    return null
  }
}

export async function fetchWordPressCategories(config: BlogConfig): Promise<WordPressCategory[]> {
  try {
    const baseUrl = getBaseUrl(config)
    const response = await fetch(`${baseUrl}/categories?per_page=100`)

    if (!response.ok) {
      return []
    }

    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      return []
    }

    return await response.json()
  } catch (error) {
    console.warn("fetchWordPressCategories error:", error)
    return []
  }
}

export async function fetchRelatedPosts(
  config: BlogConfig,
  categoryIds: number[],
  excludeId: number,
  limit = 3,
): Promise<WordPressPost[]> {
  try {
    const baseUrl = getBaseUrl(config)
    const params = new URLSearchParams({
      categories: categoryIds.join(","),
      exclude: excludeId.toString(),
      per_page: limit.toString(),
      _embed: "true",
    })

    const response = await fetch(`${baseUrl}/posts?${params}`)

    if (!response.ok) {
      return []
    }

    const contentType = response.headers.get("content-type")
    if (!contentType?.includes("application/json")) {
      return []
    }

    return await response.json()
  } catch (error) {
    console.warn("fetchRelatedPosts error:", error)
    return []
  }
}
