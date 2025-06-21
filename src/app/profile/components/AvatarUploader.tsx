/**
 * `AvatarUploader` allows the user to upload and preview a new profile picture.
 *
 * This component uses Supabase storage to upload and persist the avatar image,
 * and displays a preview using the `Avatar` UI component. It handles image validation,
 * upload feedback, and error recovery gracefully.
 *
 * @remarks
 * The component enforces a max image size of 2MB and accepts `.png` or `.jpeg` formats.
 * It uses the shared Supabase client to ensure consistency with the authentication session.
 *
 * @example
 * ```tsx
 * <AvatarUploader
 *   initialAvatarUrl={profile.avatar_url}
 *   onUploadSuccess={(url) => setAvatarUrl(url)}
 *   userEmail={profile.email}
 * />
 * ```
 *
 * @param initialAvatarUrl - The current avatar image URL (if any).
 * @param onUploadSuccess - Callback triggered with the new URL after a successful upload.
 * @param userEmail - Optional user email used to display initials in fallback mode.
 *
 * @returns A fully interactive avatar upload component.
 */

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Props for the `AvatarUploader` component.
 */
interface AvatarUploaderProps {
  initialAvatarUrl: string | null;
  onUploadSuccess: (newUrl: string) => void;
  userEmail?: string | undefined;
}

export default function AvatarUploader({
  initialAvatarUrl,
  onUploadSuccess,
  userEmail,
}: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /**
   * Handles local file selection and validates file size.
   *
   * @param event - File input change event
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Maximum size is 2MB.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  /**
   * Uploads the selected file to Supabase Storage and updates the user profile.
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await createClient().auth.getSession();

      if (sessionError || !session) {
        throw new Error("Session not found. Please log in again.");
      }

      const user = session.user;
      const fileExt = selectedFile.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await createClient()
        .storage.from("avatars")
        .upload(filePath, selectedFile, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = createClient().storage.from("avatars").getPublicUrl(filePath);

      const finalUrl = `${publicUrl}?t=${new Date().getTime()}`; // prevent caching

      const { error: updateError } = await createClient()
        .from("profiles")
        .update({ avatar_url: finalUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(finalUrl);
      onUploadSuccess(finalUrl);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32 border-4 border-slate-700 shadow-lg">
        <AvatarImage
          src={previewUrl || avatarUrl || undefined}
          alt="User Avatar"
        />
        <AvatarFallback className="text-3xl bg-slate-800 text-slate-300">
          {userEmail?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <input
        type="file"
        id="avatar-upload"
        className="hidden"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {!selectedFile && (
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Button asChild className="pointer-events-none">
            <span>Change Photo</span>
          </Button>
        </label>
      )}

      {selectedFile && (
        <div className="flex gap-4">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700"
          >
            {uploading ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            disabled={uploading}
            className="bg-red-600 hover:bg-red-700"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
