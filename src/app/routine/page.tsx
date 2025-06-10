// app/exercises/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .finally(() => setLoading(false));
  }, []);

  console.log(exercises);

  if (loading) return <p>Cargando ejercicios...</p>;

  return (
    <>
      {Array.isArray(exercises) ? (
        exercises.map((exercise) => (
          <article key={exercise.id}>
            <h2>{exercise.name}</h2>
            <p>{exercise.description}</p>
            <img src={exercise.gifUrl} alt={exercise.name} />
          </article>
        ))
      ) : (
        <p>No hay ejercicios o ocurrió un error.</p>
      )}
    </>
  );
}
