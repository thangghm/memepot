import type { MemeSortPreset } from '../utils/memeSort';

interface SortControlsProps {
  value: MemeSortPreset;
  onChange: (value: MemeSortPreset) => void;
}

const options: Array<{ value: MemeSortPreset; label: string }> = [
  { value: 'mostCopied', label: 'Most copied' },
  { value: 'leastCopied', label: 'Least copied' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

export function SortControls({ value, onChange }: SortControlsProps) {
  return (
    <div className="mb-2 grid grid-cols-2 gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`h-7 rounded-[8px] px-2 text-xs leading-none ${
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
