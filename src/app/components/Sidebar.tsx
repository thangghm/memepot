import { Archive, Flame, Heart, Inbox, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface SidebarItem {
  id: string;
  label: string;
  Icon: LucideIcon;
}

const views: SidebarItem[] = [
  { id: 'tempot', label: 'Tempot', Icon: Inbox },
  { id: 'pot', label: 'Pot', Icon: Archive },
  { id: 'favorites', label: 'Favorites', Icon: Heart },
  { id: 'hotpot', label: 'HotPot', Icon: Flame },
  { id: 'trash', label: 'Trash', Icon: Trash2 },
];

function SidebarButton({
  active,
  label,
  Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  Icon: SidebarItem['Icon'];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex size-9 items-center justify-center rounded ${
        active
          ? 'bg-memepot-primary/20 text-memepot-primary'
          : 'text-memepot-muted hover:bg-memepot-surface hover:text-memepot-text'
      }`}
      title={label}
      aria-label={label}
    >
      <Icon size={18} aria-hidden />
      <span className="pointer-events-none absolute left-11 z-50 hidden whitespace-nowrap rounded bg-black/90 px-2 py-1 text-xs text-white shadow-lg group-hover:block">
        {label}
      </span>
    </button>
  );
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="flex w-12 flex-col items-center border-r border-memepot-accent/30 bg-memepot-surface/50 p-1.5">
      <nav className="space-y-1">
        {views.map((view) => (
          <SidebarButton
            key={view.id}
            active={activeView === view.id}
            label={view.label}
            Icon={view.Icon}
            onClick={() => onViewChange(view.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
