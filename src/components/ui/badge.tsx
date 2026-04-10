interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

type BadgeVariant = "neutral" | "success" | "warning" | "error";

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-accent/10 text-accent border-accent/20",
  neutral: "bg-muted/10 text-muted border-muted/20",
  error: "bg-error/10 text-error border-error/20",
};

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-[14px] rounded-md border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
