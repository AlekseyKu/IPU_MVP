# 🚀 Быстрый деплой IPU MVP на VPS

## 📍 Сервер: 95.140.156.192

## ⚡ Быстрые команды:

### 1. Подключение к серверу:
```bash
ssh root@95.140.156.192
```

### 2. Установка Docker (если не установлен):
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo reboot
```

### 3. Клонирование проекта (без frontend):
```bash
# Вариант 1: Полное клонирование
git clone https://github.com/AlekseyKu/IPU_MVP.git
cd IPU_MVP
git checkout release

# Вариант 2: Только для сервера (без frontend)
chmod +x clone-server-only.sh
./clone-server-only.sh
cd IPU_MVP_temp
```

### 4. Настройка переменных:
```bash
# Скопируйте ваш .env файл в корень проекта
# или создайте из примера:
cp env.example .env
nano .env
```

### 5. Запуск деплоя:
```bash
chmod +x deploy.sh
sudo ./deploy.sh  # sudo нужен для настройки nginx
```

## 🔧 Настройка .env файла:

```env
# Обязательные переменные:
DATABASE_URL=postgresql://username:password@localhost:5432/ipu_db
BOT_TOKEN=your_telegram_bot_token_here
ENV=production
FRONTEND_PROD_URL=https://ipu-mvp.vercel.app
BACKEND_URL=http://95.140.156.192
LOG_LEVEL=INFO
```

## ✅ Проверка работы:

```bash
# Статус контейнеров
docker-compose ps

# Проверка API
curl http://95.140.156.192/health

# Логи backend
docker-compose logs -f backend

# Логи nginx
tail -f /var/log/nginx/ipu-mvp-access.log
```

## 🌐 Доступные URL:

- **Frontend**: https://ipu-mvp.vercel.app
- **Backend API**: http://95.140.156.192
- **Health Check**: http://95.140.156.192/health

## 🛠️ Управление:

```bash
# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Обновление
git pull && ./deploy.sh

# Логи
docker-compose logs -f backend
docker-compose logs -f bot
tail -f /var/log/nginx/ipu-mvp-access.log
```

## 📞 Проблемы:

1. **Порт 80 занят**: `sudo lsof -i :80`
2. **Docker не запущен**: `sudo systemctl start docker`
3. **Нет прав**: `sudo usermod -aG docker $USER`
4. **Firewall**: `sudo ufw allow 80`

## 🔐 Безопасность:

```bash
# Firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw enable

# Обновление системы
sudo apt update && sudo apt upgrade -y
``` 