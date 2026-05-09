import type { Meme } from '@/features/memes/types/meme.types';
import { Check } from 'lucide-react';
import { useThumbnail } from '../hooks/useThumbnail';
import copiedIcon from '../assets/figma/action-copied.svg';
import favoriteIcon from '../assets/figma/action-favorite.svg';

interface MemeCardProps {
  meme: Meme;
  copied: boolean;
  selected: boolean;
  onCopy: (memeId: string) => void;
  onContextMenu: (memeId: string, x: number, y: number) => void;
  onToggleSelect: (memeId: string) => void;
  showTags?: boolean;
}

export function MemeCard({
  meme,
  copied,
  selected,
  onCopy,
  onContextMenu,
  onToggleSelect,
  showTags = true,
}: MemeCardProps) {
  const imgSrc = useThumbnail(meme.id);

  return (
    <div
      className={`group relative aspect-square w-full overflow-hidden rounded-lg bg-white transition-colors hover:bg-white/90 ${
        selected ? 'ring-2 ring-memepot-primary ring-offset-2 ring-offset-memepot-neutral-2' : ''
      }`}
      onContextMenu={(event) => {
        event.preventDefault();
        onContextMenu(meme.id, event.clientX, event.clientY);
      }}
    >
      <button
        type="button"
        onClick={() => onCopy(meme.id)}
        className="relative flex size-full items-center justify-center overflow-hidden rounded-lg bg-white outline-none focus:ring-2 focus:ring-memepot-primary"
        title="Copy meme"
      >
        {imgSrc ? (
          <img src={imgSrc} alt="Saved meme" className="size-full object-cover" />
        ) : (
          <span className="text-2xl text-memepot-muted">?</span>
        )}
        {copied && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70">
            <span className="flex size-10 items-center justify-center rounded-full bg-white shadow">
              <img src={copiedIcon} alt="" className="size-6" aria-hidden />
            </span>
            <span className="sr-only">Copied</span>
          </span>
        )}
      </button>

      <label className="absolute left-1.5 top-1.5 flex size-5 cursor-pointer items-center justify-center rounded bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 has-[:checked]:opacity-100">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(meme.id)}
          className="sr-only"
          aria-label="Select meme"
        />
        {selected ? <Check size={14} aria-hidden /> : <span className="size-3 rounded-sm border border-white/80" />}
      </label>

      {showTags && meme.tags.length > 0 && (
        <div className="absolute inset-x-1 bottom-1 flex min-h-5 flex-wrap gap-1">
          {meme.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-white/90 px-1 py-0.5 text-[10px] leading-none text-memepot-primary shadow"
            >
              {tag}
            </span>
          ))}
          {meme.tags.length > 3 && (
            <span className="rounded bg-white/90 px-1 py-0.5 text-[10px] leading-none text-memepot-primary shadow">
              +{meme.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {meme.favorite && (
        <span className="absolute right-1.5 top-1.5 rounded bg-white p-1 shadow">
          <img src={favoriteIcon} alt="" className="size-4" aria-hidden />
        </span>
      )}
    </div>
  );
}
