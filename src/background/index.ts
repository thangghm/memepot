// Background Service Worker — minimal shell
import { setupContextMenu } from './context-menu';
import { memeService } from '@/features/memes/services/meme.service';

chrome.runtime.onInstalled.addListener((details) => {
  void details;
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
  return false;
});
