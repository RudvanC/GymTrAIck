// src/app/routine/components/ExerciseSearch.tsx (Versión Definitiva con Rendimiento Optimizado)

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
  const [search, setSearch] = React.useState("");

  const selectedExerciseName =
    options.find((option) => option.id === value)?.name ||
    "Selecciona un ejercicio...";

  // --- LA LÓGICA CLAVE ESTÁ AQUÍ ---
  const filteredOptions = React.useMemo(() => {
    // Si la barra de búsqueda está vacía, muestra solo los primeros 20.
    // Esto hace que la apertura sea instantánea.
    if (search === "") {
      return options.slice(0, 20);
    }

    // Si el usuario está buscando, filtra la lista completa.
    // El .map posterior solo renderizará esta lista ya filtrada (que será mucho más corta).
    return options.filter((option) =>
      option.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);
  // ------------------------------------

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
        <Command>
          {/* El input ahora controla nuestro estado 'search' */}
          <CommandInput
            placeholder="Buscar ejercicio..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún ejercicio.</CommandEmpty>
            <CommandGroup>
              {/* Mapeamos sobre nuestra lista inteligentemente filtrada y cortada */}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  // No es necesario 'value' aquí porque ya hemos filtrado nosotros
                  onSelect={() => {
                    onSelect(option.id);
                    setOpen(false);
                    setSearch(""); // Reseteamos la búsqueda al seleccionar
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
              {/* Mensaje de ayuda si la búsqueda está vacía y hay más opciones */}
              {search === "" && options.length > 20 && (
                <div className="p-2 text-center text-xs text-slate-500">
                  Mostrando 20 de {options.length}. Escribe para buscar en
                  todos...
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
