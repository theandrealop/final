/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
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
    ],
  },
  // Rimuovi la sezione headers() perché non funziona con export
}
export default nextConfig
