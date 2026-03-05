import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Parcel } from "@/types/parcel";

export const trackingService = {
  async trackParcel(trackingNumber: string): Promise<ApiResponse<Parcel>> {
    const response = await api.get(`/track/${trackingNumber}`);
    return response.data;
  },
};
