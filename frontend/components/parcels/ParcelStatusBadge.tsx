"use client";

import { ParcelStatus, STATUS_LABELS, STATUS_COLORS } from "@/types/parcel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ParcelStatusBadge({ status }: { status: ParcelStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", STATUS_COLORS[status])}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
