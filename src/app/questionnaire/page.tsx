import Navbar from "@/components/layout/NavbarGuest";
import QuestionnarieForm from "@/app/questionnaire/components/QuestionnarieForm";

export default function FormPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <QuestionnarieForm />
    </div>
  );
}
