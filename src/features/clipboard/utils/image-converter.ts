/**
 * Convert a Blob to a different image format using Canvas API.
 */
export async function imageToBlob(
  sourceBlob: Blob,
  targetMimeType: 'image/png' | 'image/jpeg' | 'image/webp',
): Promise<Blob> {
  const bitmap = await createImageBitmap(sourceBlob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas.convertToBlob({ type: targetMimeType, quality: 0.9 });
}