// src/app/routine/components/ExerciseSearch.tsx (Versión Optimizada)

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
} from "@/components/ui/command";
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
  // MEJORA RENDIMIENTO: Nuevo estado para guardar lo que el usuario escribe
  const [searchTerm, setSearchTerm] = React.useState("");

  const selectedExerciseName =
    options.find((option) => option.id === value)?.name ||
    "Selecciona un ejercicio...";

  // MEJORA RENDIMIENTO: Lógica para decidir qué opciones mostrar
  const displayedOptions = React.useMemo(() => {
    // Si el usuario no ha escrito nada, muestra solo los primeros 20
    if (searchTerm === "") {
      return options.slice(0, 10);
    }
    // Si ha escrito, dale la lista completa para que 'Command' pueda filtrar
    return options;
  }, [searchTerm, options]);

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
      {/* MEJORA UI: Ancho estable para el desplegable */}
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] max-h-[40vh] p-0 bg-slate-900 border-slate-700 text-white">
        <Command>
          {/* MEJORA RENDIMIENTO: El input ahora controla nuestro estado 'searchTerm' */}
          <CommandInput
            placeholder="Buscar ejercicio..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún ejercicio.</CommandEmpty>
            <CommandGroup>
              {/* MEJORA RENDIMIENTO: Mapeamos sobre la lista optimizada */}
              {displayedOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    onSelect(option.id);
                    setOpen(false);
                    setSearchTerm(""); // Reseteamos la búsqueda al seleccionar
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
              {/* Mostramos un mensaje si la lista está cortada */}
              {searchTerm === "" && options.length > 10 && (
                <div className="p-2 text-center text-xs text-slate-500">
                  Mostrando 10 de {options.length} ejercicios. Escribe para
                  buscar...
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
