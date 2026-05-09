import { useMemes } from '../hooks/useMemes';
import { MemeGrid } from '../components/MemeGrid';

interface TempotPageProps {
  refreshToken: number;
  searchQuery: string;
}

export function TempotPage({ refreshToken, searchQuery }: TempotPageProps) {
  const { memes, loading, refresh } = useMemes({ status: 'inbox', query: searchQuery }, refreshToken);
  const autoClearMessage = 'TemPot auto-clear every 48h; tag them to keep longer';

  if (loading) {
    return (
      <div>
        <p className="mb-2 rounded-[10px] bg-memepot-neutral-1 px-2 py-1 text-sm leading-none text-memepot-back/70">
          {autoClearMessage}
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="size-20 animate-pulse rounded-lg bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 rounded-[10px] bg-memepot-neutral-1 px-2 py-1 text-sm leading-none text-memepot-back/70">
        {autoClearMessage}
      </p>
      <MemeGrid
        memes={memes}
        onChanged={refresh}
        emptyMessage={
          searchQuery
            ? 'No Tempot memes match your search.'
            : "No memes in Tempot. Right-click an image and select 'Pot it' to get started."
        }
      />
    </div>
  );
}
