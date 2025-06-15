# Utilidades, Contextos y Tipos

> Generado automáticamente el 14-06-2025

[TOC]

---

## AuthContext.tsx (`src/context/AuthContext.tsx`)

### Propósito
Contexto global de autenticación que expone el usuario activo, el cliente Supabase y el estado de carga a toda la aplicación.

### API pública
```typescript
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function useAuth(): { user: User | null; supabase: SupabaseClient; loading: boolean };
```

### Uso típico
```tsx
import { useAuth } from "@/context/AuthContext";

function Profile() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return <p>Bienvenido {user?.email}</p>;
}
```

### Flujo interno
1. Crea un cliente Supabase browser (`createClient`).
2. Obtiene la sesión inicial con `supabase.auth.getUser()`.
3. Escucha `onAuthStateChange` para actualizar `user` en tiempo real.
4. Proporciona `user`, `supabase` y `loading` vía Context API.

### Hook / Context specifics
* `AuthProvider` retrasa el render de `children` hasta que `loading` es `false`, evitando **flicker**.
* Limpia el listener de auth en `useEffect` cleanup.

### Consideraciones de rendimiento / seguridad
* Usa un único cliente Supabase por árbol de componentes para evitar conexiones redundantes.
* Evita doble render bloqueando la UI con `loading`.

---

## useUserAnswers.tsx (`src/hooks/useUserAnswers.tsx`)

### Propósito
Hook que trae las respuestas del cuestionario del usuario autenticado y gestiona estados de carga, error y refetch.

### API pública
```typescript
export interface UserAnswersState {
  answers: UserAnswer[];
  loading: boolean;
  error: string | null;
  refetchAnswers(): void;
}
export function useUserAnswers(): UserAnswersState;
```

### Uso típico
```tsx
const { answers, loading, error } = useUserAnswers();
```

### Flujo interno
* Obtiene `user` y `authLoading` del `AuthContext`.
* `useCallback` crea `loadData` que:
  * Valida autenticación.
  * Hace `fetch` a `/api/user-answers?user_id=`.
  * Maneja HTTP ≠ 200 devolviendo mensajes precisos.
* `useEffect` llama a `loadData` on-mount y tras cambios en dependencias.

### Consideraciones
* Evita condiciones de carrera comprobando `authLoading` antes de llamar al endpoint.
* Cache mínima: el estado `answers` vive mientras el componente que llama al hook siga montado.

Ejemplo de test (Vitest)
```ts
import { renderHook } from "@testing-library/react";
import { useUserAnswers } from "@/hooks/useUserAnswers";
// Mock fetch + AuthContext y verifica estados.
```

---

## useQuestionnaireForm.tsx (`src/hooks/useQuestionnaireForm.tsx`)

### Propósito
Encapsula la lógica de UI/validación para el formulario de preferencias de entrenamiento.

### API pública
```typescript
export function useQuestionnaireForm(): {
  formData: FormState;
  handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  handleSelectChange(name: string, value: string | boolean): void;
  handleSubmit(e: FormEvent): Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  setSuccess: (v: boolean) => void;
};
```

### Uso típico
```tsx
const { formData, handleChange, handleSubmit } = useQuestionnaireForm();
<form onSubmit={handleSubmit}>{/* inputs controlados */}</form>
```

### Flujo interno
1. Mantiene `formData` en `useState`.
2. Validación sin librerías externas (campos obligatorios, rango de días 1-7).
3. `submitAnswers` hace `POST /api/user-answers`.
4. En éxito almacena `success` y limpia el formulario.

### Consideraciones de rendimiento / seguridad
* Valida lado cliente antes de enviar para reducir 400s.
* Controla injertos de XSS porque solo envía JSON propias del usuario.

---

## formatAnswer.ts (`src/lib/formatAnswer.ts`)

### Propósito
Funciones utilitarias y mapas para transformar valores técnicos del backend a strings legibles en español.

### API pública
```typescript
export const trainingExperienceMap: Record<string, string>;
export const fitnessLevelMap: Record<string, string>;
export const goalMap: Record<string, string>;
export const injuriesMap: Record<string, string>;
export function formatInjuries(injuries?: string[] | string): string;
export function formatSessionDuration(duration: string): string;
```

### Uso típico
```ts
const readable = goalMap[answer.goal];
```

### Detalles internos
* `formatInjuries` acepta array o JSON string, parsea y concatena.
* `formatSessionDuration` convierte "90min" → "1 hora 30 minutos".

Rendimiento: operaciones O(n) sobre arrays pequeños, insignificante.

---

## utils.ts (`src/lib/utils.ts`)

### Propósito
`cn` combina clases CSS condicionales utilizando `clsx` + `tailwind-merge`.

### API pública
```typescript
export function cn(...inputs: ClassValue[]): string;
```

### Uso típico
```tsx
<button className={cn("px-2", active && "bg-green-500")}>Guardar</button>
```

### Flujo interno
1. `clsx(inputs)` genera string limpio.
2. `twMerge()` resuelve conflictos Tailwind (p. ej. `p-2` vs `p-4`).

---

## supabase/supabaseClient.ts (`src/lib/supabase/supabaseClient.ts`)

### Propósito
Crea un cliente Supabase **browser-side** con anon key para usar en componentes client.

### API pública
```typescript
export function createClient(): SupabaseClient;
```

### Uso típico
```ts
const supabase = createClient();
```

### Flujo interno
Invoca `createBrowserClient(url, anonKey)` del paquete `@supabase/ssr`.

### Seguridad
Anon key pública; no exponer `service_role_key` en el navegador.

---

## supabase/server.ts (`src/lib/supabase/server.ts`)

### Propósito
Genera un cliente Supabase **server-side** en RSC/Route Handlers, utilizando cookies para sesión.

### API pública
```typescript
export async function createClient(): Promise<SupabaseClient>;
```

### Flujo interno
* Lee cookies con `next/headers`.
* Configura callbacks `get`, `set`, `remove` para refrescar cookies.
* Devuelve un cliente con todas las claims JWT disponibles.

### Seguridad
Permite consultas autenticadas en el servidor respetando RLS; no usa `service_role_key`.

---

## database.types.ts (`src/lib/supabase/database.types.ts`)

### Propósito
Archivo generado por `supabase gen types typescript` que declara todas las tablas, vistas y funciones del proyecto.

### API pública (extracto)
```typescript
export type Json = string | number | boolean | null | ...;
export interface Database {
  public: {
    Tables: {
      user_answers: { Row: { id: string; ... } };
      exercises: { Row: { id: string; name: string; ... } };
      /* más tablas */
    };
    Functions: {
      recommend_routines_by_answer: {
        Args: { p_answer_id: string };
        Returns: { routine_id: string }[];
      };
    };
  };
}
```

El resto de tipos se consumen mediante:
```ts
import type { Database } from "@/lib/supabase/database.types";
```

### Uso típico
```ts
const { data } = await supabase
  .from<Database["public"]["Tables"]["exercises"]["Row"]>("exercises")
  .select("*");
```

### Notas
* Generado automáticamente; **no editar manualmente**.

---

## UserAnswer.ts (`src/types/UserAnswer.tsx`)

### Propósito
Define tipos estrictos para respuestas del cuestionario; se comparte entre front y API handlers.

### API pública
```typescript
export type TrainingExperienceType = "none" | "little" | "moderate" | "advanced";
export type GoalType = /* … */;
export interface UserAnswer { /* …campos */ }
```

### Uso típico
```ts
function mapAnswer(a: UserAnswer) {
  return `${a.goal} en ${a.availability} días`;
}
```

### Consideraciones
El archivo contiene solo tipos; se sugiere renombrar a `.ts` para claridad.

---

## middleware.ts (`src/middleware.ts`)

### Propósito
Protege rutas privadas y sincroniza cookies de sesión Supabase durante SSR/RSC.

### API pública
```typescript
export async function middleware(request: NextRequest): Promise<NextResponse>;
export const config: { matcher: string[] };
```

### Flujo interno
1. Crea cliente Supabase server.
2. Obtiene `user` para decidir redirecciones.
3. Protege rutas `/dashboard`, `/profile`, `/routine`, `/questionnaire`.
4. Redirige usuarios autenticados que visitan `/auth/*` al dashboard.
5. Usa `matcher` para excluir assets.

### Seguridad
* Solo usa anon key.
* Evita exponer tokens al cliente.

---

## utils adicionales / re-exports
* `src/lib/index.ts` *(no existe)* → no se documenta.
* Carpeta `store/` vacía actualmente.

---

Fin del documento.
