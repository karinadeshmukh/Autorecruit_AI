import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import { isHr } from "@/lib/session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const jobType = searchParams.get("jobType");
  const experienceLevel = searchParams.get("experienceLevel");
  const mine = searchParams.get("mine");

  await dbConnect();
  const filter: Record<string, unknown> = { status: "open" };
  if (q) filter.title = { $regex: q, $options: "i" };
  if (location) filter.location = { $regex: location, $options: "i" };
  if (jobType) filter.jobType = jobType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;

  const session = await auth();
  if (mine && session?.user?.companyId) {
    delete filter.status;
    filter.companyId = session.user.companyId;
  }

  const jobs = await Job.find(filter).populate("companyId", "name logoText location").sort({ createdAt: -1 }).limit(60);
  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !isHr(session.user.role) || !session.user.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await dbConnect();
  const job = await Job.create({
    companyId: session.user.companyId,
    createdBy: session.user.id,
    title: body.title,
    description: body.description,
    location: body.location,
    jobType: body.jobType,
    experienceLevel: body.experienceLevel,
    remote: Boolean(body.remote),
    salaryMin: body.salaryMin ? Number(body.salaryMin) : undefined,
    salaryMax: body.salaryMax ? Number(body.salaryMax) : undefined,
    skills: Array.isArray(body.skills)
      ? body.skills
      : String(body.skills || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
    eligibility: {
      education: body.education,
      minYears: body.minYears ? Number(body.minYears) : undefined,
      location: body.eligibilityLocation,
    },
    screeningQuestions: (body.screeningQuestions || [])
      .filter((q: { prompt?: string }) => q.prompt)
      .map((q: { prompt: string; required?: boolean }) => ({
        prompt: q.prompt,
        required: q.required !== false,
      })),
    quizId: body.quizId || undefined,
  });
  return NextResponse.json({ job });
}
