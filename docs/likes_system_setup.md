# 🎯 Настройка системы лайков

## 📋 Что нужно сделать

### 1. Создание таблицы лайков в Supabase

**ВАЖНО**: Если таблица `likes` уже существует, сначала удалите её:

```sql
-- Удаляем старую таблицу (если существует)
DROP TABLE IF EXISTS likes CASCADE;
```

Затем выполните SQL скрипт из файла `docs/database_likes_table.sql` в SQL Editor вашего проекта Supabase:

1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Скопируйте и выполните содержимое файла `docs/database_likes_table.sql`

### 2. Проверка создания таблицы

Убедитесь, что таблица создана корректно:

```sql
-- Проверка существования таблицы
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'likes';

-- Проверка структуры таблицы
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'likes';

-- Проверка индексов
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'likes';

-- Проверка внешних ключей
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='likes';
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
- ✅ `POST /api/likes` - поставить лайк (с проверкой существования поста)
- ✅ `DELETE /api/likes` - убрать лайк

### Типы данных:
- ✅ `LikeData` - интерфейс для лайка
- ✅ `PostLikeData` - интерфейс для данных о лайках поста
- ✅ Обновлены `PostData`, `PromiseData`, `ChallengeData`

## 🚀 Real-time обновления

Система поддерживает real-time обновления через Supabase subscriptions:
- Лайки обновляются в реальном времени без перезагрузки страницы
- Подписка на изменения таблицы `likes` для каждого поста

## 📱 Где работает

Система лайков интегрирована в следующие страницы:
- ✅ `/list` - список всех постов
- ✅ `/user/[telegramId]` - профиль пользователя
- ✅ `/profile/[telegramId]` - профиль пользователя

## 🔒 Безопасность

Поскольку в проекте нет аутентификации:
- RLS отключен для таблицы `likes`
- Все операции доступны всем пользователям
- Валидация происходит на уровне API endpoints
- Проверка существования поста и пользователя перед созданием лайка

## 🐛 Возможные проблемы

1. **Ошибка внешнего ключа**: Убедитесь, что `user_id` существует в таблице `users`
2. **Пост не найден**: API проверяет существование поста перед созданием лайка
3. **Дублирование лайков**: Уникальный индекс предотвращает повторные лайки
4. **Real-time не работает**: Проверьте подключение к Supabase и настройки real-time

## 📝 Примечания

- Лайки сохраняются в базе данных
- Счетчики лайков обновляются в реальном времени
- Кнопка лайка показывает текущее состояние (лайкнуто/не лайкнуто)
- API проверяет существование поста и пользователя перед созданием лайка
- Внешние ключи на посты убраны для избежания конфликтов между таблицами 