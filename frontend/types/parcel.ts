import { z } from "zod";

export type ParcelStatus =
  | "PENDING"
  | "PICKED_UP"
  | "IN_WAREHOUSE"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

export interface StatusHistory {
  id: number;
  status: ParcelStatus;
  location: string | null;
  notes: string | null;
  created_at: string;
  changed_by?: { id: number; name: string } | null;
}

export interface Parcel {
  id: number;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  receiver_address: string;
  receiver_phone: string;
  weight: number;
  description: string | null;
  current_status: ParcelStatus;
  estimated_delivery: string | null;
  origin_warehouse_id: number;
  destination_warehouse_id: number;
  courier_id: number | null;
  origin_warehouse?: { id: number; name: string; code: string; city: string };
  destination_warehouse?: {
    id: number;
    name: string;
    code: string;
    city: string;
  };
  courier?: { id: number; name: string; vehicle_type: string } | null;
  status_histories?: StatusHistory[];
  created_at: string;
  updated_at: string;
}

export const createParcelSchema = z.object({
  sender_name: z.string().min(1, "Sender name is required"),
  receiver_name: z.string().min(1, "Receiver name is required"),
  receiver_address: z.string().min(1, "Receiver address is required"),
  receiver_phone: z.string().min(1, "Receiver phone is required"),
  weight: z.preprocess(
    (val) => Number(val),
    z.number().min(0.1, "Weight must be at least 0.1 kg"),
  ),
  description: z.string().optional(),
  origin_warehouse_id: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Select origin warehouse"),
  ),
  destination_warehouse_id: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Select destination warehouse"),
  ),
  courier_id: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().optional(),
  ),
  estimated_delivery: z.string().optional(),
});

export type CreateParcelFormData = z.infer<typeof createParcelSchema>;

export const updateStatusSchema = z.object({
  status: z.string().min(1, "Select a status"),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;

export interface ParcelFilters {
  current_status?: ParcelStatus;
  origin_warehouse_id?: number;
  destination_warehouse_id?: number;
  created_at_from?: string;
  created_at_to?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

export const STATUS_LABELS: Record<ParcelStatus, string> = {
  PENDING: "Pending",
  PICKED_UP: "Picked Up",
  IN_WAREHOUSE: "In Warehouse",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<ParcelStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PICKED_UP: "bg-blue-100 text-blue-800",
  IN_WAREHOUSE: "bg-purple-100 text-purple-800",
  IN_TRANSIT: "bg-indigo-100 text-indigo-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  RETURNED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};
