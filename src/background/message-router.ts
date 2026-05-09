// Message router — UI ↔ background communication
import type { ExtensionMessage } from '@/shared/types/common.types';

export function messageRouter(
  message: ExtensionMessage,
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void,
) {
  console.log('[Memepot] Message received:', message.type);

  switch (message.type) {
    case 'GET_MEMES':
      sendResponse({ success: true, memes: [] });
      break;

    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }

  return false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  messageRouter(message, sender, sendResponse);
  return true;
});