import type { Meme, MemeBlob, MemeThumbnail } from '@/features/memes/types/meme.types';
import type { Settings } from '@/features/settings/services/settings.service';

export interface BackupAssetEntry {
  path: string;
  memeId: string;
  mimeType: string;
  sizeBytes?: number;
  createdAt: string;
  width?: number;
  height?: number;
}

export interface BackupManifest {
  app: 'memepot';
  formatVersion: 1;
  exportedAt: string;
  databaseVersion: number;
  counts: {
    memes: number;
    originals: number;
    thumbnails: number;
  };
  assets: {
    originals: Record<string, BackupAssetEntry>;
    thumbnails: Record<string, BackupAssetEntry>;
  };
}

export interface BackupImportResult {
  imported: number;
  skipped: number;
  failed: number;
}

export type BackupMeme = Meme;
export type BackupMemeBlob = Omit<MemeBlob, 'blob'>;
export type BackupMemeThumbnail = Omit<MemeThumbnail, 'blob'>;
export type BackupSettings = Partial<Settings>;
