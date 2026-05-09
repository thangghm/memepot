// Background Service Worker — minimal shell
import { setupContextMenu } from './context-menu';
import { db } from '@/shared/db';
import { memeService } from '@/features/memes/services/meme.service';

console.log('[Memepot] Service worker starting...');

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Memepot] Extension installed:', details.reason);
  setupContextMenu();
});

// Handle GET_MEMES from popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_MEMES') {
    memeService.getAll().then((memes) => {
      sendResponse({ success: true, memes });
    });
    return true; // async
  }
  if (message.type === 'GET_THUMBNAIL') {
    const { memeId } = message;
    db.memeThumbnails.where('memeId').equals(memeId).first().then((thumb) => {
      if (thumb) {
        const url = URL.createObjectURL(thumb.blob);
        sendResponse({ success: true, url });
      } else {
        // Fall back to original blob
        db.memeBlobs.where('memeId').equals(memeId).first().then((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob.blob);
            sendResponse({ success: true, url });
          } else {
            sendResponse({ success: false, error: 'Blob not found' });
          }
        });
      }
    });
    return true;
  }
  return false;
});

console.log('[Memepot] Service worker ready.');
