// useMemeActions hook — stub (full implementation in Milestones 4 & 6)
import { useCallback } from 'react';
import { memeService } from '@/features/memes/services/meme.service';
import { clipboardService } from '@/features/clipboard/services/clipboard.service';
import type { Meme } from '@/features/memes/types/meme.types';

export function useMemeActions() {
  const copy = useCallback(async (memeId: string) => {
    console.log('[useMemeActions] copy:', memeId);
    await clipboardService.copyImage(memeId);
  }, []);

  const favorite = useCallback(async (memeId: string) => {
    console.log('[useMemeActions] favorite:', memeId);
    await memeService.toggleFavorite(memeId);
  }, []);

  const trash = useCallback(async (memeId: string) => {
    console.log('[useMemeActions] trash:', memeId);
    await memeService.moveToTrash(memeId);
  }, []);

  const restore = useCallback(async (memeId: string) => {
    console.log('[useMemeActions] restore:', memeId);
    await memeService.restore(memeId);
  }, []);

  const deleteMeme = useCallback(async (memeId: string) => {
    console.log('[useMemeActions] delete:', memeId);
    await memeService.delete(memeId);
  }, []);

  const update = useCallback(async (memeId: string, updates: Partial<Meme>) => {
    console.log('[useMemeActions] update:', memeId);
    await memeService.update(memeId, updates);
  }, []);

  return { copy, favorite, trash, restore, delete: deleteMeme, update };
}
