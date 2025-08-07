

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
Для Windows: установить visual studio build tools

cd backend
python -m venv venv

Для Windows:
venv\Scripts\activate
Для Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
deactivate

___________

cd ../bot
python -m venv venv

Для Windows:
venv\Scripts\activate
Для Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
deactivate
___________

cd ../frontend
npm install

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
  
- **Backend:**  
  ```bash
  cd backend
  venv\Scripts\activate
  uvicorn app.main:app --host 0.0.0.0 --port 8000
  ```

- **Bot:**  
  ```bash
  cd bot
  venv\Scripts\activate
  python main.py
  ```

- **Frontend:**  
  ```bash
  cd frontend
  npm run dev
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