import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
}

export function Input({
  className = "",
  error,
  label,
  id,
  ...props
}: InputProps) {
  return (
    <div>
      <label className="block text-[14px] text-text mb-2" htmlFor={id}>
        {label}
      </label>
      <input
        className={`w-full h-12 px-4 bg-surface border rounded-lg text-text focus:outline-none ${
          error
            ? "border-error focus:border-error"
            : "border-border focus:border-primary"
        } ${className}`}
        id={id}
        {...props}
      />
      {error && <p className="text-error text-[14px] mt-2">{error}</p>}
    </div>
  );
}
