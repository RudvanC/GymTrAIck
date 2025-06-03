import RegisterForm from "@/components/forms/RegisterForm";
import Navbar from "@/components/layout/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <RegisterForm />
    </div>
  );
}
