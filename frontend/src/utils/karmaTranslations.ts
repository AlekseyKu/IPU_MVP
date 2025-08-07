// frontend/src/utils/karmaTranslations.ts

// Маппинг русских строк на ключи переводов
const RUSSIAN_TO_TRANSLATION_KEY: Record<string, string> = {
  'Создание челленджа': 'karmaReasons.challengeCreation',
  'Создание обещания': 'karmaReasons.promiseCreation',
  'Подписка на пользователя': 'karmaReasons.userSubscription',
  'Получение выполненного обещания': 'karmaReasons.promiseCompletion',
  'Отчет в челлендже': 'karmaReasons.challengeReport',
  'Обещание принято': 'karmaReasons.promiseAccepted',
  'Обещание отклонено': 'karmaReasons.promiseRejected',
  'Челлендж завершен': 'karmaReasons.challengeCompleted',
  'Ежедневный чек': 'karmaReasons.dailyCheck',
  'Еженедельный чек': 'karmaReasons.weeklyCheck',
  'Ежемесячный чек': 'karmaReasons.monthlyCheck',
  'Удаление обещания': 'karmaReasons.promiseDeletion',
  'Выполнение обещания для другого': 'karmaReasons.promiseCompletionForOther',
};

// Функция для получения ключа перевода по русской строке
export function getKarmaReasonTranslationKey(russianReason: string): string {
  return RUSSIAN_TO_TRANSLATION_KEY[russianReason] || russianReason;
}

// Функция для перевода причины кармы
export function translateKarmaReason(
  russianReason: string, 
  t: (key: string) => string
): string {
  const translationKey = getKarmaReasonTranslationKey(russianReason);
  
  // Если ключ найден в маппинге, используем перевод
  if (RUSSIAN_TO_TRANSLATION_KEY[russianReason]) {
    return t(translationKey);
  }
  
  // Если ключ не найден, возвращаем оригинальную строку
  return russianReason;
} 