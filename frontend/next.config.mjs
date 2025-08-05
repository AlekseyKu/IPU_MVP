/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['src/styles', 'public/assets/scss'],
    logger: {
      warn: () => {},
      debug: () => {},
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'ipu-mvp.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'www.ipu-mvp.vercel.app',
      },
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://ipu-mvp.vercel.app'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          }
        ],
      },
    ]
  },
  
  allowedDevOrigins: [
    'https://ipu-mvp.vercel.app',
    'https://www.ipu-mvp.vercel.app',
    '*.local-origin.dev'
  ],
  
  // PROD оптимизации
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Оптимизация для Vercel
  experimental: {
    optimizeCss: true,
  },
  
  // Кэширование статических ресурсов
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/_next/static/:path*',
      },
    ]
  },
  
  // Настройки для обработки ошибок
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
}

export default nextConfig