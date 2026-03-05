"use client";

import { Parcel } from "@/types/parcel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParcelStatusBadge } from "@/components/parcels/ParcelStatusBadge";
import {
  User,
  MapPin,
  Phone,
  Weight,
  Warehouse,
  Truck,
  Calendar,
  FileText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function ParcelInfoCard({ parcel }: { parcel: Parcel }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Parcel{" "}
            <span className="font-mono text-primary">
              {parcel.tracking_number}
            </span>
          </CardTitle>
          <ParcelStatusBadge status={parcel.current_status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sender / Receiver */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Sender
            </p>
            <p className="flex items-center gap-2 text-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {parcel.sender_name}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Receiver
            </p>
            <p className="flex items-center gap-2 text-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {parcel.receiver_name}
            </p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {parcel.receiver_phone}
            </p>
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              {parcel.receiver_address}
            </p>
          </div>
        </div>

        <Separator />

        {/* Warehouses */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Origin
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
              {parcel.origin_warehouse?.name || "N/A"}
            </p>
            {parcel.origin_warehouse && (
              <p className="ml-5.5 text-xs text-muted-foreground">
                {parcel.origin_warehouse.city} • {parcel.origin_warehouse.code}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Destination
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Warehouse className="h-3.5 w-3.5 text-muted-foreground" />
              {parcel.destination_warehouse?.name || "N/A"}
            </p>
            {parcel.destination_warehouse && (
              <p className="ml-5.5 text-xs text-muted-foreground">
                {parcel.destination_warehouse.city} •{" "}
                {parcel.destination_warehouse.code}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Details */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Weight className="h-3.5 w-3.5" />
            {parcel.weight} kg
          </span>
          {parcel.courier && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              {parcel.courier.name} ({parcel.courier.vehicle_type})
            </span>
          )}
          {parcel.estimated_delivery && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Est.{" "}
              {new Date(parcel.estimated_delivery).toLocaleDateString("en-US", {
                dateStyle: "medium",
              })}
            </span>
          )}
        </div>

        {parcel.description && (
          <>
            <Separator />
            <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {parcel.description}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
