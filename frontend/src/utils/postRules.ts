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
 * Проверяет, можно ли редактировать пост
 * В будущем можно добавить логику для редактирования
 */
export function canEditItem(createdAt: string): boolean {
  // TODO: Добавить логику для редактирования
  return canDeleteItem(createdAt);
}

/**
 * Проверяет, можно ли завершить обещание
 * Завершение возможно только в день дедлайна или раньше
 */
export function canCompleteItem(deadline: string): boolean {
  if (!deadline) return false;
  const today = new Date();
  const deadlineDate = new Date(deadline);
  return today.setHours(0, 0, 0, 0) <= deadlineDate.setHours(0, 0, 0, 0);
} 