"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createWarehouseSchema,
  CreateWarehouseFormData,
} from "@/types/warehouse";
import { useCreateWarehouse } from "@/hooks/useWarehouses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateWarehousePage() {
  const router = useRouter();
  const createWarehouse = useCreateWarehouse();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWarehouseFormData>({
    resolver: zodResolver(createWarehouseSchema) as any,
    defaultValues: { is_active: true },
  });

  const onSubmit = (data: CreateWarehouseFormData) => {
    createWarehouse.mutate(data, {
      onSuccess: () => {
        toast.success("Warehouse created successfully");
        router.push("/admin/warehouses");
      },
      onError: () => {
        toast.error("Failed to create warehouse");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/warehouses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Warehouse</h1>
          <p className="text-sm text-muted-foreground">
            Register a new warehouse location
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g. WH-JKT-01"
                  {...register("code")}
                />
                {errors.code && (
                  <p className="text-xs text-destructive">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea id="address" rows={2} {...register("address")} />
              {errors.address && (
                <p className="text-xs text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city")} />
                {errors.city && (
                  <p className="text-xs text-destructive">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Input id="province" {...register("province")} />
                {errors.province && (
                  <p className="text-xs text-destructive">
                    {errors.province.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input id="postal_code" {...register("postal_code")} />
                {errors.postal_code && (
                  <p className="text-xs text-destructive">
                    {errors.postal_code.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Optional" {...register("phone")} />
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/warehouses">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={createWarehouse.isPending}>
                {createWarehouse.isPending ? "Creating..." : "Create Warehouse"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
