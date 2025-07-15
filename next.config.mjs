/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pff-815f04.ingress-florina.ewp.live',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Static export optimization - HTML meta tags and client-side cache busting
  generateBuildId: async () => {
    return `cache-bust-${Date.now()}`
  },
  // Note: Headers, redirects, and middleware don't work with static export
  // Cache busting is handled via meta tags and client-side mechanisms
  // For hosting providers, configure these headers at the server level:
  // - /blog/* → Cache-Control: no-cache, no-store, must-revalidate
  // - /static/* → Cache-Control: public, max-age=31536000, immutable
}
export default nextConfig
