"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parcelService } from "@/services/parcelService";
import {
  CreateParcelFormData,
  UpdateStatusFormData,
  ParcelFilters,
} from "@/types/parcel";

export function useParcels(filters?: ParcelFilters) {
  return useQuery({
    queryKey: ["parcels", filters],
    queryFn: () => parcelService.getParcels(filters),
  });
}

export function useParcel(id: number) {
  return useQuery({
    queryKey: ["parcels", id],
    queryFn: () => parcelService.getParcel(id),
    enabled: !!id,
  });
}

export function useCreateParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParcelFormData) =>
      parcelService.createParcel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
    },
  });
}

export function useUpdateParcelStatus(parcelId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStatusFormData) =>
      parcelService.updateStatus(parcelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parcels", parcelId] });
      queryClient.invalidateQueries({ queryKey: ["parcels"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
