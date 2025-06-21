/**
 * ExerciseSearch
 *
 * This component renders a searchable dropdown (combobox) optimized for performance when handling large datasets.
 * It is used to select an exercise from a provided list of options.
 *
 * Features:
 * - Displays only the first 20 items by default to ensure fast rendering.
 * - Filters options dynamically as the user types.
 * - Resets the search and closes the popover on selection.
 *
 * Props:
 * @param options - List of exercise options to choose from, each with an `id` and `name`.
 * @param value - The currently selected exercise ID.
 * @param onSelect - Callback invoked when the user selects an exercise.
 */

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

  const filteredOptions = React.useMemo(() => {
    if (search === "") {
      return options.slice(0, 20);
    }
    return options.filter((option) =>
      option.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

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
          <CommandInput
            placeholder="Buscar ejercicio..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún ejercicio.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => {
                    onSelect(option.id);
                    setOpen(false);
                    setSearch("");
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
