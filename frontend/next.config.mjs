// next.config.mjs
export default {
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
}
