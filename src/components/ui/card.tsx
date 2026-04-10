interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg p-6 ${className}`}
    >
      {children}
    </div>
  );
}
