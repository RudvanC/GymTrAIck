// src/app/auth/login/page.tsx - Defines the login page for the application.

import LoginForm from "@/components/forms/LoginForm"; // The actual login form component
import Navbar from "@/components/layout/NavbarGuest"; // The application's navigation bar

/**
 * LoginPage component.
 * Renders the navigation bar and the login form on a styled background.
 *
 * SUGGESTION: If the Navbar and the background styling are common to other auth pages
 * (e.g., register, forgot-password), consider creating a shared layout file at
 * `src/app/auth/layout.tsx` to avoid duplication and centralize the layout logic.
 * The page would then just return <LoginForm />.
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  );
}
