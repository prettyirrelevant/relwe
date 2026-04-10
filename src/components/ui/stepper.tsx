"use client";

interface StepperProps {
  onChange: (value: number) => void;
  label: string;
  value: number;
  max?: number;
  min?: number;
}

export function Stepper({
  max = 10,
  onChange,
  min = 1,
  label,
  value,
}: StepperProps) {
  return (
    <div>
      <span className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          className="w-13 h-13 flex items-center justify-center border border-border rounded-xl text-xl text-primary cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed hover:bg-surface-raised transition-colors"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          type="button"
        >
          −
        </button>
        <span className="w-10 text-center text-xl font-heading tabular-nums">
          {value}
        </span>
        <button
          className="w-13 h-13 flex items-center justify-center border border-border rounded-xl text-xl text-primary cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed hover:bg-surface-raised transition-colors"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
