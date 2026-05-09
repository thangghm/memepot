// Placeholder components — full implementation in Milestones 4 & 5
export function MemeDetailModal() {
  return <div className="fixed inset-0 flex items-center justify-center bg-black/50">Detail Modal Placeholder</div>;
}

export function SearchInput() {
  return (
    <input
      type="text"
      placeholder="Search memes..."
      className="rounded bg-memepot-surface px-3 py-1.5 text-sm text-memepot-text outline-none placeholder:text-memepot-muted focus:ring-1 focus:ring-memepot-primary"
    />
  );
}

export function ImportDropzone() {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-memepot-accent/40">
      <p className="text-sm text-memepot-muted">Drop images here or click to import</p>
    </div>
  );
}

export function Toast() {
  return <div className="fixed bottom-3 right-3 rounded bg-memepot-surface px-3 py-2 text-sm shadow-lg">Toast placeholder</div>;
}