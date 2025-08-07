// Простая конфигурация для MVP
export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];

// Простая функция для получения переводов
export function getMessages(locale: Locale) {
  switch (locale) {
    case 'ru':
      return require('./locales/ru').ru;
    case 'en':
      return require('./locales/en').en;
    default:
      return require('./locales/ru').ru;
  }
} 