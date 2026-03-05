"use client";

import { AdminGuard } from "@/components/layout/AdminGuard";
import { Sidebar } from "@/components/layout/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
