# Endpoints de la API

> Última actualización: 2025-06-14

[TOC]

---

## GET /api/exercises
Ruta del archivo: `src/app/api/exercises/route.ts`

### Descripción
Devuelve un listado básico (máx. 10 registros) de ejercicios almacenados en la tabla `exercises`.

### Autenticación
No requiere autenticación. La tabla `exercises` es pública.

### Parámetros de consulta
Ninguno.

### Cuerpo de la petición
No requiere cuerpo.

### Respuesta (200 OK)
```json
[
  {
    "id": 1,
    "name": "bench press",
    "body_part": "chest",
    "equipment": "barbell",
    "gif_url": "https://...",
    "target": "pectorals",
    "secondary_muscles": ["triceps"],
    "instructions": ["..."],
    "created_at": "2025-06-12T10:45:00Z",
    "updated_at": null
  },
  { "id": 2, "name": "..." }
]
```

### Errores
| Código | Condición | Ejemplo mensaje |
|--------|-----------|-----------------|
| 500 | Supabase devuelve error | `{ "error": "Error fetching exercises from database" }` |

### Flujo interno
1. Instancia `supabase` con `createClient` (anon key).
2. `select('*').order('id').limit(10)` sobre `exercises`.
3. Devuelve `NextResponse.json()`.

### Dependencias
* `@supabase/supabase-js` 
* Tabla `public.exercises`

### Notas de seguridad / rendimiento
* No aplica RLS.  
* Índice primario por `id`.

### Ejemplo cURL
```bash
curl -X GET https://<host>/api/exercises
```

---

## GET /api/user-answers?user_id=<uuid>
Ruta del archivo: `src/app/api/user-answers/route.ts`

### Descripción
Devuelve el historial de cuestionarios (`user_answers`) de un usuario.

### Autenticación
Requiere cookie JWT válida: se crea un **server client** (`createServerClient`) que lee las cookies.  
RLS: tabla `user_answers` protege acceso; sólo puede leer filas donde `user_id = auth.uid()`.

### Parámetros de consulta
| Nombre | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| `user_id` | `uuid` | Sí | Id del usuario del cual obtener las respuestas. Debe coincidir con `auth.uid()` |

### Cuerpo de la petición
No aplica.

### Respuesta (200 OK)
```json
[
  {
    "id": "d3387d63-...",
    "user_id": "51b8745e-...",
    "created_at": "2025-06-13T14:22:32.123Z",
    "goal": "hypertrophy",
    "fitness_level": "intermediate",
    "training_experience": "6-12_months",
    "availability": "mon,wed,fri",
    "equipment_access": true,
    "session_duration": "45",
    "injuries": null
  }
]
```

### Errores
| Código | Condición | Ejemplo |
|--------|-----------|---------|
| 400 | Falta `user_id` | `{ "error": "Falta user_id para identificar usuario" }` |
| 500 | Error de Supabase | `{ "error": "Error al obtener respuestas" }` |

### Flujo interno
* Crea `supabase` con `createServerClient` incorporando cookies.  
* Valida presencia de `user_id`.  
* `select('*').eq('user_id', userId).order('created_at', {ascending:false})`.  
* Devuelve JSON.

### Dependencias
* Hook de cookies `next/headers`.
* Tabla `public.user_answers`.

### Notas de seguridad / rendimiento
* RLS asegura propiedad.  
* Índice `user_answers(user_id, created_at desc)` acelera la consulta.

### Ejemplo cURL
```bash
curl -H "Cookie: sb-access-token=<jwt>" \
     "https://<host>/api/user-answers?user_id=51b8745e-..."
```

---

## POST /api/user-answers
Ruta del archivo: `src/app/api/user-answers/route.ts`

### Descripción
Inserta una nueva respuesta de cuestionario y devuelve sólo el UUID generado.

### Autenticación
No utiliza cookie; usa `service-role` key interna para realizar la inserción.  
La RLS se evita con el rol de servicio.

### Cuerpo de la petición (JSON)
```json
{
  "user_id": "51b8745e-...",
  "goal": "hypertrophy",
  "fitness_level": "intermediate",
  "training_experience": "6-12_months",
  "availability": "mon,wed,fri",
  "equipment_access": true,
  "session_duration": "45",
  "injuries": null
}
```

### Respuesta (201 Created)
```json
{ "id": "d3387d63-..." }
```

### Errores
| Código | Condición | Ejemplo |
|--------|-----------|---------|
| 500 | Error Supabase | `{ "error": "duplicate key value violates unique constraint ..." }` |

### Flujo interno
1. Lee `payload = await request.json()`.
2. `supabase.from('user_answers').insert(payload).select('id').single()` usando Service Role.

### Dependencias
* `@supabase/supabase-js` (`service-role`).
* Tabla `user_answers`.

### Notas de seguridad / rendimiento
* Sólo debe ejecutarse desde el backend; **no exponer `SERVICE_ROLE_KEY`** en el navegador.

### Ejemplo cURL
```bash
curl -X POST https://<host>/api/user-answers \
  -H "Content-Type: application/json" \
  -d '{"user_id":"51b8745e-...", "goal":"strength", ... }'
```

---

## GET /api/recommend-routines-by-answer?answer_id=<uuid>
Ruta del archivo: `src/app/api/recommend-routines-by-answer/route.ts`

### Descripción
Devuelve una lista de rutinas recomendadas para la `answer_id` dada, con sus ejercicios ordenados.

### Autenticación
Usa `service-role` key para acceder a una **RPC** sin restricciones RLS.

### Parámetros de consulta
| Nombre | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| `answer_id` | `uuid` | Sí | Id de la respuesta del cuestionario a evaluar |

### Cuerpo de la petición
No aplica.

### Respuesta (200 OK)
```json
[
  {
    "id": "a1b2-...",
    "slug": "upper-body",
    "name": "Upper Body Blast",
    "description": "Rutina enfocada en pecho y espalda",
    "exercises": [
      {
        "id": 12,
        "name": "bench press",
        "gif_url": "https://...",
        "equipment": "barbell",
        "target": "pectorals",
        "secondary_muscles": "triceps",
        "sets": 4,
        "reps": 10,
        "sort_order": 1
      }
    ]
  }
]
```

### Errores
| Código | Condición | Mensaje |
|--------|-----------|---------|
| 400 | Falta `answer_id` | `{ "error": "Missing query param: answer_id" }` |
| 500 | Error en RPC o consulta | `{ "error": "<mensaje de Supabase>" }` |

### Flujo interno
1. Valida `answer_id`.  
2. Llama a RPC `recommend_routines_by_answer(p_answer_id)`.
3. Si `recs` vacío → `[]`.
4. `select` sobre `base_routines` con `in('id', routineIds)` y sub-select `base_routine_exercises ( ... exercises (...))`.
5. Ordena ejercicios por `sort_order` y transforma.

### Dependencias
* RPC `recommend_routines_by_answer`.  
* Tablas `base_routines`, `base_routine_exercises`, `exercises`.

### Notas de seguridad / rendimiento
* Uso de `service-role` implica bypass de RLS; restringir origen mediante middleware/cors.  
* Índices: PK `base_routines.id`, FK en `base_routine_exercises`.

### Ejemplo cURL
```bash
curl "https://<host>/api/recommend-routines-by-answer?answer_id=d3387d63-..."
```

---

## POST /api/routine-results
Ruta del archivo: `src/app/api/routine-results/route.ts`

### Descripción
Guarda el resultado (JSON) de una rutina completada por el usuario.

### Autenticación
Necesita cookie JWT válida. RLS en `routine_results` asegura `auth.uid() = user_id`.

### Cuerpo de la petición (JSON)
```json
{
  "routineId": "a1b2-...",
  "date": "2025-06-14",
  "results": {
    "exercise_12": [
      { "set": 1, "weight": 60, "reps": 10 },
      { "set": 2, "weight": 60, "reps": 8 }
    ]
  }
}
```

### Respuesta (201 Created)
```json
{
  "message": "Rutina finalizada y guardada con éxito",
  "data": {
    "id": "e3f1-...",
    "user_id": "51b8745e-...",
    "routine_id": "a1b2-...",
    "date": "2025-06-14",
    "results": {"exercise_12": [...]},
    "created_at": "2025-06-14T19:50:00Z"
  }
}
```

### Errores
| Código | Condición | Mensaje |
|--------|-----------|---------|
| 401 | Usuario no autenticado | `{"error":"No autorizado. Debes iniciar sesión ..."}` |
| 500 | Error Supabase | `{ "error": "Error en el servidor" }` |

### Flujo interno
1. Crea `supabase` server-side con cookies.  
2. `supabase.auth.getUser()` → verifica sesión.  
3. Construye `dataToInsert` (`user_id`, `routine_id`, `date`, `results`).  
4. `insert` en `user_routine_results` y devuelve fila.

### Dependencias
* Tabla `user_routine_results` (PK `id`, FK `user_id`, `routine_id`).  
* `@supabase/ssr` para cookies.

### Notas de seguridad / rendimiento
* RLS: `WITH CHECK auth.uid() = user_id`.  
* `results` es JSONB; considerar índices GIN si consultas profundas.

### Ejemplo cURL
```bash
curl -X POST https://<host>/api/routine-results \
  -H "Cookie: sb-access-token=<jwt>" \
  -H "Content-Type: application/json" \
  -d '{"routineId":"a1b2-...","date":"2025-06-14","results":{...}}'
```

---

## Scripts auxiliares en /api (no exponen endpoints)
Los archivos bajo `/api/migrate-exercises` y `/api/migrate-gifs` son scripts internos de migración; **no exportan handlers HTTP** y se ejecutan manualmente. Se excluyen del índice principal.

---

Fin del documento.
