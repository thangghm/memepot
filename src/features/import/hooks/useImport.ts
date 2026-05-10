// useImport hook — stub
import { useState } from 'react';
import { importService } from '../services/import.service';
import type { MemeImportResult } from '../types/import-result.types';

export function useImport() {
  const [importing, setImporting] = useState(false);

  async function importFiles(files: File[]) {
    setImporting(true);
    try {
      const results: MemeImportResult[] = [];
      for (const file of files) {
        const result = await importService.importFromFile(file);
        results.push(result);
      }
      return results;
    } finally {
      setImporting(false);
    }
  }

  return { importFiles, importing };
}
