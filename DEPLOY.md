# 🚀 Деплой IPU MVP на VPS

## 📋 Требования

### Сервер:
- Ubuntu 20.04+ или Debian 11+
- Минимум 2GB RAM
- 20GB свободного места
- Домен (опционально, для SSL)

### Установленные компоненты:
- Docker
- Docker Compose
- Git

## 🔧 Подготовка сервера

### 1. Установка Docker:
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагрузка
sudo reboot
```

### 2. Клонирование проекта:
```bash
git clone https://github.com/your-username/IPU_MVP.git
cd IPU_MVP
```

### 3. Настройка переменных окружения:
```bash
# Копирование примера
cp env.example .env

# Редактирование .env файла
nano .env
```

## ⚙️ Конфигурация

### 1. Заполните .env файл:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ipu_db

# Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here

# Environment
ENV=production

# Frontend URL
FRONTEND_PROD_URL=https://ipu-mvp.vercel.app

# Logging
LOG_LEVEL=INFO
```

### 2. Настройка домена (опционально):
```bash
# Если у вас есть домен, настройте DNS записи
# A запись: ваш-домен.com → 95.140.156.192
# CNAME запись: api.ваш-домен.com → ваш-домен.com

# Backend будет доступен по адресу:
# http://95.140.156.192
```

## 🚀 Деплой

### 1. Запуск деплоя:
```bash
# Сделать скрипт исполняемым
chmod +x deploy.sh

# Запуск деплоя
./deploy.sh
```

### 2. Проверка статуса:
```bash
# Статус контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Проверка health check
curl http://localhost:8000/health
```

## 🔍 Мониторинг

### Полезные команды:
```bash
# Просмотр логов всех сервисов
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f bot
docker-compose logs -f nginx

# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Вход в контейнер
docker-compose exec backend bash
docker-compose exec bot bash
```

## 🔧 Обновление

### 1. Обновление кода:
```bash
# Получение обновлений
git pull origin main

# Перезапуск с новым кодом
./deploy.sh
```

### 2. Обновление конфигурации:
```bash
# Перезагрузка nginx
docker-compose restart nginx

# Проверка конфигурации
docker exec ipu_nginx nginx -t
```

## 🛠️ Устранение неполадок

### Проблемы с контейнерами:
```bash
# Перезапуск всех сервисов
docker-compose restart

# Пересборка образов
docker-compose build --no-cache

# Очистка Docker
docker system prune -f
```

### Проблемы с nginx:
```bash
# Проверка nginx конфигурации
docker exec ipu_nginx nginx -t

# Перезагрузка nginx
docker exec ipu_nginx nginx -s reload

# Просмотр логов nginx
docker-compose logs nginx
```

### Проблемы с ботом:
```bash
# Проверка токена
docker-compose logs bot

# Перезапуск бота
docker-compose restart bot
```

## 📊 Структура проекта

```
IPU_MVP/
├── backend/           # FastAPI приложение
├── bot/              # Telegram бот
├── frontend/         # Next.js приложение (на Vercel)
├── nginx/            # Nginx конфигурация
│   ├── ipu-mvp.conf
│   ├── setup-nginx.sh
│   └── INTEGRATION.md
├── docker-compose.yml
├── deploy.sh
├── env.example
└── DEPLOY.md
```

## 🔐 Безопасность

### Рекомендации:
1. Используйте сильные пароли
2. Регулярно обновляйте SSL сертификаты
3. Мониторьте логи на подозрительную активность
4. Используйте firewall (ufw)
5. Регулярно обновляйте систему

### Firewall настройка:
```bash
# Установка ufw
sudo apt install ufw

# Настройка правил
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw enable
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs`
2. Проверьте статус: `docker-compose ps`
3. Проверьте health check: `curl http://localhost:8000/health`
4. Создайте issue в репозитории 