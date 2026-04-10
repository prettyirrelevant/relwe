const STEPS = ["Find train", "Pick seats", "Book & pay"] as const;

interface ProgressBarProps {
  currentStep: 0 | 1 | 2;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 py-4">
      {STEPS.map((step, index) => (
        <div className="flex items-center gap-2" key={step}>
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full text-[14px] font-heading ${
                index <= currentStep
                  ? "bg-primary text-text-inverse"
                  : "bg-muted/20 text-muted"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`text-[14px] hidden sm:block ${
                index <= currentStep ? "text-text" : "text-muted"
              }`}
            >
              {step}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-px ${
                index < currentStep ? "bg-primary" : "bg-muted/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
