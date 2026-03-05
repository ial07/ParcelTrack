"use client";

import { useQuery } from "@tanstack/react-query";
import { trackingService } from "@/services/trackingService";

export function useTracking(trackingNumber: string) {
  return useQuery({
    queryKey: ["tracking", trackingNumber],
    queryFn: () => trackingService.trackParcel(trackingNumber),
    enabled: !!trackingNumber,
    retry: false,
  });
}
