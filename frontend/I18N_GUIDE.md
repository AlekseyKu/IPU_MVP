# 🌐 Руководство по интернационализации (i18n)

## 🏗️ Структура файлов

```
src/
├── i18n.ts                    # Конфигурация переводов
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

import { useLanguage } from '@/context/LanguageContext';

export default function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      {/* "Добро пожаловать" */}
      <h1>{t('onboarding.welcome.title')}</h1>
      
      {/* "Начать" */}
      <button>{t('onboarding.welcome.startButton')}</button>
    </div>
  );
}
```

### 2. Комментарии для поиска:

```tsx
// ✅ Правильно - с комментарием для поиска
{/* "Добро пожаловать" */}
<h1>{t('onboarding.welcome.title')}</h1>

// ✅ Правильно - для строковых литералов
{/* "Загрузка..." */}
<span>Загрузка...</span>
```

### 3. Переключение языка:

```tsx
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const { language } = useLanguage();
  
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
3. Или ищите комментарии: `/* "Текст" */`

### В терминале:
```bash
# Поиск в комментариях
grep -r "/* \".*\"" src/

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
const { t } = useLanguage();

{/* "Новый заголовок" */}
<h1>{t('newSection.title')}</h1>
```

## 🌍 Поддерживаемые локали

- `ru` - Русский (по умолчанию)
- `en` - Английский

## 🔧 Как это работает

### Контекст языка (LanguageContext.tsx):
- Управляет состоянием языка (ru/en)
- Сохраняет выбор в localStorage
- Предоставляет функцию `t()` для переводов
- Автоматически загружает сохраненный язык при инициализации

### Функция переводов:
```typescript
// Поддерживает глубокую вложенность ключей
t('onboarding.welcome.title') // "Добро пожаловать"
t('common.loading') // "Загрузка..."
```

## ⚠️ Важные моменты

1. **Всегда добавляйте комментарии** для поиска русских текстов
2. **Используйте структурированные ключи** для организации переводов
3. **Проверяйте оба языка** при разработке
4. **Не забывайте про контекст** - некоторые переводы могут зависеть от контекста
5. **Простая и эффективная реализация** - без лишних зависимостей 