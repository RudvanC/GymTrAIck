import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function ExercisesCard() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/exercises")
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .finally(() => setLoading(false));
  }, []);

  console.log(exercises);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <section className="flex flex-wrap gap-6 justify-center p-20">
        {Array.isArray(exercises) ? (
          exercises.map((exercise) => (
            <article
              key={exercise.id}
              className="flex flex-col gap-2 w-[200px] text-center"
            >
              <img
                src={exercise.gif_url}
                alt={exercise.name}
                className="w-[200px] h-[200px] object-cover"
              />
              <h4>
                <span className="font-bold">Ejercicio:</span> {exercise.name}
              </h4>
              <p>
                <span className="font-bold">Equipo:</span> {exercise.equipment}
              </p>
              <p>
                <span className="font-bold">Objetivo:</span> {exercise.target}
              </p>
            </article>
          ))
        ) : (
          <p>No hay ejercicios o ocurrió un error.</p>
        )}
      </section>
    </>
  );
}

export default ExercisesCard;
