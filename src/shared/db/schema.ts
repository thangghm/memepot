import Dexie from 'dexie';
import type { Meme, MemeBlob, MemeThumbnail } from '@/features/memes/types/meme.types';

export class MemepotDB extends Dexie {
  memes!: Dexie.Table<Meme, string>;
  memeBlobs!: Dexie.Table<MemeBlob, string>;
  memeThumbnails!: Dexie.Table<MemeThumbnail, string>;

  constructor() {
    super('memepot');
    this.version(1).stores({
      memes:
        'id, title, category, status, favorite, sourceType, sourceDomain, usageCount, createdAt, updatedAt, lastUsedAt, *tags',
      memeBlobs: 'id, memeId',
      memeThumbnails: 'id, memeId',
    });
  }
}

export const db = new MemepotDB();