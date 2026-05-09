import { MemeGrid } from '../components/MemeGrid';
import { useMemes, type UseMemesOptions } from '../hooks/useMemes';

interface MemeListPageProps {
  title: string;
  refreshToken: number;
  options?: UseMemesOptions;
  emptyMessage?: string;
}

export function MemeListPage({
  title,
  refreshToken,
  options = {},
  emptyMessage,
}: MemeListPageProps) {
  const { memes, loading, refresh } = useMemes(options, refreshToken);

  if (loading) {
    return (
      <div>
        <h2 className="mb-3 text-lg font-semibold text-memepot-text">{title}</h2>
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
        {title}
        {memes.length > 0 && (
          <span className="ml-2 text-sm font-normal text-memepot-muted">
            ({memes.length})
          </span>
        )}
      </h2>
      <MemeGrid memes={memes} onChanged={refresh} emptyMessage={emptyMessage} />
    </div>
  );
}
