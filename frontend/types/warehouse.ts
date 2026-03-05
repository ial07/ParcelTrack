import { z } from "zod";

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const createWarehouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required").max(20),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  phone: z.string().optional(),
  is_active: z.boolean().default(true),
});

export type CreateWarehouseFormData = z.infer<typeof createWarehouseSchema>;
