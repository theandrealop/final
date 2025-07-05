import { BlogSection } from "./blog-section"

/**
 * Demo component showing different ways to use the BlogSection
 * This file demonstrates various configuration options
 */
export function BlogSectionDemo() {
  return (
    <div className="space-y-16">
      {/* Basic Usage */}
      <BlogSection
        config={{
          apiEndpoint: "https://demo.wp-api.org/wp-json/wp/v2",
          postsPerPage: 6,
        }}
        title="Latest News"
        subtitle="Stay updated with our latest announcements"
      />

      {/* With Category Filter Disabled */}
      <BlogSection
        config={{
          apiEndpoint: "https://demo.wp-api.org/wp-json/wp/v2",
          postsPerPage: 3,
          enableCategoryFilter: false,
          enablePagination: false,
        }}
        title="Featured Posts"
        subtitle="Hand-picked articles just for you"
        className="bg-muted/30"
      />

      {/* Compact Version */}
      <BlogSection
        config={{
          apiEndpoint: "https://demo.wp-api.org/wp-json/wp/v2",
          postsPerPage: 4,
          enablePagination: true,
          enableCategoryFilter: true,
        }}
        title="Quick Reads"
        subtitle="Short articles and quick tips"
      />
    </div>
  )
}
