import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Quiz } from "@/models/Quiz";
import { isHr } from "@/lib/session";

export async function GET() {
  const session = await auth();
  if (!session?.user?.companyId || !isHr(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const quizzes = await Quiz.find({ companyId: session.user.companyId }).sort({ createdAt: -1 });
  return NextResponse.json({ quizzes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.companyId || !isHr(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await dbConnect();
  const quiz = await Quiz.create({
    companyId: session.user.companyId,
    createdBy: session.user.id,
    title: body.title,
    description: body.description,
    timeLimitMinutes: body.timeLimitMinutes || 20,
    questions: body.questions || [],
  });
  return NextResponse.json({ quiz });
}
