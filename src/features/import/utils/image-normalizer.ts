import type { MemeMimeType } from '@/features/memes/types/meme.types';
import {
  MEME_IMAGE_MAX_DIMENSION,
  MEME_WEBP_QUALITY,
} from '@/shared/constants';

interface NormalizedImage {
  blob: Blob;
  mimeType: MemeMimeType;
}

export async function normalizeImportedImage(blob: Blob): Promise<NormalizedImage> {
  const bitmap = await createImageBitmap(blob);
  const longestSide = Math.max(bitmap.width, bitmap.height);
  const scale = longestSide > MEME_IMAGE_MAX_DIMENSION ? MEME_IMAGE_MAX_DIMENSION / longestSide : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  try {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create image canvas.');
    }

    context.drawImage(bitmap, 0, 0, width, height);
    const compressedBlob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: MEME_WEBP_QUALITY,
    });

    return {
      blob: compressedBlob,
      mimeType: 'image/webp',
    };
  } finally {
    bitmap.close();
  }
}
