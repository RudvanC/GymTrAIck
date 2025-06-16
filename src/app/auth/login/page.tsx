// src/app/auth/login/page.tsx - Defines the login page for the application.

import LoginForm from "@/app/auth/login/components/LoginForm"; // The actual login form component
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
    // Main container for the login page with full height and gradient background.
    // Flexbox is used to center the content.
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background-color)]">
      {/* Renders the application navbar at the top of the page. */}
      {/* If using an auth layout, Navbar would typically be in that layout. */}
      <Navbar />
      {/* Renders the login form component. */}
      <LoginForm />
    </div>
  );
}
