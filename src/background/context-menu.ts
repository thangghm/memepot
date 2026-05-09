// Context menu registration and handler
import { db } from '@/shared/db';
import { generateId, now } from '@/shared/utils/id';
import { MAX_IMAGE_SIZE } from '@/shared/constants';

export function setupContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'memepot-pot-image',
      title: 'Pot it',
      contexts: ['image'],
    });
  });
}

async function potImage(srcUrl: string, pageUrl?: string) {
  console.log('[Memepot] Potting image:', srcUrl);

  let response: Response;
  try {
    response = await fetch(srcUrl);
  } catch (err) {
    console.error('[Memepot] Fetch failed:', err);
    console.warn('[Memepot] Fetch failed — image may be blocked by CORS');
    return;
  }

  if (!response.ok) {
    console.error('[Memepot] HTTP error:', response.status);
    return;
  }

  const blob = await response.blob();
  const mimeType = response.headers.get('content-type') || blob.type || 'image/png';

  if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(mimeType)) {
    console.error('[Memepot] Unsupported MIME type:', mimeType);
    return;
  }

  if (blob.size > MAX_IMAGE_SIZE) {
    console.error('[Memepot] Image too large:', blob.size);
    return;
  }

  const timestamp = now();
  const memeId = generateId();
  const blobId = generateId();
  const thumbId = generateId();

  // Determine source domain from page URL
  let sourceDomain: string | undefined;
  if (pageUrl) {
    try {
      sourceDomain = new URL(pageUrl).hostname;
    } catch {
      // ignore
    }
  }

  // Save original blob
  await db.memeBlobs.add({
    id: blobId,
    memeId,
    blob,
    mimeType: mimeType as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif',
    sizeBytes: blob.size,
    createdAt: timestamp,
  });

  // Save thumbnail (placeholder — same as original for now)
  await db.memeThumbnails.add({
    id: thumbId,
    memeId,
    blob,
    width: 0,
    height: 0,
    mimeType: 'image/png',
    createdAt: timestamp,
  });

  // Save meme record
  await db.memes.add({
    id: memeId,
    title: memeId,
    tags: [],
    sourceType: 'web',
    sourceUrl: srcUrl,
    sourceDomain,
    pageUrl,
    originalBlobId: blobId,
    thumbnailBlobId: thumbId,
    mimeType: mimeType as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif',
    sizeBytes: blob.size,
    favorite: false,
    status: 'inbox',
    usageCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  console.log('[Memepot] Meme saved to Tempot:', memeId);
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'memepot-pot-image' && info.srcUrl) {
    potImage(info.srcUrl, info.pageUrl);
  }
});
