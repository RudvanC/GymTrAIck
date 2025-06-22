// app/dashboard/layout.tsx

import React from "react";
import Sidebar from "@/components/layout/Aside"; // confirma que en tu filesystem exista components/Sidebar.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
