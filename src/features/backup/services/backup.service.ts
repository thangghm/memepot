import JSZip from 'jszip';
import { db } from '@/shared/db';
import type { Meme, MemeBlob, MemeThumbnail, MemeMimeType } from '@/features/memes/types/meme.types';
import {
  sanitizeSettings,
  settingsService,
  type Settings,
} from '@/features/settings/services/settings.service';
import type { BackupImportResult, BackupManifest, BackupSettings } from '../types/backup.types';

const BACKUP_FORMAT_VERSION = 1;
const DATABASE_VERSION = 3;
const MANIFEST_PATH = 'manifest.json';
const MEMES_PATH = 'memes.json';
const SETTINGS_PATH = 'settings.json';

const MIME_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function getAssetPath(kind: 'original' | 'thumbnail', id: string, mimeType: string) {
  const folder = kind === 'original' ? 'original' : 'thumbnails';
  const extension = MIME_EXTENSION[mimeType] ?? 'bin';
  return `images/${folder}/${id}.${extension}`;
}

function readJsonFile<T>(zip: JSZip, path: string): Promise<T> {
  const file = zip.file(path);
  if (!file) {
    throw new Error(`Backup is missing ${path}.`);
  }

  return file.async('string').then((content) => JSON.parse(content) as T);
}

function validateManifest(manifest: BackupManifest) {
  if (manifest.app !== 'memepot' || manifest.formatVersion !== BACKUP_FORMAT_VERSION) {
    throw new Error('Invalid Memepot backup file.');
  }
}

function isSupportedImageMimeType(value: string): value is MemeMimeType {
  return value === 'image/png' || value === 'image/jpeg' || value === 'image/webp';
}

export class BackupService {
  async exportBackup(): Promise<Blob> {
    const [memes, memeBlobs, memeThumbnails, settings] = await Promise.all([
      db.memes.toArray(),
      db.memeBlobs.toArray(),
      db.memeThumbnails.toArray(),
      settingsService.get(),
    ]);

    const zip = new JSZip();
    const manifest: BackupManifest = {
      app: 'memepot',
      formatVersion: BACKUP_FORMAT_VERSION,
      exportedAt: new Date().toISOString(),
      databaseVersion: DATABASE_VERSION,
      counts: {
        memes: memes.length,
        originals: memeBlobs.length,
        thumbnails: memeThumbnails.length,
      },
      assets: {
        originals: {},
        thumbnails: {},
      },
    };

    for (const row of memeBlobs) {
      const path = getAssetPath('original', row.id, row.mimeType);
      manifest.assets.originals[row.id] = {
        path,
        memeId: row.memeId,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
        createdAt: row.createdAt,
      };
      zip.file(path, row.blob);
    }

    for (const row of memeThumbnails) {
      const path = getAssetPath('thumbnail', row.id, row.mimeType);
      manifest.assets.thumbnails[row.id] = {
        path,
        memeId: row.memeId,
        mimeType: row.mimeType,
        width: row.width,
        height: row.height,
        createdAt: row.createdAt,
      };
      zip.file(path, row.blob);
    }

    zip.file(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    zip.file(MEMES_PATH, JSON.stringify(memes, null, 2));
    zip.file(SETTINGS_PATH, JSON.stringify(settings, null, 2));

    return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  }

  async importBackup(file: File): Promise<BackupImportResult> {
    const zip = await JSZip.loadAsync(file);
    const manifest = await readJsonFile<BackupManifest>(zip, MANIFEST_PATH);
    validateManifest(manifest);

    const [backupMemes, backupSettings, localMemes, localBlobs, localThumbnails] = await Promise.all([
      readJsonFile<Meme[]>(zip, MEMES_PATH),
      readJsonFile<BackupSettings>(zip, SETTINGS_PATH).catch(() => ({})),
      db.memes.toArray(),
      db.memeBlobs.toArray(),
      db.memeThumbnails.toArray(),
    ]);
    const localIds = new Set(localMemes.map((meme) => meme.id));
    const localContentHashes = new Set(localMemes.map((meme) => meme.contentHash).filter(Boolean));
    const localBlobIds = new Set(localBlobs.map((blob) => blob.id));
    const localThumbnailIds = new Set(localThumbnails.map((thumbnail) => thumbnail.id));
    const memesToImport: Meme[] = [];
    const blobsToImport: MemeBlob[] = [];
    const thumbnailsToImport: MemeThumbnail[] = [];
    let skipped = 0;
    let failed = 0;

    for (const meme of backupMemes) {
      if (
        localIds.has(meme.id) ||
        localBlobIds.has(meme.originalBlobId) ||
        localThumbnailIds.has(meme.thumbnailBlobId) ||
        (meme.contentHash && localContentHashes.has(meme.contentHash))
      ) {
        skipped += 1;
        continue;
      }

      const originalAsset = manifest.assets.originals[meme.originalBlobId];
      if (!originalAsset || !isSupportedImageMimeType(originalAsset.mimeType)) {
        failed += 1;
        continue;
      }

      const originalBlob = await zip.file(originalAsset.path)?.async('blob');
      if (!originalBlob) {
        failed += 1;
        continue;
      }

      blobsToImport.push({
        id: meme.originalBlobId,
        memeId: meme.id,
        blob: originalBlob,
        mimeType: originalAsset.mimeType,
        sizeBytes: originalAsset.sizeBytes ?? originalBlob.size,
        createdAt: originalAsset.createdAt,
      });

      const thumbnailAsset = manifest.assets.thumbnails[meme.thumbnailBlobId];
      if (thumbnailAsset && isSupportedImageMimeType(thumbnailAsset.mimeType)) {
        const thumbnailBlob = await zip.file(thumbnailAsset.path)?.async('blob');
        if (thumbnailBlob) {
          thumbnailsToImport.push({
            id: meme.thumbnailBlobId,
            memeId: meme.id,
            blob: thumbnailBlob,
            width: thumbnailAsset.width ?? 320,
            height: thumbnailAsset.height ?? 320,
            mimeType: thumbnailAsset.mimeType,
            createdAt: thumbnailAsset.createdAt,
          });
        }
      }

      memesToImport.push(meme);
      localIds.add(meme.id);
      localBlobIds.add(meme.originalBlobId);
      localThumbnailIds.add(meme.thumbnailBlobId);
      if (meme.contentHash) {
        localContentHashes.add(meme.contentHash);
      }
    }

    await db.transaction('rw', db.memes, db.memeBlobs, db.memeThumbnails, async () => {
      if (blobsToImport.length > 0) {
        await db.memeBlobs.bulkAdd(blobsToImport);
      }
      if (thumbnailsToImport.length > 0) {
        await db.memeThumbnails.bulkAdd(thumbnailsToImport);
      }
      if (memesToImport.length > 0) {
        await db.memes.bulkAdd(memesToImport);
      }
    });

    const settingsUpdates = sanitizeSettings(backupSettings) as Partial<Settings>;
    if (Object.keys(settingsUpdates).length > 0) {
      await settingsService.set(settingsUpdates);
    }

    return {
      imported: memesToImport.length,
      skipped,
      failed,
    };
  }
}

export const backupService = new BackupService();
