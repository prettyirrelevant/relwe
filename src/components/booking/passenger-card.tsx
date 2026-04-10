"use client";

import { useState } from "react";

import { SegmentedControl } from "~/components/ui/segmented-control";

interface PassengerCardProps {
  userProfile?: {
    phone: string;
    name: string;
    nin: string;
  };
  errors?: Partial<Record<keyof PassengerData, string>>;
  onChange: (data: PassengerData) => void;
  defaultExpanded?: boolean;
  data: PassengerData;
  coachLabel: string;
  seatLabel: string;
  index: number;
}

interface PassengerData {
  passengerType: "adult" | "minor";
  fullName: string;
  isSelf: boolean;
  phone: string;
  nin: string;
}

export function PassengerCard({
  defaultExpanded = false,
  userProfile,
  coachLabel,
  seatLabel,
  onChange,
  errors,
  index,
  data,
}: PassengerCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const completed = isComplete(data);

  function toggleSelf() {
    if (!userProfile) return;
    if (data.isSelf) {
      onChange({ ...data, isSelf: false, fullName: "", phone: "", nin: "" });
    } else {
      onChange({
        ...data,
        fullName: userProfile.name,
        phone: userProfile.phone,
        nin: userProfile.nin,
        isSelf: true,
      });
    }
  }

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      {/* header (always visible, clickable to toggle) */}
      <button
        className="w-full bg-surface-raised px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-surface-raised/80 transition-colors"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="flex items-center gap-2 text-left">
          {completed && (
            <span className="w-5 h-5 flex items-center justify-center bg-success rounded-full text-[10px] text-text-inverse shrink-0">
              ✓
            </span>
          )}
          <span className="text-sm font-medium text-text">
            {data.fullName || `Passenger ${index + 1}`}
          </span>
          <span className="text-xs text-muted">
            · Seat {seatLabel}, {coachLabel}
          </span>
        </div>
        <span className="text-muted text-sm shrink-0">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {/* form (collapsible) */}
      {expanded && (
        <div className="px-6 py-5 border-t border-border">
          <div className="flex items-center justify-between mb-5">
            <SegmentedControl
              options={[
                { value: "adult" as const, label: "Adult" },
                { value: "minor" as const, label: "Minor" },
              ]}
              onChange={(v) => onChange({ ...data, passengerType: v })}
              value={data.passengerType}
            />
            {userProfile && index === 0 && (
              <button
                className={`px-4 h-9 rounded-lg text-xs cursor-pointer transition-colors ${
                  data.isSelf
                    ? "bg-primary text-text-inverse"
                    : "border border-border text-muted hover:border-border-strong hover:text-text"
                }`}
                onClick={toggleSelf}
                type="button"
              >
                {data.isSelf ? "Booking for myself" : "For myself"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full name
              </label>
              <input
                className={`w-full h-13 px-4 bg-surface border rounded-xl text-text focus:outline-none transition-colors ${
                  errors?.fullName
                    ? "border-error focus:border-error"
                    : "border-border focus:border-border-strong focus:ring-1 focus:ring-border-strong"
                } ${data.isSelf ? "opacity-60" : ""}`}
                onChange={(e) =>
                  onChange({ ...data, fullName: e.target.value })
                }
                readOnly={data.isSelf}
                value={data.fullName}
                type="text"
                required
              />
              {errors?.fullName && (
                <p className="text-error text-xs mt-1.5">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                NIN
              </label>
              <input
                className={`w-full h-13 px-4 bg-surface border rounded-xl text-text placeholder:text-muted/50 focus:outline-none transition-colors ${
                  errors?.nin
                    ? "border-error focus:border-error"
                    : "border-border focus:border-border-strong focus:ring-1 focus:ring-border-strong"
                } ${data.isSelf ? "opacity-60" : ""}`}
                onChange={(e) => onChange({ ...data, nin: e.target.value })}
                placeholder="Any 11-digit number"
                readOnly={data.isSelf}
                inputMode="numeric"
                value={data.nin}
                maxLength={11}
                type="text"
                required
              />
              {errors?.nin && (
                <p className="text-error text-xs mt-1.5">{errors.nin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone number
              </label>
              <div className="flex">
                <span className="flex items-center h-13 px-3 bg-primary text-text-inverse rounded-l-xl text-sm">
                  +234
                </span>
                <input
                  className={`w-full h-13 px-4 bg-surface border border-l-0 rounded-r-xl text-text focus:outline-none transition-colors ${
                    errors?.phone
                      ? "border-error focus:border-error"
                      : "border-border focus:border-border-strong focus:ring-1 focus:ring-border-strong"
                  } ${data.isSelf ? "opacity-60" : ""}`}
                  onChange={(e) =>
                    onChange({ ...data, phone: e.target.value })
                  }
                  readOnly={data.isSelf}
                  value={data.phone}
                  type="tel"
                  required
                />
              </div>
              {errors?.phone && (
                <p className="text-error text-xs mt-1.5">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isComplete(data: PassengerData): boolean {
  return (
    data.fullName.trim().length > 0 &&
    data.nin.length === 11 &&
    data.phone.trim().length > 0
  );
}
