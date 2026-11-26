import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Quiz } from "@/models/Quiz";
import { QuizAttempt } from "@/models/QuizAttempt";
import { Application } from "@/models/Application";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { answers, applicationId } = await req.json();
  await dbConnect();
  const quiz = await Quiz.findById(id);
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let score = 0;
  let maxScore = 0;
  quiz.questions.forEach((q: { type: string; correctIndex?: number; points?: number }, i: number) => {
    const pts = q.points || 1;
    if (q.type === "mcq") {
      maxScore += pts;
      const ans = (answers || []).find((a: { questionIndex: number }) => a.questionIndex === i);
      if (ans && ans.selectedIndex === q.correctIndex) score += pts;
    }
  });

  const attempt = await QuizAttempt.create({
    quizId: quiz._id,
    applicationId,
    candidateId: session.user.id,
    answers,
    score,
    maxScore,
    submittedAt: new Date(),
  });

  if (applicationId) {
    await Application.findOneAndUpdate(
      { _id: applicationId, candidateId: session.user.id },
      { quizScore: maxScore ? Math.round((score / maxScore) * 100) : 0, quizAttemptId: attempt._id }
    );
  }

  return NextResponse.json({ attempt });
}
