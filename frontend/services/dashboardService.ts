import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { DashboardMetrics } from "@/types/dashboard";

export const dashboardService = {
  async getMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    const response = await api.get("/admin/dashboard/metrics");
    return response.data;
  },
};
