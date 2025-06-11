"use client";

import React, { useState } from "react";
import type { Routine } from "@/app/api/base-routines/route";
import { Button } from "@/components/ui/button";

interface RoutineRunnerProps {
  routine: Routine;
  onBack: () => void;
}

export default function RoutineRunner({ routine, onBack }: RoutineRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const exercises = routine.exercises;
  const total = exercises.length;

  const current = exercises[currentIndex];

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <button
        className="text-sm text-gray-500 hover:underline mb-4"
        onClick={onBack}
      >
        ← Volver a rutinas
      </button>

      <h2 className="text-2xl font-bold mb-2 text-black">{routine.name}</h2>
      {routine.description && (
        <p className="text-gray-600 mb-4">{routine.description}</p>
      )}

      <div className="flex flex-col items-center">
        <img
          src={current.gif_url}
          alt={current.name}
          className="w-64 h-64 object-cover rounded mb-4"
        />
        <h3 className="text-xl font-semibold mb-1 text-black">
          {current.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {current.sets} x {current.reps} · {current.equipment}
        </p>
        <p className="text-sm text-gray-500 mb-4">Músculo: {current.target}</p>

        <div className="flex w-full justify-between">
          <Button disabled={isFirst} onClick={handlePrev}>
            Anterior
          </Button>
          <Button disabled={isLast} onClick={handleNext}>
            Siguiente
          </Button>
        </div>

        <p className="text-center text-gray-500 mt-4">
          Ejercicio {currentIndex + 1} de {total}
        </p>
      </div>
    </div>
  );
}
