/**
 * Renders the login page for the application.
 *
 * This page is part of the `/auth/login` route in a Next.js application.
 * It displays a full-screen layout with a guest-style navigation bar
 * and a login form centered vertically on a styled background.
 *
 * @remarks
 * The layout uses Flexbox to center its contents and applies a gradient background
 * via the `--background-color` CSS variable.
 *
 * If multiple auth-related pages share this layout (e.g. login, register, forgot password),
 * consider abstracting it into a shared layout file such as `src/app/auth/layout.tsx`.
 *
 * @example
 * ```tsx
 * // Accessing the /auth/login route will render this page.
 * ```
 *
 * @returns The login page UI as a React element.
 *
 * @see {@link LoginForm} - The login form component used within this page.
 * @see {@link Navbar} - The guest navigation bar component.
 */

import LoginForm from "@/app/auth/login/components/LoginForm";
import Navbar from "@/components/layout/NavbarGuest";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-[var(--background-color)]">
      <Navbar />
      <LoginForm />
    </div>
  );
}
