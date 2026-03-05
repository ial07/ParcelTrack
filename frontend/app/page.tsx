"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Search, Package, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    if (trimmed) {
      router.push(`/track/${trimmed}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Navbar */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-indigo-400" />
            <span className="text-lg font-bold tracking-tight">
              ParcelTrack
            </span>
          </div>
          <a
            href="/admin/login"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Admin Portal →
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-4 pt-24 pb-16 sm:pt-32">
        {/* Glow Effect */}
        <div className="absolute left-1/2 top-40 -translate-x-1/2 h-64 w-64 rounded-full bg-indigo-500/20 blur-[120px]" />

        <div className="relative z-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
            <Package className="h-3.5 w-3.5" />
            Real-time Parcel Tracking
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Track Your{" "}
            <span className="bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Parcel
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-lg text-base text-white/60 sm:text-lg">
            Enter your tracking number below to get instant updates on your
            delivery status and timeline.
          </p>

          {/* Search Form */}
          <form onSubmit={handleTrack} className="mx-auto flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                id="tracking-input"
                type="text"
                placeholder="e.g. PT-2A8F3C91"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="h-12 border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/30 focus-visible:border-indigo-400/50 focus-visible:ring-indigo-400/20"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 bg-indigo-600 px-6 hover:bg-indigo-500"
              disabled={!trackingNumber.trim()}
            >
              Track
            </Button>
          </form>
        </div>

        {/* Feature Cards */}
        <div className="mt-24 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {[
            {
              icon: Package,
              title: "Real-Time Status",
              desc: "Get instant updates on your parcel's journey",
            },
            {
              icon: Clock,
              title: "Full Timeline",
              desc: "View complete delivery history with timestamps",
            },
            {
              icon: MapPin,
              title: "Location Tracking",
              desc: "See exactly where your parcel is right now",
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <CardContent className="pt-6">
                <feature.icon className="mb-3 h-8 w-8 text-indigo-400" />
                <h3 className="mb-1 font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/50">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
