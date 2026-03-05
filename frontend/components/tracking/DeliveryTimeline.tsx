"use client";

import { StatusHistory } from "@/types/parcel";
import { ParcelStatusBadge } from "@/components/parcels/ParcelStatusBadge";
import { MapPin, Clock, User, MessageSquare } from "lucide-react";

export function DeliveryTimeline({
  histories,
}: {
  histories: StatusHistory[];
}) {
  if (!histories || histories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No status history available.
      </p>
    );
  }

  // Sort by created_at descending (newest first)
  const sorted = [...histories].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="relative space-y-0">
      {sorted.map((entry, index) => (
        <div key={entry.id} className="relative flex gap-4 pb-8 last:pb-0">
          {/* Vertical line */}
          {index < sorted.length - 1 && (
            <div className="absolute left-[15px] top-[30px] h-full w-[2px] bg-border" />
          )}

          {/* Dot */}
          <div
            className={`relative z-10 mt-1 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 ${
              index === 0
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/30 bg-background text-muted-foreground"
            }`}
          >
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                index === 0 ? "bg-primary-foreground" : "bg-muted-foreground/50"
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <ParcelStatusBadge status={entry.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(entry.created_at).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>

              {entry.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {entry.location}
                </span>
              )}

              {entry.changed_by && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {entry.changed_by.name}
                </span>
              )}
            </div>

            {entry.notes && (
              <p className="flex items-start gap-1 text-sm text-foreground/80">
                <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                {entry.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
