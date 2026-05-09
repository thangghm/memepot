// Core shared types used across the extension
export type MimeType = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';
export type SourceType = 'web' | 'import' | 'clipboard';
export type MemeStatus = 'inbox' | 'active' | 'trash';
export type MemeCategory =
  | 'reaction'
  | 'emotion'
  | 'work'
  | 'animal'
  | 'pop-culture'
  | 'vietnamese'
  | 'template'
  | 'other';
export type LicenseTier = 'free' | 'pro';

// Extension message types
export type ExtensionMessage =
  | { type: 'POT_IMAGE'; payload: { srcUrl: string; pageUrl?: string; linkUrl?: string; selectionText?: string } }
  | { type: 'IMPORT_COMPLETED'; payload: { memeId: string } }
  | { type: 'COPY_MEME'; payload: { memeId: string } }
  | { type: 'OPEN_MEME'; payload: { memeId: string } }
  | { type: 'GET_MEMES'; payload?: Record<string, never> }
  | { type: 'DELETE_MEME'; payload: { memeId: string } }
  | { type: 'UPDATE_MEME'; payload: { memeId: string; updates: Partial<import('@/features/memes/types/meme.types').Meme> } };