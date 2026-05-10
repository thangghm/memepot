import type { ChangeEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';
import { Routes } from './routes';
import { useImport } from '@/features/import';
import hotpotIcon from './assets/figma/hotpot.png';
import logoIcon from './assets/figma/logo.png';
import potIcon from './assets/figma/pot.png';
import settingsActiveIcon from './assets/figma/settings-active.svg';
import settingsInactiveIcon from './assets/figma/settings-inactive.svg';
import tempotIcon from './assets/figma/tempot.png';
import trashIcon from './assets/figma/trash.png';
import wordmarkIcon from './assets/figma/wordmark.svg';
import wordmarkSettingsIcon from './assets/figma/wordmark-settings.svg';

interface AppProps {
  children?: ReactNode;
}

const navigationItems = [
  { id: 'tempot', label: 'Tempot', icon: tempotIcon },
  { id: 'pot', label: 'Pot', icon: potIcon },
  { id: 'hotpot', label: 'HotPot', icon: hotpotIcon },
  { id: 'trash', label: 'Trash', icon: trashIcon },
];

export default function App({ children }: AppProps) {
  const [activeView, setActiveView] = useState('tempot');
  const [lastContentView, setLastContentView] = useState('tempot');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importFiles, importing } = useImport();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.trim()) {
      setActiveView('pot');
      setLastContentView('pot');
    }
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
      setLastContentView('tempot');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import selected images.';
      console.error('[App] Import failed:', error);
      setImportError(message);
    }
  };

  return (
    <div
      className="flex h-[600px] w-[400px] flex-col overflow-hidden rounded-[20px] bg-memepot-neutral-1 p-3 font-memepot text-memepot-back"
      data-node-id={activeView === 'settings' ? '2:8' : '1:2'}
    >
      <header className="relative z-10 flex h-9 shrink-0 items-start gap-2.5">
        <label className="flex h-9 w-[222px] items-center rounded-[10px] bg-white px-2">
          <span className="sr-only">Search memes</span>
          <input
            type="text"
            placeholder="search: scary, laught, irony..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm leading-none text-memepot-back outline-none placeholder:text-memepot-neutral-1"
          />
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="flex h-9 w-[98px] items-center justify-center rounded-[10px] bg-memepot-primary text-lg leading-none text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleImportClick}
          disabled={importing}
        >
          {importing ? 'POT...' : 'ImPOT'}
        </button>
        <button
          type="button"
          className={`flex size-9 items-center justify-center rounded-[10px] ${
            activeView === 'settings'
              ? 'bg-memepot-primary'
              : 'border-2 border-memepot-primary bg-transparent'
          }`}
          onClick={() => {
            setActiveView((view) => (view === 'settings' ? lastContentView : 'settings'));
          }}
          title="Settings"
          aria-label="Settings"
        >
          <img
            src={activeView === 'settings' ? settingsActiveIcon : settingsInactiveIcon}
            alt=""
            className="size-[27px]"
            aria-hidden
          />
        </button>
      </header>

      {importError && (
        <p className="relative z-10 mt-2 text-xs text-red-600" role="alert">
          {importError}
        </p>
      )}

      <div className="relative z-10 mt-2.5 flex min-h-0 flex-1 flex-col gap-[11px] rounded-[10px]">
        {activeView !== 'settings' && (
          <nav className="grid h-12 shrink-0 grid-cols-4 gap-2.5" aria-label="Meme sections">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex h-12 items-center justify-center rounded-lg ${
                  activeView === item.id ? 'bg-memepot-neutral-2' : 'bg-transparent'
                }`}
                onClick={() => {
                  setActiveView(item.id);
                  setLastContentView(item.id);
                }}
                title={item.label}
                aria-label={item.label}
              >
                <img src={item.icon} alt="" className="size-12" aria-hidden />
              </button>
            ))}
          </nav>
        )}

        <main
          className={`memepot-scroll min-h-0 flex-1 overflow-y-auto rounded-[10px] ${
            activeView === 'settings' ? 'bg-memepot-neutral-1' : 'bg-memepot-neutral-2 p-2.5'
          }`}
        >
          <Routes activeView={activeView} refreshToken={refreshToken} searchQuery={searchQuery} />
        </main>

        <footer className="flex h-9 shrink-0 items-center justify-between px-2.5">
          <div className="flex h-9 items-center gap-2.5">
            <img src={logoIcon} alt="" className="size-[51px]" aria-hidden />
            <img
              src={activeView === 'settings' ? wordmarkSettingsIcon : wordmarkIcon}
              alt="Memepot"
              className="h-[16px] w-[104px]"
            />
          </div>
          <span className="text-lg leading-none text-memepot-back">V{__APP_VERSION__}</span>
        </footer>
      </div>

      {children}
    </div>
  );
}
