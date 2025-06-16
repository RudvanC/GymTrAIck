// src/hooks/useCustomRoutineForm.ts
import { useState } from "react";
import { z } from "zod";

export const useCustomRoutineForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState<
    { exercise_id: string; sets: number; reps: number; position: number }[]
  >([]);

  const addRow = () =>
    setRows((r) => [
      ...r,
      { exercise_id: "", sets: 3, reps: 10, position: r.length + 1 },
    ]);

  const removeRow = (index: number) =>
    setRows((r) =>
      r
        .filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, position: i + 1 }))
    );

  const swapRows = (from: number, to: number) => {
    /* dnd-kit o simple splice */
  };

  const isValid =
    z.string().min(3).safeParse(name).success &&
    rows.every((r) => r.exercise_id);

  return {
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
  };
};
