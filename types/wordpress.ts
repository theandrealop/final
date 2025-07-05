export interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: any[]
  categories: number[]
  tags: number[]
  acf?: Record<string, any> // Advanced Custom Fields support
  _embedded?: {
    author?: Array<{
      id: number
      name: string
      url: string
      description: string
      link: string
      slug: string
      avatar_urls: {
        [key: string]: string
      }
    }>
    "wp:featuredmedia"?: Array<{
      id: number
      date: string
      slug: string
      type: string
      link: string
      title: {
        rendered: string
      }
      author: number
      caption: {
        rendered: string
      }
      alt_text: string
      media_type: string
      mime_type: string
      media_details: {
        width: number
        height: number
        file: string
        sizes: {
          [key: string]: {
            file: string
            width: number
            height: number
            mime_type: string
            source_url: string
          }
        }
      }
      source_url: string
    }>
    "wp:term"?: Array<
      Array<{
        id: number
        link: string
        name: string
        slug: string
        taxonomy: string
      }>
    >
  }
}

export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string // Full HTML content
  slug: string
  link: string
  date: string
  modified: string
  author: {
    id: number
    name: string
    avatar: string
    description: string
  }
  featuredImage: {
    url: string
    alt: string
    width: number
    height: number
  } | null
  categories: string[]
  categoryIds: number[] // For related posts
  tags: string[]
  customFields: Record<string, any> // ACF support
}

export interface BlogConfig {
  apiEndpoint: string
  postsPerPage: number
  enablePagination: boolean
  enableCategoryFilter: boolean
  enableSearch?: boolean
  enableRelatedPosts?: boolean
}

export interface WordPressCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
}

export interface SearchFilters {
  category: number | null
  search: string
  page: number
}
