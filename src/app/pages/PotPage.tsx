import { useMemes } from '../hooks/useMemes';
import { MemeGrid } from '../components/MemeGrid';

interface PotPageProps {
  refreshToken: number;
  searchQuery: string;
}

export function PotPage({ refreshToken, searchQuery }: PotPageProps) {
  const { memes, loading, refresh } = useMemes(
    { query: searchQuery, sort: 'created', status: 'active' },
    refreshToken,
  );

  if (loading) {
    return (
      <div>
        <h2 className="mb-3 text-lg font-semibold text-memepot-text">Pot</h2>
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
        Pot
        {memes.length > 0 && (
          <span className="ml-2 text-sm font-normal text-memepot-muted">
            ({memes.length})
          </span>
        )}
      </h2>
      <MemeGrid
        memes={memes}
        onChanged={refresh}
        emptyMessage={searchQuery ? 'No Pot memes match your search.' : 'No tagged memes yet.'}
      />
    </div>
  );
}
