"use client";

import { use, useState } from "react";
import { useParcel, useUpdateParcelStatus } from "@/hooks/useParcels";
import { ParcelInfoCard } from "@/components/tracking/ParcelInfoCard";
import { DeliveryTimeline } from "@/components/tracking/DeliveryTimeline";
import { ParcelStatusBadge } from "@/components/parcels/ParcelStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ParcelStatus, STATUS_LABELS } from "@/types/parcel";

// Valid status transitions from PRD
const VALID_TRANSITIONS: Record<ParcelStatus, ParcelStatus[]> = {
  PENDING: ["PICKED_UP", "CANCELLED"],
  PICKED_UP: ["IN_WAREHOUSE", "CANCELLED"],
  IN_WAREHOUSE: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "IN_WAREHOUSE", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "RETURNED", "CANCELLED"],
  DELIVERED: [],
  RETURNED: ["CANCELLED"],
  CANCELLED: [],
};

export default function ParcelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const parcelId = Number(id);
  const { data, isPending } = useParcel(parcelId);
  const updateStatus = useUpdateParcelStatus(parcelId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const parcel = data?.data;
  const validNextStatuses = parcel
    ? VALID_TRANSITIONS[parcel.current_status]
    : [];

  const handleStatusUpdate = () => {
    if (!newStatus) return;
    updateStatus.mutate(
      {
        status: newStatus,
        location: location || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Status updated successfully");
          setDialogOpen(false);
          setNewStatus("");
          setLocation("");
          setNotes("");
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to update status");
        },
      },
    );
  };

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-muted-foreground">Parcel not found.</p>
        <Link href="/admin/parcels">
          <Button variant="outline" className="mt-4">
            Back to Parcels
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/parcels">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Parcel Detail</h1>
            <p className="font-mono text-sm text-muted-foreground">
              {parcel.tracking_number}
            </p>
          </div>
        </div>

        {validNextStatuses.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Parcel Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Current Status
                  </p>
                  <ParcelStatusBadge status={parcel.current_status} />
                </div>

                <div className="space-y-2">
                  <Label>New Status *</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {validNextStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status-location">Location</Label>
                  <Input
                    id="status-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where is the parcel now?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status-notes">Notes</Label>
                  <Textarea
                    id="status-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus || updateStatus.isPending}
                  >
                    {updateStatus.isPending ? "Updating..." : "Confirm"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <ParcelInfoCard parcel={parcel} />

      <Card>
        <CardHeader>
          <CardTitle>Delivery Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliveryTimeline histories={parcel.status_histories || []} />
        </CardContent>
      </Card>
    </div>
  );
}
