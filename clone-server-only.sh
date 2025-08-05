#!/bin/bash

# ===========================================
# Клонирование проекта без frontend для сервера
# ===========================================

REPO_URL="https://github.com/AlekseyKu/IPU_MVP.git"
TEMP_DIR="IPU_MVP_temp"

echo "🚀 Клонирование проекта без frontend..."

# Создание временной директории
echo "📁 Создание временной директории..."
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# Клонирование репозитория
echo "📥 Клонирование репозитория..."
git clone $REPO_URL .

# Переключение на ветку release
echo "🔄 Переключение на ветку release..."
git checkout release

# Удаление frontend директории
echo "🗑️ Удаление frontend директории..."
rm -rf frontend/

# Удаление ненужных файлов
echo "🧹 Очистка ненужных файлов..."
rm -f package.json package-lock.json
rm -f tsconfig.json
rm -f next.config.mjs
rm -f ngrok.exe

# Перемещение файлов в корень
echo "📦 Перемещение файлов..."
mv backend/* . 2>/dev/null || true
mv bot/* . 2>/dev/null || true
rmdir backend bot 2>/dev/null || true

# Удаление временных файлов
echo "🧹 Очистка временных файлов..."
rm -rf .git
rm -rf docs/
rm -rf backup/
rm -f README.md

# Создание .gitignore для сервера
echo "📝 Создание .gitignore..."
cat > .gitignore << EOF
# Environment files (не удаляем .env, так как он создается вручную)
.env.local
.env.production

# Logs
logs/
*.log

# Docker
.dockerignore

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF

# Создание README для сервера
echo "📝 Создание README для сервера..."
cat > README_SERVER.md << EOF
# IPU MVP - Server Version

## 📋 Что включено:

- ✅ Backend (FastAPI)
- ✅ Bot (Telegram)
- ✅ Docker конфигурация
- ✅ Nginx конфигурация
- ✅ Скрипты деплоя
- ❌ Frontend (на Vercel)

## 🚀 Быстрый запуск:

\`\`\`bash
# Настройка переменных
# Скопируйте ваш .env файл в корень проекта

# Запуск деплоя
chmod +x deploy.sh
sudo ./deploy.sh
\`\`\`

## 📁 Структура:

\`\`\`
./
├── app/              # FastAPI приложение
├── handlers/         # Telegram handlers
├── services/         # Bot services
├── keyboards/        # Bot keyboards
├── nginx/           # Nginx конфигурация
├── docker-compose.yml
├── deploy.sh
├── env.example
└── README_SERVER.md
\`\`\`

## 🌐 Доступные URL:

- **Frontend**: https://ipu-mvp.vercel.app
- **Backend API**: http://95.140.156.192
- **Health Check**: http://95.140.156.192/health
EOF

echo "✅ Клонирование завершено!"
echo "📁 Файлы готовы в директории: $TEMP_DIR"
echo ""
echo "📋 Следующие шаги:"
echo "1. cd $TEMP_DIR"
echo "2. Скопируйте ваш .env файл в корень проекта"
echo "3. sudo ./deploy.sh" 