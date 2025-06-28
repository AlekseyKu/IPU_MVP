// next.config.mjs
export default {
  sassOptions: {
    includePaths: ['src/styles', 'public/assets/scss'], // Убедимся, что пути корректны
  },
  images: {
    domains: ['fonts.googleapis.com', 'assets/images'],
  },
};