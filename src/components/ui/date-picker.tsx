"use client";

import { useEffect, useState, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface DatePickerProps {
  onChange: (value: string) => void;
  minDate?: Date;
  label: string;
  value: string;
  id?: string;
}

export function DatePicker({
  onChange,
  minDate,
  label,
  value,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + "T00:00:00") : undefined;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(date: undefined | Date) {
    if (!date) return;
    onChange(isoDate(date));
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <label
        className="block text-sm font-medium text-text-secondary mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <button
        className="w-full h-13 px-4 bg-surface border border-border rounded-xl text-text text-base text-left focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors flex items-center justify-between cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        type="button"
        id={id}
      >
        <span className={selected ? "text-text" : "text-muted/60"}>
          {selected ? formatDate(selected) : "Select a date"}
        </span>
        <svg
          strokeLinejoin="round"
          stroke="currentColor"
          strokeLinecap="round"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          aria-hidden
          fill="none"
          height="18"
          width="18"
        >
          <rect height="18" width="18" rx="2" x="3" y="4" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x2="21" y1="10" y2="10" x1="3" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 bg-surface border border-border rounded-xl shadow-lg p-3">
          <DayPicker
            disabled={minDate ? { before: minDate } : undefined}
            onSelect={handleSelect}
            startMonth={minDate}
            selected={selected}
            required={false}
            mode="single"
            animate
          />
        </div>
      )}
    </div>
  );
}

function formatDate(date: undefined | Date): string {
  if (!date) return "";
  return date.toLocaleDateString("en-NG", {
    weekday: "short",
    year: "numeric",
    day: "numeric",
    month: "long",
  });
}

function isoDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
