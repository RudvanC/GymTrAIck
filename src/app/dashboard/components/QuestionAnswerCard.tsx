// src/app/dashboard/components/QuestionAnswerCard.tsx


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface QAItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Renders a small card showing a single Q&A pair coming from the user's latest
 * questionnaire answer.
 */
export function QuestionAnswerCard({ item }: { item: QAItem }) {
  return (
    <Card className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 shadow rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-300">
          {item.question}
        </CardTitle>
        <Separator className="bg-slate-700/50" />
      </CardHeader>
      <CardContent>
        <p className="text-slate-100 text-lg break-words">{item.answer}</p>
      </CardContent>
    </Card>
  );
}
