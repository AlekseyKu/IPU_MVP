# Git Workflow для команды IPU_MVP

## 🎯 Основные принципы

### 1. Безопасность
- **Никогда не работайте в main напрямую**
- **Всегда создавайте feature-ветки**
- **Используйте Pull Requests для слияния**

### 2. Чистота истории
- **Регулярные коммиты** - не накапливайте изменения
- **Описательные сообщения** - используйте conventional commits
- **Чистая история** - избегайте merge commits

### 3. Коммуникация
- **Обсуждайте изменения** с командой
- **Уведомляйте о больших изменениях**
- **Документируйте сложные решения**

---

## 🔄 Основной Workflow

### ⚠️ Важно: Структура веток
- **main** - основная ветка для команды (защищена)
- **master** - личная ветка (не используется командой)
- **feature/*, fix/*, hotfix/*** - рабочие ветки команды

#### Настройка main ветки (для администратора):
```bash
# Создать main ветку из текущего master
git checkout -b main
git push -u origin main

# В GitHub: Settings → Branches → Default branch → main

# Удалить master из репозитория (опционально)
git push origin --delete master
```

### 1. Начало работы над задачей

```bash
# Обновить основную ветку
git checkout main 
git pull origin main

# Создать feature-ветку
git checkout -b feature/название-задачи

# Примеры названий веток:
# feature/user-profile-page
# fix/login-validation-error
# hotfix/critical-security-patch
# refactor/database-connection
```

### 2. Во время разработки

```bash
# Регулярные коммиты (минимум раз в день)
git add .
git commit -m "feat: добавить валидацию формы"

# Периодический push (чтобы не потерять работу)
git push origin feature/название-задачи

# Если нужно обновить ветку с main
git checkout main
git pull origin main
git checkout feature/название-задачи
git rebase main
```

### 3. Завершение задачи

```bash
# Убедиться что все тесты проходят, билд корректно собирается и работает
npm test                   # запустить тесты
npm run build              # собрать проект для продакшена
npm run dev                # проверить что dev сервер запускается

# Обновить основную ветку
git checkout main
git pull origin main

# Перебазировать feature-ветку
git checkout feature/название-задачи
git rebase main

# Если есть конфликты, решить их
# git add .
# git rebase --continue

# Пушить обновленную ветку
git push origin feature/название-задачи --force-with-lease

# Создать Pull Request в GitHub
```

---

## 📝 Соглашения по коммитам

### Conventional Commits

```bash
# Формат: type(scope): description

# Типы коммитов:
feat:     # новая функциональность
fix:      # исправление бага
docs:     # изменения в документации
style:    # форматирование кода (пробелы, отступы)
refactor: # рефакторинг без изменения функциональности
test:     # добавление тестов
chore:    # обновление зависимостей, конфигурации
perf:     # улучшение производительности
ci:       # изменения в CI/CD
build:    # изменения в системе сборки
```

### Примеры хороших коммитов

```bash
git commit -m "feat: добавить валидацию email в форме регистрации"
git commit -m "fix: исправить отображение видео в PromiseView"
git commit -m "docs: обновить README с инструкциями по установке"
git commit -m "refactor: вынести логику API в отдельный сервис"
git commit -m "test: добавить тесты для usePromiseApi хука"
git commit -m "style: форматировать код согласно ESLint"
git commit -m "chore: обновить зависимости до последних версий"
```

### Примеры плохих коммитов

```bash
git commit -m "fix"                    # слишком коротко
git commit -m "update"                 # неясно что обновлено
git commit -m "wip"                    # work in progress
git commit -m "stuff"                  # неинформативно
git commit -m "fix bug"                # неясно какой баг
```

---

## 🌿 Соглашения по веткам

### Названия веток

```bash
# Feature ветки
feature/user-profile-page
feature/add-payment-system
feature/implement-search

# Bug fix ветки
fix/login-validation-error
fix/video-playback-issue
fix/database-connection-timeout

# Hotfix ветки (критические исправления)
hotfix/critical-security-patch
hotfix/production-crash-fix

# Refactor ветки
refactor/database-connection
refactor/api-structure

# Documentation ветки
docs/update-readme
docs/add-api-documentation

# Chore ветки
chore/update-dependencies
chore/configure-ci
```

### Структура веток

```
main                 # основная ветка (защищена)
├── master           # личная ветка (не используется командой)
├── develop         # ветка разработки (опционально)
├── feature/*       # ветки новых функций
├── fix/*           # ветки исправлений
├── hotfix/*        # критические исправления
└── release/*       # ветки релизов (опционально)
```

---

## 🔀 Работа с Pull Requests

### Создание Pull Request

1. **Заголовок PR:**
   ```
   feat: добавить систему уведомлений
   fix: исправить отображение видео на мобильных
   ```

2. **Описание PR:**
   ```markdown
   ## Описание
   Добавлена система уведомлений для пользователей о новых челленджах.

   ## Изменения
   - Создан компонент NotificationCenter
   - Добавлен хук useNotifications
   - Интегрирован с Supabase realtime

   ## Тестирование
   - [ ] Уведомления отображаются корректно
   - [ ] Работает на мобильных устройствах
   - [ ] Нет ошибок в консоли

   ## Скриншоты
   [Добавить скриншоты если нужно]
   ```

### Code Review

#### Чек-лист ревьюера:
- [ ] Код соответствует стандартам проекта
- [ ] Функциональность работает корректно
- [ ] Тесты покрывают изменения
- [ ] Документация обновлена
- [ ] Нет критических уязвимостей
- [ ] Производительность не ухудшена

#### Комментарии в PR:
```markdown
# Хороший комментарий
Отличная работа! Небольшое предложение: можно вынести логику валидации в отдельную функцию для переиспользования.

# Плохой комментарий
Это неправильно. Исправь.
```

---

## ⚠️ Разрешение конфликтов

### Профилактика конфликтов

1. **Регулярно обновляйте основную ветку**
2. **Не работайте в одной области кода**
3. **Обсуждайте изменения заранее**
4. **Используйте rebase вместо merge**

### Разрешение конфликтов

```bash
# При конфликте во время rebase
git status                    # посмотреть конфликтующие файлы
# Решить конфликты в редакторе
git add .                     # добавить разрешенные файлы
git rebase --continue         # продолжить rebase

# Если нужно отменить rebase
git rebase --abort

# При конфликте в merge
git merge main
# Решить конфликты
git add .
git commit
```

### Стратегии разрешения

1. **Обсудите с коллегой** - кто какие изменения делал
2. **Понять контекст** - зачем были сделаны изменения
3. **Сохранить функциональность** - не потерять важный код
4. **Протестировать** - убедиться что всё работает

---

## 🧹 Поддержание чистоты

### Очистка веток

```bash
# Удалить локальные ветки после мержа
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Удалить удаленные ветки
git push origin --delete feature/завершенная-задача

# Очистить историю коммитов (если нужно)
git rebase -i HEAD~5  # интерактивный rebase последних 5 коммитов
```

### Удаление старых ветокa

```bash
# Посмотреть все ветки
git branch -a

# Удалить локальную ветку
git branch -d feature/старая-задача

# Удалить удаленную ветку
git push origin --delete feature/старая-задача
```

---

## 🚀 Продвинутые техники

### Stash для временного сохранения

```bash
# Сохранить изменения
git stash push -m "сохранение перед переключением ветки"

# Посмотреть stash
git stash list

# Применить stash
git stash pop

# Удалить stash
git stash drop
```

### Cherry-pick для переноса коммитов

```bash
# Перенести конкретный коммит
git cherry-pick abc1234

# Перенести несколько коммитов
git cherry-pick abc1234 def5678
```

### Reset для отмены изменений

```bash
# Отменить последний коммит (сохранить изменения)
git reset --soft HEAD~1

# Отменить последний коммит (удалить изменения)
git reset --hard HEAD~1

# Отменить изменения в файле
git checkout -- filename
```

---

## 📋 Чек-лист для разработчика

### ⚠️ Важно для команды
- **Работайте только с main веткой** - не используйте master
- **Все feature-ветки создавайте от main**
- **Pull Requests делайте в main**

### Перед началом работы
- [ ] Обновить основную ветку (main)
- [ ] Создать feature-ветку с правильным названием
- [ ] Понять требования задачи

### Во время разработки
- [ ] Регулярные коммиты с описательными сообщениями
- [ ] Периодический push в удаленный репозиторий
- [ ] Обновление ветки с основной при необходимости

### Перед созданием PR
- [ ] Все тесты проходят
- [ ] Код соответствует стандартам
- [ ] Документация обновлена
- [ ] Ветка перебазирована на основную

### После мержа
- [ ] Удалить feature-ветку
- [ ] Обновить локальную основную ветку
- [ ] Проверить что всё работает

---

## 🆘 Частые проблемы и решения

### "Permission denied" при push
```bash
# Проверить права доступа
git remote -v

# Настроить SSH ключи или токен
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### "Branch is behind" при push
```bash
# Обновить ветку
git pull origin main

# Или принудительный push (осторожно!)
git push --force-with-lease
```

### Потерянные коммиты
```bash
# Найти потерянные коммиты
git reflog

# Восстановить коммит
git checkout -b recovery abc1234
```

### Неправильный коммит
```bash
# Изменить последний коммит
git commit --amend

# Изменить сообщение коммита
git commit --amend -m "новое сообщение"
```

---

## 📚 Полезные команды

### Информация
```bash
git status                    # статус репозитория
git log --oneline            # история коммитов
git branch -a                # все ветки
git remote -v                # удаленные репозитории
```

### Навигация
```bash
git checkout branch-name      # переключиться на ветку
git checkout -b new-branch   # создать и переключиться
git checkout -                # вернуться к предыдущей ветке
```

### Изменения
```bash
git add .                     # добавить все изменения
git add filename              # добавить конкретный файл
git reset HEAD filename       # отменить добавление файла
git diff                      # посмотреть изменения
```

### История
```bash
git log                       # полная история
git log --graph              # история с графиком
git log --author="name"      # коммиты автора
git blame filename           # кто что изменил в файле
```

---

**Удачной работы с Git! 🚀** 