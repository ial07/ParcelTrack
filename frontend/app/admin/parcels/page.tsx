"use client";

import { useState } from "react";
import { useParcels } from "@/hooks/useParcels";
import { ParcelStatusBadge } from "@/components/parcels/ParcelStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ParcelFilters, ParcelStatus, STATUS_LABELS } from "@/types/parcel";

const ALL_STATUSES: ParcelStatus[] = [
  "PENDING",
  "PICKED_UP",
  "IN_WAREHOUSE",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "RETURNED",
  "CANCELLED",
];

export default function ParcelsPage() {
  const [filters, setFilters] = useState<ParcelFilters>({
    page: 1,
    per_page: 15,
    sort: "-created_at",
  });

  const { data, isPending } = useParcels(filters);
  const parcels = data?.data?.data ?? [];
  const pagination = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parcels</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all parcels
          </p>
        </div>
        <Link href="/admin/parcels/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Parcel
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select
          value={filters.current_status || "all"}
          onValueChange={(val) =>
            setFilters((prev) => ({
              ...prev,
              current_status: val === "all" ? undefined : (val as ParcelStatus),
              page: 1,
            }))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parcels.length ? (
                    parcels.map((parcel) => (
                      <TableRow key={parcel.id}>
                        <TableCell>
                          <Link
                            href={`/admin/parcels/${parcel.id}`}
                            className="font-mono text-sm text-primary hover:underline"
                          >
                            {parcel.tracking_number}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm">
                          {parcel.sender_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {parcel.receiver_name}
                        </TableCell>
                        <TableCell>
                          <ParcelStatusBadge status={parcel.current_status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {parcel.origin_warehouse?.city || "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {parcel.destination_warehouse?.city || "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(parcel.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-12 text-center text-muted-foreground"
                      >
                        No parcels found. Create your first parcel!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.current_page} of {pagination.last_page} (
                    {pagination.total} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.current_page <= 1}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: (prev.page ?? 1) - 1,
                        }))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.current_page >= pagination.last_page}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          page: (prev.page ?? 1) + 1,
                        }))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
