import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Card, Badge } from "@/components/ui";
import Link from "next/link";

export default async function AssessmentsPage() {
  const user = await requireRole(["CANDIDATE"]);
  await dbConnect();
  const apps = (await Application.find({ candidateId: user.id })
    .populate({ path: "jobId", select: "title quizId" })
    .lean()) as any[];
  const withQuiz = apps.filter((a: any) => a.jobId?.quizId);

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Quizzes</h1>
      <div className="mt-6 space-y-3">
        {withQuiz.map((a: any) => (
          <Card key={String(a._id)} className="flex items-center justify-between">
            <div>
              <p className="font-bold">{a.jobId?.title}</p>
              {a.quizScore != null && <Badge tone="lime">Score {a.quizScore}%</Badge>}
            </div>
            <Link className="text-sm font-semibold underline" href={`/app/assessments/${a.jobId.quizId}?applicationId=${a._id}`}>
              {a.quizScore != null ? "Review" : "Start"}
            </Link>
          </Card>
        ))}
        {withQuiz.length === 0 && <p className="text-muted">No quizzes assigned yet.</p>}
      </div>
    </div>
  );
}
