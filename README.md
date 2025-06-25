# GymTrackerNoAI - Documentación del Proyecto

Bienvenido a GymTrackerNoAI, una aplicación diseñada para ayudarte a registrar y seguir tus preferencias y progresos en el entrenamiento físico. Este documento proporciona una visión general de la arquitectura del proyecto, explicando la funcionalidad de sus componentes, hooks y librerías principales

## Tabla de Contenidos.

1.  [Estructura del Proyecto](#estructura-del-proyecto)
2.  [Componentes (`src/components`)](#componentes-srccomponents)
    - [Comunes (`src/components/common`)](#comunes-srccomponentscommon)
    - [Dashboard (`src/components/dashboard`)](#dashboard-srccomponentsdashboard)
    - [Formularios (`src/components/forms`)](#formularios-srccomponentsforms)
    - [Layout (`src/components/layout`)](#layout-srccomponentslayout)
    - [UI (`src/components/ui`)](#ui-srccomponentsui)
3.  [Hooks (`src/hooks`)](#hooks-srchooks)
4.  [Librerías (`src/lib`)](#librerías-srclib)
    - [User Answers (`src/lib/userAnswers`)](#user-answers-srclibuseranswers)
5.  [Tipos (`src/types`)](#tipos-srctypes)
6.  [Estructura de la Aplicación (`src/app`)](#estructura-de-la-aplicación-srcapp)
7.  [Cómo Empezar](#cómo-empezar)
8.  [Scripts Disponibles](#scripts-disponibles)

## Estructura del Proyecto.

El proyecto sigue una estructura típica de Next.js con el App Router:

- `src/app/`: Contiene las rutas principales de la aplicación, layouts y páginas.
- `src/components/`: Alberga los componentes reutilizables de React.
- `src/hooks/`: Contiene hooks personalizados para la lógica de estado y efectos secundarios.
- `src/lib/`: Módulos de utilidad y funciones de ayuda, incluyendo la configuración de Supabase.
- `src/types/`: Definiciones de tipos y interfaces de TypeScript.
- `public/`: Archivos estáticos.
- `tailwind.config.ts`: Configuración de Tailwind CSS.
- `next.config.ts`: Configuración de Next.js.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Componentes (`src/components`)

Los componentes son los bloques de construcción de la interfaz de usuario. Están organizados por su funcionalidad y ubicación dentro de la aplicación.

### Comunes (`src/components/common`)

Estos componentes son genéricos y se utilizan en diversas partes de la aplicación.

#### `LoadingSpinner.tsx`

- **Funcionalidad**: Muestra una animación de carga a pantalla completa con el texto "Cargando...". Es útil para indicar al usuario que se está procesando una operación en segundo plano, como la carga de datos.
- **Detalles Técnicos**: Utiliza Tailwind CSS para el estilizado y posicionamiento. Consiste en un div que ocupa toda la pantalla (`h-screen`, `w-screen`) con un fondo semitransparente y un spinner SVG animado en el centro. El texto "Cargando..." se muestra debajo del spinner.
- **Uso**: Se importa y renderiza condicionalmente cuando se necesita una indicación visual de carga.

### Dashboard (`src/components/dashboard`)

Componentes específicos para la sección del panel de usuario (dashboard).

#### `AnswerCard.tsx`

- **Funcionalidad**: Presenta los detalles de una respuesta de usuario (`UserAnswer`) en un formato de tarjeta. Muestra información como la fecha, experiencia de entrenamiento, disponibilidad, objetivos, etc.
- **Detalles Técnicos**: Construido con los componentes `Card` de `src/components/ui`. Define una interfaz `AnswerCardProps` para tipar las propiedades que recibe (un objeto `UserAnswer`). Realiza un formateo básico de la fecha y muestra la información de manera estructurada dentro de la tarjeta. El acceso a equipamiento se representa con emojis (✅ o ❌).
- **Uso**: Utilizado principalmente por `UserAnswers.tsx` para listar las respuestas del usuario.

#### `UserAnswers.tsx`

- **Funcionalidad**: Obtiene y muestra una lista de las respuestas a cuestionarios enviadas por el usuario actual. Utiliza el componente `AnswerCard` para renderizar cada respuesta.
- **Detalles Técnicos**: Emplea el hook `useUserAnswers` para obtener los datos de las respuestas. Maneja estados de carga (mostrando el `LoadingSpinner`) y errores (mostrando un mensaje de error). Si no hay respuestas, muestra un mensaje indicándolo. Las respuestas se muestran en orden cronológico descendente.
- **Uso**: Componente principal para que los usuarios vean su historial de respuestas a los cuestionarios.

### Formularios (`src/components/forms`)

Componentes encargados de la entrada de datos del usuario.

#### `LoginForm.tsx`

- **Funcionalidad**: Proporciona un formulario para que los usuarios inicien sesión con su correo electrónico y contraseña.
- **Detalles Técnicos**: Utiliza el hook `useAuth` para la lógica de autenticación (específicamente la función `signIn`). Incluye campos para email y contraseña, y un botón de envío. Maneja estados de carga y errores, mostrando mensajes al usuario. Proporciona un enlace a la página de registro. Se han implementado mejoras de accesibilidad como etiquetas `sr-only` para los inputs.
- **Uso**: Se muestra en la ruta `/auth/login`.

#### `RegisterForm.tsx`

- **Funcionalidad**: Permite a los nuevos usuarios crear una cuenta proporcionando un nombre de usuario, correo electrónico y contraseña.
- **Detalles Técnicos**: Anteriormente interactuaba directamente con Supabase para el `signUp` y la creación del perfil de usuario; se sugirió centralizar esta lógica en el hook `useAuth`. Maneja el estado de envío (éxito/error) y muestra mensajes correspondientes. Incluye un enlace a la página de inicio de sesión. Se han implementado mejoras de accesibilidad y un retraso en la redirección tras el registro exitoso para que el usuario pueda leer el mensaje de confirmación.
- **Uso**: Se muestra en la ruta `/auth/register`.

#### `QuestionnaireForm.tsx`

- **Funcionalidad**: Recopila información detallada sobre las preferencias de entrenamiento del usuario, como experiencia, objetivos, disponibilidad, equipamiento, etc.
- **Detalles Técnicos**: Utiliza el hook `useAuth` para obtener el ID del usuario y la función `insertUserAnswers` de `src/lib/userAnswers` para guardar los datos en Supabase. Implementa un estado local para manejar los datos del formulario (`QuestionnaireFormData`). Incluye validación del lado del cliente para asegurar que los datos ingresados sean correctos antes del envío. Tras un envío exitoso, muestra un mensaje y redirige al usuario al dashboard después de un breve retraso. Maneja la correcta obtención del `user.id` antes de permitir el envío.
- **Uso**: Se encuentra en la ruta `/dashboard/questionnaire` y es el medio principal para que los usuarios proporcionen sus datos de entrenamiento.

### Layout (`src/components/layout`)

Estos componentes definen la estructura visual principal de las páginas de la aplicación.

#### `Navbar.tsx`

- **Funcionalidad**: Barra de navegación principal de la aplicación. Muestra el logo/título del sitio y enlaces de autenticación (Login/Register).
- **Detalles Técnicos**: Es un componente fijo en la parte superior de la pantalla (`sticky top-0`) para mejorar la accesibilidad a la navegación. Utiliza Tailwind CSS para el estilizado. Actualmente, los enlaces de autenticación son estáticos; se ha sugerido hacerlos dinámicos (mostrar "Dashboard" y "Logout" si el usuario está autenticado).
- **Uso**: Se incluye en las páginas principales (`/`, `/auth/login`, `/auth/register`) y en el layout de autenticación `src/app/auth/layout.tsx`.

#### `Main.tsx`

- **Funcionalidad**: Renderiza el contenido principal de la página de inicio (landing page).
- **Detalles Técnicos**: Compone varias secciones como `Navbar`, un "Hero section", una sección de características ("Features"), una llamada a la acción ("Call to Action" o CTA) y el pie de página (`Footer`). El pie de página incluye un año de copyright dinámico. Se han implementado mejoras de responsividad en los tamaños de texto y efectos de sombra al pasar el cursor sobre ciertos elementos.
- **Uso**: Es el componente principal renderizado por la ruta raíz (`src/app/page.tsx`).

### UI (`src/components/ui`)

Este directorio contiene componentes de UI reutilizables y estilizados, inspirados en la filosofía de Shadcn/UI. Están construidos utilizando primitivas de Radix UI y Tailwind CSS para ofrecer accesibilidad y flexibilidad.

Todos estos componentes utilizan `React.forwardRef` para permitir que las refs se pasen a los elementos DOM subyacentes y tienen asignada una propiedad `displayName` para facilitar la depuración.

#### `button.tsx`

- **Funcionalidad**: Un componente de botón versátil con variantes de estilo (default, destructive, outline, secondary, ghost, link) y tamaños (default, sm, lg, icon). Permite renderizar como un elemento hijo (`asChild` prop).
- **Detalles Técnicos**: Utiliza `cva` (class-variance-authority) para gestionar las variantes de estilo y `Slot` de `@radix-ui/react-slot` para la prop `asChild`.

#### `card.tsx`

- **Funcionalidad**: Un conjunto de componentes para construir secciones de contenido en formato de tarjeta. Incluye `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, y `CardContent`.
- **Detalles Técnicos**: Simples contenedores `div` estilizados con Tailwind CSS para crear una estructura de tarjeta cohesiva y personalizable.

#### `input.tsx`

- **Funcionalidad**: Un componente de input HTML estilizado.
- **Detalles Técnicos**: Envuelve un elemento `<input>` estándar, aplicando estilos consistentes a través de Tailwind CSS.

#### `label.tsx`

- **Funcionalidad**: Un componente de etiqueta estilizado, basado en la primitiva `Label` de Radix UI.
- **Detalles Técnicos**: Extiende `@radix-ui/react-label` y aplica estilos base. Se ha modificado para ser más genérico eliminando un estilo `flex` por defecto.

#### `select.tsx`

- **Funcionalidad**: Un conjunto completo de componentes para crear menús desplegables (selects) accesibles y personalizables. Incluye `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, y `SelectScrollUpButton`, `SelectScrollDownButton`.
- **Detalles Técnicos**: Basado en las primitivas de `@radix-ui/react-select`, proporciona una base sólida para la creación de selects con buen manejo de teclado y accesibilidad.

#### `textarea.tsx`

- **Funcionalidad**: Un componente de área de texto HTML (`<textarea>`) estilizado.
- **Detalles Técnicos**: Envuelve un elemento `<textarea>` estándar, aplicando estilos consistentes mediante Tailwind CSS.

#### `navigation-menu.tsx`

- **Funcionalidad**: Un sistema robusto para menús de navegación, basado en las primitivas de Radix UI. Incluye `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuContent`, `NavigationMenuTrigger`, `NavigationMenuLink`, `NavigationMenuIndicator`, y `NavigationMenuViewport`.
- **Detalles Técnicos**: Utiliza `@radix-ui/react-navigation-menu` para proporcionar menús de navegación complejos y accesibles, con soporte para submenús y diferentes orientaciones.

---

## Hooks (`src/hooks`)

Los hooks personalizados encapsulan lógica de estado y efectos secundarios reutilizables.

### `useAuth.tsx`

- **Funcionalidad**: Gestiona el estado de autenticación del usuario con Supabase. Proporciona información sobre el usuario actual, así como funciones para iniciar sesión (`signIn`) y cerrar sesión (`signOut`).
- **Detalles Técnicos**: Utiliza `useState` y `useEffect` de React para manejar el estado del usuario (`user`), el estado de carga (`loading`) y los errores (`error`). Se suscribe a los cambios de estado de autenticación de Supabase (`onAuthStateChange`) para mantener la información del usuario actualizada. Las funciones `signIn` y `signOut` interactúan con el cliente de Supabase. Se ha sugerido añadir una función `signUp` para centralizar todas las operaciones de autenticación. Las funciones asíncronas están envueltas en `useCallback` para optimizar el rendimiento.
- **Uso**: Se importa en componentes que necesitan acceder al estado de autenticación o realizar acciones de autenticación, como `LoginForm.tsx`, `RegisterForm.tsx` y `QuestionnaireForm.tsx`.

### `useUserAnswers.tsx`

- **Funcionalidad**: Obtiene las respuestas a los cuestionarios del usuario actualmente autenticado.
- **Detalles Técnicos**: Depende del hook `useAuth` para obtener el ID del usuario y su estado de carga de autenticación. Llama a la función `fetchUserAnswersByUserId` (de `src/lib/userAnswers`) para recuperar los datos de Supabase. Maneja estados de carga y error propios. Vuelve a cargar las respuestas si el usuario o el estado de carga de la autenticación cambian. Proporciona una función `refetchAnswers` para permitir la recarga manual de los datos.
- **Uso**: Utilizado por el componente `UserAnswers.tsx` para mostrar el historial de respuestas del usuario.

---

## Librerías (`src/lib`)

Este directorio contiene módulos de utilidad, configuración de servicios externos y lógica de acceso a datos.

### `supabase.ts`

- **Funcionalidad**: Inicializa y exporta el cliente de Supabase, que permite interactuar con la base de datos y los servicios de autenticación de Supabase.
- **Detalles Técnicos**: Lee las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` para configurar el cliente. Incluye verificaciones en tiempo de ejecución para asegurar que estas variables estén definidas antes de intentar crear el cliente, evitando errores en caso de que falten.
- **Uso**: El cliente exportado (`supabase`) se importa en otros módulos y hooks que necesitan comunicarse con Supabase (e.g., `useAuth.tsx`, `fetch.ts`, `insert.ts`).

### `utils.ts`

- **Funcionalidad**: Proporciona la función de utilidad `cn`.
- **Detalles Técnicos**: La función `cn` combina `clsx` y `tailwind-merge` para permitir la escritura de clases de Tailwind CSS de manera condicional y resolver conflictos de clases de forma inteligente. Es una utilidad estándar en proyectos que usan Tailwind CSS بكثافة.
- **Uso**: Se utiliza en toda la base de código para aplicar clases de Tailwind CSS a los componentes de forma dinámica y limpia.

### User Answers (`src/lib/userAnswers`)

Este subdirectorio contiene la lógica específica para interactuar con la tabla `user_answers` en la base de datos.

#### `fetch.ts` (`src/lib/userAnswers/fetch.ts`)

- **Funcionalidad**: Exporta la función `fetchUserAnswersByUserId(userId)` que recupera todas las respuestas a cuestionarios para un ID de usuario específico.
- **Detalles Técnicos**: Realiza una consulta a la tabla `user_answers` de Supabase, filtrando por `user_id` y ordenando los resultados por `created_at` en orden descendente. Utiliza tipado explícito para la respuesta de la promesa (`Promise<UserAnswer[]>`) y maneja posibles errores imprimiéndolos en la consola.
- **Uso**: Principalmente utilizado por el hook `useUserAnswers.tsx`.

#### `insert.ts` (`src/lib/userAnswers/insert.ts`)

- **Funcionalidad**: Exporta la función `insertUserAnswers(answers)` que inserta un nuevo conjunto de respuestas de cuestionario en la base de datos.
- **Detalles Técnicos**: Realiza una operación de inserción en la tabla `user_answers` de Supabase. Define una interfaz `UserAnswersPayload` para tipar los datos que se esperan. Maneja posibles errores de inserción imprimiéndolos en la consola.
- **Uso**: Utilizado por `QuestionnaireForm.tsx` para guardar las respuestas del usuario.

#### `index.ts` (`src/lib/userAnswers/index.ts`)

- **Funcionalidad**: Actúa como un archivo "barrel" (barril) que reexporta las funciones de `fetch.ts` e `insert.ts`.
- **Detalles Técnicos**: Simplifica las importaciones en otras partes del código, permitiendo importar `fetchUserAnswersByUserId` e `insertUserAnswers` directamente desde `src/lib/userAnswers` en lugar de sus archivos específicos.
- **Uso**: Mejora la organización y mantenibilidad de las importaciones relacionadas con las respuestas de los usuarios.

---

## Tipos (`src/types`)

Este directorio alberga las definiciones de tipos e interfaces de TypeScript utilizadas en todo el proyecto para asegurar la consistencia y corrección de los datos.

### `UserAnswer.ts` (anteriormente `UserAnswer.tsx`)

- **Funcionalidad**: Define la interfaz `UserAnswer` que estructura los datos de las respuestas de los cuestionarios de los usuarios. También define tipos literales de cadena para campos específicos como `training_experience`, `goal`, y `fitness_level` para mejorar la integridad de los datos.
- **Detalles Técnicos**: La interfaz `UserAnswer` incluye campos como `id`, `user_id`, `created_at`, `training_experience`, `goal`, `availability_days`, `availability_time_per_day`, `preferred_training_duration`, `fitness_level`, `has_specific_injuries`, `injury_details`, `has_specific_equipment`, y `equipment_details`. Los tipos `TrainingExperienceType`, `GoalType`, y `FitnessLevelType` usan uniones de literales de cadena (e.g., `'beginner' | 'intermediate' | 'advanced'`) para restringir los valores posibles de esos campos.
- **Uso**: Esta interfaz y los tipos asociados se utilizan en todo el código que maneja datos de respuestas de usuarios, como en `AnswerCard.tsx`, `QuestionnaireForm.tsx`, `useUserAnswers.tsx`, y las funciones en `src/lib/userAnswers`.

---

## Estructura de la Aplicación (`src/app`)

Este directorio es el corazón de la aplicación Next.js y utiliza el App Router. Contiene las páginas, layouts y otros archivos necesarios para definir la estructura y el enrutamiento de la aplicación.

### `layout.tsx` (Root Layout)

- **Funcionalidad**: Es el layout raíz de la aplicación. Envuelve todas las páginas y define la estructura HTML base, incluyendo las etiquetas `<html>` y `<body>`.
- **Detalles Técnicos**: Configura las fuentes globales (Geist Sans y Geist Mono) y los metadatos por defecto del sitio. Importa y aplica `globals.css`. Establece el idioma de la página a español (`lang="es"`). Se ha añadido un color de fondo y texto por defecto al `<body>` para mejorar la apariencia inicial.
- **Uso**: Next.js lo utiliza automáticamente para renderizar todas las rutas. Es un buen lugar para añadir proveedores globales (como contextos de React) que deban estar disponibles en toda la aplicación.

### `page.tsx` (Homepage)

- **Funcionalidad**: Es la página de inicio de la aplicación, accesible en la ruta `/`.
- **Detalles Técnicos**: Renderiza el componente `Main` de `src/components/layout/Main.tsx`, que a su vez construye el contenido de la landing page.
- **Uso**: Punto de entrada principal para los visitantes del sitio.

### `globals.css`

- **Funcionalidad**: Contiene los estilos globales de la aplicación.
- **Detalles Técnicos**: Incluye la configuración base de Tailwind CSS (`@tailwind base; @tailwind components; @tailwind utilities;`). Define un sistema de tematización con variables CSS para colores en modo claro y oscuro, utilizando la gama de colores OKLCH para una mejor percepción del color. Contiene algunos estilos globales agresivos aplicados al selector universal (`*`).
- **Uso**: Estos estilos se aplican a toda la aplicación, estableciendo una base visual coherente.

### `auth/login/page.tsx`

- **Funcionalidad**: Página para el inicio de sesión de usuarios, accesible en `/auth/login`.
- **Detalles Técnicos**: Renderiza el formulario de inicio de sesión (`LoginForm.tsx`). Utiliza el `auth/layout.tsx` para mantener una estructura visual consistente con otras páginas de autenticación.
- **Uso**: Permite a los usuarios existentes acceder a sus cuentas.

### `auth/register/page.tsx`

- **Funcionalidad**: Página para el registro de nuevos usuarios, accesible en `/auth/register`.
- **Detalles Técnicos**: Renderiza el formulario de registro (`RegisterForm.tsx`). Utiliza el `auth/layout.tsx` para una apariencia coherente.
- **Uso**: Permite a los nuevos usuarios crear una cuenta.

### `auth/layout.tsx`

- **Funcionalidad**: Layout compartido para las páginas de autenticación (login, register).
- **Detalles Técnicos**: Proporciona una estructura visual común para las páginas dentro de la ruta `/auth`. Incluye la `Navbar` y un fondo estilizado. El contenido específico de cada página (e.g., `LoginForm` o `RegisterForm`) se renderiza a través de la prop `children`.
- **Uso**: Asegura una experiencia de usuario consistente en el flujo de autenticación y reduce la duplicación de código.

### `dashboard/layout.tsx`

- **Funcionalidad**: Layout específico para las páginas dentro del panel de control del usuario (dashboard).
- **Detalles Técnicos**: Similar al `auth/layout.tsx`, este layout proporcionaría una estructura común (por ejemplo, una barra lateral de navegación del dashboard, cabecera específica del dashboard) para todas las páginas bajo la ruta `/dashboard`. Protege las rutas del dashboard, redirigiendo a los usuarios no autenticados.
- **Uso**: Define la interfaz principal que ven los usuarios una vez que han iniciado sesión y acceden a sus datos y funcionalidades personales.

### `dashboard/page.tsx`

- **Funcionalidad**: Página principal del dashboard del usuario, accesible en `/dashboard` después de iniciar sesión.
- **Detalles Técnicos**: Muestra un saludo al usuario y renderiza el componente `UserAnswers` para listar las respuestas previas a los cuestionarios. También proporciona un enlace para completar un nuevo cuestionario.
- **Uso**: Es la primera página que ve un usuario al acceder a su panel de control.

### `dashboard/questionnaire/page.tsx`

- **Funcionalidad**: Página donde los usuarios pueden completar o enviar el cuestionario de preferencias de entrenamiento. Accesible en `/dashboard/questionnaire`.
- **Detalles Técnicos**: Renderiza el componente `QuestionnaireForm` que maneja la lógica de entrada de datos y envío a la base de datos.
- **Uso**: Permite a los usuarios proporcionar o actualizar su información de entrenamiento.

---

## Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/GymTrackerNoAI.git
    cd GymTrackerNoAI
    ```

2.  **Instalar dependencias:**

    Asegúrate de tener Node.js (versión 18.x o superior recomendada) y npm o yarn instalados.

    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configurar variables de entorno:**

    Crea un archivo `.env.local` en la raíz del proyecto. Este archivo contendrá las claves de tu instancia de Supabase. Puedes encontrar estas claves en el dashboard de tu proyecto Supabase (Configuración del Proyecto > API).

    ```env
    NEXT_PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
    ```

    Reemplaza `TU_SUPABASE_URL` y `TU_SUPABASE_ANON_KEY` con tus valores correspondientes.

4.  **Configurar la base de datos Supabase:**

    Asegúrate de que tu instancia de Supabase tenga la tabla `user_answers` y la tabla `profiles` (manejada por la autenticación de Supabase) configuradas correctamente. La tabla `user_answers` debe tener las columnas esperadas por la interfaz `UserAnswer` y las funciones de inserción/lectura, incluyendo:

    - `id` (uuid, primary key, default: `gen_random_uuid()`)
    - `user_id` (uuid, foreign key a `auth.users.id`)
    - `created_at` (timestamp with time zone, default: `now()`)
    - `training_experience` (text)
    - `goal` (text)
    - `availability_days` (integer)
    - `availability_time_per_day` (integer)
    - `preferred_training_duration` (integer)
    - `fitness_level` (text)
    - `has_specific_injuries` (boolean)
    - `injury_details` (text, nullable)
    - `has_specific_equipment` (boolean)
    - `equipment_details` (text, nullable)

    La tabla `profiles` generalmente es creada por Supabase y se usa para almacenar datos adicionales del usuario. Como mínimo, debe tener una columna `id` (que es una FK a `auth.users.id`) y una columna `username` (text).

5.  **Ejecutar el servidor de desarrollo:**

    ```bash
    npm run dev
    # o
    yarn dev
    ```

    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

- `npm run dev` o `yarn dev`

  - Inicia la aplicación en modo de desarrollo con Turbopack.
  - Abre [http://localhost:3000](http://localhost:3000) para verla en tu navegador.
  - La página se recargará automáticamente si realizas cambios.

- `npm run build` o `yarn build`

  - Construye la aplicación para producción en la carpeta `.next`.
  - Optimiza la aplicación para el mejor rendimiento.

- `npm run start` o `yarn start`

  - Inicia un servidor de producción para la aplicación construida.

- `npm run lint` o `yarn lint`

  - Ejecuta el linter (ESLint) para analizar el código en busca de problemas y asegurar la calidad del código.

- `npm run test` o `yarn test`

  - Ejecuta las pruebas unitarias y de integración utilizando Vitest en modo watch.

- `npm run test:ui` o `yarn test:ui`

  - Ejecuta las pruebas con la interfaz de usuario de Vitest.

- `npm run test:coverage` o `yarn test:coverage`
  - Ejecuta las pruebas una vez y genera un informe de cobertura de código.

---

## Consideraciones Adicionales y Próximos Pasos

Este proyecto es una base sólida para una aplicación de seguimiento de fitness. Aquí hay algunas áreas que podrían explorarse para futuras mejoras:

- **Pruebas (Testing)**: Aunque se han configurado scripts de prueba con Vitest, sería beneficioso ampliar la cobertura de pruebas, incluyendo pruebas unitarias para componentes y lógica de negocio, y pruebas de integración para flujos de usuario.
- **Gestión de Estado Avanzada**: Para aplicaciones más complejas, se podría considerar una librería de gestión de estado global más robusta si `useState` y `useContext` (o los hooks personalizados actuales) se vuelven insuficientes.
- **Optimización del Rendimiento**: Aunque Next.js ofrece muchas optimizaciones, se podrían analizar más a fondo los "Core Web Vitals" y aplicar técnicas de optimización específicas según sea necesario (e.g., optimización de imágenes, carga diferida de componentes).
- **Accesibilidad (a11y)**: Continuar auditando y mejorando la accesibilidad de todos los componentes y flujos de usuario.
- **Seguridad**: Revisar y asegurar las configuraciones de Supabase, especialmente las políticas de seguridad a nivel de fila (Row Level Security) para proteger los datos del usuario.
- **Generación de Rutinas (Funcionalidad Principal)**: Implementar la lógica para procesar las respuestas del usuario y generar planes o sugerencias de entrenamiento.
- **Internacionalización (i18n)**: Si se planea soportar múltiples idiomas.

¡Gracias por explorar GymTrackerNoAI!

---
