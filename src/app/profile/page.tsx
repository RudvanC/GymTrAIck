"use client";

import AvatarUploader from "@/app/profile/components/AvatarUploader";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <>
      <AvatarUploader
        initialAvatarUrl={user?.user_metadata.avatar_url}
        onUploadSuccess={() => {}}
      />
    </>
  );
}
