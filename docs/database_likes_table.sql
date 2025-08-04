-- Создание таблицы лайков
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id BIGINT NOT NULL,
    post_id UUID NOT NULL,
    post_type TEXT NOT NULL CHECK (post_type IN ('promise', 'challenge')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Уникальный индекс для предотвращения дублирования лайков
    UNIQUE(user_id, post_id, post_type),
    
    -- Внешний ключ только для пользователя
    FOREIGN KEY (user_id) REFERENCES users(telegram_id) ON DELETE CASCADE
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_type ON likes(post_type);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at);

-- Отключаем RLS, так как нет аутентификации
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;

-- Комментарии к таблице
COMMENT ON TABLE likes IS 'Таблица для хранения лайков к постам (обещаниям и челленджам)';
COMMENT ON COLUMN likes.user_id IS 'ID пользователя, который поставил лайк';
COMMENT ON COLUMN likes.post_id IS 'ID поста (обещания или челленджа)';
COMMENT ON COLUMN likes.post_type IS 'Тип поста: promise или challenge';
COMMENT ON COLUMN likes.created_at IS 'Дата и время создания лайка'; 