#!/bin/bash

# ===========================================
# Безопасный мерж из main в release
# ===========================================

echo "🔄 Безопасный мерж из main в release..."

# Проверка текущей ветки
current_branch=$(git branch --show-current)
if [ "$current_branch" != "release" ]; then
    echo "❌ Вы должны быть в ветке release!"
    echo "Текущая ветка: $current_branch"
    exit 1
fi

# Сохранение текущих изменений
echo "💾 Сохранение текущих изменений..."
git add .
git commit -m "Save current release changes before merge" || true

# Получение обновлений из main
echo "📥 Получение обновлений из main..."
git fetch origin main

# Мерж из main
echo "🔀 Мерж из main..."
git merge origin/main --no-edit

# Восстановление защищенных файлов
echo "🛡️ Восстановление защищенных файлов..."
git checkout HEAD -- docker-compose.yml
git checkout HEAD -- deploy.sh
git checkout HEAD -- nginx/ipu-mvp.conf
git checkout HEAD -- nginx/setup-nginx.sh
git checkout HEAD -- nginx/INTEGRATION.md
git checkout HEAD -- DEPLOY.md
git checkout HEAD -- QUICK_DEPLOY.md
git checkout HEAD -- backend/Dockerfile
git checkout HEAD -- backend/app/main.py
git checkout HEAD -- bot/Dockerfile
git checkout HEAD -- env.example
git checkout HEAD -- frontend/next.config.mjs

# Коммит восстановленных файлов
echo "💾 Коммит восстановленных файлов..."
git add .
git commit -m "Restore release-specific files after merge from main"

echo "✅ Мерж завершен успешно!"
echo "📋 Защищенные файлы сохранены:"
echo "   - docker-compose.yml"
echo "   - deploy.sh"
echo "   - nginx/*"
echo "   - DEPLOY.md"
echo "   - QUICK_DEPLOY.md"
echo "   - backend/Dockerfile"
echo "   - bot/Dockerfile"
echo "   - env.example"
echo "   - frontend/next.config.mjs" 