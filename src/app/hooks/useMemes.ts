import { useCallback, useEffect, useState } from 'react';
import type { Meme, MemeStatus } from '@/features/memes/types/meme.types';
import { normalizeText } from '@/features/search/utils/normalize';

export interface UseMemesOptions {
  status?: MemeStatus;
  favorite?: boolean;
  sort?: 'created' | 'frequent' | 'used';
  sortDirection?: 'asc' | 'desc';
  includeTrash?: boolean;
  taggedOnly?: boolean;
  usedOnly?: boolean;
  query?: string;
}

function getCreatedTimestamp(meme: Meme) {
  return meme.createdAt;
}

function getUsedTimestamp(meme: Meme) {
  return meme.lastUsedAt ?? meme.updatedAt ?? meme.createdAt;
}

function getSearchText(meme: Meme) {
  return normalizeText(
    [
      meme.note,
      meme.sourceDomain,
      meme.sourceUrl,
      meme.pageUrl,
      ...meme.tags,
    ]
      .filter(Boolean)
      .join(' '),
  );
}

function matchesSearch(meme: Meme, query: string) {
  const tokens = normalizeText(query).split(' ').filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  const searchText = getSearchText(meme);
  return tokens.every((token) => searchText.includes(token));
}

function filterAndSortMemes(memes: Meme[], options: UseMemesOptions) {
  let nextMemes = [...memes];

  if (!options.includeTrash && options.status !== 'trash') {
    nextMemes = nextMemes.filter((meme) => meme.status !== 'trash');
  }

  if (options.status) {
    nextMemes = nextMemes.filter((meme) => meme.status === options.status);
  }

  if (options.favorite !== undefined) {
    nextMemes = nextMemes.filter((meme) => meme.favorite === options.favorite);
  }

  if (options.taggedOnly) {
    nextMemes = nextMemes.filter((meme) => meme.tags.length > 0);
  }

  if (options.usedOnly) {
    nextMemes = nextMemes.filter((meme) => meme.usageCount > 0 || Boolean(meme.lastUsedAt));
  }

  if (options.query?.trim()) {
    nextMemes = nextMemes.filter((meme) => matchesSearch(meme, options.query ?? ''));
  }

  const direction = options.sortDirection ?? 'desc';
  const sortDate = (a: string, b: string) => (
    direction === 'desc' ? b.localeCompare(a) : a.localeCompare(b)
  );
  const sortNumber = (a: number, b: number) => (direction === 'desc' ? b - a : a - b);

  switch (options.sort) {
    case 'frequent':
      nextMemes.sort((a, b) => sortNumber(a.usageCount, b.usageCount) || sortDate(a.createdAt, b.createdAt));
      break;
    case 'used':
      nextMemes.sort((a, b) => sortDate(getUsedTimestamp(a), getUsedTimestamp(b)));
      break;
    case 'created':
    default:
      nextMemes.sort((a, b) => sortDate(getCreatedTimestamp(a), getCreatedTimestamp(b)));
      break;
  }

  return nextMemes;
}

export function useMemes(options: UseMemesOptions = {}, refreshToken = 0) {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorite, includeTrash, query, sort, sortDirection, status, taggedOnly, usedOnly } = options;

  const fetchMemes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({ type: 'GET_MEMES' });
      if (response?.success) {
        setMemes(
          filterAndSortMemes(response.memes as Meme[], {
            favorite,
            includeTrash,
            query,
            sort,
            sortDirection,
            status,
            taggedOnly,
            usedOnly,
          }),
        );
      }
    } catch (err) {
      console.error('[useMemes] Failed to fetch memes:', err);
    } finally {
      setLoading(false);
    }
  }, [favorite, includeTrash, query, sort, sortDirection, status, taggedOnly, usedOnly]);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes, refreshToken]);

  return { memes, loading, refresh: fetchMemes };
}
