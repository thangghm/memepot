// Context menu registration and handler
import { db } from '@/shared/db';
import { generateId, now } from '@/shared/utils/id';
import { MAX_IMAGE_SIZE } from '@/shared/constants';
import type { MemeMimeType } from '@/features/memes/types/meme.types';
import { normalizeImportedImage } from '@/features/import/utils/image-normalizer';
import { duplicateService } from '@/features/import/services/duplicate.service';
import type { MemeImportResult } from '@/features/import';

const SUPPORTED_MIME_TYPES: MemeMimeType[] = ['image/png', 'image/jpeg', 'image/webp'];

interface ImageDataPayload {
  dataUrl: string;
  mimeType?: string;
}

interface ContentImageResponse {
  success: boolean;
  payload?: ImageDataPayload;
  error?: string;
}

interface PottedImage {
  blob: Blob;
  mimeType: MemeMimeType;
}

export function setupContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'memepot-pot-image',
      title: 'Pot it',
      contexts: ['image'],
    });
  });
}

function getSupportedMimeType(value?: string | null): MemeMimeType | null {
  const normalized = value?.split(';')[0]?.trim().toLowerCase();

  if (normalized === 'image/jpg') {
    return 'image/jpeg';
  }

  if (SUPPORTED_MIME_TYPES.includes(normalized as MemeMimeType)) {
    return normalized as MemeMimeType;
  }

  return null;
}

function inferMimeTypeFromUrl(srcUrl: string): MemeMimeType | null {
  try {
    const pathname = new URL(srcUrl).pathname.toLowerCase();
    if (pathname.endsWith('.png')) return 'image/png';
    if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg';
    if (pathname.endsWith('.webp')) return 'image/webp';
  } catch {
    // Data and blob URLs do not always parse into useful pathnames.
  }

  return null;
}

function resolveMimeType(blob: Blob, srcUrl: string, headerMimeType?: string | null): MemeMimeType {
  const mimeType =
    getSupportedMimeType(headerMimeType) ??
    getSupportedMimeType(blob.type) ??
    inferMimeTypeFromUrl(srcUrl);

  if (!mimeType) {
    throw new Error('Unsupported image type. Use PNG, JPEG, or WebP.');
  }

  return mimeType;
}

async function blobFromDataUrl(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function fetchImageFromContentScript(tabId: number, srcUrl: string): Promise<PottedImage | null> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: 'MEMEPOT_FETCH_IMAGE', payload: { srcUrl } },
      async (response: ContentImageResponse | undefined) => {
        const runtimeError = chrome.runtime.lastError;
        if (runtimeError || !response?.success || !response.payload?.dataUrl) {
          if (runtimeError) {
            console.warn('[Memepot] Content image fetch unavailable:', runtimeError.message);
          } else if (response?.error) {
            console.warn('[Memepot] Content image fetch failed:', response.error);
          }
          resolve(null);
          return;
        }

        try {
          const blob = await blobFromDataUrl(response.payload.dataUrl);
          resolve({
            blob,
            mimeType: resolveMimeType(blob, srcUrl, response.payload.mimeType),
          });
        } catch (error) {
          console.warn('[Memepot] Content image payload could not be decoded:', error);
          resolve(null);
        }
      },
    );
  });
}

async function fetchImageFromBackground(srcUrl: string, pageUrl?: string): Promise<PottedImage> {
  const requestInit: RequestInit = {
    credentials: 'include',
  };

  if (pageUrl) {
    requestInit.referrer = pageUrl;
    requestInit.referrerPolicy = 'strict-origin-when-cross-origin';
  }

  let response: Response;
  try {
    response = await fetch(srcUrl, requestInit);
  } catch (err) {
    console.error('[Memepot] Background fetch failed:', err);
    throw new Error('Could not read this image from the page.');
  }

  if (!response.ok) {
    console.error('[Memepot] Background fetch HTTP error:', response.status);
    throw new Error(`Could not read this image (${response.status}).`);
  }

  const blob = await response.blob();
  return {
    blob,
    mimeType: resolveMimeType(blob, srcUrl, response.headers.get('content-type')),
  };
}

async function readPottedImage(srcUrl: string, pageUrl?: string, tabId?: number): Promise<PottedImage> {
  if (tabId !== undefined) {
    const pageImage = await fetchImageFromContentScript(tabId, srcUrl);
    if (pageImage) {
      return pageImage;
    }
  }

  return fetchImageFromBackground(srcUrl, pageUrl);
}

function notifyTab(tabId: number | undefined, success: boolean, message: string) {
  if (tabId === undefined) {
    return;
  }

  chrome.tabs.sendMessage(
    tabId,
    { type: 'MEMEPOT_POT_IMAGE_RESULT', payload: { success, message } },
    () => {
      void chrome.runtime.lastError;
    },
  );
}

async function potImage(srcUrl: string, pageUrl?: string, tabId?: number): Promise<MemeImportResult> {
  const image = await readPottedImage(srcUrl, pageUrl, tabId);

  if (image.blob.size > MAX_IMAGE_SIZE) {
    console.error('[Memepot] Image too large:', image.blob.size);
    throw new Error('Image is too large. Maximum size is 20 MB.');
  }

  const { blob, mimeType } = await normalizeImportedImage(image.blob);
  const { contentHash, duplicate, duplicateKind, perceptualHash } = await duplicateService.checkBlob(blob);
  if (duplicate) {
    return { status: 'duplicate', memeId: duplicate.id, duplicateKind: duplicateKind ?? 'exact' };
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
    mimeType,
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
    mimeType,
    contentHash,
    perceptualHash,
    sizeBytes: blob.size,
    favorite: false,
    status: 'inbox',
    usageCount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return { status: 'imported', memeId };
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'memepot-pot-image' && info.srcUrl) {
    const tabId = tab?.id;

    potImage(info.srcUrl, info.pageUrl, tabId)
      .then((result) => {
        const message =
          result.status === 'duplicate'
            ? result.duplicateKind === 'similar'
              ? 'Similar meme already in Memepot.'
              : 'Already in Memepot.'
            : 'Saved to Tempot.';
        notifyTab(tabId, true, message);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Could not save this image.';
        console.error('[Memepot] Pot image failed:', error);
        notifyTab(tabId, false, message);
      });
  }
});
