import { useCallback } from 'react';
import { useSettings } from '../hooks/useSettings';
import type { Settings } from '@/features/settings/services/settings.service';

export function SettingsPage() {
  const { settings, loading, update } = useSettings();

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

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-memepot-text">Settings</h2>
        <div className="h-8 animate-pulse rounded bg-memepot-surface" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-memepot-text">Settings</h2>

      <div className="space-y-2">
        <label className="block text-sm text-memepot-muted" htmlFor="grid-size">
          Grid Size
        </label>
        <select
          id="grid-size"
          className="w-full rounded bg-memepot-surface px-3 py-1.5 text-sm text-memepot-text outline-none focus:ring-1 focus:ring-memepot-primary"
          value={settings?.gridSize ?? 'medium'}
          onChange={(event) => handleGridChange(event.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <label className="flex items-center gap-2 rounded bg-memepot-surface px-3 py-2 text-sm text-memepot-text">
        <input
          type="checkbox"
          checked={settings?.closeAfterCopy ?? false}
          onChange={(event) => handleCloseAfterCopyChange(event.target.checked)}
          className="size-4 rounded border-memepot-accent bg-memepot-bg text-memepot-primary focus:ring-memepot-primary"
        />
        <span>Close after copy</span>
      </label>

      <div className="space-y-2">
        <label className="block text-sm text-memepot-muted" htmlFor="license-key">
          License Key
        </label>
        <input
          id="license-key"
          type="text"
          value="Coming soon"
          disabled
          readOnly
          className="w-full cursor-not-allowed rounded bg-memepot-surface/70 px-3 py-1.5 text-sm text-memepot-muted outline-none"
        />
        <p className="text-xs text-memepot-muted">
          License activation is not available in this intro build.
        </p>
      </div>

      <p className="border-t border-memepot-accent/20 pt-3 text-xs text-memepot-muted">
        Nodehub.Studio (c) 2026
      </p>
    </div>
  );
}
