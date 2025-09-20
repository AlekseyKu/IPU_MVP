#!/bin/bash

# ===========================================
# IPU MVP - Deploy Script
# ===========================================

set -e  # Остановка при ошибке

echo "🚀 Начинаем деплой IPU MVP..."

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    echo "Скопируйте env.example в .env и заполните переменные"
    exit 1
fi

# Остановка существующих контейнеров
echo "📦 Останавливаем существующие контейнеры..."
docker-compose down

# Удаление старых образов (опционально)
echo "🧹 Очистка старых образов..."
docker system prune -f

# Сборка новых образов
echo "🔨 Сборка Docker образов..."
docker-compose build --no-cache

# Запуск сервисов
echo "🚀 Запуск сервисов..."
docker-compose up -d

# Ожидание запуска backend
echo "⏳ Ожидание запуска backend..."
sleep 10

# Проверка health check
echo "🏥 Проверка health check..."
for i in {1..30}; do
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Backend запущен успешно!"
        break
    fi
    echo "⏳ Ожидание... ($i/30)"
    sleep 2
done

# Настройка nginx (если запущен с правами root)
if [ "$EUID" -eq 0 ]; then
    echo "🔧 Настройка nginx..."
    cd nginx
    chmod +x setup-nginx.sh
    ./setup-nginx.sh
    cd ..
fi

# Проверка статуса контейнеров
echo "📊 Статус контейнеров:"
docker-compose ps

# Проверка логов
echo "📋 Последние логи:"
docker-compose logs --tail=20

echo "🎉 Деплой завершен!"
echo "🌐 Frontend: https://ipu-mvp.vercel.app"
echo "🔗 Backend: http://95.140.156.192"
echo "🤖 Bot: запущен в контейнере"

# Полезные команды
echo ""
echo "📝 Полезные команды:"
echo "  Просмотр логов: docker-compose logs -f"
echo "  Остановка: docker-compose down"
echo "  Перезапуск: docker-compose restart"
echo "  Обновление: ./deploy.sh" 