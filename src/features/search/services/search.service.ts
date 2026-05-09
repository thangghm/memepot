// SearchService — stub. Full implementation in Milestone 5.
import type { Meme, MemeFilter } from '@/features/memes/types/meme.types';
import { db } from '@/shared/db';
import { normalizeText } from '../utils/normalize';

export class SearchService {
  async search(_query: string, _filter?: MemeFilter): Promise<Meme[]> {
    const queryTokens = normalizeText(_query).split(' ').filter(Boolean);
    let memes = await db.memes.toArray();

    if (_filter?.status) {
      memes = memes.filter((meme) => meme.status === _filter.status);
    }

    if (_filter?.favorites !== undefined) {
      memes = memes.filter((meme) => meme.favorite === _filter.favorites);
    }

    if (_filter?.tags?.length) {
      memes = memes.filter((meme) => _filter.tags?.every((tag) => meme.tags.includes(tag)));
    }

    if (queryTokens.length > 0) {
      memes = memes.filter((meme) => {
        const searchText = normalizeText(
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

        return queryTokens.every((token) => searchText.includes(token));
      });
    }

    return this.sortResults(memes, _filter?.sort);
  }

  normalizeText(input: string): string {
    return normalizeText(input);
  }

  private sortResults(memes: Meme[], sort: MemeFilter['sort'] = 'created') {
    return [...memes].sort((a, b) => {
      if (sort === 'frequent') {
        return b.usageCount - a.usageCount;
      }

      const aTimestamp = sort === 'used' ? (a.lastUsedAt ?? a.updatedAt) : a.createdAt;
      const bTimestamp = sort === 'used' ? (b.lastUsedAt ?? b.updatedAt) : b.createdAt;
      return bTimestamp.localeCompare(aTimestamp);
    });
  }
}

export const searchService = new SearchService();
