Подробная нструкция по запуску проекта в dev-режиме

1. Переход в директорию проекта
   cd \IPU_MVP

2. Активация виртуальных окружений (для установки зависимостей локально. Однократно)
   - Для backend:
     cd backend
     .\venv\Scripts\Activate.ps1
   - Для bot:
     cd ..\bot
     .\venv\Scripts\Activate.ps1

3. Установка зависимостей
   - Для backend:
     cd ..\backend
     pip install -r requirements.txt
   - Для bot:
     cd ..\bot
     pip install -r requirements.txt
   - Для frontend:
     cd ..\frontend
     npm install


4. Проверка .env
   - Убедись, что файлы .env в backend и bot содержат:
     - DATABASE_URL=postgresql+asyncpg://postgres:[YOUR-PASSWORD]@apyhfnjdkqjjgqwacjzn:6543/postgres
     - BOT_TOKEN=your_bot_token_here
     - API_URL=http://localhost:8000
     - ENV=dev (или prod)
     - FRONTEND_DEV_URL=http://localhost:3000 (или FRONTEND_PROD_URL для продакшена)

5. Запуск NGROK
    - ngrok.exe (frontend/ngrok.exe)
      ngrok http 3000
      Установить Forwarding URL из ngrok (прим. https://xxx.ngrok-free.app):
        bot/.env > FRONTEND_DEV_URL
        frontend/next.config.mjs > allowedDevOrigins

6. Запуск серверов (backend, bot)
   - В новом окне PowerShell запусти FastAPI (backend):
     cd ..\backend
     uvicorn app.main:app --host 0.0.0.0 --port 8000

   - В новом окне PowerShell запусти бота (bot):
     cd ..\bot
     python main.py

7. Frontend
   - В новом окне PowerShell запусти клиентскую часть:
     cd ..\frontend
     npm run dev

8. Проверка
   - Открой http://localhost:3000 для клиентской части
   - Открой http://localhost:8000/docs для API.
   - Проверь бота через Telegram с командой /start.

---
Готово! Закрой окна с Ctrl+C после работы.


### Быстрый DEV-режим (замена пунктов 6-7):

Способ 1 (3 процесса в одном теминале)
  * установить npm install --save-dev concurrently (однократно)
  - npm start

Способ 2 (3 отдельных вкладки терминала, каждая с отдельным процессом)
  * Настройки запуска .vscode\tasks.json
  - Ctrl+Shift+P → Tasks: Run Task → Run All


TODO: переписать док +активацию .venv