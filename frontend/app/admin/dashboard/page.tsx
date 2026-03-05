"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ParcelStatusBadge } from "@/components/parcels/ParcelStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Warehouse,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data, isPending } = useDashboard();
  const metrics = data?.data;

  const metricCards = [
    {
      title: "Total Parcels",
      value: metrics?.parcels.total ?? 0,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "In Transit",
      value: metrics?.parcels.in_transit ?? 0,
      icon: Truck,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Delivered",
      value: metrics?.parcels.delivered ?? 0,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Pending Pickup",
      value: metrics?.parcels.pending_pickup ?? 0,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Warehouses",
      value: `${metrics?.warehouses.active ?? 0} / ${metrics?.warehouses.total ?? 0}`,
      icon: Warehouse,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Active Couriers",
      value: metrics?.couriers.active ?? 0,
      icon: Users,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your logistics operations
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`rounded-xl p-3 ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                {isPending ? (
                  <Skeleton className="mt-1 h-7 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{card.value}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Parcels */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Parcels</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics?.recent_parcels?.length ? (
                  metrics.recent_parcels.map((parcel) => (
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
                        {parcel.receiver_name}
                      </TableCell>
                      <TableCell>
                        <ParcelStatusBadge status={parcel.current_status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(parcel.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No parcels yet. Create your first parcel!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
