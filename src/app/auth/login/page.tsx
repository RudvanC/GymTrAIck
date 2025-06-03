// src/app/login/page.tsx
import LoginForm from "@/components/forms/LoginForm";
import Navbar from "@/components/layout/Navbar";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <LoginForm />
    </div>
  );
}
