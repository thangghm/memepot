/**
 * Normalize text for search matching.
 * Handles Vietnamese diacritics and whitespace.
 */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .replace(/\s+/g, ' ');
}