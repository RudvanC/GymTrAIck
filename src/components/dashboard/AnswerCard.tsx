import { UserAnswer } from "@/types/UserAnswer";

// Defines the props for the AnswerCard component.
// It expects an 'answer' object of type UserAnswer.
interface AnswerCardProps {
  answer: UserAnswer;
}

// AnswerCard component: Renders a card displaying details of a user's answers.
export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    // Main card container with styling for background, rounded corners, shadow, padding, and border.
    <section className="p-6 flex flex-col gap-2">
      {/* Displays the creation date of the answer, formatted to local date string. */}

      <div className="flex gap-2 justify-evenly">
        {/* Section for Training Experience */}
        <article className="mb-2 border border-gray-200 p-2 rounded-md flex flex-col gap-2 bg-[#613289]">
          <span className="font-semibold text-gray-400">Experiencia:</span>{" "}
          {/* Displays training experience in a styled badge. */}
          <span className="justify-center items-center text-center flex bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full capitalize">
            {answer.training_experience}
          </span>
        </article>

        {/* Section for Availability */}
        <article className="mb-2 border border-gray-200 p-2 rounded-md flex flex-col gap-2 bg-[#613289]">
          <span className="font-semibold text-gray-400">Disponibilidad:</span>{" "}
          {/* Displays availability in a styled badge. */}
          <span className="justify-center items-center text-center flex bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full capitalize">
            {answer.availability}
          </span>
        </article>

        {/* Section for Injuries */}
        <article className="mb-2 border border-gray-200 p-2 rounded-md flex flex-col gap-2 bg-[#613289]">
          <span className="font-semibold text-gray-400">Lesiones:</span>{" "}
          {/* Displays injuries or "Ninguna" if not specified. */}
          <span className="justify-center items-center text-center flex bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full capitalize">
            {answer.injuries || "Ninguna"}
          </span>
        </article>

        {/* Section for Equipment Access */}
        <article className="mb-2 border border-gray-200 p-2 rounded-md flex flex-col gap-2 bg-[#613289]">
          <span className="font-semibold text-gray-400">Acceso a equipo:</span>{" "}
          {/* Displays a check or cross mark based on equipment access. */}
          <span className="justify-center items-center text-center flex bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full capitalize">
            {answer.equipment_access ? "✅" : "❌"}
          </span>
        </article>

        {/* Section for Goal */}
        <article className="mb-2 border border-gray-200 p-2 rounded-md flex flex-col gap-2 bg-[#613289]">
          <span className="font-semibold text-gray-400">Objetivo:</span>{" "}
          {/* Displays the user's goal in a styled badge. */}
          <span className="justify-center items-center text-center flex bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full capitalize">
            {answer.goal}
          </span>
        </article>

        {/* Section for Fitness Level */}
        <article className="mb-2 border border-gray-200 p-2 rounded-md flex flex-col gap-2 bg-[#613289]">
          <span className="font-semibold text-gray-400">Nivel físico:</span>{" "}
          {/* Displays fitness level in a styled badge. */}
          <span className="justify-center items-center text-center flex bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full capitalize">
            {answer.fitness_level}
          </span>
        </article>

        {/* Section for Session Duration */}
        <article className="mb-2 border border-gray-200 p-2 rounded-md flex flex-col gap-2 bg-[#613289]">
          <span className="font-semibold text-gray-400">Duración sesión:</span>{" "}
          {/* Displays the preferred session duration. */}
          <span className="justify-center items-center text-center flex bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full capitalize">
            {answer.session_duration}
          </span>
        </article>
      </div>
    </section>
  );
}
