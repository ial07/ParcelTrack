"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboardService";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardService.getMetrics(),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  });
}
