// frontend/src/data/popularHashtags.ts
export interface HashtagData {
  ru: string;
  en: string;
}

export const popularHashtags: HashtagData[] = [
  { ru: 'мотивация', en: 'motivation' },
  { ru: 'спорт', en: 'sport' },
  { ru: 'чтение', en: 'reading' },
  { ru: 'учёба', en: 'study' },
  { ru: 'развитие', en: 'development' },
  { ru: 'дисциплина', en: 'discipline' },
  { ru: 'цели', en: 'goals' },
  { ru: 'успех', en: 'success' },
  { ru: 'здоровье', en: 'health' },
  { ru: 'работа', en: 'work' },
  { ru: 'деньги', en: 'money' },
  { ru: 'питание', en: 'nutrition' },
  { ru: 'сон', en: 'sleep' },
  { ru: 'утро', en: 'morning' },
  { ru: 'вечер', en: 'evening' },
  { ru: 'привычки', en: 'habits' },
  { ru: 'энергия', en: 'energy' },
  { ru: 'путешествия', en: 'travel' },
  { ru: 'друзья', en: 'friends' },
  { ru: 'семья', en: 'family' },
  { ru: 'отношения', en: 'relationships' },
  { ru: 'любовь', en: 'love' },
  { ru: 'карьера', en: 'career' },
  { ru: 'бизнес', en: 'business' },
  { ru: 'инвестиции', en: 'investments' },
  { ru: 'творчество', en: 'creativity' },
  { ru: 'музыка', en: 'music' },
  { ru: 'искусство', en: 'art' },
  { ru: 'фотография', en: 'photography' },
  { ru: 'спортзал', en: 'gym' },
  { ru: 'бег', en: 'running' },
  { ru: 'йога', en: 'yoga' },
  { ru: 'медитация', en: 'meditation' },
  { ru: 'английский', en: 'english' },
  { ru: 'языки', en: 'languages' },
  { ru: 'программирование', en: 'programming' },
  { ru: 'книги', en: 'books' },
  { ru: 'фильмы', en: 'movies' },
  { ru: 'сериалы', en: 'series' },
  { ru: 'психология', en: 'psychology' },
  { ru: 'саморазвитие', en: 'selfdevelopment' },
  { ru: 'планирование', en: 'planning' },
  { ru: 'ежедневник', en: 'diary' },
  { ru: 'спорт2025', en: 'sport2025' },
  { ru: 'питание2025', en: 'nutrition2025' },
  { ru: 'здоровье2025', en: 'health2025' },
  { ru: 'успех2025', en: 'success2025' },
  { ru: '2025', en: '2025' }
];

// Функция для получения хэштегов на определенном языке
export function getHashtagsByLanguage(language: 'ru' | 'en'): string[] {
  return popularHashtags.map(tag => tag[language]);
}

// Функция для получения хэштега на определенном языке
export function getHashtagByLanguage(tag: string, language: 'ru' | 'en'): string {
  const hashtagData = popularHashtags.find(t => t.ru === tag || t.en === tag);
  return hashtagData ? hashtagData[language] : tag;
} 