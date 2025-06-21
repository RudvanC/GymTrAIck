/**
 * Renders the registration page for the application.
 *
 * This page is part of the `/auth/register` route in a Next.js project.
 * It displays a full-height background with a guest navigation bar and a registration form,
 * centered vertically using Flexbox.
 *
 * @remarks
 * This layout duplicates the structure and styling used in the login page (`LoginPage`),
 * including the use of a full-screen container and the `Navbar` component.
 * To improve code reuse and maintainability, consider abstracting the shared layout
 * into a file such as `src/app/auth/layout.tsx`. Both `RegisterPage` and `LoginPage`
 * would then only need to render their respective form components.
 *
 * @example
 * ```tsx
 * // Accessing the /auth/register route will render this page.
 * ```
 *
 * @returns The registration page UI as a React element.
 *
 * @see {@link RegisterForm} - The registration form component used within this page.
 * @see {@link Navbar} - The guest navigation bar component.
 * @see {@link LoginPage} - Related page with shared layout logic.
 */

import RegisterForm from "@/app/auth/register/components/RegisterForm";
import Navbar from "@/components/layout/NavbarGuest";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-color)]">
      <Navbar />
      <RegisterForm />
    </div>
  );
}
