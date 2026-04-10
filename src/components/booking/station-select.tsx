"use client";

import { useEffect, useState, useRef } from "react";

interface StationSelectProps {
  onChange: (stationId: string) => void;
  value: string | null;
  stations: Station[];
  label: string;
  id?: string;
}

interface Station {
  area: string;
  code: string;
  name: string;
  id: string;
}

export function StationSelect({
  onChange,
  stations,
  label,
  value,
  id,
}: StationSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = stations.find((s) => s.id === value);

  const filtered = query
    ? stations.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.area.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase()),
      )
    : stations;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label
        className="block text-sm font-medium text-text-secondary mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="w-full h-13 px-4 bg-surface border border-border rounded-xl text-text text-base placeholder:text-muted/60 focus:border-border-strong focus:ring-1 focus:ring-border-strong focus:outline-none transition-colors"
        value={
          open ? query : selected ? `${selected.area} — ${selected.name}` : ""
        }
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        placeholder="search stations..."
        type="text"
        id={id}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 w-full mt-2 bg-surface border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {filtered.map((station) => (
            <li key={station.id}>
              <button
                className="w-full text-left px-5 py-3 hover:bg-surface-raised cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
                onClick={() => {
                  onChange(station.id);
                  setOpen(false);
                  setQuery("");
                }}
                type="button"
              >
                <span className="text-text text-sm truncate">{station.name}</span>
                <span className="text-muted text-xs shrink-0 ml-3">
                  {station.area}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
