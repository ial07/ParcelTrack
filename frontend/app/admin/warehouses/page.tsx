"use client";

import { useState } from "react";
import { useWarehouses, useDeleteWarehouse } from "@/hooks/useWarehouses";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function WarehousesPage() {
  const [page, setPage] = useState(1);
  const { data, isPending } = useWarehouses(page);
  const deleteWarehouse = useDeleteWarehouse();

  const warehouses = data?.data?.data ?? [];
  const pagination = data?.data;

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteWarehouse.mutate(id, {
        onSuccess: () => toast.success(`${name} deleted`),
        onError: () => toast.error("Failed to delete warehouse"),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Warehouses</h1>
          <p className="text-sm text-muted-foreground">
            Manage warehouse locations
          </p>
        </div>
        <Link href="/admin/warehouses/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-16" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.length ? (
                    warehouses.map((wh) => (
                      <TableRow key={wh.id}>
                        <TableCell className="font-mono text-sm">
                          {wh.code}
                        </TableCell>
                        <TableCell className="font-medium">{wh.name}</TableCell>
                        <TableCell className="text-sm">{wh.city}</TableCell>
                        <TableCell className="text-sm">{wh.province}</TableCell>
                        <TableCell>
                          <Badge
                            variant={wh.is_active ? "default" : "secondary"}
                          >
                            {wh.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(wh.id, wh.name)}
                            disabled={deleteWarehouse.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-muted-foreground"
                      >
                        No warehouses yet. Add your first warehouse!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {pagination && pagination.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {pagination.current_page} of {pagination.last_page}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= (pagination?.last_page ?? 1)}
                      onClick={() => setPage((p) => p + 1)}
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
