import { Parcel } from "./parcel";

export interface DashboardMetrics {
  parcels: {
    total: number;
    in_transit: number;
    delivered: number;
    pending_pickup: number;
  };
  warehouses: {
    total: number;
    active: number;
    inactive: number;
  };
  couriers: {
    active: number;
  };
  recent_parcels: Parcel[];
}
