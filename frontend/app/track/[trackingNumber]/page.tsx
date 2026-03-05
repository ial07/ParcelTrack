"use client";

import { use } from "react";
import { useTracking } from "@/hooks/useTracking";
import { ParcelInfoCard } from "@/components/tracking/ParcelInfoCard";
import { DeliveryTimeline } from "@/components/tracking/DeliveryTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackageX, Truck } from "lucide-react";
import Link from "next/link";

export default function TrackingResultPage({
  params,
}: {
  params: Promise<{ trackingNumber: string }>;
}) {
  const { trackingNumber } = use(params);
  const { data, isPending, isError, error } = useTracking(trackingNumber);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Link>
          <div className="flex items-center gap-2 text-white">
            <Truck className="h-5 w-5 text-indigo-400" />
            <span className="font-bold">ParcelTrack</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <h1 className="text-xl font-bold text-white">
          Tracking:{" "}
          <span className="font-mono text-indigo-400">{trackingNumber}</span>
        </h1>

        {/* Loading State */}
        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-64 w-full rounded-lg bg-white/5" />
          </div>
        )}

        {/* Error / Not Found */}
        {isError && (
          <Card className="border-white/10 bg-white/5">
            <CardContent className="flex flex-col items-center py-16">
              <PackageX className="mb-4 h-16 w-16 text-red-400/60" />
              <h2 className="mb-2 text-lg font-semibold text-white">
                Parcel Not Found
              </h2>
              <p className="mb-6 text-sm text-white/50">
                We couldn&apos;t find a parcel with tracking number{" "}
                <span className="font-mono font-medium text-indigo-400">
                  {trackingNumber}
                </span>
                . Please check the number and try again.
              </p>
              <Link href="/">
                <Button variant="secondary">Search Again</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Success */}
        {data?.data && (
          <>
            <ParcelInfoCard parcel={data.data} />

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Delivery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <DeliveryTimeline
                  histories={data.data.status_histories || []}
                />
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
