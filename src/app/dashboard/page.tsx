"use client";

import UserAnswers from "@/components/dashboard/UserAnswers";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <UserAnswers />
    </div>
  );
}
