# 🎯 Настройка системы лайков

## 📋 Что нужно сделать

### 1. Создание таблицы лайков в Supabase

Выполните SQL скрипт из файла `docs/database_likes_table.sql` в SQL Editor вашего проекта Supabase:

1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Скопируйте и выполните содержимое файла `docs/database_likes_table.sql`

### 2. Проверка RLS политик

Убедитесь, что Row Level Security включен и политики созданы корректно:

```sql
-- Проверка RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'likes';

-- Проверка политик
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'likes';
```

### 3. Тестирование API endpoints

После создания таблицы протестируйте API endpoints:

#### Поставить лайк:
```bash
curl -X POST http://localhost:3000/api/likes \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "uuid-поста",
    "post_type": "promise",
    "user_id": 123456789
  }'
```

#### Убрать лайк:
```bash
curl -X DELETE http://localhost:3000/api/likes \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": "uuid-поста",
    "post_type": "promise",
    "user_id": 123456789
  }'
```

#### Получить информацию о лайках:
```bash
curl "http://localhost:3000/api/likes?post_id=uuid-поста&post_type=promise&user_id=123456789"
```

## 🔧 Что уже реализовано

### Frontend компоненты:
- ✅ `LikeButton.tsx` - переиспользуемый компонент кнопки лайка
- ✅ `useLikes.ts` - хук для работы с лайками
- ✅ Интеграция в `PromiseView.tsx`
- ✅ Интеграция в `ChallengeView.tsx`

### API endpoints:
- ✅ `GET /api/likes` - получение информации о лайках
- ✅ `POST /api/likes` - поставить лайк
- ✅ `DELETE /api/likes` - убрать лайк

### Типы данных:
- ✅ `LikeData` - интерфейс для лайка
- ✅ `PostLikeData` - интерфейс для данных о лайках поста
- ✅ Обновлены `PostData`, `PromiseData`, `ChallengeData`

## 🚀 Real-time обновления

Система поддерживает real-time обновления через Supabase subscriptions:
- Лайки обновляются в реальном времени без перезагрузки страницы
- Подписка на изменения таблицы `likes`
- Автоматическое обновление счетчиков и состояния кнопок

## 📱 UI/UX особенности

- Кнопка лайка с иконкой сердца
- Заполненное сердце для лайкнутых постов
- Счетчик лайков рядом с кнопкой
- Анимация при наведении и клике
- Предотвращение всплытия событий (stopPropagation)

## 🔒 Безопасность

- RLS политики для контроля доступа
- Проверка существования лайка перед созданием
- Валидация типов постов (promise/challenge)
- Защита от дублирования лайков

## 🧪 Тестирование

После настройки протестируйте:

1. **Постановка лайка** - клик на пустое сердце
2. **Убирание лайка** - клик на заполненное сердце
3. **Real-time обновления** - откройте пост в двух вкладках
4. **Счетчик лайков** - проверьте корректность отображения
5. **Работа на всех страницах** - list, profile, user

## 📝 Примечания

- Лайки работают только для аутентифицированных пользователей
- Один пользователь может поставить только один лайк на пост
- При удалении поста все связанные лайки удаляются автоматически (CASCADE)
- Система поддерживает как обещания, так и челленджи 