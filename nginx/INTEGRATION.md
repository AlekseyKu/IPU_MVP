# 🔧 Интеграция с существующим Nginx

## 📋 Текущая архитектура:

### Существующий nginx на хосте:
- Основной конфиг: `/etc/nginx/nginx.conf`
- Сайты: `/etc/nginx/sites-available/` и `/etc/nginx/sites-enabled/`
- Логи: `/var/log/nginx/`

### IPU MVP конфигурация:
- Файл: `nginx/ipu-mvp.conf`
- Размещение: `/etc/nginx/sites-available/ipu-mvp`
- Активация: симлинк в `/etc/nginx/sites-enabled/`

## 🚀 Процесс интеграции:

### 1. Автоматическая настройка (рекомендуется):
```bash
# Запуск с правами root
sudo ./deploy.sh
```

### 2. Ручная настройка:
```bash
# Копирование конфигурации
sudo cp nginx/ipu-mvp.conf /etc/nginx/sites-available/ipu-mvp

# Активация сайта
sudo ln -sf /etc/nginx/sites-available/ipu-mvp /etc/nginx/sites-enabled/

# Проверка конфигурации
sudo nginx -t

# Перезагрузка nginx
sudo systemctl reload nginx
```

## 🔍 Проверка интеграции:

### 1. Проверка конфигурации:
```bash
# Проверка синтаксиса
sudo nginx -t

# Проверка активных сайтов
ls -la /etc/nginx/sites-enabled/

# Проверка статуса nginx
sudo systemctl status nginx
```

### 2. Проверка доступности:
```bash
# Проверка API
curl http://95.140.156.192/health

# Проверка CORS
curl -H "Origin: https://ipu-mvp.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://95.140.156.192/
```

## 📊 Логирование:

### IPU MVP логи:
```bash
# Access лог
tail -f /var/log/nginx/ipu-mvp-access.log

# Error лог
tail -f /var/log/nginx/ipu-mvp-error.log
```

### Общие логи nginx:
```bash
# Основной access лог
tail -f /var/log/nginx/access.log

# Основной error лог
tail -f /var/log/nginx/error.log
```

## 🛠️ Управление:

### Перезагрузка nginx:
```bash
# Перезагрузка конфигурации
sudo systemctl reload nginx

# Полная перезагрузка
sudo systemctl restart nginx
```

### Отключение IPU MVP:
```bash
# Удаление симлинка
sudo rm /etc/nginx/sites-enabled/ipu-mvp

# Перезагрузка nginx
sudo systemctl reload nginx
```

### Включение IPU MVP:
```bash
# Создание симлинка
sudo ln -sf /etc/nginx/sites-available/ipu-mvp /etc/nginx/sites-enabled/

# Перезагрузка nginx
sudo systemctl reload nginx
```

## 🔐 Безопасность:

### Проверка конфигурации:
```bash
# Проверка синтаксиса
sudo nginx -t

# Проверка конфигурации в тестовом режиме
sudo nginx -T | grep ipu-mvp
```

### Firewall:
```bash
# Проверка открытых портов
sudo netstat -tlnp | grep :80

# Настройка firewall (если нужно)
sudo ufw allow 80
```

## 📞 Устранение неполадок:

### Проблемы с nginx:
```bash
# Проверка статуса
sudo systemctl status nginx

# Просмотр ошибок
sudo journalctl -u nginx -f

# Проверка конфигурации
sudo nginx -t
```

### Проблемы с конфигурацией:
```bash
# Проверка синтаксиса
sudo nginx -t

# Просмотр полной конфигурации
sudo nginx -T
```

### Проблемы с доступностью:
```bash
# Проверка портов
sudo netstat -tlnp | grep :80

# Проверка процессов
ps aux | grep nginx

# Проверка логов
tail -f /var/log/nginx/error.log
``` 