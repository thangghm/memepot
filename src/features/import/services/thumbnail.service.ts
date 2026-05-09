// ThumbnailService — stub. Full implementation in Milestone 2.
import type { MemeThumbnail, MemeMimeType } from '@/features/memes/types/meme.types';
import { THUMBNAIL_MAX_WIDTH, THUMBNAIL_MAX_HEIGHT } from '@/shared/constants';
import { now } from '@/shared/utils/id';

export class ThumbnailService {
  async generateThumbnail(
    _blob: Blob,
    _mimeType: MemeMimeType,
  ): Promise<Omit<MemeThumbnail, 'id' | 'memeId'>> {
    // TODO(Milestone 2): use createImageBitmap + canvas to scale down
    // Default: use original blob as thumbnail (placeholder)
    const timestamp = now();
    return {
      blob: _blob,
      width: THUMBNAIL_MAX_WIDTH,
      height: THUMBNAIL_MAX_HEIGHT,
      mimeType: 'image/webp',
      createdAt: timestamp,
    };
  }
}

export const thumbnailService = new ThumbnailService();