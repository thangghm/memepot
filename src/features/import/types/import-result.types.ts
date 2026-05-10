export type MemeImportResult =
  | { status: 'imported'; memeId: string }
  | { status: 'duplicate'; memeId: string; duplicateKind: 'exact' | 'similar' };
