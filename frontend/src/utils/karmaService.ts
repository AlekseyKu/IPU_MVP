import { supabase } from '@/lib/supabaseClient';

// Начисление кармы пользователю
export async function awardKarma(
  userId: number,
  amount: number,
  reason: string,
  relatedEntityType?: string,
  relatedEntityId?: string | null
): Promise<void> {
  try {
    // Сначала получаем текущую карму пользователя
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('karma_points')
      .eq('telegram_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user karma points:', fetchError);
      throw fetchError;
    }

    // Обновляем карму пользователя
    const newKarmaPoints = (user.karma_points || 0) + amount;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ karma_points: newKarmaPoints })
      .eq('telegram_id', userId);

    if (updateError) {
      console.error('Error updating karma points:', updateError);
      throw updateError;
    }

    // Записываем транзакцию
    const transactionData = {
      user_id: userId,
      amount,
      reason,
      related_entity_type: relatedEntityType,
      related_entity_id: relatedEntityId
    };
    
    const { error: insertError } = await supabase
      .from('karma_transactions')
      .insert(transactionData);

    if (insertError) {
      console.error('Error inserting karma transaction:', insertError);
      throw insertError;
    }
  } catch (error) {
    console.error('Error in awardKarma:', error);
    throw error;
  }
}

// Проверка лимита активных обещаний
export async function checkActivePromisesLimit(userId: number): Promise<boolean> {
  try {
    const { data: activePromises, error } = await supabase
      .from('promises')
      .select('id')
      .eq('user_id', userId)
      .eq('is_completed', false);

    if (error) {
      console.error('Error checking active promises limit:', error);
      return false;
    }

    const activeCount = activePromises?.length || 0;
    console.log(`Active promises for user ${userId}: ${activeCount}`);
    return activeCount < 20; // Максимум 20 активных обещаний
  } catch (error) {
    console.error('Error in checkActivePromisesLimit:', error);
    return false;
  }
}

// Проверка лимита активных челленджей
export async function checkActiveChallengesLimit(userId: number): Promise<boolean> {
  try {
    const { data: activeChallenges, error } = await supabase
      .from('challenges')
      .select('id')
      .eq('user_id', userId)
      .eq('is_completed', false);

    if (error) {
      console.error('Error checking active challenges limit:', error);
      return false;
    }

    const activeCount = activeChallenges?.length || 0;
    console.log(`Active challenges for user ${userId}: ${activeCount}`);
    return activeCount < 5; // Максимум 5 активных челленджей
  } catch (error) {
    console.error('Error in checkActiveChallengesLimit:', error);
    return false;
  }
}

// Получение количества выполненных отчетов в челлендже
export async function getCompletedReportsCount(challengeId: string): Promise<number> {
  try {
    const { data: reports, error } = await supabase
      .from('challenge_reports')
      .select('id')
      .eq('challenge_id', challengeId);

    if (error) {
      console.error('Error getting completed reports count:', error);
      return 0;
    }

    return reports?.length || 0;
  } catch (error) {
    console.error('Error in getCompletedReportsCount:', error);
    return 0;
  }
}

// Получение количества участников челленджа
export async function getParticipantsCount(challengeId: string): Promise<number> {
  try {
    const { data: participants, error } = await supabase
      .from('challenge_participants')
      .select('id')
      .eq('challenge_id', challengeId);

    if (error) {
      console.error('Error getting participants count:', error);
      return 0;
    }

    return participants?.length || 0;
  } catch (error) {
    console.error('Error in getParticipantsCount:', error);
    return 0;
  }
}

// Получение истории кармы пользователя
export async function getKarmaHistory(
  userId: number, 
  limit: number = 20, 
  offset: number = 0
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('karma_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error getting karma history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getKarmaHistory:', error);
    return [];
  }
}

// Получение статистики кармы пользователя
export async function getKarmaStats(userId: number): Promise<any> {
  try {
    // Получаем текущую карму пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('karma_points')
      .eq('telegram_id', userId)
      .single();

    if (userError) {
      console.error('Error getting user karma points:', userError);
      return null;
    }

    // Получаем последние транзакции
    const { data: recentTransactions, error: transactionsError } = await supabase
      .from('karma_transactions')
      .select('amount, reason, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsError) {
      console.error('Error getting recent transactions:', transactionsError);
      return null;
    }

    return {
      karma_points: user.karma_points,
      recent_transactions: recentTransactions || []
    };
  } catch (error) {
    console.error('Error in getKarmaStats:', error);
    return null;
  }
}

// Проверка просрочки обещания
export function isPromiseOverdue(deadline: string): boolean {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return deadlineDate < now;
}

// Получение уровня кармы (для будущей геймификации)
export function getKarmaLevel(karmaPoints: number): string {
  if (karmaPoints >= 500) return 'Мастер';
  if (karmaPoints >= 200) return 'Эксперт';
  if (karmaPoints >= 50) return 'Активный';
  return 'Новичок';
} 