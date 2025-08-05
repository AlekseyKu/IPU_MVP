/**
 * Бизнес-правила для постов (обещания и челленджи)
 */

/**
 * Проверяет, можно ли удалить пост (обещание или челлендж)
 * Удаление разрешено только в течение 6 часов после создания
 */
export function canDeleteItem(createdAt: string): boolean {
  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= 6;
}

/**
 * Проверяет, можно ли завершить обещание
 * Завершение возможно только через 3 часа после создания
 */
export function canCompletePromise(createdAt: string): boolean {
  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff >= 3;
}

/**
 * Возвращает оставшееся время до возможности завершения обещания
 * Возвращает null, если уже можно завершать
 */
export function getTimeUntilCompletionAllowed(createdAt: string): string | null {
  const createdAtDate = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursDiff >= 3) return null; // Уже можно завершать
  
  const remainingHours = 3 - hoursDiff;
  const remainingMinutes = Math.ceil(remainingHours * 60);
  
  if (remainingMinutes >= 60) {
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    return `${hours}ч ${minutes}м`;
  } else {
    return `${remainingMinutes}м`;
  }
}

/**
 * Проверяет, можно ли редактировать пост
 * В будущем можно добавить логику для редактирования
 */
export function canEditItem(createdAt: string): boolean {
  // TODO: Добавить логику для редактирования
  return canDeleteItem(createdAt);
}

/**
 * Проверяет, можно ли завершить обещание по дедлайну
 * Завершение возможно только до дедлайна включительно
 */
export function canCompleteItem(deadline: string): boolean {
  if (!deadline) return false;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return now <= deadlineDate;
}

/**
 * Проверяет, просрочено ли обещание
 * Обещание просрочено, если текущее время позже дедлайна
 */
export function isPromiseExpired(deadline: string): boolean {
  if (!deadline) return false;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return now > deadlineDate;
} 