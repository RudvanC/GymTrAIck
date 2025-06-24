# GymTrAIck - Documentación Completa del Proyecto

## Índice
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías y Dependencias](#tecnologías-y-dependencias)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Componentes Principales](#componentes-principales)
6. [Sistema de Autenticación](#sistema-de-autenticación)
7. [API Endpoints](#api-endpoints)
8. [Hooks Personalizados](#hooks-personalizados)
9. [Tipos y Interfaces](#tipos-y-interfaces)
10. [Configuración del Entorno](#configuración-del-entorno)
11. [Comandos Disponibles](#comandos-disponibles)
12. [Testing](#testing)
13. [Despliegue](#despliegue)
14. [Mejoras Futuras](#mejoras-futuras)

---

## Resumen Ejecutivo

**GymTrAIck** es una aplicación web moderna desarrollada con Next.js 14+ que utiliza inteligencia artificial para generar rutinas de ejercicio personalizadas. La aplicación permite a los usuarios completar cuestionarios sobre sus preferencias de ejercicio, objetivos y limitaciones físicas, para luego generar rutinas adaptadas a sus necesidades específicas.

### Características Principales:
- 🏋️ Generación de rutinas personalizadas basadas en IA
- 👤 Sistema completo de autenticación de usuarios
- 📊 Dashboard personalizado con seguimiento de progreso
- 📱 Diseño responsivo y moderno
- 🔒 Protección de rutas y manejo seguro de datos
- ⚡ Optimizado para rendimiento con SSR/SSG

---

## Arquitectura del Proyecto

La aplicación sigue una arquitectura moderna de React/Next.js con los siguientes patrones:

### Patrones Arquitectónicos:
- **App Router**: Utiliza el nuevo App Router de Next.js 13+
- **Server Components**: Componentes de servidor para mejor rendimiento
- **Client Components**: Componentes de cliente para interactividad
- **API Routes**: Endpoints REST para la comunicación con el backend
- **Context Pattern**: Para el manejo del estado global de autenticación
- **Custom Hooks**: Para lógica reutilizable de datos y estado
- **Component Composition**: Composición de componentes para UI flexible

### Stack Tecnológico:
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, Radix UI
- **Backend**: Next.js API Routes, Supabase
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estado**: React Context API, Zustand
- **Fetching**: SWR para data fetching
- **Testing**: Jest, Vitest, React Testing Library

---

## Tecnologías y Dependencias

### Dependencias Principales:
```json
{
  "@radix-ui/react-*": "UI components primitivos",
  "@supabase/supabase-js": "Cliente de Supabase",
  "next": "14.2.16",
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "swr": "2.2.5",
  "zustand": "5.0.0",
  "tailwindcss": "3.4.14",
  "typescript": "5.6.3"
}
```

### Dependencias de Desarrollo:
```json
{
  "@testing-library/react": "16.0.1",
  "@types/jest": "29.5.14",
  "eslint": "8.57.1",
  "jest": "29.7.0",
  "vitest": "2.1.4",
  "typedoc": "0.26.11"
}
```

---

## Estructura de Directorios

```
GymTrAIck/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── base-routines/
│   │   │   ├── custom-routines/
│   │   │   ├── recommend-routines-by-answer/
│   │   │   ├── regenerate-plan/
│   │   │   ├── routine-results/
│   │   │   └── user-answers/
│   │   ├── auth/              # Páginas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # Panel de usuario
│   │   ├── questionnaire/     # Cuestionario
│   │   ├── routines/          # Gestión de rutinas
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   ├── loading.tsx        # Componente de carga
│   │   ├── not-found.tsx      # Página 404
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes UI base
│   │   ├── auth/             # Componentes de autenticación
│   │   ├── dashboard/        # Componentes del dashboard
│   │   ├── layout/           # Componentes de layout
│   │   └── questionnaire/    # Componentes del cuestionario
│   ├── context/              # Contextos de React
│   │   └── AuthContext.tsx
│   ├── hooks/                # Hooks personalizados
│   │   └── useUserAnswers.ts
│   ├── lib/                  # Utilidades y configuraciones
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/                # Definiciones de tipos
│       └── userAnswer.ts
├── __tests__/                # Tests
├── docs/                     # Documentación generada
├── public/                   # Archivos estáticos
├── .env.local               # Variables de entorno
├── next.config.ts           # Configuración de Next.js
├── tailwind.config.ts       # Configuración de Tailwind
├── tsconfig.json           # Configuración de TypeScript
└── package.json            # Dependencias y scripts
```

---

## Componentes Principales

### 1. Layout Principal (`src/app/layout.tsx`)
```typescript
// Estructura base de la aplicación con:
// - Configuración de metadatos
// - Proveedores de contexto
// - Configuración de fuentes
// - AuthProvider wrapper
```

### 2. Página Principal (`src/app/page.tsx`)
```typescript
// Landing page con componente Main que incluye:
// - Sección Hero
// - Características principales
// - Call-to-action
// - Footer
```

### 3. Dashboard (`src/app/dashboard/page.tsx`)
```typescript
// Panel principal del usuario autenticado:
// - Saludo personalizado
// - Resumen de cuestionarios
// - Acciones rápidas (editar perfil, nuevo cuestionario)
// - Estado de carga y error handling
```

### 4. Gestión de Rutinas (`src/app/routines/page.tsx`)
```typescript
// Página de rutinas con:
// - Lista de rutinas recomendadas
// - Rutinas personalizadas del usuario
// - Funciones para añadir/regenerar rutinas
// - Integración con SWR para data fetching
```

---

## Sistema de Autenticación

### AuthContext (`src/context/AuthContext.tsx`)
El contexto de autenticación maneja:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Características:**
- Manejo de estado de usuario con Supabase Auth
- Listeners para cambios de autenticación
- Funciones para login, registro y logout
- Estado de carga global
- Persistencia de sesión automática

### Middleware (`src/middleware.ts`)
Protege rutas y maneja redirecciones:

```typescript
// Rutas protegidas: dashboard, questionnaire, routines
// Rutas públicas: login, register, home
// Redirecciones automáticas basadas en estado de autenticación
```

---

## API Endpoints

### Estructura de la API
Todas las rutas están bajo `src/app/api/` y siguen el patrón de Next.js App Router:

#### 1. `/api/base-routines`
- **GET**: Obtiene rutinas base del sistema
- **Uso**: Rutinas predefinidas como punto de partida

#### 2. `/api/custom-routines`
- **GET**: Obtiene rutinas personalizadas del usuario
- **POST**: Crea nuevas rutinas personalizadas
- **Uso**: Gestión de rutinas creadas por el usuario

#### 3. `/api/recommend-routines-by-answer`
- **POST**: Genera recomendaciones basadas en respuestas del cuestionario
- **Uso**: IA para generar rutinas personalizadas

#### 4. `/api/regenerate-plan`
- **POST**: Regenera un plan de rutinas existente
- **Uso**: Actualizar rutinas basadas en progreso/feedback

#### 5. `/api/routine-results/`
- **`/create`**: Crear nuevos resultados de rutina
- **`/custom-routine-results`**: Resultados de rutinas personalizadas
- **`/search`**: Búsqueda de resultados
- **Base route**: CRUD de resultados de rutinas

#### 6. `/api/user-answers`
- **GET**: Obtiene respuestas del cuestionario del usuario
- **POST**: Guarda nuevas respuestas del cuestionario
- **PUT**: Actualiza respuestas existentes

---

## Hooks Personalizados

### useUserAnswers (`src/hooks/useUserAnswers.ts`)
Hook para gestionar las respuestas del usuario al cuestionario:

```typescript
interface UseUserAnswersReturn {
  answers: UserAnswer | null;
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

// Características:
// - Integración con SWR para caching y revalidación
// - Manejo automático de estados de carga y error
// - Revalidación automática en focus/reconnect
// - Dependent fetching basado en autenticación
```

---

## Tipos y Interfaces

### UserAnswer (`src/types/userAnswer.ts`)
Define la estructura de las respuestas del cuestionario:

```typescript
interface UserAnswer {
  id: string;
  user_id: string;
  current_fitness_level: FitnessLevel;
  primary_goals: Goal[];
  workout_frequency: WorkoutFrequency;
  session_duration: SessionDuration;
  preferred_workout_types: WorkoutType[];
  available_equipment: Equipment[];
  workout_location: WorkoutLocation[];
  injuries_limitations: InjuryLimitation[];
  experience_with_ai_fitness: ExperienceLevel;
  created_at: string;
  updated_at: string;
}

// Tipos literales para garantizar consistencia:
type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
type Goal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility';
// ... más tipos específicos
```

---

## Configuración del Entorno

### Variables de Entorno (`.env.local`)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics, monitoring, etc.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Next.js Config (`next.config.ts`)
```typescript
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Solo para desarrollo
  },
  eslint: {
    ignoreDuringBuilds: true, // Solo para desarrollo
  },
};
```

### Tailwind Config (`tailwind.config.ts`)
```typescript
// Configuración personalizada con:
// - Paths de contenido optimizados
// - Tema extendido con colores personalizados
// - Plugins de Radix UI
// - Configuración responsive
```

---

## Comandos Disponibles

### Scripts de Desarrollo
```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo
npm run build        # Build de producción
npm run start        # Inicia servidor de producción
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Corrige errores de linting automáticamente

# Testing
npm run test         # Ejecuta tests con Jest
npm run test:watch   # Tests en modo watch
npm run test:coverage # Coverage report
npm run test:ui      # Tests con Vitest UI

# Documentación
npm run docs         # Genera documentación con TypeDoc
npm run docs:serve   # Sirve documentación localmente

# Utilidades
npm run type-check   # Verificación de tipos TypeScript
npm run format       # Formatea código con Prettier
```

---

## Testing

### Configuración de Testing
El proyecto incluye configuración para múltiples frameworks de testing:

#### Jest (`jest.config.js`)
- Unit tests para componentes y utilidades
- Mocking de Supabase y Next.js
- Coverage reporting
- Setup files para testing environment

#### Vitest (`vitest.config.ts`)
- Tests rápidos con hot reload
- UI para testing interactivo
- Compatible con Jest API
- Mejor integración con Vite/modern tooling

### Estrategia de Testing
```typescript
// Tipos de tests implementados:
// 1. Unit Tests: Componentes individuales
// 2. Integration Tests: Hooks con API calls
// 3. API Tests: Endpoints de Next.js
// 4. E2E Tests: Flujos completos de usuario (planeado)
```

---

## Despliegue

### Preparación para Producción
1. **Variables de Entorno**: Configurar en plataforma de hosting
2. **Base de Datos**: Setup de Supabase en producción
3. **Build Optimization**: 
   ```bash
   npm run build
   npm run start
   ```

### Plataformas Recomendadas
- **Vercel**: Optimizado para Next.js
- **Netlify**: Excelente para sitios estáticos
- **Railway**: Para full-stack con base de datos
- **Supabase Hosting**: Integración nativa

### Checklist de Despliegue
- [ ] Variables de entorno configuradas
- [ ] Base de datos de producción lista
- [ ] Dominios y SSL configurados
- [ ] Monitoring y analytics setup
- [ ] Error tracking (Sentry, etc.)
- [ ] Performance monitoring

---

## Mejoras Futuras

### Funcionalidades Planeadas
1. **Sistema de Progreso**
   - Tracking de ejercicios completados
   - Métricas de rendimiento
   - Gráficos de progreso temporal

2. **Social Features**
   - Compartir rutinas
   - Sistema de seguimiento de amigos
   - Leaderboards y achievements

3. **IA Avanzada**
   - Adaptación automática de rutinas
   - Análisis de patrones de ejercicio
   - Recomendaciones nutricionales

4. **Mobile App**
   - React Native o PWA
   - Sincronización offline
   - Notificaciones push

### Optimizaciones Técnicas
1. **Performance**
   - Implementar ISR (Incremental Static Regeneration)
   - Image optimization
   - Bundle splitting avanzado

2. **SEO y Marketing**
   - Meta tags dinámicos
   - Schema markup
   - Sitemap automático

3. **DevOps**
   - CI/CD pipelines
   - Automated testing
   - Performance monitoring

---

## Conclusión

GymTrAIck es una aplicación moderna y bien estructurada que demuestra las mejores prácticas en desarrollo web actual. Con una arquitectura escalable, código bien tipado y una experiencia de usuario intuitiva, está preparada tanto para el uso inmediato como para el crecimiento futuro.

El proyecto destaca por:
- ✅ Arquitectura limpia y mantenible
- ✅ Código completamente tipado con TypeScript
- ✅ Testing comprehensivo
- ✅ Documentación detallada
- ✅ Configuración de desarrollo optimizada
- ✅ Preparado para producción

---

**Documentación generada el:** $(date)
**Versión del proyecto:** 0.1.0
**Autor:** Equipo GymTrAIck
