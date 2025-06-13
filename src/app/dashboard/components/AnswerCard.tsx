interface Answer {
  id: string;
  question: string; // Asumo que tienes una propiedad para la pregunta/título
  answer: string; // y otra para la respuesta.
}

interface AnswerCardProps {
  answer: Answer;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  // Estilo para simular las tarjetas rojas de tu diseño.
  return (
    <div className="p-4 border-2 border-red-400 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <h3 className="font-bold text-slate-800 truncate">
        {answer.question || "Respuesta"}
      </h3>
      <p className="text-blue-600 font-semibold text-lg">{answer.answer}</p>
    </div>
  );
}
