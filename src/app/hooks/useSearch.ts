// useSearch hook — stub (full implementation in Milestone 5)
import { useState, useCallback } from 'react';
import { searchService } from '@/features/search/services/search.service';
import type { Meme } from '@/features/memes/types/meme.types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Meme[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await searchService.search(q);
      setResults(res);
    } finally {
      setSearching(false);
    }
  }, []);

  return { query, results, searching, search };
}