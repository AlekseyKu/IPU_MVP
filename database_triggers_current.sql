-- Текущее состояние триггеров в Supabase (на 2025-07-29)
-- Файл для отслеживания и понимания архитектуры БД

-- ==========================================
-- ТРИГГЕРЫ ДЛЯ ТАБЛИЦЫ PROMISES
-- ==========================================

-- Триггер: trigger_update_user_promise_stats
-- Срабатывает: AFTER INSERT, UPDATE, DELETE
-- Функция: update_user_promise_stats()
-- Назначение: Автоматически обновляет статистику пользователя (promises, promises_done)

-- Логика функции update_user_promise_stats:
-- INSERT: увеличивает promises на 1
-- DELETE: уменьшает promises на 1, если обещание было выполнено - уменьшает promises_done на 1
-- UPDATE: если is_completed меняется с FALSE на TRUE - увеличивает promises_done на 1
--         если is_completed меняется с TRUE на FALSE - уменьшает promises_done на 1

-- ==========================================
-- ТРИГГЕРЫ ДЛЯ ТАБЛИЦЫ CHALLENGES
-- ==========================================

-- Триггер: trigger_set_frequency_interval
-- Срабатывает: BEFORE INSERT, UPDATE
-- Функция: set_frequency_interval()
-- Назначение: Устанавливает интервалы для челленджей

-- Триггер: trigger_update_user_challenge_stats
-- Срабатывает: AFTER INSERT, UPDATE, DELETE
-- Функция: update_user_challenge_stats()
-- Назначение: Автоматически обновляет статистику пользователя (challenges, challenges_done)

-- Логика функции update_user_challenge_stats:
-- INSERT: увеличивает challenges на 1
-- DELETE: уменьшает challenges на 1, если челлендж был выполнен - уменьшает challenges_done на 1
-- UPDATE: если is_completed меняется с FALSE на TRUE - увеличивает challenges_done на 1
--         если is_completed меняется с TRUE на FALSE - уменьшает challenges_done на 1

-- ==========================================
-- ТРИГГЕРЫ ДЛЯ ТАБЛИЦЫ USERS
-- ==========================================

-- НЕТ ТРИГГЕРОВ

-- ==========================================
-- ВЫВОДЫ ПО АРХИТЕКТУРЕ
-- ==========================================

-- 1. Триггеры НЕ делают UPDATE в таблицах promises/challenges
-- 2. Триггеры обновляют ТОЛЬКО таблицу users
