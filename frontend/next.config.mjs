/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['src/styles', 'public/assets/scss'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Используйте конкретный домен ngrok для продакшена
          },
        ],
      },
    ]
  },
  allowedDevOrigins: ['https://6c9a-2a09-bac1-7aa0-10-00-1f1-1b8.ngrok-free.app', '*.local-origin.dev'],
}

export default nextConfig