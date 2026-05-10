import { db } from '@/shared/db';
import type { Meme } from '@/features/memes/types/meme.types';
import { hashBlob } from '../utils/content-hash';
import { createPerceptualHash, hammingDistance } from '../utils/perceptual-hash';
import { PERCEPTUAL_HASH_MAX_DISTANCE } from '@/shared/constants';

export interface DuplicateCheckResult {
  contentHash: string;
  perceptualHash?: string;
  duplicate?: Meme;
  duplicateKind?: 'exact' | 'similar';
}

export class DuplicateService {
  async checkBlob(blob: Blob): Promise<DuplicateCheckResult> {
    const contentHash = await hashBlob(blob);
    const exactDuplicate = await db.memes
      .where('contentHash')
      .equals(contentHash)
      .filter((meme) => meme.status !== 'trash')
      .first();

    if (exactDuplicate) {
      return { contentHash, duplicate: exactDuplicate, duplicateKind: 'exact' };
    }

    const perceptualHash = await createPerceptualHash(blob);
    const candidates = await db.memes
      .filter((meme) => meme.status !== 'trash' && Boolean(meme.perceptualHash))
      .toArray();
    const similarDuplicate = candidates.find(
      (meme) =>
        meme.perceptualHash !== undefined &&
        hammingDistance(perceptualHash, meme.perceptualHash) <= PERCEPTUAL_HASH_MAX_DISTANCE,
    );

    if (similarDuplicate) {
      return { contentHash, perceptualHash, duplicate: similarDuplicate, duplicateKind: 'similar' };
    }

    return { contentHash, perceptualHash };
  }
}

export const duplicateService = new DuplicateService();
