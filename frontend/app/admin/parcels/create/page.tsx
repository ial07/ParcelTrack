"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createParcelSchema, CreateParcelFormData } from "@/types/parcel";
import { useCreateParcel } from "@/hooks/useParcels";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useCouriers } from "@/hooks/useCouriers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateParcelPage() {
  const router = useRouter();
  const createParcel = useCreateParcel();
  const { data: warehousesData } = useWarehouses(1, 100);
  const { data: couriersData } = useCouriers();

  const warehouses = warehousesData?.data?.data ?? [];
  const couriers = couriersData?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateParcelFormData>({
    resolver: zodResolver(createParcelSchema) as any,
  });

  const onSubmit = (data: CreateParcelFormData) => {
    createParcel.mutate(data, {
      onSuccess: (response) => {
        toast.success(`Parcel created: ${response.data.tracking_number}`);
        router.push("/admin/parcels");
      },
      onError: () => {
        toast.error("Failed to create parcel. Please try again.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/parcels">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Parcel</h1>
          <p className="text-sm text-muted-foreground">
            Register a new parcel in the system
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parcel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Sender & Receiver */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sender_name">Sender Name *</Label>
                <Input id="sender_name" {...register("sender_name")} />
                {errors.sender_name && (
                  <p className="text-xs text-destructive">
                    {errors.sender_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver_name">Receiver Name *</Label>
                <Input id="receiver_name" {...register("receiver_name")} />
                {errors.receiver_name && (
                  <p className="text-xs text-destructive">
                    {errors.receiver_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="receiver_phone">Receiver Phone *</Label>
                <Input id="receiver_phone" {...register("receiver_phone")} />
                {errors.receiver_phone && (
                  <p className="text-xs text-destructive">
                    {errors.receiver_phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register("weight")}
                />
                {errors.weight && (
                  <p className="text-xs text-destructive">
                    {errors.weight.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiver_address">Receiver Address *</Label>
              <Textarea
                id="receiver_address"
                rows={2}
                {...register("receiver_address")}
              />
              {errors.receiver_address && (
                <p className="text-xs text-destructive">
                  {errors.receiver_address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={2}
                placeholder="Describe the parcel contents..."
                {...register("description")}
              />
            </div>

            {/* Warehouses & Courier */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Origin Warehouse *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("origin_warehouse_id", Number(val))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={String(wh.id)}>
                        {wh.name} ({wh.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.origin_warehouse_id && (
                  <p className="text-xs text-destructive">
                    {errors.origin_warehouse_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Destination Warehouse *</Label>
                <Select
                  onValueChange={(val) =>
                    setValue("destination_warehouse_id", Number(val))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={String(wh.id)}>
                        {wh.name} ({wh.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destination_warehouse_id && (
                  <p className="text-xs text-destructive">
                    {errors.destination_warehouse_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Assigned Courier</Label>
                <Select
                  onValueChange={(val) => setValue("courier_id", Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select courier (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {couriers.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} ({c.vehicle_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_delivery">
                  Estimated Delivery Date
                </Label>
                <Input
                  id="estimated_delivery"
                  type="date"
                  {...register("estimated_delivery")}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/parcels">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={createParcel.isPending}>
                {createParcel.isPending ? "Creating..." : "Create Parcel"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
