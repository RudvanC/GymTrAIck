/**
 * `EditableUsername` component.
 *
 * Displays the user's current username and allows inline editing with save and cancel options.
 * On successful update, it triggers a callback to allow the parent component to refresh data.
 *
 * @remarks
 * This component uses the `useAuth` context to access the current user and Supabase client.
 * It prevents saving if the field is empty or the user is not authenticated.
 *
 * @example
 * ```tsx
 * <EditableUsername
 *   initialUsername={profile.username}
 *   onUpdate={() => mutateProfile()}
 * />
 * ```
 *
 * @param initialUsername - The current username to be displayed and edited.
 * @param onUpdate - Callback executed after a successful update to refresh the parent state.
 *
 * @returns A user interface element that toggles between display and edit modes.
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User as UserIcon, Check, X } from "lucide-react";

/**
 * Props for the `EditableUsername` component.
 */
interface EditableUsernameProps {
  initialUsername: string | null;
  onUpdate: () => void;
}

export default function EditableUsername({
  initialUsername,
  onUpdate,
}: EditableUsernameProps) {
  const { user, supabase } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(initialUsername || "");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles saving the new username to the database and notifies the parent.
   */
  const handleSave = async () => {
    if (!user || !username.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user.id);

      if (error) throw error;

      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update username:", error);
      alert("Could not save the username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancels editing and restores the original username value.
   */
  const handleCancel = () => {
    setUsername(initialUsername || "");
    setIsEditing(false);
  };

  // Edit mode view
  if (isEditing) {
    return (
      <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700">
        <Label htmlFor="username-input" className="text-sm text-slate-400">
          Edit Username
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-slate-900 text-white border-slate-600"
          />
          <Button
            size="icon"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // View mode (default)
  return (
    <div className="flex items-center justify-between gap-4 p-2 -m-2 rounded-lg transition-colors hover:bg-slate-800/50">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400">
          <UserIcon size={20} />
        </div>
        <div>
          <p className="text-sm text-slate-400">Username</p>
          <p className="font-semibold text-white">
            {initialUsername || "Not specified"}
          </p>
        </div>
      </div>
      <Button
        className="bg-white text-black hover:bg-cyan-600"
        size="sm"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </Button>
    </div>
  );
}
