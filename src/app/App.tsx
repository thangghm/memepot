import type { ChangeEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Routes } from './routes';
import { Sidebar } from './components/Sidebar';
import { useImport } from '@/features/import';

interface AppProps {
  children?: ReactNode;
}

export default function App({ children }: AppProps) {
  const [activeView, setActiveView] = useState('tempot');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importFiles, importing } = useImport();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = '';

    if (files.length === 0) {
      return;
    }

    setImportError(null);
    try {
      await importFiles(files);
      setActiveView('tempot');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import selected images.';
      console.error('[App] Import failed:', error);
      setImportError(message);
    }
  };

  return (
    <div className="flex h-[600px] w-[400px] flex-col bg-memepot-bg">
      {/* Header */}
      <div className="border-b border-memepot-accent/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search memes..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="flex-1 rounded bg-memepot-surface px-3 py-1.5 text-sm text-memepot-text outline-none placeholder:text-memepot-muted focus:ring-1 focus:ring-memepot-primary"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="rounded bg-memepot-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleImportClick}
            disabled={importing}
          >
            {importing ? 'Importing...' : 'Import'}
          </button>
          <button
            type="button"
            className="rounded px-2 py-1.5 text-sm text-memepot-muted hover:bg-memepot-surface hover:text-memepot-text"
            onClick={() => setActiveView('settings')}
          >
            Settings
          </button>
        </div>
        {importError && (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {importError}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-y-auto p-3">
          <Routes activeView={activeView} refreshToken={refreshToken} searchQuery={searchQuery} />
        </main>
      </div>

      {children}
    </div>
  );
}
