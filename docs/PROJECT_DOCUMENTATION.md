# Документация проекта IPU_MVP

## 📋 Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Архитектура](#архитектура)
3. [Установка и настройка](#установка-и-настройка)
4. [Работа с Git](#работа-с-git)
5. [Разработка](#разработка)
6. [API и база данных](#api-и-база-данных)
7. [Тестирование](#тестирование)
8. [Деплой](#деплой)
9. [Полезные команды](#полезные-команды)

---

## 🎯 Обзор проекта

**IPU_MVP** — социальная платформа для создания и выполнения челленджей, публичных обещаний и отслеживания прогресса.

### Основные возможности:
- ✅ Создание и управление челленджами и обещаниями
- 📸 Загрузка фото/видео к отчетам
- 👥 Подписки на пользователей и челленджи
- 🏆 Система кармы и достижений
- 🔔 Realtime-уведомления
- 🤖 Интеграция с Telegram-ботом
- 🌐 Мультиязычность (i18n)

### Текущая версия: v0.2.8

---

## 🏗️ Архитектура

### Технологический стек

| Компонент | Технологии |
|-----------|------------|
| **Frontend** | Next.js 14, React, TypeScript, Bootstrap 5, Supabase Client |
| **Backend** | FastAPI, Alembic, PostgreSQL |
| **База данных** | Supabase (PostgreSQL) |
| **Бот** | Python, python-telegram-bot |
| **Хостинг** | Vercel (frontend), Supabase (backend) |

### Структура проекта

```
IPU_MVP/
├── frontend/                 # Next.js приложение
│   ├── src/
│   │   ├── app/             # App Router (Next.js 14)
│   │   │   ├── api/         # API роуты
│   │   │   ├── user/        # Страницы пользователей
│   │   │   └── layout.tsx   # Корневой layout
│   │   ├── components/      # React компоненты
│   │   ├── hooks/          # Кастомные хуки
│   │   ├── lib/            # Утилиты и конфигурация
│   │   ├── types.ts        # TypeScript типы
│   │   └── utils/          # Вспомогательные функции
│   ├── public/             # Статические файлы
│   └── package.json
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── routers/        # API роуты
│   │   ├── schemas/        # Pydantic схемы
│   │   └── services/       # Бизнес-логика
│   └── requirements.txt
├── bot/                     # Telegram бот
│   ├── handlers/           # Обработчики команд
│   ├── keyboards/          # Клавиатуры
│   └── services/           # Сервисы бота
└── docs/                    # Документация
```

---

## ⚙️ Установка и настройка

### Предварительные требования

- Node.js 18+ 
- Python 3.8+
- Git
- ngrok (для разработки)

### 1. Клонирование репозитория

```bash
git clone https://github.com/AlekseyKu/IPU_MVP
cd IPU_MVP
```

### 2. Настройка переменных окружения

Создайте файлы `.env` в следующих директориях:

#### frontend/.env.local
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### backend/.env
```env
DATABASE_URL=postgresql+asyncpg://postgres:[YOUR-PASSWORD]@apyhfnjdkqjjgqwacjzn:6543/postgres
BOT_TOKEN=your_bot_token_here
API_URL=http://localhost:8000
ENV=dev
FRONTEND_DEV_URL=http://localhost:3000
```

#### bot/.env
```env
BOT_TOKEN=your_bot_token_here
API_URL=http://localhost:8000
ENV=dev
FRONTEND_DEV_URL=http://localhost:3000
```

### 3. Установка зависимостей

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
python -m venv venv
# Windows:
venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt

# Bot
cd ../bot
python -m venv venv
# Windows:
venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Настройка ngrok (для разработки)

```bash
cd frontend
./ngrok.exe http 3000
```

Скопируйте полученный URL и обновите:
- `bot/.env` → `FRONTEND_DEV_URL`
- `frontend/next.config.mjs` → `allowedDevOrigins`

---

## 🔄 Работа с Git

### Основные правила

1. **Никогда не работайте в `main` ветке напрямую**
2. **Создавайте feature-ветки для каждой задачи**
3. **Используйте Pull Requests для слияния**
4. **Регулярно обновляйте main**

### Workflow

#### 1. Начало работы над задачей

```bash
# Обновить main
git checkout main
git pull origin main

# Создать feature-ветку
git checkout -b feature/название-задачи
```

#### 2. Во время разработки

```bash
# Регулярные коммиты
git add .
git commit -m "feat: добавить валидацию формы"

# Периодический push
git push origin feature/название-задачи
```

#### 3. Завершение задачи

```bash
# Обновить main
git checkout main
git pull origin main

# Перебазировать feature-ветку
git checkout feature/название-задачи
git rebase main

# Создать Pull Request в GitHub
```

### Соглашения по именованию

#### Ветки
```
feature/user-profile-page
fix/login-validation-error
hotfix/critical-security-patch
refactor/database-connection
```

#### Коммиты
```
feat: добавить новую функциональность
fix: исправить баг
docs: обновить документацию
style: форматирование кода
refactor: рефакторинг без изменения функциональности
test: добавить тесты
```

### Разрешение конфликтов

1. **Не паникуйте** - конфликты это нормально
2. **Обсудите с коллегой** - кто какие изменения делал
3. **Решите конфликт вместе** - это поможет избежать потери кода
4. **Протестируйте** - убедитесь что всё работает после разрешения

---

## 💻 Разработка

### Запуск в режиме разработки

#### Способ 1: Отдельные терминалы

```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Terminal 3: Bot
cd bot
python main.py
```

#### Способ 2: Concurrent (рекомендуется)

```bash
# Установить concurrently
cd frontend
npm install --save-dev concurrently

# Запустить все сервисы
npm start
```

### Структура компонентов

#### Frontend компоненты

```
src/components/
├── ChallengeView.tsx        # Отображение челленджа
├── PromiseView.tsx          # Отображение обещания
├── modals/                  # Модальные окна
│   ├── CreatepostModal.tsx
│   ├── PromiseCompleteModal.tsx
│   └── ChallengeCheckModal.tsx
└── ProfilecardThree.tsx     # Карточка профиля
```

#### API роуты

```
src/app/api/
├── challenges/              # API челленджей
├── promises/               # API обещаний
├── karma/                  # API кармы
├── users/                  # API пользователей
└── upload/                 # Загрузка файлов
```

### Добавление новой функциональности

1. **Создайте feature-ветку**
2. **Добавьте типы** в `src/types.ts`
3. **Создайте API роут** в `src/app/api/`
4. **Создайте компонент** в `src/components/`
5. **Добавьте хук** в `src/hooks/` (если нужно)
6. **Протестируйте**
7. **Создайте Pull Request**

### Стилизация

Проект использует **Bootstrap 5** + **SCSS**. 

```scss
// Пример кастомного стиля
.custom-component {
  @extend .btn;
  @extend .btn-primary;
  
  &:hover {
    background-color: darken($primary, 10%);
  }
}
```

---

## 🗄️ API и база данных

### Основные таблицы

#### `users` - Пользователи
```sql
telegram_id INTEGER PRIMARY KEY
username TEXT
first_name TEXT
last_name TEXT
avatar_img_url TEXT
hero_img_url TEXT
about TEXT
address TEXT
subscribers INTEGER DEFAULT 0
promises INTEGER DEFAULT 0
promises_done INTEGER DEFAULT 0
challenges INTEGER DEFAULT 0
challenges_done INTEGER DEFAULT 0
karma_points INTEGER DEFAULT 0
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `promises` - Обещания
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id INTEGER REFERENCES users(telegram_id)
title TEXT NOT NULL
content TEXT
deadline TIMESTAMPTZ
media_url TEXT
is_completed BOOLEAN DEFAULT FALSE
is_public BOOLEAN DEFAULT TRUE
hashtags TEXT[]
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `challenges` - Челленджи
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id INTEGER REFERENCES users(telegram_id)
title TEXT NOT NULL
content TEXT
start_date TIMESTAMPTZ
end_date TIMESTAMPTZ
period_type TEXT -- daily, weekly, monthly
completed_reports INTEGER DEFAULT 0
is_completed BOOLEAN DEFAULT FALSE
is_public BOOLEAN DEFAULT TRUE
hashtags TEXT[]
created_at TIMESTAMPTZ DEFAULT NOW()
```

### API эндпоинты

#### Челленджи
```
GET    /api/challenges           # Получить все челленджи
POST   /api/challenges           # Создать челлендж
PUT    /api/challenges/[id]      # Обновить челлендж
DELETE /api/challenges/[id]      # Удалить челлендж
POST   /api/challenges/[id]/start    # Начать челлендж
POST   /api/challenges/[id]/check    # Чек дня
POST   /api/challenges/[id]/finish   # Завершить челлендж
```

#### Обещания
```
GET    /api/promises             # Получить все обещания
POST   /api/promises             # Создать обещание
PUT    /api/promises/[id]        # Обновить обещание
DELETE /api/promises/[id]        # Удалить обещание
POST   /api/promises/[id]/complete # Завершить обещание
```

### Supabase интеграция

```typescript
// Пример использования Supabase
import { supabase } from '@/lib/supabaseClient'

const { data, error } = await supabase
  .from('promises')
  .select('*')
  .eq('user_id', telegramId)
```

---

## 🧪 Тестирование

### Frontend тесты

```bash
# Запуск тестов
npm test

# Запуск тестов в watch режиме
npm run test:watch

# Покрытие кода
npm run test:coverage
```

### Backend тесты

```bash
cd backend
pytest
```

### E2E тесты

```bash
# Установка Playwright
npm install -D @playwright/test

# Запуск тестов
npx playwright test
```

---

## 🚀 Деплой

### Frontend (Vercel)

1. **Подключите репозиторий к Vercel**
2. **Настройте переменные окружения**
3. **Автоматический деплой при push в main**

### Backend (Supabase)

```bash
# Миграции
cd backend
alembic upgrade head

# Деплой
supabase deploy
```

### Bot

```bash
# Деплой на сервер
cd bot
python main.py
```

---

## 🛠️ Полезные команды

### Git команды

```bash
# Создать feature-ветку
git checkout -b feature/название

# Посмотреть статус
git status

# Посмотреть историю
git log --oneline

# Отменить последний коммит
git reset --soft HEAD~1

# Синхронизировать с удаленным репозиторием
git fetch origin
git rebase origin/main
```

### NPM команды

```bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run dev

# Сборка для продакшена
npm run build

# Линтинг
npm run lint

# Форматирование кода
npm run format
```

### Python команды

```bash
# Активация виртуального окружения
# Windows:
venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
uvicorn app.main:app --reload
```

### База данных

```bash
# Создание миграции
alembic revision --autogenerate -m "описание изменений"

# Применение миграций
alembic upgrade head

# Откат миграции
alembic downgrade -1
```

---

## 📞 Контакты и поддержка

- **Telegram:** @AlekseyOp
- **GitHub Issues:** Для багов и предложений
- **Discord/Slack:** Для командной коммуникации

---

## 📝 TODO и планы

### Краткосрочные планы
- [ ] Внедрение i18n и локализации (En)
- [ ] Расширение возможностей Telegram-бота
- [ ] Улучшение realtime и оптимистичных обновлений
- [ ] Добавление unit- и e2e-тестов

### Долгосрочные планы
- [ ] Улучшение UI/UX
- [ ] Мобильное приложение
- [ ] Интеграция с социальными сетями
- [ ] Система достижений и бейджей

---

**Удачной разработки! 🚀** 