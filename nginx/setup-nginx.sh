#!/bin/bash

# ===========================================
# IPU MVP - Nginx Setup Script
# ===========================================

echo "🔧 Настройка Nginx для IPU MVP..."

# Проверка прав
if [ "$EUID" -ne 0 ]; then
    echo "❌ Запустите скрипт с правами root: sudo $0"
    exit 1
fi

# Копирование конфигурации
echo "📁 Копирование конфигурации nginx..."
cp ipu-mvp.conf /etc/nginx/sites-available/ipu-mvp

# Активация сайта
echo "🔗 Активация сайта..."
ln -sf /etc/nginx/sites-available/ipu-mvp /etc/nginx/sites-enabled/

# Проверка конфигурации
echo "✅ Проверка конфигурации nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "🔄 Перезагрузка nginx..."
    systemctl reload nginx
    
    echo "🎉 Nginx настроен успешно!"
    echo "📋 Конфигурация размещена в:"
    echo "   - /etc/nginx/sites-available/ipu-mvp"
    echo "   - /etc/nginx/sites-enabled/ipu-mvp"
    echo ""
    echo "🌐 API будет доступен по адресу:"
    echo "   http://95.140.156.192"
    echo ""
    echo "📝 Полезные команды:"
    echo "   - Проверка статуса: systemctl status nginx"
    echo "   - Просмотр логов: tail -f /var/log/nginx/ipu-mvp-access.log"
    echo "   - Перезагрузка: systemctl reload nginx"
else
    echo "❌ Ошибка в конфигурации nginx!"
    exit 1
fi 