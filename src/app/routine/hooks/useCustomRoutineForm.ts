// src/hooks/useCustomRoutineForm.ts
import { useState, useCallback } from "react";
import { z } from "zod";

// 1. Añadimos un `id` a la definición del tipo de la fila
type RoutineRow = {
  id: number; // ID único para la key de React
  exercise_id: string;
  sets: number;
  reps: number;
  position: number;
};

export const useCustomRoutineForm = () => {
  console.log("Ejecutando el hook useCustomRoutineForm...");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // 2. Usamos el nuevo tipo para el estado
  const [rows, setRows] = useState<RoutineRow[]>([]);

  const addRow = useCallback(() => {
    setRows((r) => [
      ...r,
      // 3. Al añadir una fila, le asignamos un ID único y la posición
      {
        id: Date.now(),
        exercise_id: "",
        sets: 3,
        reps: 10,
        position: r.length + 1,
      },
    ]);
  }, []);

  const removeRow = useCallback((idToRemove: number) => {
    // Ahora eliminamos por ID, no por índice
    setRows(
      (r) =>
        r
          .filter((row) => row.id !== idToRemove) // Filtramos por ID
          .map((row, i) => ({ ...row, position: i + 1 })) // Recalculamos posición
    );
  }, []);

  const swapRows = useCallback((from: number, to: number) => {
    setRows((currentRows) => {
      const newRows = [...currentRows];
      const [movedItem] = newRows.splice(from, 1);
      newRows.splice(to, 0, movedItem);
      return newRows.map((row, i) => ({ ...row, position: i + 1 }));
    });
  }, []);

  const isValid =
    z.string().min(3).safeParse(name).success &&
    rows.length > 0 &&
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
