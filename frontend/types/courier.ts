export interface Courier {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  vehicle_type: string;
  is_active: boolean;
}
