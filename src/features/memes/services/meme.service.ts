// MemeService — stub. Full implementation in Milestone 4.
import { db } from '@/shared/db';
import type { Meme, MemeFilter, MemeStats } from '../types/meme.types';
import { generateId, now } from '@/shared/utils/id';

const AUTO_DELETE_MS = 48 * 60 * 60 * 1000;

export class MemeService {
  async create(_data: Omit<Meme, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'favorite' | 'status'>): Promise<string> {
    const id = generateId();
    const timestamp = now();
    await db.memes.add({
      id,
      ..._data,
      favorite: false,
      status: 'inbox',
      usageCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    } as Meme);
    return id;
  }

  async update(_memeId: string, _updates: Partial<Meme>): Promise<void> {
    await db.memes.update(_memeId, { ..._updates, updatedAt: now() });
  }

  async delete(_memeId: string): Promise<void> {
    await db.memes.delete(_memeId);
    await db.memeBlobs.where('memeId').equals(_memeId).delete();
    await db.memeThumbnails.where('memeId').equals(_memeId).delete();
  }

  async toggleFavorite(_memeId: string): Promise<void> {
    const meme = await db.memes.get(_memeId);
    if (meme) {
      const timestamp = now();
      const shouldMakeHot = !meme.favorite;

      await db.memes.update(_memeId, {
        favorite: shouldMakeHot,
        updatedAt: timestamp,
      });
    }
  }

  async updateUsage(_memeId: string): Promise<void> {
    const meme = await db.memes.get(_memeId);
    if (meme) {
      await db.memes.update(_memeId, {
        usageCount: meme.usageCount + 1,
        lastUsedAt: now(),
        updatedAt: now(),
      });
    }
  }

  async getAll(_filter?: MemeFilter): Promise<Meme[]> {
    await this.clearExpiredMemes();

    let collection = db.memes.toCollection();
    if (_filter?.status) {
      collection = db.memes.where('status').equals(_filter.status);
    }
    return collection.toArray();
  }

  async getById(_memeId: string): Promise<Meme | undefined> {
    return db.memes.get(_memeId);
  }

  async getStats(): Promise<MemeStats> {
    await this.clearExpiredMemes();

    const all = await db.memes.toArray();
    return {
      total: all.length,
      inbox: all.filter((m) => m.status === 'inbox').length,
      active: all.filter((m) => m.status === 'active').length,
      trash: all.filter((m) => m.status === 'trash').length,
      favorites: all.filter((m) => m.favorite).length,
    };
  }

  async moveToTrash(_memeId: string): Promise<void> {
    await db.memes.update(_memeId, { status: 'trash', updatedAt: now() });
  }

  async restore(_memeId: string): Promise<void> {
    const meme = await db.memes.get(_memeId);
    if (!meme) {
      return;
    }

    await db.memes.update(_memeId, {
      status: meme.tags.length > 0 ? 'active' : 'inbox',
      updatedAt: now(),
    });
  }

  async getBlob(_memeId: string): Promise<Blob | undefined> {
    const blob = await db.memeBlobs.where('memeId').equals(_memeId).first();
    return blob?.blob;
  }

  async getThumbnail(_memeId: string): Promise<Blob | undefined> {
    const thumb = await db.memeThumbnails.where('memeId').equals(_memeId).first();
    return thumb?.blob;
  }

  private async clearExpiredMemes(): Promise<void> {
    const expiresBefore = Date.now() - AUTO_DELETE_MS;
    const [expiredInboxMemes, expiredTrashMemes] = await Promise.all([
      db.memes
        .where('status')
        .equals('inbox')
        .filter((meme) => new Date(meme.createdAt).getTime() <= expiresBefore)
        .toArray(),
      db.memes
        .where('status')
        .equals('trash')
        .filter((meme) => new Date(meme.updatedAt).getTime() <= expiresBefore)
        .toArray(),
    ]);
    const expiredMemes = [...expiredInboxMemes, ...expiredTrashMemes];

    if (expiredMemes.length === 0) {
      return;
    }

    const expiredIds = expiredMemes.map((meme) => meme.id);

    await db.transaction('rw', db.memes, db.memeBlobs, db.memeThumbnails, async () => {
      await db.memes.bulkDelete(expiredIds);
      await db.memeBlobs.where('memeId').anyOf(expiredIds).delete();
      await db.memeThumbnails.where('memeId').anyOf(expiredIds).delete();
    });
  }
}

export const memeService = new MemeService();
