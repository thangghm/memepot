import type { Meme } from '@/features/memes/types/meme.types';
import { Check, RotateCcw } from 'lucide-react';
import { useThumbnail } from '../hooks/useThumbnail';
import copiedIcon from '../assets/figma/action-copied.svg';
import favoriteIcon from '../assets/figma/action-favorite.svg';
import hotIcon from '../assets/figma/action-hot.svg';
import tagIcon from '../assets/figma/action-tag.svg';
import trashIcon from '../assets/figma/action-trash.svg';

interface MemeCardProps {
  meme: Meme;
  copied: boolean;
  selected: boolean;
  onCopy: (memeId: string) => void;
  onKick?: (memeId: string) => void;
  onMakeHot?: (memeId: string) => void;
  onRestore?: (memeId: string) => void;
  onTag?: (memeId: string) => void;
  onToggleSelect: (memeId: string) => void;
  showHotActionWhenFavorite?: boolean;
  showTags?: boolean;
}

export function MemeCard({
  meme,
  copied,
  selected,
  onCopy,
  onKick,
  onMakeHot,
  onRestore,
  onTag,
  onToggleSelect,
  showHotActionWhenFavorite = false,
  showTags = true,
}: MemeCardProps) {
  const imgSrc = useThumbnail(meme.id);
  const canCopy = meme.status !== 'trash';
  const visibleTags = meme.tags.slice(0, 4);
  const makeHotIcon = meme.favorite ? hotIcon : favoriteIcon;
  const shouldShowHotAction = showHotActionWhenFavorite && meme.favorite;

  return (
    <div
      className={`group relative aspect-square w-full rounded-[10px] bg-white transition-colors hover:bg-white/95 ${
        selected ? 'ring-2 ring-memepot-primary ring-offset-2 ring-offset-memepot-neutral-2' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => {
          if (canCopy) {
            onCopy(meme.id);
          }
        }}
        aria-disabled={!canCopy}
        className={`relative flex size-full items-center justify-center overflow-hidden rounded-[10px] bg-white outline-none focus-visible:ring-2 focus-visible:ring-memepot-primary ${
          canCopy ? '' : 'cursor-default'
        }`}
        title={canCopy ? 'Copy meme' : 'Restore meme to copy'}
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

      {onMakeHot && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onMakeHot(meme.id);
          }}
          className={`absolute right-[2%] top-1/2 z-10 flex size-[clamp(18px,22%,28px)] -translate-y-1/2 items-center justify-center rounded-full bg-memepot-neutral-1 shadow-sm transition-[opacity,transform] hover:scale-110 group-focus-within:opacity-100 group-hover:opacity-100 ${
            shouldShowHotAction ? 'opacity-100' : 'opacity-0'
          }`}
          title={meme.favorite ? 'Unmake Hot' : 'Make it Hot'}
          aria-label={meme.favorite ? 'Unmake Hot' : 'Make it Hot'}
        >
          <img src={makeHotIcon} alt="" className="size-[72%]" aria-hidden />
        </button>
      )}

      {onKick && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onKick(meme.id);
          }}
          className="absolute right-[-5%] top-[-5%] z-10 flex size-[clamp(18px,22%,28px)] items-center justify-center rounded-full bg-white opacity-0 shadow-sm transition-[opacity,transform] hover:scale-110 group-focus-within:opacity-100 group-hover:opacity-100"
          title={meme.status === 'trash' ? 'Delete forever' : 'Kick'}
          aria-label={meme.status === 'trash' ? 'Delete forever' : 'Kick'}
        >
          <img src={trashIcon} alt="" className="size-[72%]" aria-hidden />
        </button>
      )}

      <label
        className={`absolute left-[4%] top-[4%] z-10 flex size-[clamp(15px,19%,24px)] cursor-pointer items-center justify-center rounded-full bg-memepot-neutral-1 text-memepot-back shadow-sm transition-[opacity,transform] hover:scale-110 group-focus-within:opacity-100 group-hover:opacity-100 ${
          selected ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(meme.id)}
          className="sr-only"
          aria-label="Select meme"
        />
        {selected ? <Check size={12} strokeWidth={3} aria-hidden /> : <span className="size-2 rounded-full bg-white" />}
      </label>

      {onRestore && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRestore(meme.id);
          }}
          className="absolute bottom-[2%] right-[2%] z-10 flex size-[clamp(18px,22%,28px)] items-center justify-center rounded-full bg-memepot-neutral-1 text-memepot-primary opacity-0 shadow-sm transition-[opacity,transform] hover:scale-110 group-focus-within:opacity-100 group-hover:opacity-100"
          title="Restore"
          aria-label="Restore"
        >
          <RotateCcw className="size-[72%]" strokeWidth={3} aria-hidden />
        </button>
      )}

      {onTag && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onTag(meme.id);
          }}
          className="absolute bottom-[2%] right-[2%] z-10 flex size-[clamp(18px,22%,28px)] items-center justify-center rounded-full bg-memepot-neutral-1 opacity-0 shadow-sm transition-[opacity,transform] hover:scale-110 group-focus-within:opacity-100 group-hover:opacity-100"
          title="Tag"
          aria-label="Tag"
        >
          <img src={tagIcon} alt="" className="size-[72%]" aria-hidden />
        </button>
      )}

      {showTags && visibleTags.length > 0 && (
        <div className="absolute bottom-[5px] left-[3px] z-10 flex max-w-[38px] flex-col gap-0.5">
          {visibleTags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="block h-[10px] max-w-[38px] truncate rounded-lg bg-memepot-neutral-1 px-1 text-[8px] leading-[10px] text-memepot-primary shadow-sm"
              title={tag}
            >
              {tag || 'Tag'}
            </span>
          ))}
        </div>
      )}

      {meme.favorite && !onMakeHot && (
        <span className="absolute right-[2%] top-1/2 z-10 flex size-[clamp(18px,22%,28px)] -translate-y-1/2 items-center justify-center rounded-full bg-memepot-neutral-1 opacity-0 shadow-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
          <img src={hotIcon} alt="" className="size-[72%]" aria-hidden />
        </span>
      )}
    </div>
  );
}
