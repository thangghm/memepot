import { useCallback, useRef, useState, type ChangeEvent } from 'react';
import { useSettings } from '../hooks/useSettings';
import dropdownArrow from '../assets/figma/dropdown-arrow.svg';
import { backupService } from '@/features/backup';
import type { Settings } from '@/features/settings/services/settings.service';

export function SettingsPage() {
  const { settings, loading, refresh, update } = useSettings();
  const importInputRef = useRef<HTMLInputElement>(null);
  const [backupBusy, setBackupBusy] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);

  const resetBackupStatus = () => {
    setBackupMessage(null);
    setBackupError(null);
  };

  const handleGridChange = useCallback(
    (value: string) => {
      void update({ gridSize: value as Settings['gridSize'] });
    },
    [update],
  );

  const handleCloseAfterCopyChange = useCallback(
    (checked: boolean) => {
      void update({ closeAfterCopy: checked });
    },
    [update],
  );

  const handleShowTagsChange = useCallback(
    (checked: boolean) => {
      void update({ showTags: checked });
    },
    [update],
  );

  const handleConfirmBeforePermanentDeleteChange = useCallback(
    (checked: boolean) => {
      void update({ confirmBeforePermanentDelete: checked });
    },
    [update],
  );

  const handleExportBackup = useCallback(() => {
    void (async () => {
      resetBackupStatus();
      setBackupBusy(true);

      try {
        const backup = await backupService.exportBackup();
        const url = URL.createObjectURL(backup);
        const anchor = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        anchor.href = url;
        anchor.download = `memepot-backup-${date}.zip`;
        anchor.click();
        URL.revokeObjectURL(url);
        setBackupMessage('Backup exported.');
      } catch (error) {
        setBackupError(error instanceof Error ? error.message : 'Export failed.');
      } finally {
        setBackupBusy(false);
      }
    })();
  }, []);

  const handleImportBackup = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];
      event.currentTarget.value = '';

      if (!file) {
        return;
      }

      void (async () => {
        resetBackupStatus();
        setBackupBusy(true);

        try {
          const result = await backupService.importBackup(file);
          await refresh();
          setBackupMessage(
            `Imported ${result.imported}. Skipped ${result.skipped}. Failed ${result.failed}.`,
          );
        } catch (error) {
          setBackupError(error instanceof Error ? error.message : 'Import failed.');
        } finally {
          setBackupBusy(false);
        }
      })();
    },
    [refresh],
  );

  if (loading) {
    return (
      <div className="h-full animate-pulse rounded-[10px] bg-memepot-neutral-2" aria-label="Loading settings">
        <div className="h-16 w-40 rounded-[10px] bg-white/70" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto rounded-[10px] bg-memepot-neutral-1 text-memepot-back">
      <section className="flex shrink-0 flex-col gap-4">
        <div className="flex h-16 items-center px-2.5">
          <h2 className="text-[32px] leading-none text-memepot-primary">Setting</h2>
        </div>

        <label className="flex items-center justify-between px-2.5 text-lg leading-none">
          <span>Close after copy</span>
          <input
            type="checkbox"
            checked={settings?.closeAfterCopy ?? false}
            onChange={(event) => handleCloseAfterCopyChange(event.target.checked)}
            className="size-8 appearance-none rounded-[5px] border-2 border-memepot-primary bg-white checked:bg-memepot-primary checked:bg-[linear-gradient(135deg,transparent_38%,white_38%,white_50%,transparent_50%),linear-gradient(45deg,transparent_48%,white_48%,white_60%,transparent_60%)] focus:outline-none focus:ring-2 focus:ring-memepot-primary/30"
          />
        </label>

        <label className="flex items-center justify-between px-2.5 text-lg leading-none">
          <span>Show tag</span>
          <input
            type="checkbox"
            checked={settings?.showTags ?? true}
            onChange={(event) => handleShowTagsChange(event.target.checked)}
            className="size-8 appearance-none rounded-[5px] border-2 border-memepot-primary bg-white checked:bg-memepot-primary checked:bg-[linear-gradient(135deg,transparent_38%,white_38%,white_50%,transparent_50%),linear-gradient(45deg,transparent_48%,white_48%,white_60%,transparent_60%)] focus:outline-none focus:ring-2 focus:ring-memepot-primary/30"
          />
        </label>

        <label className="flex items-center justify-between gap-3 px-2.5 text-lg leading-none">
          <span>Confirm Trash delete</span>
          <input
            type="checkbox"
            checked={settings?.confirmBeforePermanentDelete ?? true}
            onChange={(event) => handleConfirmBeforePermanentDeleteChange(event.target.checked)}
            className="size-8 shrink-0 appearance-none rounded-[5px] border-2 border-memepot-primary bg-white checked:bg-memepot-primary checked:bg-[linear-gradient(135deg,transparent_38%,white_38%,white_50%,transparent_50%),linear-gradient(45deg,transparent_48%,white_48%,white_60%,transparent_60%)] focus:outline-none focus:ring-2 focus:ring-memepot-primary/30"
          />
        </label>

        <div className="flex items-center justify-between px-2.5 text-lg leading-none">
          <label htmlFor="grid-size">Grid size</label>
          <div className="relative h-9 w-32 rounded-[10px] bg-white">
            <select
              id="grid-size"
              className="h-9 w-full appearance-none rounded-[10px] bg-transparent px-2.5 pr-8 text-center text-lg leading-none text-memepot-primary outline-none"
              value={settings?.gridSize ?? 'small'}
              onChange={(event) => handleGridChange(event.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <img
              src={dropdownArrow}
              alt=""
              className="pointer-events-none absolute right-2.5 top-1/2 h-2 w-[13px] -translate-y-1/2"
              aria-hidden
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <div className="px-2.5">
          <h2 className="text-[32px] leading-none text-memepot-primary">Backup</h2>
        </div>
        <div className="flex h-[42px] items-center gap-2.5">
          <button
            type="button"
            disabled={backupBusy}
            onClick={handleExportBackup}
            className="flex h-[36px] flex-1 items-center justify-center rounded-[10px] bg-memepot-primary text-lg leading-none text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export
          </button>
          <button
            type="button"
            disabled={backupBusy}
            onClick={() => importInputRef.current?.click()}
            className="flex h-[36px] flex-1 items-center justify-center rounded-[10px] bg-white text-lg leading-none text-memepot-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Import
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".zip,application/zip"
            className="hidden"
            onChange={handleImportBackup}
          />
        </div>
        {(backupMessage || backupError) && (
          <p
            className={`px-2.5 text-sm leading-none ${
              backupError ? 'text-red-700' : 'text-memepot-primary'
            }`}
            role="status"
          >
            {backupError ?? backupMessage}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <div className="px-2.5">
          <h2 className="text-[32px] leading-none text-memepot-primary">Activation</h2>
        </div>
        <div className="flex h-[42px] items-center gap-2.5">
          <label className="flex h-[42px] min-w-0 flex-1 items-center rounded-[10px] bg-white px-2.5">
            <span className="sr-only">License key</span>
            <input
              type="text"
              placeholder="Not available now"
              disabled
              className="w-full bg-transparent text-base leading-none text-memepot-back outline-none placeholder:text-memepot-neutral-2 disabled:cursor-not-allowed"
            />
          </label>
          <button
            type="button"
            disabled
            className="flex h-[42px] w-[98px] cursor-not-allowed items-center justify-center rounded-[10px] bg-memepot-primary text-lg leading-none text-white opacity-70"
          >
            Active
          </button>
        </div>
        <p className="whitespace-pre-wrap px-2.5 text-sm leading-none">
          You need to be a Potter (like Harry) to use advanced features like: Auto-Tagging, OCR
          Tagging, Semantic Search...
          {'\n\n'}
          Don&apos;t worry bro, it&apos;s free; you just need to sign up and get your key:{' '}
          <span className="text-memepot-primary">https://memepot.nodehub.studio</span>
        </p>
      </section>
    </div>
  );
}
