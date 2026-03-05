import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { AuthResponse, LoginFormData, User } from "@/types/auth";

export const authService = {
  async login(data: LoginFormData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};
