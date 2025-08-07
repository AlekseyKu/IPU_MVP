# 🌿 Управление ветками и защита файлов

## 📋 Структура веток:

### `main` ветка:
- Разработка и тестирование
- Frontend код
- Общие настройки

### `release` ветка:
- Production конфигурация
- Docker файлы
- Nginx конфигурация
- Скрипты деплоя

## 🛡️ Защита файлов:

### Файлы, защищенные от перезаписи:
- `docker-compose.yml`
- `deploy.sh`
- `nginx/ipu-mvp.conf`
- `nginx/setup-nginx.sh`
- `nginx/INTEGRATION.md`
- `DEPLOY.md`
- `QUICK_DEPLOY.md`
- `backend/Dockerfile`
- `backend/app/main.py`
- `bot/Dockerfile`
- `env.example`
- `frontend/next.config.mjs`

### Как работает защита:
```bash
# В .gitattributes указано:
docker-compose.yml merge=ours
# Это означает, что при конфликте всегда берется версия из release
```

## 🔄 Безопасный мерж из main в release:

### Автоматический мерж:
```bash
# В ветке release
chmod +x merge-from-main.sh
./merge-from-main.sh
```

### Ручной мерж:
```bash
# 1. Сохранить текущие изменения
git add .
git commit -m "Save release changes"

# 2. Получить обновления из main
git fetch origin main

# 3. Мерж
git merge origin/main

# 4. Восстановить защищенные файлы
git checkout HEAD -- docker-compose.yml
git checkout HEAD -- deploy.sh
# ... и так далее для всех защищенных файлов

# 5. Коммит восстановленных файлов
git add .
git commit -m "Restore release files"
```

## 📥 Клонирование для разных целей:

### Для разработки (с frontend):
```bash
git clone https://github.com/AlekseyKu/IPU_MVP.git
cd IPU_MVP
# Работа в main ветке
```

### Для сервера (без frontend):
```bash
# Автоматическое клонирование
chmod +x clone-server-only.sh
./clone-server-only.sh
cd IPU_MVP_temp

# Или ручное клонирование
git clone https://github.com/AlekseyKu/IPU_MVP.git
cd IPU_MVP
git checkout release
rm -rf frontend/
```

## 🔧 Работа с ветками:

### Создание release ветки:
```bash
git checkout main
git pull origin main
git checkout -b release
# Внести изменения для production
git add .
git commit -m "Add production configuration"
git push origin release
```

### Обновление main ветки:
```bash
git checkout main
git pull origin main
# Внести изменения
git add .
git commit -m "Update development code"
git push origin main
```

### Обновление release из main:
```bash
git checkout release
./merge-from-main.sh
git push origin release
```

## 📊 Мониторинг изменений:

### Проверка защищенных файлов:
```bash
# Посмотреть .gitattributes
cat .gitattributes

# Проверить статус файлов
git status

# Посмотреть историю изменений
git log --oneline -10
```

### Проверка различий между ветками:
```bash
# Различия между main и release
git diff main..release

# Только защищенные файлы
git diff main..release -- docker-compose.yml deploy.sh
```

## 🚨 Устранение проблем:

### Если файлы все-таки перезаписались:
```bash
# Восстановить из последнего коммита release
git checkout HEAD -- docker-compose.yml
git checkout HEAD -- deploy.sh
# ... и так далее

# Или восстановить из конкретного коммита
git checkout <commit-hash> -- docker-compose.yml
```

### Если мерж не работает:
```bash
# Отменить мерж
git merge --abort

# Начать заново
./merge-from-main.sh
```

### Если нужно принудительно обновить защищенный файл:
```bash
# Временно убрать защиту
git checkout main -- docker-compose.yml

# Внести изменения
# ...

# Вернуть защиту
git checkout HEAD -- docker-compose.yml
```

## 📝 Рекомендации:

1. **Всегда работайте в правильной ветке:**
   - `main` - для разработки
   - `release` - для production

2. **Используйте скрипты для мержа:**
   - `merge-from-main.sh` - для безопасного мержа
   - `clone-server-only.sh` - для клонирования на сервер

3. **Регулярно обновляйте ветки:**
   - `main` - после разработки
   - `release` - после мержа из main

4. **Проверяйте защищенные файлы:**
   - После каждого мержа
   - Перед деплоем

5. **Документируйте изменения:**
   - Коммиты с понятными сообщениями
   - Обновление документации 