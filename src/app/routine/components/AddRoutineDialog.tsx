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

  // SWR fetcher
  const { data: results, isValidating } = useSWR<Routine[]>(
    query.length > 0
      ? `/api/routine-results/search?q=${encodeURIComponent(query)}`
      : null,
    (url: string) => fetch(url).then((r) => r.json())
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(null);
    }
  }, [open]);

  async function handleAdd() {
    if (!selected) return;
    setAdding(true);
    console.log("About to add:", {
      answer_id: answerId,
      routine_id: selected!.routine_id,
    });
    const res = await fetch("/api/routine-results/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answer_id: answerId,
        routine_id: selected!.routine_id,
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

        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-black" />
          <Input
            placeholder="Buscar rutina..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

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
