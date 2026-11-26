import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Quiz } from "@/models/Quiz";
import { notFound } from "next/navigation";
import { QuizTake } from "./take";

export default async function TakeQuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ applicationId?: string }>;
}) {
  await requireRole(["CANDIDATE"]);
  const { id } = await params;
  const sp = await searchParams;
  await dbConnect();
  const quiz = (await Quiz.findById(id).lean()) as any;
  if (!quiz) notFound();
  const safe = {
    ...quiz,
    questions: (quiz.questions || []).map((q: { prompt: string; type: string; options?: string[]; points?: number }) => ({
      prompt: q.prompt,
      type: q.type,
      options: q.options,
      points: q.points,
    })),
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold">{quiz.title}</h1>
      <p className="mt-2 text-muted">{quiz.description} · {quiz.timeLimitMinutes} min</p>
      <QuizTake quizId={id} applicationId={sp.applicationId} questions={JSON.parse(JSON.stringify(safe.questions))} />
    </div>
  );
}
