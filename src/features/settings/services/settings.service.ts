// SettingsService — stub. Full implementation in Milestone 4.
import type { MemeMimeType } from '@/features/memes/types/meme.types';

export interface Settings {
  defaultCopyFormat: MemeMimeType;
  lastView: string;
  gridSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark' | 'system';
  maxImageSize: number;
  closeAfterCopy: boolean;
}

const DEFAULTS: Settings = {
  defaultCopyFormat: 'image/png',
  lastView: 'tempot',
  gridSize: 'medium',
  theme: 'dark',
  maxImageSize: 20 * 1024 * 1024,
  closeAfterCopy: false,
};

export class SettingsService {
  async get(): Promise<Settings> {
    const stored = await chrome.storage.local.get(Object.keys(DEFAULTS));
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
