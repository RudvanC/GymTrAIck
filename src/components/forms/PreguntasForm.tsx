// src/components/forms/PreguntasForm.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PreguntasForm() {
  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Cuestionario de Entrenamiento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Experiencia */}
        <div className="space-y-2">
          <Label>¿Cuánto tiempo llevas entrenando?</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu experiencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguna">Nunca he entrenado</SelectItem>
              <SelectItem value="poco">Menos de 6 meses</SelectItem>
              <SelectItem value="moderada">6 meses - 2 años</SelectItem>
              <SelectItem value="avanzada">Más de 2 años</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Disponibilidad */}
        <div className="space-y-2">
          <Label>¿Cuántos días a la semana puedes entrenar?</Label>
          <Input type="number" placeholder="Ej: 3" min={1} max={7} />
        </div>

        {/* Tiempo estimado */}
        <div className="space-y-2">
          <Label>¿Cuánto tiempo puedes dedicar por sesión (en minutos)?</Label>
          <Input type="number" placeholder="Ej: 45" />
        </div>

        {/* Lesiones */}
        <div className="space-y-2">
          <Label>
            ¿Tienes alguna lesión o condición que debamos considerar?
          </Label>
          <Textarea placeholder="Describe tus limitaciones si las hay" />
        </div>

        {/* Equipo */}
        <div className="space-y-2">
          <Label>¿Tienes acceso a equipo o gimnasio?</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguno">No tengo equipo</SelectItem>
              <SelectItem value="casa">Equipo básico en casa</SelectItem>
              <SelectItem value="gimnasio">
                Acceso a gimnasio completo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Objetivo */}
        <div className="space-y-2">
          <Label>¿Cuál es tu objetivo principal?</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ganar">Ganar masa muscular</SelectItem>
              <SelectItem value="perder">Perder grasa</SelectItem>
              <SelectItem value="mantener">Mantenerme en forma</SelectItem>
              <SelectItem value="salud">Mejorar salud general</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nivel actual */}
        <div className="space-y-2">
          <Label>¿Cómo describirías tu condición física actual?</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu nivel actual" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baja">Baja</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" type="submit">
          Guardar respuestas
        </Button>
      </CardContent>
    </Card>
  );
}
