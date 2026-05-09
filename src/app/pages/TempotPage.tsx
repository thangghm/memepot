import { useMemes } from '../hooks/useMemes';
import { MemeGrid } from '../components/MemeGrid';

interface TempotPageProps {
  refreshToken: number;
  searchQuery: string;
}

export function TempotPage({ refreshToken, searchQuery }: TempotPageProps) {
  const { memes, loading, refresh } = useMemes({ status: 'inbox', query: searchQuery }, refreshToken);

  if (loading) {
    return (
      <div>
        <h2 className="mb-3 text-lg font-semibold text-memepot-text">Tempot</h2>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-memepot-surface"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold text-memepot-text">
        Tempot
        {memes.length > 0 && (
          <span className="ml-2 text-sm font-normal text-memepot-muted">
            ({memes.length})
          </span>
        )}
      </h2>
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
