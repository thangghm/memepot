import { useState } from 'react';
import { useMemes } from '../hooks/useMemes';
import { MemeGrid } from '../components/MemeGrid';
import { SortControls } from '../components/SortControls';
import { getSortOptions, type MemeSortPreset } from '../utils/memeSort';

interface PotPageProps {
  refreshToken: number;
  searchQuery: string;
}

export function PotPage({ refreshToken, searchQuery }: PotPageProps) {
  const [sortPreset, setSortPreset] = useState<MemeSortPreset>('newest');
  const { memes, loading, refresh } = useMemes(
    { query: searchQuery, status: 'active', taggedOnly: true, ...getSortOptions(sortPreset) },
    refreshToken,
  );

  if (loading) {
    return (
      <div>
        <SortControls value={sortPreset} onChange={setSortPreset} />
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
      <SortControls value={sortPreset} onChange={setSortPreset} />
      <MemeGrid
        memes={memes}
        onChanged={refresh}
        emptyMessage={searchQuery ? 'No Pot memes match your search.' : 'No tagged memes yet.'}
      />
    </div>
  );
}
