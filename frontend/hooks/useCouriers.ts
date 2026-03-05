"use client";

import { useQuery } from "@tanstack/react-query";
import { courierService } from "@/services/courierService";

export function useCouriers() {
  return useQuery({
    queryKey: ["couriers"],
    queryFn: () => courierService.getCouriers(),
  });
}
