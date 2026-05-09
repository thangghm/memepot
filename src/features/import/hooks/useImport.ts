// useImport hook — stub
import { useState } from 'react';
import { importService } from '../services/import.service';

export function useImport() {
  const [importing, setImporting] = useState(false);

  async function importFiles(files: File[]) {
    setImporting(true);
    try {
      const ids: string[] = [];
      for (const file of files) {
        const id = await importService.importFromFile(file);
        ids.push(id);
      }
      return ids;
    } finally {
      setImporting(false);
    }
  }

  return { importFiles, importing };
}