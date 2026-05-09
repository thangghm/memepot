import type { Meme } from '@/features/memes/types/meme.types';
import { Check, Star } from 'lucide-react';
import { useThumbnail } from '../hooks/useThumbnail';

interface MemeCardProps {
  meme: Meme;
  copied: boolean;
  selected: boolean;
  onCopy: (memeId: string) => void;
  onContextMenu: (memeId: string, x: number, y: number) => void;
  onToggleSelect: (memeId: string) => void;
}

export function MemeCard({
  meme,
  copied,
  selected,
  onCopy,
  onContextMenu,
  onToggleSelect,
}: MemeCardProps) {
  const imgSrc = useThumbnail(meme.id);

  return (
    <div
      className={`group relative flex flex-col rounded-lg bg-memepot-surface p-2 transition-colors hover:bg-memepot-accent/20 ${
        selected ? 'ring-2 ring-memepot-primary' : ''
      }`}
      onContextMenu={(event) => {
        event.preventDefault();
        onContextMenu(meme.id, event.clientX, event.clientY);
      }}
    >
      <button
        type="button"
        onClick={() => onCopy(meme.id)}
        className="relative mb-2 flex aspect-square items-center justify-center overflow-hidden rounded bg-memepot-accent/30 outline-none focus:ring-2 focus:ring-memepot-primary"
        title="Copy meme"
      >
        {imgSrc ? (
          <img src={imgSrc} alt="Saved meme" className="size-full object-cover" />
        ) : (
          <span className="text-2xl text-memepot-muted">?</span>
        )}
        {copied && (
          <span className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
            <Check size={15} aria-hidden />
            <span className="sr-only">Copied</span>
          </span>
        )}
      </button>

      <label className="absolute left-2 top-2 flex size-6 cursor-pointer items-center justify-center rounded bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 has-[:checked]:opacity-100">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(meme.id)}
          className="sr-only"
          aria-label="Select meme"
        />
        {selected ? <Check size={14} aria-hidden /> : <span className="size-3 rounded-sm border border-white/80" />}
      </label>

      {meme.tags.length > 0 && (
        <div className="flex min-h-5 flex-wrap gap-1">
          {meme.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-memepot-accent/40 px-1.5 py-0.5 text-[10px] text-memepot-muted"
            >
              {tag}
            </span>
          ))}
          {meme.tags.length > 3 && (
            <span className="text-[10px] text-memepot-muted">+{meme.tags.length - 3}</span>
          )}
        </div>
      )}

      {meme.favorite && (
        <span className="absolute right-2 top-2 rounded bg-black/70 p-1 text-yellow-400">
          <Star size={13} aria-hidden fill="currentColor" />
        </span>
      )}
    </div>
  );
}
