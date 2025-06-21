/**
 * AddRoutineDialog
 *
 * This client-side component displays a dialog that allows users to add an existing routine
 * to a given user answer (`answerId`). The user can search routines via a search box
 * powered by SWR and dynamically fetched results from `/api/routine-results/search`.
 *
 * Main Features:
 * - Modal dialog using Radix UI `Dialog`
 * - Search input with debounce-like behavior using `useSWR`
 * - Displays search results dynamically
 * - Allows selecting one routine and submitting it via `/api/routine-results/create`
 * - Shows loading indicators when fetching or submitting
 *
 * Props:
 * - `answerId` (string): ID of the user answer to which a routine will be attached.
 * - `onAdded` (function): Callback called after a successful addition to refresh parent state.
 *
 * Example usage:
 * ```tsx
 * <AddRoutineDialog answerId="1234" onAdded={() => refetch()} />
 * ```
 */

"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";

interface Routine {
  routine_id: string;
  name: string;
}

interface AddRoutineDialogProps {
  answerId: string;
  onAdded: () => void;
}

export default function AddRoutineDialog({
  answerId,
  onAdded,
}: AddRoutineDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Routine | null>(null);
  const [adding, setAdding] = useState(false);

  // Fetch routines matching the query using SWR
  const { data: results, isValidating } = useSWR<Routine[]>(
    query.length > 0
      ? `/api/routine-results/search?q=${encodeURIComponent(query)}`
      : null,
    (url: string) => fetch(url).then((r) => r.json())
  );

  // Reset dialog state when it is closed
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
    }
  }, [open]);

  // Submit selected routine to the server
  async function handleAdd() {
    if (!selected) return;
    setAdding(true);
    const res = await fetch("/api/routine-results/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer_id: answerId,
        routine_id: selected.routine_id,
      }),
    });
    setAdding(false);
    if (res.ok) {
      setOpen(false);
      onAdded();
    } else {
      const { error } = await res.json();
      alert(error ?? "Error añadiendo la rutina");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="gap-2 text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Añadir rutina
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md text-black">
        <DialogHeader>
          <DialogTitle>Añadir rutina a tu plan</DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-black" />
          <Input
            placeholder="Buscar rutina..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Search results */}
        <div className="max-h-56 overflow-y-auto mt-4 space-y-1">
          {isValidating && (
            <p className="flex items-center gap-2 text-sm text-black">
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando…
            </p>
          )}

          {!isValidating && query && results?.length === 0 && (
            <p className="text-sm text-black">No hay resultados</p>
          )}

          {results?.map((r) => (
            <button
              key={r.routine_id}
              onClick={() => setSelected(r)}
              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-300 ${
                selected?.routine_id === r.routine_id ? "bg-gray-200" : ""
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        {/* Footer with add button */}
        <DialogFooter>
          <Button
            disabled={!selected || adding}
            onClick={handleAdd}
            className="gap-2 bg-black text-white"
          >
            {adding && <Loader2 className="w-4 h-4 animate-spin" />} Añadir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
