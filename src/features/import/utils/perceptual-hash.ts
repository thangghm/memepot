import { PERCEPTUAL_HASH_SIZE } from '@/shared/constants';

export async function createPerceptualHash(blob: Blob): Promise<string> {
  const bitmap = await createImageBitmap(blob);

  try {
    const canvas = new OffscreenCanvas(PERCEPTUAL_HASH_SIZE, PERCEPTUAL_HASH_SIZE);
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not create image canvas.');
    }

    context.drawImage(bitmap, 0, 0, PERCEPTUAL_HASH_SIZE, PERCEPTUAL_HASH_SIZE);

    const { data } = context.getImageData(0, 0, PERCEPTUAL_HASH_SIZE, PERCEPTUAL_HASH_SIZE);
    const luminanceValues: number[] = [];

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index] ?? 0;
      const green = data[index + 1] ?? 0;
      const blue = data[index + 2] ?? 0;
      luminanceValues.push(0.299 * red + 0.587 * green + 0.114 * blue);
    }

    const average =
      luminanceValues.reduce((total, luminance) => total + luminance, 0) / luminanceValues.length;

    return luminanceValues.map((luminance) => (luminance >= average ? '1' : '0')).join('');
  } finally {
    bitmap.close();
  }
}

export function hammingDistance(left: string, right: string): number {
  const length = Math.min(left.length, right.length);
  let distance = Math.abs(left.length - right.length);

  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) {
      distance += 1;
    }
  }

  return distance;
}
