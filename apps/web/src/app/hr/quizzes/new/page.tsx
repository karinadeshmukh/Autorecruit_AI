import { requireRole } from "@/lib/session";
import { QuizBuilder } from "./builder";

export default async function NewQuizPage() {
  await requireRole(["HR", "COMPANY_ADMIN"]);
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold">Quiz builder</h1>
      <QuizBuilder />
    </div>
  );
}
