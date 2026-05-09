// useSettings hook — stub (full implementation in Milestone 4)
import { useState, useEffect } from 'react';
import { settingsService, type Settings } from '@/features/settings/services/settings.service';

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService.get().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const update = async (updates: Partial<Settings>) => {
    await settingsService.set(updates);
    setSettings((s) => (s ? { ...s, ...updates } : s));
  };

  return { settings, loading, update };
}