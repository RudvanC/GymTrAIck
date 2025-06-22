import Navbar from "@/components/layout/NavbarGuest";
import QuestionnarieForm from "@/app/questionnaire/components/QuestionnarieForm";

export default function FormPage() {
  return (
    <div className="pb-20 md:pb-0 bg-[var(--background-color)]">
      <Navbar />
      <QuestionnarieForm />
    </div>
  );
}
