"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomRoutineForm } from "@/app/routine/hooks/useCustomRoutineForm";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/supabase/database.types";
import { mutate } from "swr";

export default function AddCustomRoutineDialog() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
  }, [supabase]);

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
        <Button size="lg" className="text-black bg-white hover:bg-zinc-300">
          Crear rutina personalizada
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <h2 className="text-xl text-black font-bold mb-4">
          Crear rutina personalizada
        </h2>
        <Input
          className="text-black"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          className="text-black"
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mt-4 space-y-2">
          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2 items-center">
              <select
                className="col-span-2 input text-black"
                value={row.exercise_id}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((it, i) =>
                      i === idx ? { ...it, exercise_id: e.target.value } : it
                    )
                  )
                }
              >
                <option value="" disabled>
                  – Selecciona ejercicio –
                </option>
                {exerciseOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <Input
                className="text-black"
                type="number"
                min={1}
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
                className="text-black"
                type="number"
                min={1}
                value={row.reps}
                onChange={(e) =>
                  setRows((r) =>
                    r.map((it, i) =>
                      i === idx ? { ...it, reps: +e.target.value } : it
                    )
                  )
                }
              />
              <Button variant="ghost" onClick={() => removeRow(idx)}>
                🗑
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={addRow}>
            Añadir ejercicio
          </Button>
        </div>

        <div className="flex justify-end mt-6 gap-2 text-black">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              resetState();
            }}
          >
            Cancelar
          </Button>
          <Button disabled={!isValid || isSaving} onClick={save}>
            {isSaving ? "Guardando..." : isSaved ? "Guardado" : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
