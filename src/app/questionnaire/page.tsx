import Navbar from "@/components/layout/NavbarGuest";
import QuestionnarieForm from "@/app/questionnaire/components/QuestionnarieForm";

export default function FormPage() {
  return (
    <div className="h-screen bg-[var(--background-color)]">
      <Navbar />
      <QuestionnarieForm />
    </div>
  );
}
