// ClipboardService — stub. Full implementation in Milestone 6.
import { db } from '@/shared/db';
import { ClipboardWriteFailedError } from '@/shared/errors';
import { memeService } from '@/features/memes/services/meme.service';
import { imageToBlob } from '../utils/image-converter';

export class ClipboardService {
  async copyImage(memeId: string): Promise<void> {
    // TODO(Milestone 6): load blob, write to clipboard, update usage
    await this.assertCopyable(memeId);
    const blob = await db.memeBlobs.where('memeId').equals(memeId).first();
    if (!blob) throw new ClipboardWriteFailedError();
    const clipboardBlob =
      blob.blob.type === 'image/png' ? blob.blob : await imageToBlob(blob.blob, 'image/png');
    await this.writeBlob(clipboardBlob);
    await memeService.updateUsage(memeId);
  }

  async copyAsPng(memeId: string): Promise<void> {
    await this.assertCopyable(memeId);
    const blob = await db.memeBlobs.where('memeId').equals(memeId).first();
    if (!blob) throw new ClipboardWriteFailedError();
    const pngBlob = await imageToBlob(blob.blob, 'image/png');
    await this.writeBlob(pngBlob);
    await memeService.updateUsage(memeId);
  }

  async copyAsJpg(memeId: string): Promise<void> {
    await this.assertCopyable(memeId);
    const blob = await db.memeBlobs.where('memeId').equals(memeId).first();
    if (!blob) throw new ClipboardWriteFailedError();
    const jpgBlob = await imageToBlob(blob.blob, 'image/jpeg');
    await this.writeBlob(jpgBlob);
    await memeService.updateUsage(memeId);
  }

  private async writeBlob(_blob: Blob): Promise<void> {
    try {
      await navigator.clipboard.write([new ClipboardItem({ [_blob.type]: _blob })]);
    } catch {
      throw new ClipboardWriteFailedError();
    }
  }

  private async assertCopyable(memeId: string): Promise<void> {
    const meme = await memeService.getById(memeId);
    if (meme?.status === 'trash') {
      throw new ClipboardWriteFailedError('Restore this meme before copying.');
    }
  }
}

export const clipboardService = new ClipboardService();
