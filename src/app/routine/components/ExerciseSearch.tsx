// src/app/routine/components/ExerciseSearch.tsx (Versión Final Optimizada y Simplificada)

"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // <-- Usamos el Command original de shadcn
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ExerciseSearchProps {
  options: { id: string; name: string }[];
  value: string;
  onSelect: (id: string) => void;
}

export default function ExerciseSearch({
  options,
  value,
  onSelect,
}: ExerciseSearchProps) {
  const [open, setOpen] = React.useState(false);

  const selectedExerciseName =
    options.find((option) => option.id === value)?.name ||
    "Selecciona un ejercicio...";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-white text-left font-normal"
        >
          <span className="truncate">{selectedExerciseName}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[40vh] p-0 bg-slate-900 border-slate-700 text-white">
        {/* Command ahora renderiza una lista que SIEMPRE es corta */}
        <Command
          // MEJORA CLAVE: El filtro se aplica sobre la lista completa, pero solo se renderiza un subconjunto
          filter={(value, search) => {
            const parts = search.toLowerCase().split(" ");
            const allPartsInName = parts.every((part) =>
              value.toLowerCase().includes(part)
            );
            return allPartsInName ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Buscar ejercicio..." />
          <CommandList>
            <CommandEmpty>No se encontró ningún ejercicio.</CommandEmpty>
            <CommandGroup>
              {/* Le pasamos la lista completa, CMDK la filtra internamente de forma eficiente */}
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name} // 'value' es lo que usa CMDK para filtrar
                  onSelect={() => {
                    onSelect(option.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.id
                        ? "opacity-100 text-cyan-400"
                        : "opacity-0"
                    )}
                  />
                  <span className="capitalize">{option.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
