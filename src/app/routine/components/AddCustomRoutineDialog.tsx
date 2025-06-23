/**
 * AddCustomRoutineDialog
 *
 * This React client component renders a modal dialog that allows users
 * to create a custom workout routine. Users can name the routine, optionally
 * add a description, and dynamically add multiple exercises with sets and reps.
 *
 * Internally, it:
 * - Fetches available exercises from Supabase on mount
 * - Uses a custom hook (`useCustomRoutineForm`) to manage form state
 * - Handles form submission and sends data to the `/api/custom-routines` endpoint
 * - Uses SWR to revalidate the list of custom routines on successful save
 *
 * The component uses Radix UI dialog primitives and custom UI components for styling.
 *
 * Features:
 * - Dynamic exercise rows with autocomplete search
 * - Form validation (e.g., empty fields, disabled submit)
 * - Graceful error handling and reset on close
 *
 * Usage:
 * ```tsx
 * <AddCustomRoutineDialog />
 * ```
 */

"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomRoutineForm } from "@/app/routine/hooks/useCustomRoutineForm";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/supabase/database.types";
import { mutate } from "swr";
import { Dumbbell, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import ExerciseSearch from "./ExerciseSearch";

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddCustomRoutineDialog() {
  const {
    name,
    setName,
    description,
    setDescription,
    rows,
    setRows,
    addRow,
    removeRow,
    isValid,
  } = useCustomRoutineForm();

  const [exerciseOptions, setExerciseOptions] = useState<
    { id: string; name: string }[]
  >([]);

  const [isOpen, setIsOpen] = useState(false); // controla visibilidad modal
  const [isSaving, setIsSaving] = useState(false); // estado de carga
  const [isSaved, setIsSaved] = useState(false); // estado final exitoso

  useEffect(() => {
    supabase
      .from("exercises")
      .select("id, name")
      .then(({ data }) => {
        setExerciseOptions(
          (data ?? []).map((row) => ({
            id: String(row.id),
            name: row.name,
          }))
        );
      });
  }, []);

  const resetState = () => {
    setName("");
    setDescription("");
    setRows([]);
    setIsSaving(false);
    setIsSaved(false);
  };

  const save = async () => {
    setIsSaving(true);
    setIsSaved(false);
    const res = await fetch("/api/custom-routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, exercises: rows }),
    });

    if (res.ok) {
      mutate("/api/custom-routines");
      setIsSaved(true);
      setTimeout(() => {
        setIsOpen(false);
        resetState();
      }, 1000); // cierra con pequeño delay
    } else {
      // Manejar errores aquí si lo deseas
    }

    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md hover:shadow-cyan-600/30 transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Crear Rutina Personalizada
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-slate-900/80 backdrop-blur-xl border-slate-700 text-white">
        {/* Usamos un <form> pero el botón de guardar final será de tipo 'button' y llamará a 'save' */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Dumbbell className="text-cyan-400" />
              Crea tu Rutina Personalizada
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Dale un nombre a tu rutina y añade los ejercicios, series y
              repeticiones.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="routine-name">Nombre de la Rutina</Label>
              <Input
                id="routine-name"
                className="bg-slate-800 border-slate-700 h-11"
                placeholder="Ej: Día de Empuje"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routine-desc">Descripción (Opcional)</Label>
              <Input
                id="routine-desc"
                className="bg-slate-800 border-slate-700 h-11"
                placeholder="Ej: Enfocado en pecho, hombros y tríceps"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 px-2 text-xs font-semibold text-slate-400">
              <p className="col-span-5">Ejercicio</p>
              <p className="col-span-3 text-center">Series</p>
              <p className="col-span-3 text-center">Reps</p>
              <div className="col-span-2"></div>
            </div>

            {rows.map((row, idx) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <div className="col-span-5">
                  <ExerciseSearch
                    options={exerciseOptions}
                    value={row.exercise_id}
                    onSelect={(value) =>
                      setRows((r) =>
                        r.map((it, i) =>
                          i === idx ? { ...it, exercise_id: value } : it
                        )
                      )
                    }
                  />
                </div>
                <Input
                  className="col-span-3 bg-slate-800 border-slate-700 text-center"
                  type="number"
                  min={1}
                  placeholder="3"
                  value={row.sets}
                  onChange={(e) =>
                    setRows((r) =>
                      r.map((it, i) =>
                        i === idx ? { ...it, sets: +e.target.value } : it
                      )
                    )
                  }
                />
                <Input
                  className="col-span-3 bg-slate-800 border-slate-700 text-center"
                  type="number"
                  min={1}
                  placeholder="12"
                  value={row.reps}
                  onChange={(e) =>
                    setRows((r) =>
                      r.map((it, i) =>
                        i === idx ? { ...it, reps: +e.target.value } : it
                      )
                    )
                  }
                />
                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addRow}
              className="border-dashed bg-slate-800 border-slate-700 text-slate-300  hover:border-slate-600 w-full"
            >
              Añadir Ejercicio
            </Button>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                resetState();
              }}
            >
              Cancelar
            </Button>
            {/* Usamos type="button" y onClick para tener control total sobre la llamada a 'save' */}
            <Button
              type="button"
              disabled={!isValid || isSaving}
              onClick={save}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Rutina"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
