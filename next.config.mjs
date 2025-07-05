/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // output: 'export', // <- Rimuovi questa riga
  trailingSlash: true,
  images: {
    // unoptimized: true, // <- Rimuovi anche questa se rimuovi output: export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pff-815f04.ingress-florina.ewp.live',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

export default nextConfig
