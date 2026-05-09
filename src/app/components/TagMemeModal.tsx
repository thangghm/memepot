import { useEffect, useState, type FormEvent } from 'react';
import type { Meme } from '@/features/memes/types/meme.types';

interface TagMemeModalProps {
  meme: Meme;
  onClose: () => void;
  onSave: (updates: Partial<Meme>) => Promise<void>;
}

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

export function TagMemeModal({ meme, onClose, onSave }: TagMemeModalProps) {
  const [tags, setTags] = useState(meme.tags.join(', '));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTags(meme.tags.join(', '));
    setError(null);
  }, [meme]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSave({ tags: parseTags(tags) });
      onClose();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Failed to save tags.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-memepot-bg p-4 shadow-xl"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-memepot-text">Tag Meme</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-memepot-muted hover:bg-memepot-surface hover:text-memepot-text"
          >
            Close
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-1 block text-xs font-medium text-memepot-muted">Tags</span>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="w-full rounded bg-memepot-surface px-3 py-2 text-sm text-memepot-text outline-none focus:ring-1 focus:ring-memepot-primary"
            placeholder="reaction, work, template"
          />
        </label>

        {error && (
          <p className="mb-3 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1.5 text-sm text-memepot-muted hover:bg-memepot-surface hover:text-memepot-text"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-memepot-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
