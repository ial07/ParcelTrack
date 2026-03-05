import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Courier } from "@/types/courier";

export const courierService = {
  async getCouriers(): Promise<ApiResponse<Courier[]>> {
    const response = await api.get("/admin/couriers");
    return response.data;
  },
};
