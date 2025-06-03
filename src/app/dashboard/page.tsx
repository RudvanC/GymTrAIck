"use client";

import UserAnswers from "@/components/dashboard/UserAnswers";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <UserAnswers user={user as User} />
    </div>
  );
}
