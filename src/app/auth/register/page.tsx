// src/app/auth/register/page.tsx - Defines the registration page for the application.

import RegisterForm from "@/components/forms/RegisterForm"; // The actual registration form component
import Navbar from "@/components/layout/NavbarGuest"; // The application's navigation bar

/**
 * RegisterPage component.
 * Renders the navigation bar and the registration form on a styled background.
 *
 * CRITICAL SUGGESTION: This page duplicates the Navbar and background styling from LoginPage.
 * Create a shared layout file at `src/app/auth/layout.tsx` to hold these common elements.
 * This will make `RegisterPage` and `LoginPage` much cleaner (they would just return their respective forms).
 */
export default function RegisterPage() {
  return (
    // Main container for the registration page with full height and gradient background.
    // This styling is identical to LoginPage and should be moved to a shared auth layout.
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Renders the application navbar. This would be part of the shared auth layout. */}
      <Navbar />
      {/* Renders the registration form component. */}
      <RegisterForm />
    </div>
  );
}
