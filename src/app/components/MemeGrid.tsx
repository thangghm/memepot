import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { MemeCard } from './MemeCard';
import type { Meme, MemeStatus } from '@/features/memes/types/meme.types';
import { useMemeActions } from '../hooks/useMemeActions';
import { useSettings } from '../hooks/useSettings';
import { TagMemeModal } from './TagMemeModal';
import favoriteIcon from '../assets/figma/action-favorite.svg';
import tagIcon from '../assets/figma/action-tag.svg';
import trashIcon from '../assets/figma/action-trash.svg';

interface MemeGridProps {
  memes?: Meme[];
  emptyMessage?: string;
  onChanged?: () => void | Promise<void>;
}

interface ContextMenuState {
  memeId: string;
  x: number;
  y: number;
}

export function MemeGrid({ memes = [], emptyMessage = 'No memes yet. Import some!', onChanged }: MemeGridProps) {
  const actions = useMemeActions();
  const { settings } = useSettings();
  const [taggingMeme, setTaggingMeme] = useState<Meme | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copiedMemeId, setCopiedMemeId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const gridClassName = {
    small: 'grid-cols-4',
    medium: 'grid-cols-3',
    large: 'grid-cols-2',
  }[settings?.gridSize ?? 'small'];
  const shouldConfirmPermanentDelete = settings?.confirmBeforePermanentDelete ?? true;
  const contextMeme = contextMenu ? memes.find((meme) => meme.id === contextMenu.memeId) : null;

  useEffect(() => {
    setSelectedIds((ids) => ids.filter((id) => memes.some((meme) => meme.id === id)));
  }, [memes]);

  useEffect(() => {
    if (!contextMenu) {
      return;
    }

    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);

    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [contextMenu]);

  const refresh = async () => {
    await onChanged?.();
  };

  const runAction = async (operation: () => Promise<void>, successMessage?: string) => {
    setActionError(null);
    setActionMessage(null);

    try {
      await operation();
      await refresh();
      if (successMessage) {
        setActionMessage(successMessage);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed.';
      setActionError(message);
    }
  };

  const getMetadataStatus = (meme: Meme, updates: Partial<Meme>): MemeStatus | undefined => {
    if (meme.status === 'trash') {
      return undefined;
    }

    const tags = updates.tags ?? meme.tags;
    return tags.length > 0 ? 'active' : 'inbox';
  };

  const openTagEditor = (memeId: string) => {
    const meme = memes.find((item) => item.id === memeId);
    if (meme) {
      setTaggingMeme(meme);
    }
    setContextMenu(null);
  };

  const handleCopy = (memeId: string) => {
    const meme = memes.find((item) => item.id === memeId);
    if (meme?.status === 'trash') {
      setActionMessage(null);
      setActionError('Restore this meme before copying.');
      return;
    }

    void (async () => {
      setActionError(null);
      setActionMessage(null);

      try {
        await actions.copy(memeId);

        if (settings?.closeAfterCopy) {
          window.close();
          return;
        }

        setCopiedMemeId(memeId);
        window.setTimeout(() => {
          setCopiedMemeId((current) => (current === memeId ? null : current));
        }, 900);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Action failed.';
        setActionError(message);
      }
    })();
  };

  const handleKick = (memeId: string) => {
    const meme = memes.find((item) => item.id === memeId);
    if (!meme) {
      return;
    }

    setContextMenu(null);

    if (meme.status === 'trash') {
      if (shouldConfirmPermanentDelete && !window.confirm('Delete this meme permanently?')) {
        return;
      }

      void runAction(() => actions.delete(memeId), 'Deleted permanently.');
      return;
    }

    void runAction(() => actions.trash(memeId), 'Kicked.');
  };

  const handleRestore = (memeId: string) => {
    setContextMenu(null);
    void runAction(() => actions.restore(memeId), 'Restored.');
  };

  const handleToggleSelect = (memeId: string) => {
    setSelectedIds((ids) => (ids.includes(memeId) ? ids.filter((id) => id !== memeId) : [...ids, memeId]));
  };

  const handleBatchDelete = () => {
    const selectedMemes = memes.filter((meme) => selectedIds.includes(meme.id));
    const trashItems = selectedMemes.filter((meme) => meme.status === 'trash');
    const activeItems = selectedMemes.filter((meme) => meme.status !== 'trash');

    if (selectedMemes.length === 0) {
      return;
    }

    if (
      trashItems.length > 0 &&
      shouldConfirmPermanentDelete &&
      !window.confirm(`Delete ${trashItems.length} meme(s) permanently?`)
    ) {
      return;
    }

    void runAction(async () => {
      await Promise.all([
        ...activeItems.map((meme) => actions.trash(meme.id)),
        ...trashItems.map((meme) => actions.delete(meme.id)),
      ]);
      setSelectedIds([]);
    }, trashItems.length > 0 ? 'Deleted selected meme(s).' : 'Moved selected meme(s) to Trash.');
  };

  const handleBatchRestore = () => {
    const selectedMemes = memes.filter((meme) => selectedIds.includes(meme.id) && meme.status === 'trash');

    if (selectedMemes.length === 0) {
      return;
    }

    void runAction(async () => {
      await Promise.all(selectedMemes.map((meme) => actions.restore(meme.id)));
      setSelectedIds([]);
    }, 'Restored selected meme(s).');
  };

  if (memes.length === 0) {
    return (
      <div className="flex h-full min-h-48 items-center justify-center">
        <p className="max-w-64 text-center text-sm leading-none text-memepot-back/60">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      {(actionError || actionMessage) && (
        <p className={`mb-2 text-xs ${actionError ? 'text-red-700' : 'text-memepot-primary'}`} role="status">
          {actionError ?? actionMessage}
        </p>
      )}

      {selectedIds.length > 0 && (
        <div className="mb-2 flex items-center gap-2 rounded-[10px] bg-white px-2 py-1.5">
          <span className="text-xs text-memepot-back/70">{selectedIds.length} selected</span>
          <button
            type="button"
            onClick={handleBatchDelete}
            className="ml-auto rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
          >
            Delete
          </button>
          {memes.some((meme) => selectedIds.includes(meme.id) && meme.status === 'trash') && (
            <button
              type="button"
              onClick={handleBatchRestore}
              className="rounded bg-memepot-primary px-2 py-1 text-xs text-white hover:opacity-90"
            >
              Restore
            </button>
          )}
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="rounded px-2 py-1 text-xs text-memepot-back/70 hover:bg-memepot-neutral-1"
          >
            Clear
          </button>
        </div>
      )}

      <div className={`grid ${gridClassName} gap-2.5`}>
        {memes.map((meme) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            copied={copiedMemeId === meme.id}
            selected={selectedIds.includes(meme.id)}
            onCopy={handleCopy}
            onContextMenu={(memeId, x, y) => setContextMenu({ memeId, x, y })}
            onToggleSelect={handleToggleSelect}
            showTags={settings?.showTags ?? true}
          />
        ))}
      </div>

      {contextMenu && contextMeme && (
        <div
          className="fixed z-50 min-w-36 rounded-[10px] bg-white py-1 text-sm shadow-xl ring-1 ring-black/10"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          {contextMeme.status === 'trash' ? (
            <button
              type="button"
              onClick={() => handleRestore(contextMeme.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-memepot-primary hover:bg-memepot-neutral-1"
              >
                <RotateCcw size={14} aria-hidden />
                Restore
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openTagEditor(contextMeme.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-memepot-primary hover:bg-memepot-neutral-1"
              >
                <img src={tagIcon} alt="" className="size-4" aria-hidden />
                Tag
              </button>
              {contextMeme.status !== 'inbox' && (
                <button
                  type="button"
                  onClick={() => {
                    setContextMenu(null);
                    void runAction(
                      () => actions.makeHot(contextMeme.id),
                      contextMeme.favorite ? 'Removed Hot mark.' : 'Made Hot.',
                    );
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-memepot-primary hover:bg-memepot-neutral-1"
                >
                  <img src={favoriteIcon} alt="" className="size-4" aria-hidden />
                  {contextMeme.favorite ? 'Unmake Hot' : 'Make it Hot'}
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => handleKick(contextMeme.id)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-memepot-primary hover:bg-memepot-neutral-1"
          >
            <img src={trashIcon} alt="" className="size-4" aria-hidden />
            {contextMeme.status === 'trash' ? 'Delete Forever' : 'Kick'}
          </button>
        </div>
      )}

      {taggingMeme && (
        <TagMemeModal
          meme={taggingMeme}
          onClose={() => setTaggingMeme(null)}
          onSave={async (updates) => {
            const status = getMetadataStatus(taggingMeme, updates);
            await actions.update(taggingMeme.id, status ? { ...updates, status } : updates);
            await refresh();
          }}
        />
      )}
    </>
  );
}
