import type { MemeStatus, MemeCategory } from '@/shared/types/common.types';
export type { MemeStatus, MemeCategory } from '@/shared/types/common.types';
export type MemeSourceType = 'web' | 'import' | 'clipboard';

export type MemeMimeType = 'image/png' | 'image/jpeg' | 'image/webp';

export interface Meme {
  id: string;
  title: string;
  note?: string;
  category?: MemeCategory;
  tags: string[];
  sourceType: MemeSourceType;
  sourceUrl?: string;
  sourceDomain?: string;
  pageUrl?: string;
  originalBlobId: string;
  thumbnailBlobId: string;
  mimeType: MemeMimeType;
  width?: number;
  height?: number;
  sizeBytes?: number;
  favorite: boolean;
  status: MemeStatus;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

export interface MemeBlob {
  id: string;
  memeId: string;
  blob: Blob;
  mimeType: MemeMimeType;
  sizeBytes: number;
  createdAt: string;
}

export interface MemeThumbnail {
  id: string;
  memeId: string;
  blob: Blob;
  width: number;
  height: number;
  mimeType: 'image/webp' | 'image/jpeg' | 'image/png';
  createdAt: string;
}

export interface License {
  key: string;
  tier: 'free' | 'pro';
  expiresAt?: string;
  activatedAt?: string;
  email?: string;
}

export interface MemeFilter {
  query?: string;
  category?: MemeCategory;
  tags?: string[];
  status?: MemeStatus;
  favorites?: boolean;
  sort?: 'created' | 'frequent' | 'used';
}

export interface MemeStats {
  total: number;
  inbox: number;
  active: number;
  trash: number;
  favorites: number;
}
