import type { MemeSortPreset } from '../utils/memeSort';

interface SortControlsProps {
  value: MemeSortPreset;
  onChange: (value: MemeSortPreset) => void;
}

const options: Array<{ value: MemeSortPreset; label: string }> = [
  { value: 'mostCopied', label: 'Hot' },
  { value: 'leastCopied', label: 'Cold' },
  { value: 'newest', label: 'New' },
  { value: 'oldest', label: 'Old' },
];

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <div className="mb-1.5 grid grid-cols-4 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-5 rounded-[6px] px-1 text-[11px] leading-none ${
            value === option.value
              ? 'bg-memepot-primary text-white'
              : 'bg-white text-memepot-primary hover:bg-memepot-neutral-1'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
