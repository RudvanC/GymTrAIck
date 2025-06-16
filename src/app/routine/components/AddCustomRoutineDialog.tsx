"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomRoutineForm } from "@/app/routine/hooks/useCustomRoutineForm";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/supabase/database.types";
import { DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
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
    swapRows,
    isValid,
  } = useCustomRoutineForm();

  // cargar ejercicios para el <select>
  const [exerciseOptions, setExerciseOptions] = useState<
    { id: string; name: string }[]
  >([]);

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

  const save = async () => {
    const res = await fetch("/api/custom-routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, exercises: rows }),
    });
    if (res.ok) {
      mutate("/api/custom-routines");
      // TODO: toast éxito + redirect a la rutina recién creada
    } else {
      // TODO: toast error
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="text-black bg-white hover:bg-zinc-300">
          Crear rutina personalizada
        </Button>
      </DialogTrigger>
      <DialogTitle className="hidden">Añadir rutina personalizada</DialogTitle>
      <DialogDescription className="hidden">
        Añadir rutina personalizada
      </DialogDescription>
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
          <Button variant="outline">Cancelar</Button>
          <Button disabled={!isValid} onClick={save}>
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
