import api from "@/lib/axios";
import { ApiResponse, PaginatedResponse } from "@/types/api";
import { Warehouse, CreateWarehouseFormData } from "@/types/warehouse";

export const warehouseService = {
  async getWarehouses(
    page = 1,
    perPage = 15,
  ): Promise<PaginatedResponse<Warehouse>> {
    const response = await api.get("/admin/warehouses", {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  async getWarehouse(id: number): Promise<ApiResponse<Warehouse>> {
    const response = await api.get(`/admin/warehouses/${id}`);
    return response.data;
  },

  async createWarehouse(
    data: CreateWarehouseFormData,
  ): Promise<ApiResponse<Warehouse>> {
    const response = await api.post("/admin/warehouses", data);
    return response.data;
  },

  async updateWarehouse(
    id: number,
    data: Partial<CreateWarehouseFormData>,
  ): Promise<ApiResponse<Warehouse>> {
    const response = await api.put(`/admin/warehouses/${id}`, data);
    return response.data;
  },

  async deleteWarehouse(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/warehouses/${id}`);
    return response.data;
  },
};
