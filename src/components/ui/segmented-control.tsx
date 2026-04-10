"use client";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T; }[];
  onChange: (value: T) => void;
  value: T;
}

export function SegmentedControl<T extends string>({
  onChange,
  options,
  value,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex border border-border rounded-lg overflow-hidden">
      {options.map((option) => (
        <button
          className={`flex-1 h-12 px-4 text-[14px] cursor-pointer ${
            value === option.value
              ? "bg-primary text-text-inverse"
              : "bg-surface text-text hover:bg-primary/5"
          }`}
          onClick={() => onChange(option.value)}
          key={option.value}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
