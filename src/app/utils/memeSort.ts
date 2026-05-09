export type MemeSortPreset = 'mostCopied' | 'leastCopied' | 'newest' | 'oldest';

export function getSortOptions(value: MemeSortPreset) {
  switch (value) {
    case 'leastCopied':
      return { sort: 'frequent' as const, sortDirection: 'asc' as const };
    case 'newest':
      return { sort: 'created' as const, sortDirection: 'desc' as const };
    case 'oldest':
      return { sort: 'created' as const, sortDirection: 'asc' as const };
    case 'mostCopied':
    default:
      return { sort: 'frequent' as const, sortDirection: 'desc' as const };
  }
}
