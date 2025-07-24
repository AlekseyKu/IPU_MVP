// frontend\src\utils\hashtags.ts
import { popularHashtags } from '@/data/popularHashtags';

export const MAX_HASHTAGS = 5;

export function normalizeHashtag(tag: string): string {
  return tag.trim().toLowerCase().replace(/^#/, '');
}

export function addHashtag(
  hashtags: string[],
  tag: string
): string[] {
  const normalized = normalizeHashtag(tag);
  if (
    !normalized ||
    hashtags.includes(normalized) ||
    hashtags.length >= MAX_HASHTAGS
  ) {
    return hashtags;
  }
  return [...hashtags, normalized];
}

export function removeHashtag(
  hashtags: string[],
  tag: string
): string[] {
  return hashtags.filter(t => t !== tag);
}

export function getRandomPopularHashtags(
  current: string[],
  count = 6
): string[] {
  return popularHashtags
    .filter(tag => !current.includes(tag))
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
} 