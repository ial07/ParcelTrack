import api from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import {
  Parcel,
  CreateParcelFormData,
  UpdateStatusFormData,
  ParcelFilters,
} from "@/types/parcel";

export const parcelService = {
  async getParcels(
    filters?: ParcelFilters,
  ): Promise<PaginatedResponse<Parcel>> {
    const params: Record<string, string | number | undefined> = {
      page: filters?.page,
      per_page: filters?.per_page,
      sort: filters?.sort,
      "filter[current_status]": filters?.current_status,
      "filter[origin_warehouse_id]": filters?.origin_warehouse_id,
      "filter[destination_warehouse_id]": filters?.destination_warehouse_id,
      "filter[created_at_from]": filters?.created_at_from,
      "filter[created_at_to]": filters?.created_at_to,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key],
    );

    const response = await api.get("/admin/parcels", { params });
    return response.data;
  },

  async getParcel(id: number): Promise<ApiResponse<Parcel>> {
    const response = await api.get(`/admin/parcels/${id}`);
    return response.data;
  },

  async createParcel(data: CreateParcelFormData): Promise<ApiResponse<Parcel>> {
    const response = await api.post("/admin/parcels", data);
    return response.data;
  },

  async updateStatus(
    id: number,
    data: UpdateStatusFormData,
  ): Promise<ApiResponse<Parcel>> {
    const response = await api.post(`/admin/parcels/${id}/status`, data);
    return response.data;
  },
};
