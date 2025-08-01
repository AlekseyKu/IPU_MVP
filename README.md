

```markdown
# IPU_MVP — Социальная платформа челленджей и обещаний

## Описание

**IPU_MVP** — это MVP социальной платформы, где пользователи могут создавать и выполнять челленджи, давать публичные обещания, делиться прогрессом, загружать медиаотчёты и получать поддержку от подписчиков. Проект реализован на стеке Next.js (frontend), Supabase (база данных, realtime), FastAPI (backend), Telegram-бот.

---

## Архитектура проекта

```
IPU_MVP/
  backend/      — FastAPI backend, Alembic, модели, схемы, сервисы
  bot/          — Telegram-бот, обработчики, сервисы
  frontend/     — Next.js приложение, компоненты, хуки, API-роуты
  docs/         — Документация проекта
```

- **Frontend:** Next.js, React, Supabase-js, поддержка SSR, модульная структура, SCSS, Bootstrap.
- **Backend:** FastAPI, Alembic, PostgreSQL, REST API, бизнес-логика.
- **Bot:** Telegram-бот для уведомлений и взаимодействия.
- **Supabase:** Хранение данных, realtime-обновления, хранение медиа.

---

## Основные возможности

- Создание, редактирование, удаление челленджей и обещаний
- Загрузка фото/видео к отчетам и обещаниям
- Модальные окна для выполнения и проверки задач
- Прогресс-бар и история отчетов по челленджу
- Подписки на пользователей, счётчики достижений
- Реалтайм-обновления через Supabase
- Оптимистичные обновления UI
- Поддержка i18n (интернационализация)
- Интеграция с Telegram WebApp

---

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/AlekseyKu/IPU_MVP
cd IPU_MVP
```

### 2. Настройка переменных окружения

Создайте 
`.env.local` в `frontend/`
`.env` в `backend/`
`.env` в `bot/`
Запросить env-файлы.

### 3. Установка зависимостей

```bash
cd frontend
npm install

cd ../backend
pip install -r requirements.txt

cd ../bot
pip install -r requirements.txt
```

### 4. Запуск разработки
[Подобная иструкция](README_dev_start_project.md)

- **Запуск NGROK**
  ```ngrok.exe (frontend/ngrok.exe)
  ngrok http 3000
  Установить Forwarding URL из ngrok (прим. https://xxx.ngrok-free.app):
  bot/.env > FRONTEND_DEV_URL
  frontend/next.config.mjs > allowedDevOrigins
  ```
- **Frontend:**  
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend:**  
  ```bash
  cd backend
  uvicorn app.main:app --host 0.0.0.0 --port 8000
  ```
- **Bot:**  
  ```bash
  cd bot
  python main.py
  ```

---

## Структура frontend

- `src/components/` — UI-компоненты (ChallengeView, PromiseView, модалки и др.)
- `src/hooks/` — хуки для работы с API, realtime, состоянием
- `src/app/api/` — API-роуты Next.js (promises, challenges, upload и др.)
- `src/context/` — контексты пользователя и модалок
- `src/types/` — типы и интерфейсы
- `src/lib/` — Supabase client
- `public/assets/` — изображения, стили, шрифты

---

## Документация

- [Основная документация проекта](README.md)
- [Подробная нструкция запуска проекта в dev](README_dev_start_project.md)
- [Подробная структура проекта](docs/project_structure)
- [Коммиты и TODO проекта](info)

---

## Планы

- Внедение i18n и локализации (En)
- Расширение возможностей Telegram-бота
- Улучшение realtime и оптимистичных обновлений
- Добавление unit- и e2e-тестов
- Улучшение UI/UX
- Deploy

---

## Контакты и поддержка

- Telegram @AlekseyOp

---

**Добро пожаловать в проект!**
```