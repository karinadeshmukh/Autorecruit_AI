import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { Resume } from "@/models/Resume";
import { matchJob } from "@/lib/ai";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (session.user.role === "CANDIDATE") {
    const apps = await Application.find({ candidateId: session.user.id })
      .populate({ path: "jobId", populate: { path: "companyId", select: "name logoText" } })
      .sort({ createdAt: -1 });
    return NextResponse.json({ applications: apps });
  }

  if (!session.user.companyId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const filter: Record<string, unknown> = { companyId: session.user.companyId };
  if (jobId) filter.jobId = jobId;
  const apps = await Application.find(filter)
    .populate("candidateId", "name email headline location skills")
    .populate("resumeId")
    .populate("jobId", "title")
    .sort({ matchScore: -1, createdAt: -1 });
  return NextResponse.json({ applications: apps });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await dbConnect();
  const job = await Job.findById(body.jobId);
  if (!job || job.status !== "open") return NextResponse.json({ error: "Job unavailable" }, { status: 400 });

  const resume = body.resumeId
    ? await Resume.findOne({ _id: body.resumeId, userId: session.user.id })
    : await Resume.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
  if (!resume) return NextResponse.json({ error: "Upload a resume first" }, { status: 400 });

  let matchReport = null;
  let matchScore = 0;
  try {
    matchReport = await matchJob({
      resume_text: resume.rawText || "",
      job_description: job.description,
      required_skills: job.skills || [],
      eligibility: job.eligibility || {},
      weights: job.weights || undefined,
    });
    matchScore = matchReport.score;
  } catch (err) {
    console.error(err);
  }

  try {
    const application = await Application.create({
      jobId: job._id,
      candidateId: session.user.id,
      resumeId: resume._id,
      companyId: job.companyId,
      screeningAnswers: body.screeningAnswers || [],
      matchScore,
      matchReport,
      stageHistory: [{ stage: "applied", at: new Date(), by: session.user.id }],
    });
    return NextResponse.json({ application });
  } catch {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }
}
