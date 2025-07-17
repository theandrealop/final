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
  // Ottimizzazioni per build stabile e cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  
  // Configurazioni per migliorare il build process
  experimental: {
    // Cache ottimizzata per fetch durante build
    fetchCache: 'default-cache',
    staleTimes: {
      dynamic: 60, // 1 minuto per contenuto dinamico
      static: 300, // 5 minuti per contenuto statico
    },
    // Preload più aggressivo per build
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  
  // Configurazioni per deployment su Kinsta
  env: {
    // Variabili per identificare il build environment
    NEXT_BUILD_TIME: new Date().toISOString(),
    NEXT_DEPLOYMENT_TARGET: 'kinsta',
  },
  
  // Headers per cache busting (nota: non funzionano con static export)
  // Configurare questi headers a livello server su Kinsta:
  // - /blog/* → Cache-Control: no-cache, no-store, must-revalidate
  // - /_next/static/* → Cache-Control: public, max-age=31536000, immutable
  // - /api/* → Cache-Control: no-cache, no-store, must-revalidate
  
  // Ottimizzazioni per build time
  swcMinify: true,
  compress: true,
  
  // Gestione errori durante build
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minuto
    pagesBufferLength: 5,
  },
}
export default nextConfig
