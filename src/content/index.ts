import { MAX_IMAGE_SIZE } from '@/shared/constants';

interface FetchImageMessage {
  type: 'MEMEPOT_FETCH_IMAGE';
  payload?: {
    srcUrl?: string;
  };
}

interface PotImageResultMessage {
  type: 'MEMEPOT_POT_IMAGE_RESULT';
  payload?: {
    success?: boolean;
    message?: string;
  };
}

type MemepotContentMessage = FetchImageMessage | PotImageResultMessage;

const TOAST_ID = 'memepot-page-toast';

console.log('[Memepot] Content script loaded.');

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read image data.'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('Could not read image data.'));
    reader.readAsDataURL(blob);
  });
}

async function fetchImageData(srcUrl: string) {
  const response = await fetch(srcUrl, {
    credentials: 'include',
    referrer: window.location.href,
    referrerPolicy: 'strict-origin-when-cross-origin',
  });

  if (!response.ok) {
    throw new Error(`Image request failed (${response.status}).`);
  }

  const blob = await response.blob();
  if (blob.size > MAX_IMAGE_SIZE) {
    throw new Error('Image is too large. Maximum size is 20 MB.');
  }

  const dataUrl = await blobToDataUrl(blob);

  return {
    dataUrl,
    mimeType: response.headers.get('content-type') ?? blob.type,
  };
}

function showToast(message: string, success: boolean) {
  document.getElementById(TOAST_ID)?.remove();

  const toast = document.createElement('div');
  toast.id = TOAST_ID;
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.right = '16px';
  toast.style.bottom = '16px';
  toast.style.zIndex = '2147483647';
  toast.style.maxWidth = '320px';
  toast.style.padding = '10px 12px';
  toast.style.borderRadius = '8px';
  toast.style.background = success ? '#0000ff' : '#b91c1c';
  toast.style.color = '#ffffff';
  toast.style.font = '13px/1.35 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  toast.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.22)';

  document.documentElement.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3500);
}

chrome.runtime.onMessage.addListener((message: MemepotContentMessage, _sender, sendResponse) => {
  if (message.type === 'MEMEPOT_FETCH_IMAGE') {
    const srcUrl = message.payload?.srcUrl;
    if (!srcUrl) {
      sendResponse({ success: false, error: 'Missing image URL.' });
      return false;
    }

    fetchImageData(srcUrl)
      .then((payload) => sendResponse({ success: true, payload }))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Could not read image data.';
        sendResponse({ success: false, error: message });
      });

    return true;
  }

  if (message.type === 'MEMEPOT_POT_IMAGE_RESULT') {
    showToast(
      message.payload?.message ?? (message.payload?.success ? 'Saved to Tempot.' : 'Could not save this image.'),
      Boolean(message.payload?.success),
    );
    sendResponse({ success: true });
    return false;
  }

  return false;
});
