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
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: "default-src 'self'  https://9e0ac82e9a65.ngrok-free.app 'unsafe-eval' 'unsafe-inline'; font-src 'self'  https://9e0ac82e9a65.ngrok-free.app data:;",          },
        ],
      },
    ]
  },
  allowedDevOrigins: [' https://9e0ac82e9a65.ngrok-free.app', '*.local-origin.dev'],
}

export default nextConfig