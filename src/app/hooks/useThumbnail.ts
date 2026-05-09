import { useEffect, useState } from 'react';
import { db } from '@/shared/db';

export function useThumbnail(memeId: string | undefined) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!memeId) {
      setSrc(null);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;
    const requestedMemeId = memeId;

    async function loadThumbnail() {
      const thumbnail = await db.memeThumbnails.where('memeId').equals(requestedMemeId).first();
      const original = thumbnail
        ? null
        : await db.memeBlobs.where('memeId').equals(requestedMemeId).first();
      const blob = thumbnail?.blob ?? original?.blob;

      if (cancelled) {
        return;
      }

      if (blob) {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      } else {
        setSrc(null);
      }
    }

    loadThumbnail().catch((error) => {
      if (!cancelled) {
        console.error('[useThumbnail] Failed to load thumbnail:', error);
        setSrc(null);
      }
    });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [memeId]);

  return src;
}
