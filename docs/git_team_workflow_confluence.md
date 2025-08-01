# Git Workflow для команды IPU_MVP

h1. Основные принципы

h2. 1. Безопасность
* *Никогда не работайте в main напрямую*
* *Всегда создавайте feature-ветки*
* *Используйте Pull Requests для слияния*

h2. 2. Чистота истории
* *Регулярные коммиты* - не накапливайте изменения
* *Описательные сообщения* - используйте conventional commits
* *Чистая история* - избегайте merge commits

h2. 3. Коммуникация
* *Обсуждайте изменения* с командой
* *Уведомляйте о больших изменениях*
* *Документируйте сложные решения*

---

h1. Основной Workflow

h2. Быстрый старт (для новых участников)

{code:bash}
# 1. Обновить main
git checkout main
git pull origin main

# 2. Создать ветку для задачи
git checkout -b feature/ваша-первая-задача

# 3. Работать и коммитить
git add .
git commit -m "feat: описание изменений"
git push origin feature/ваша-первая-задача

# 4. Создать Pull Request в GitHub
# 5. Получить одобрение и мержить
{code}

h2. Важно: Структура веток
* *main* - основная ветка для команды (защищена)
* *master* - личная ветка (не используется командой)
* *feature/*, fix/*, hotfix/** - рабочие ветки команды

h2. 1. Начало работы над задачей

{code:bash}
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
{code}

h2. 2. Во время разработки

{code:bash}
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
{code}

h2. 3. Завершение задачи

{code:bash}
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
{code}

---

h1. Соглашения по коммитам

h2. Conventional Commits

{code:bash}
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
{code}

h2. Примеры хороших коммитов

{code:bash}
git commit -m "feat: добавить валидацию email в форме регистрации"
git commit -m "fix: исправить отображение видео в PromiseView"
git commit -m "docs: обновить README с инструкциями по установке"
git commit -m "refactor: вынести логику API в отдельный сервис"
git commit -m "test: добавить тесты для usePromiseApi хука"
git commit -m "style: форматировать код согласно ESLint"
git commit -m "chore: обновить зависимости до последних версий"
{code}

h2. Примеры плохих коммитов

{code:bash}
git commit -m "fix"                    # слишком коротко
git commit -m "update"                 # неясно что обновлено
git commit -m "wip"                    # work in progress
git commit -m "stuff"                  # неинформативно
git commit -m "fix bug"                # неясно какой баг
{code}

---

h1. Соглашения по веткам

h2. Названия веток

{code:bash}
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
{code}

h2. Структура веток

{code}
main                 # основная ветка (защищена)
├── master           # личная ветка (не используется командой)
├── develop         # ветка разработки (опционально)
├── feature/*       # ветки новых функций
├── fix/*           # ветки исправлений
├── hotfix/*        # критические исправления
└── release/*       # ветки релизов (опционально)
{code}

h3. Важно: Ветки создаются динамически
* *Не создавайте ветки заранее!* 
* *Создавайте по мере необходимости:*
{code:bash}
# Когда начинаете новую задачу
git checkout -b feature/название-задачи

# Когда исправляете баг
git checkout -b fix/название-бага

# Когда критическое исправление
git checkout -b hotfix/название-исправления
{code}

---

h1. Работа с Pull Requests

h2. Создание Pull Request

h3. 1. Заголовок PR:
{code}
feat: добавить систему уведомлений
fix: исправить отображение видео на мобильных
{code}

h3. 2. Описание PR:
{code:markdown}
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
{code}

h2. Code Review

h3. Чек-лист ревьюера:
* [ ] Код соответствует стандартам проекта
* [ ] Функциональность работает корректно
* [ ] Тесты покрывают изменения
* [ ] Документация обновлена
* [ ] Нет критических уязвимостей
* [ ] Производительность не ухудшена

h3. Комментарии в PR:
{code:markdown}
# Хороший комментарий
Отличная работа! Небольшое предложение: можно вынести логику валидации в отдельную функцию для переиспользования.

# Плохой комментарий
Это неправильно. Исправь.
{code}

---

h1. Разрешение конфликтов

h2. Профилактика конфликтов

* Регулярно обновляйте основную ветку
* Не работайте в одной области кода
* Обсуждайте изменения заранее
* Используйте rebase вместо merge

h2. Разрешение конфликтов

{code:bash}
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
{code}

h2. Стратегии разрешения

* Обсудите с коллегой - кто какие изменения делал
* Понять контекст - зачем были сделаны изменения
* Сохранить функциональность - не потерять важный код
* Протестировать - убедиться что всё работает

---

h1. Чек-лист для разработчика

h2. Важно для команды
* *Работайте только с main веткой* - не используйте master
* *Все feature-ветки создавайте от main*
* *Pull Requests делайте в main*

h2. Перед началом работы
* [ ] Обновить основную ветку (main)
* [ ] Создать feature-ветку с правильным названием
* [ ] Понять требования задачи

h2. Во время разработки
* [ ] Регулярные коммиты с описательными сообщениями
* [ ] Периодический push в удаленный репозиторий
* [ ] Обновление ветки с основной при необходимости

h2. Перед созданием PR
* [ ] Все тесты проходят
* [ ] Код соответствует стандартам
* [ ] Документация обновлена
* [ ] Ветка перебазирована на основную

h2. После мержа
* [ ] Обновить локальную основную ветку
* [ ] Проверить что всё работает
* [ ] Оставить ветку на 2-4 недели (для MVP)
* [ ] Архивировать ветку через месяц (опционально)

---

h1. Частые проблемы и решения

h2. "Permission denied" при push
{code:bash}
# Проверить права доступа
git remote -v

# Настроить SSH ключи или токен
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
{code}

h2. "Branch is behind" при push
{code:bash}
# Обновить ветку
git pull origin main

# Или принудительный push (осторожно!)
git push --force-with-lease
{code}

h2. Потерянные коммиты
{code:bash}
# Найти потерянные коммиты
git reflog

# Восстановить коммит
git checkout -b recovery abc1234
{code}

h2. Неправильный коммит
{code:bash}
# Изменить последний коммит
git commit --amend

# Изменить сообщение коммита
git commit --amend -m "новое сообщение"
{code}

---

h1. Полезные команды

h2. Информация
{code:bash}
git status                    # статус репозитория
git log --oneline            # история коммитов
git branch -a                # все ветки
git remote -v                # удаленные репозитории
{code}

h2. Навигация
{code:bash}
git checkout branch-name      # переключиться на ветку
git checkout -b new-branch   # создать и переключиться
git checkout -                # вернуться к предыдущей ветке
{code}

h2. Изменения
{code:bash}
git add .                     # добавить все изменения
git add filename              # добавить конкретный файл
git reset HEAD filename       # отменить добавление файла
git diff                      # посмотреть изменения
{code}

h2. История
{code:bash}
git log                       # полная история
git log --graph              # история с графиком
git log --author="name"      # коммиты автора
git blame filename           # кто что изменил в файле
{code}

---

h1. Продвинутые техники

h2. Stash для временного сохранения

{code:bash}
# Сохранить изменения
git stash push -m "сохранение перед переключением ветки"

# Посмотреть stash
git stash list

# Применить stash
git stash pop

# Удалить stash
git stash drop
{code}

h2. Cherry-pick для переноса коммитов

{code:bash}
# Перенести конкретный коммит
git cherry-pick abc1234

# Перенести несколько коммитов
git cherry-pick abc1234 def5678
{code}

h2. Reset для отмены изменений

{code:bash}
# Отменить последний коммит (сохранить изменения)
git reset --soft HEAD~1

# Отменить последний коммит (удалить изменения)
git reset --hard HEAD~1

# Отменить изменения в файле
git checkout -- filename
{code}

---

h1. Поддержание чистоты (for Team Lead)

h2. Стратегия для MVP: Гибридный подход

Для MVP-версии рекомендуется *не удалять ветки сразу*, а использовать гибридный подход:

h3. 1. Оставлять ветки первые 2-4 недели
* Позволяет команде вернуться к коду при необходимости
* Помогает в отладке и анализе проблем
* Сохраняет контекст разработки

h3. 2. Архивировать старые ветки
{code:bash}
# Переименовать старые ветки в архив
git branch -m feature/старая-задача archive/feature/старая-задача
git push origin archive/feature/старая-задача
git push origin --delete feature/старая-задача
{code}

h3. 3. Удалять только очень старые ветки (2-3 месяца)
{code:bash}
# Удалить ветки старше 3 месяцев
git branch --merged | grep "archive/" | xargs -n 1 git branch -d
git push origin --delete archive/очень-старая-задача
{code}

h2. Очистка веток (опционально)

Если команда решит использовать строгую очистку:

{code:bash}
# Удалить локальные ветки после мержа (только для завершенных задач)
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Удалить удаленные ветки (осторожно!)
git push origin --delete feature/завершенная-задача

# Очистить историю коммитов (если нужно)
git rebase -i HEAD~5  # интерактивный rebase последних 5 коммитов
{code}

h2. Удаление старых веток (опционально)

{code:bash}
# Посмотреть все ветки
git branch -a

# Удалить локальную ветку
git branch -d feature/старая-задача

# Удалить удаленную ветку
git push origin --delete feature/старая-задача
{code}

h2. Рекомендации для MVP:

h3. Что делать:
* Оставлять ветки первые 2-4 недели после мержа
* Архивировать ветки старше месяца
* Удалять только ветки старше 3 месяцев
* Вести документацию о важных изменениях

h3. Что НЕ делать:
* Удалять ветки сразу после мержа
* Оставлять все ветки навсегда
* Игнорировать чистоту репозитория

h2. Автоматизация (для будущего):

Когда проект вырастет, можно настроить автоматическую очистку:

{code:bash}
# Скрипт для автоматической архивации (пример)
#!/bin/bash
# Найти ветки старше 30 дней и архивировать их
# Добавить в CI/CD pipeline
{code}

---

*Удачной работы с Git! 🚀* 