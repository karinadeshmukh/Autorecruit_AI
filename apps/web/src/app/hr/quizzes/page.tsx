import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Quiz } from "@/models/Quiz";
import { Button, Card } from "@/components/ui";
import mongoose from "mongoose";

export default async function QuizzesPage() {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  await dbConnect();
  const quizzes = (await Quiz.find({ companyId: new mongoose.Types.ObjectId(user.companyId) }).lean()) as any[];
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Quizzes</h1>
        <Button href="/hr/quizzes/new">New quiz</Button>
      </div>
      <div className="mt-6 space-y-3">
        {quizzes.map((q: any) => (
          <Card key={String(q._id)}>
            <p className="font-bold">{q.title}</p>
            <p className="text-sm text-muted">
              {q.questions?.length || 0} questions · {q.timeLimitMinutes} min
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
