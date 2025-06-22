// src/app/community/components/CreateGroupDialog.tsx
// ¡PERFECTO! NO SE NECESITAN CAMBIOS.

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyedMutator } from "swr";

// Definimos las props que el componente recibirá
interface CreateGroupDialogProps {
  onGroupCreated: KeyedMutator<any>;
}

export default function CreateGroupDialog({
  onGroupCreated,
}: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Esta lógica sigue funcionando porque el backend devuelve los errores en el formato esperado.
        throw new Error(
          errorData.errors?.name?.[0] || errorData.error || "Ocurrió un error"
        );
      }

      // Si todo va bien...
      await onGroupCreated(); // Llama a la función mutate de SWR para refrescar la lista
      setOpen(false); // Cierra el modal
      // Limpia el formulario para la próxima vez
      setName("");
      setDescription("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-md hover:shadow-cyan-600/30 transition-all duration-300">Crear Nuevo Grupo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800 text-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear un nuevo grupo</DialogTitle>
            <DialogDescription>
              Dale un nombre a tu comunidad. Puedes añadir una descripción
              opcional.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-slate-900 border-slate-700"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3 bg-slate-900 border-slate-700"
                placeholder="(Opcional)"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mb-2">{error}</p>
          )}
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isSubmitting ? "Creando..." : "Crear Grupo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
