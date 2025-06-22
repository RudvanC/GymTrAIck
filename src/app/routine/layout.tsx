// app/dashboard/layout.tsx

import React from "react";
import Sidebar from "@/components/layout/Aside"; // confirma que en tu filesystem exista components/Sidebar.tsx

export default function RoutineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-slate-950">{children}</main>
    </div>
  );
}
