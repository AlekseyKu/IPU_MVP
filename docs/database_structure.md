# 📊 Структура базы данных IPU-MVP

## 📋 Список всех таблиц

| table_name             | table_type |
| ---------------------- | ---------- |
| challenge_participants | BASE TABLE |
| challenge_reports      | BASE TABLE |
| challenges             | BASE TABLE |
| promises               | BASE TABLE |
| subscriptions          | BASE TABLE |
| users                  | BASE TABLE |

---

## 👥 Таблица `users`


| column_name     | data_type                   | is_nullable | column_default                          | character_maximum_length |
| --------------- | --------------------------- | ----------- | --------------------------------------- | ------------------------ |
| id              | integer                     | NO          | nextval('users_id_seq'::regclass)       | null                     |
| telegram_id     | bigint                      | NO          | null                                    | null                     |
| username        | character varying           | YES         | null                                    | 255                      |
| created_at      | timestamp without time zone | YES         | CURRENT_TIMESTAMP                       | null                     |
| updated_at      | timestamp without time zone | YES         | CURRENT_TIMESTAMP                       | null                     |
| subscribers     | integer                     | YES         | 0                                       | null                     |
| promises        | integer                     | YES         | 0                                       | null                     |
| promises_done   | integer                     | YES         | 0                                       | null                     |
| karma_points    | integer                     | YES         | 0                                       | null                     |
| first_name      | text                        | YES         | null                                    | null                     |
| last_name       | text                        | YES         | null                                    | null                     |
| hero_img_url    | text                        | YES         | /hero-img.png'::text                    | null                     |
| avatar_img_url  | text                        | YES         | ''::text                                | null                     |
| about           | text                        | YES         | 'lorem ipsum ...'::text 		        | null         		       |
| address         | text                        | YES         | ''::text                                | null                     |
| auth_id         | uuid                        | YES         | null                                    | null                     |
| hideWelcomePage | boolean                     | YES         | false                                   | null                     |
| challenges      | integer                     | YES         | 0                                       | null                     |
| challenges_done | integer                     | YES         | 0                                       | null                     |

---

## 🤝 Таблица `promises`

| column_name               | data_type                | is_nullable | column_default     | character_maximum_length |
| ------------------------- | ------------------------ | ----------- | ------------------ | ------------------------ |
| id                        | uuid                     | NO          | uuid_generate_v4() | null                     |
| user_id                   | bigint                   | YES         | null               | null                     |
| title                     | text                     | NO          | null               | null                     |
| deadline                  | timestamp with time zone | NO          | null               | null                     |
| content                   | text                     | NO          | null               | null                     |
| media_url                 | text                     | YES         | null               | null                     |
| created_at                | timestamp with time zone | YES         | now()              | null                     |
| is_completed              | boolean                  | YES         | false              | null                     |
| is_public                 | boolean                  | YES         | true               | null                     |
| result_content            | text                     | YES         | null               | null                     |
| result_media_url          | text                     | YES         | null               | null                     |
| completed_at              | timestamp with time zone | YES         | null               | null                     |
| hashtags                  | ARRAY                    | YES         | null               | null                     |
| requires_accept           | boolean                  | YES         | false              | null                     |
| recipient_id              | bigint                   | YES         | null               | null                     |
| is_accepted               | boolean                  | YES         | null               | null                     |
| is_completed_by_creator   | boolean                  | YES         | null               | null                     |
| is_completed_by_recipient | boolean                  | YES         | null               | null                     |

---

## 🏆 Таблица `challenges`

| column_name        | data_type                | is_nullable | column_default    | character_maximum_length |
| ------------------ | ------------------------ | ----------- | ----------------- | ------------------------ |
| id                 | uuid                     | NO          | gen_random_uuid() | null                     |
| user_id            | bigint                   | NO          | null              | null                     |
| title              | text                     | NO          | null              | null                     |
| frequency          | text                     | NO          | null              | null                     |
| total_reports      | integer                  | NO          | null              | null                     |
| completed_reports  | integer                  | NO          | 0                 | null                     |
| content            | text                     | YES         | null              | null                     |
| created_at         | timestamp with time zone | NO          | null              | null                     |
| is_public          | boolean                  | NO          | true              | null                     |
| media_url          | text                     | YES         | null              | null                     |
| is_completed       | boolean                  | YES         | false             | null                     |
| start_at           | timestamp with time zone | YES         | null              | null                     |
| frequency_interval | integer                  | YES         | null              | null                     |
| report_periods     | jsonb                    | YES         | null              | null                     |
| deadline_period    | text                     | YES         | null              | null                     |
| end_at             | timestamp with time zone | YES         | null              | null                     |
| hashtags           | ARRAY                    | YES         | null              | null                     |

---

## 👥 Таблица `challenge_participants`

| column_name  | data_type                | is_nullable | column_default    | character_maximum_length |
| ------------ | ------------------------ | ----------- | ----------------- | ------------------------ |
| id           | uuid                     | NO          | gen_random_uuid() | null                     |
| user_id      | bigint                   | NO          | null              | null                     |
| challenge_id | uuid                     | NO          | null              | null                     |
| joined_at    | timestamp with time zone | YES         | null              | null                     |

---

## 📝 Таблица `challenge_reports`

| column_name  | data_type                | is_nullable | column_default    | character_maximum_length |
| ------------ | ------------------------ | ----------- | ----------------- | ------------------------ |
| id           | uuid                     | NO          | gen_random_uuid() | null                     |
| user_id      | bigint                   | NO          | null              | null                     |
| challenge_id | uuid                     | NO          | null              | null                     |
| report_date  | timestamp with time zone | NO          | null              | null                     |
| comment      | text                     | YES         | null              | null                     |
| media_url    | text                     | YES         | null              | null                     |

---

## 🔗 Таблица `subscriptions`

| column_name | data_type                | is_nullable | column_default    | character_maximum_length |
| ----------- | ------------------------ | ----------- | ----------------- | ------------------------ |
| id          | uuid                     | NO          | gen_random_uuid() | null                     |
| follower_id | bigint                   | NO          | null              | null                     |
| followed_id | bigint                   | NO          | null              | null                     |
| created_at  | timestamp with time zone | YES         | CURRENT_TIMESTAMP | null                     |

---

## 🔗 Таблица `karma_transactions`

| column_name         | data_type                   | is_nullable | column_default                                 | character_maximum_length |
| ------------------- | --------------------------- | ----------- | ---------------------------------------------- | ------------------------ |
| id                  | integer                     | NO          | nextval('karma_transactions_id_seq'::regclass) | null                     |
| user_id             | bigint                      | YES         | null                                           | null                     |
| amount              | integer                     | NO          | null                                           | null                     |
| reason              | character varying           | NO          | null                                           | 255                      |
| related_entity_type | character varying           | YES         | null                                           | 50                       |
| related_entity_id   | uuid                        | YES         | null                                           | null                     |
| created_at          | timestamp without time zone | YES         | now()                                          | null                     |

## 🔍 Ключевые поля для системы кармы

### **Поля для проверки лимитов:**
- `promises.is_completed` - для проверки активных обещаний
- `challenges.is_completed` - для проверки активных челленджей
- `users.karma_points` - текущее поле для кармы

### **Поля для начисления кармы:**
- `promises.is_completed_by_creator` - выполнение обещания создателем
- `promises.is_completed_by_recipient` - выполнение обещания получателем
- `promises.deadline` - для проверки просрочки
- `challenge_reports` - для подсчета отчетов в челленджах
- `challenge_participants` - для подсчета участников челленджей

### **Поля для социальных взаимодействий:**
- `subscriptions.follower_id` - кто подписывается
- `subscriptions.followed_id` - на кого подписываются 