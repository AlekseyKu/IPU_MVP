// Утилиты для работы с localStorage для модалок завершения челленджей
// ОТКЛЮЧЕНО - модалка показывается только после успешного завершения

const STORAGE_KEY = "shownCompleteModals";

export const getShownModals = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    console.error("Error reading shown modals from localStorage:", error);
    return [];
  }
};

export const addShownModal = (challengeId: string): void => {
  try {
    const shownModals = getShownModals();
    if (!shownModals.includes(challengeId)) {
      const updatedModals = [...shownModals, challengeId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedModals));
    }
  } catch (error) {
    console.error("Error adding shown modal to localStorage:", error);
  }
};

export const isModalShown = (challengeId: string): boolean => {
  try {
    const shownModals = getShownModals();
    return shownModals.includes(challengeId);
  } catch (error) {
    console.error("Error checking if modal was shown:", error);
    return false;
  }
};

export const clearShownModals = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing shown modals from localStorage:", error);
  }
};

// Очистка старых записей (опционально, для предотвращения переполнения localStorage)
export const cleanupOldModals = (
  maxAge: number = 30 * 24 * 60 * 60 * 1000
): void => {
  try {
    const shownModals = getShownModals();
    const now = Date.now();
    const filteredModals = shownModals.filter((modalId: string) => {
      // Здесь можно добавить логику для определения возраста записи
      // Пока просто оставляем все записи
      return true;
    });

    if (filteredModals.length !== shownModals.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredModals));
    }
  } catch (error) {
    console.error("Error cleaning up old modals:", error);
  }
};
