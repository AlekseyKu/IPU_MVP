# 🌐 Руководство по интернационализации (i18n)

## 📦 Установленные пакеты
- `next-intl` - библиотека для интернационализации

## 🏗️ Структура файлов

```
src/
├── i18n.ts                    # Конфигурация next-intl
├── middleware.ts              # Middleware для обработки локалей
├── context/
│   └── LanguageContext.tsx   # Контекст для управления языком
├── components/
│   └── LanguageSwitcher.tsx  # Компонент переключения языка
└── locales/
    ├── ru.ts                 # Русские переводы
    └── en.ts                 # Английские переводы
```

## 🎯 Как использовать

### 1. В компонентах с переводом:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  
  return (
    <div>
      {/* "Добро пожаловать" */}
      <h1>{t('welcome.title')}</h1>
      
      {/* "Начать" */}
      <button>{t('welcome.startButton')}</button>
    </div>
  );
}
```

### 2. Комментарии для поиска:

```tsx
// ✅ Правильно - с комментарием для поиска
{/* "Добро пожаловать" */}
<h1>{t('welcome.title')}</h1>

// ✅ Правильно - для строковых литералов
{/* "Загрузка..." */}
<span>Загрузка...</span>
```

### 3. Переключение языка:

```tsx
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const { locale } = useLanguage();
  
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## 🔍 Поиск текстов

### В VS Code:
1. `Ctrl+Shift+F` 
2. Введите русский текст в кавычках: `"Добро пожаловать"`
3. Или ищите комментарии: `Поиск:`

### В терминале:
```bash
# Поиск в комментариях
grep -r "Поиск:" src/

# Поиск в строках
grep -r '"Текст"' src/
```

## 📝 Добавление новых переводов

1. Добавьте ключ в `src/locales/ru.ts`:
```typescript
export const ru = {
  newSection: {
    title: "Новый заголовок",
    description: "Новое описание"
  }
};
```

2. Добавьте перевод в `src/locales/en.ts`:
```typescript
export const en = {
  newSection: {
    title: "New Title",
    description: "New Description"
  }
};
```

3. Используйте в компоненте:
```tsx
const t = useTranslations('newSection');

{/* "Новый заголовок" */}
<h1>{t('title')}</h1>
```

## 🌍 Поддерживаемые локали

- `ru` - Русский (по умолчанию)
- `en` - Английский

## 🔧 Конфигурация

### next.config.mjs
```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

export default withNextIntl(nextConfig);
```

### middleware.ts
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed'
});
```

## 📱 URL структура

- `/` - Русская версия (по умолчанию)
- `/en/` - Английская версия
- `/en/profile` - Английская версия страницы профиля

## ⚠️ Важные моменты

1. **Всегда добавляйте комментарии** для поиска русских текстов
2. **Используйте namespace** для организации переводов
3. **Проверяйте оба языка** при разработке
4. **Не забывайте про контекст** - некоторые переводы могут зависеть от контекста 