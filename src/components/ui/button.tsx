import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

type ButtonVariant = "secondary" | "primary";

const variantStyles: Record<ButtonVariant, string> = {
  secondary:
    "border border-primary text-primary hover:bg-primary hover:text-text-inverse",
  primary:
    "bg-accent text-text hover:opacity-90",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`h-12 px-6 font-heading text-[18px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
