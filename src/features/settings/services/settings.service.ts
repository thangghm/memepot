// SettingsService — stub. Full implementation in Milestone 4.
import type { MemeMimeType } from '@/features/memes/types/meme.types';

export interface Settings {
  defaultCopyFormat: MemeMimeType;
  lastView: string;
  gridSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'system';
  maxImageSize: number;
  closeAfterCopy: boolean;
  showTags: boolean;
  confirmBeforePermanentDelete: boolean;
}

const DEFAULTS: Settings = {
  defaultCopyFormat: 'image/png',
  lastView: 'tempot',
  gridSize: 'small',
  theme: 'dark',
  maxImageSize: 20 * 1024 * 1024,
  closeAfterCopy: false,
  showTags: true,
  confirmBeforePermanentDelete: true,
};

const SETTING_KEYS = Object.keys(DEFAULTS) as Array<keyof Settings>;

export function sanitizeSettings(value: unknown): Partial<Settings> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const source = value as Partial<Record<keyof Settings, unknown>>;
  const sanitized: Partial<Settings> = {};

  if (
    source.defaultCopyFormat === 'image/png' ||
    source.defaultCopyFormat === 'image/jpeg' ||
    source.defaultCopyFormat === 'image/webp'
  ) {
    sanitized.defaultCopyFormat = source.defaultCopyFormat;
  }
  if (typeof source.lastView === 'string') {
    sanitized.lastView = source.lastView;
  }
  if (source.gridSize === 'small' || source.gridSize === 'medium' || source.gridSize === 'large') {
    sanitized.gridSize = source.gridSize;
  }
  if (source.theme === 'light' || source.theme === 'dark' || source.theme === 'system') {
    sanitized.theme = source.theme;
  }
  if (typeof source.maxImageSize === 'number') {
    sanitized.maxImageSize = source.maxImageSize;
  }
  if (typeof source.closeAfterCopy === 'boolean') {
    sanitized.closeAfterCopy = source.closeAfterCopy;
  }
  if (typeof source.showTags === 'boolean') {
    sanitized.showTags = source.showTags;
  }
  if (typeof source.confirmBeforePermanentDelete === 'boolean') {
    sanitized.confirmBeforePermanentDelete = source.confirmBeforePermanentDelete;
  }

  return sanitized;
}

export class SettingsService {
  async get(): Promise<Settings> {
    const stored = await chrome.storage.local.get(SETTING_KEYS);
    return { ...DEFAULTS, ...stored } as Settings;
  }

  async set(updates: Partial<Settings>): Promise<void> {
    await chrome.storage.local.set(updates);
  }

  async reset(): Promise<void> {
    await chrome.storage.local.set(DEFAULTS);
  }
}

export const settingsService = new SettingsService();
