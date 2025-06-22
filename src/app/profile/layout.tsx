// app/dashboard/layout.tsx

import React from "react";
import Sidebar from "@/components/layout/Aside"; // confirma que en tu filesystem exista components/Sidebar.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 bg-slate-950 text-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {children}
      </main>
    </div>
  );
}
