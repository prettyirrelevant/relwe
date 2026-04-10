"use client";

export function PrintButton() {
  return (
    <button
      className="print:hidden h-10 px-5 border border-border rounded-lg text-sm text-text hover:border-border-strong hover:bg-surface-raised transition-colors cursor-pointer"
      onClick={() => window.print()}
      type="button"
    >
      Print tickets
    </button>
  );
}
