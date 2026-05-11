// ImportService — stub. Full implementation in Milestones 2 & 3.
import type { MemeBlob, MemeMimeType, MemeSourceType } from '@/features/memes/types/meme.types';
import { db } from '@/shared/db';
import { generateId, now } from '@/shared/utils/id';
import { ThumbnailService } from './thumbnail.service';
import { MAX_IMAGE_SIZE } from '@/shared/constants';
import { UnsupportedFileTypeError, ImageTooLargeError, ImageFetchFailedError } from '@/shared/errors';
import { normalizeImportedImage } from '../utils/image-normalizer';
import { duplicateService } from './duplicate.service';
import type { MemeImportResult } from '../types/import-result.types';

const SUPPORTED_TYPES: MemeMimeType[] = ['image/png', 'image/jpeg', 'image/webp'];

export class ImportService {
  private thumbnailService = new ThumbnailService();

  async importFromUrl(
    _srcUrl: string,
    _pageUrl?: string,
    _sourceType: MemeSourceType = 'web',
  ): Promise<MemeImportResult> {
    // TODO(Milestone 3): fetch URL, validate, generate thumbnail, save
    throw new ImageFetchFailedError();
  }

  async importFromFile(_file: File): Promise<MemeImportResult> {
    // TODO(Milestone 2): read file as Blob, validate, generate thumbnail, save
    if (!SUPPORTED_TYPES.includes(_file.type as MemeMimeType)) {
      throw new UnsupportedFileTypeError();
    }
    if (_file.size > MAX_IMAGE_SIZE) {
      throw new ImageTooLargeError();
    }
    const normalizedImage = await normalizeImportedImage(_file);
    const { blob, mimeType } = normalizedImage;
    const { contentHash, duplicate, duplicateKind, perceptualHash } = await duplicateService.checkBlob(blob);
    if (duplicate) {
      return { status: 'duplicate', memeId: duplicate.id, duplicateKind: duplicateKind ?? 'exact' };
    }

    const id = generateId();
    const timestamp = now();

    // Save original blob
    const blobId = generateId();
    const memeBlob: MemeBlob = {
      id: blobId,
      memeId: id,
      blob,
      mimeType,
      sizeBytes: blob.size,
      createdAt: timestamp,
    };
    await db.memeBlobs.add(memeBlob);

    // Generate and save thumbnail
    const thumbId = generateId();
    const thumbnail = await this.thumbnailService.generateThumbnail(blob, mimeType);
    await db.memeThumbnails.add({ ...thumbnail, id: thumbId, memeId: id });

    await db.memes.add({
      id,
      title: id,
      tags: [],
      sourceType: 'import' as MemeSourceType,
      originalBlobId: blobId,
      thumbnailBlobId: thumbId,
      mimeType,
      contentHash,
      perceptualHash,
      sizeBytes: blob.size,
      favorite: false,
      status: 'inbox' as const,
      usageCount: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return { status: 'imported', memeId: id };
  }

  async importFromClipboard(_blob: Blob, _mimeType: MemeMimeType): Promise<string> {
    // TODO(Milestone 2): validate, generate thumbnail, save
    return '';
  }
}

export const importService = new ImportService();
