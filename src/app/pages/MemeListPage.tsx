import { useState } from 'react';
import { MemeGrid } from '../components/MemeGrid';
import { SortControls } from '../components/SortControls';
import { useMemes, type UseMemesOptions } from '../hooks/useMemes';
import { getSortOptions, type MemeSortPreset } from '../utils/memeSort';

interface MemeListPageProps {
  title: string;
  refreshToken: number;
  options?: UseMemesOptions;
  emptyMessage?: string;
  sortable?: boolean;
  variant?: 'pot' | 'hotpot' | 'trash';
}

export function MemeListPage({
  title,
  refreshToken,
  options = {},
  emptyMessage,
  sortable = false,
  variant = 'pot',
}: MemeListPageProps) {
  const [sortPreset, setSortPreset] = useState<MemeSortPreset>('mostCopied');
  const sortOptions = sortable ? getSortOptions(sortPreset) : {};
  const { memes, loading, refresh } = useMemes({ ...options, ...sortOptions }, refreshToken);

  if (loading) {
    return (
      <div aria-label={`Loading ${title}`}>
        {sortable && <SortControls value={sortPreset} onChange={setSortPreset} />}
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
      {sortable && <SortControls value={sortPreset} onChange={setSortPreset} />}
      <MemeGrid memes={memes} onChanged={refresh} emptyMessage={emptyMessage} variant={variant} />
    </div>
  );
}
