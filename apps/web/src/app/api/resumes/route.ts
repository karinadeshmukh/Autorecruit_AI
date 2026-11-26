import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Resume } from "@/models/Resume";
import { AiSettings } from "@/models/AiSettings";
import { parseResume, scoreQuality, resumeInsights } from "@/lib/ai";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await dbConnect();
  const resumes = await Resume.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ resumes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "CANDIDATE") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const fd = await req.formData();
  const file = fd.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "File required" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const uploads = path.join(process.cwd(), "uploads");
  await mkdir(uploads, { recursive: true });
  const stored = `${session.user.id}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploads, stored);
  await writeFile(filePath, buf);

  await dbConnect();
  const settings = await AiSettings.findOne({ key: "global" });

  let parsed;
  let quality;
  let insights: string[] = [];
  let structuredInsights = null;

  try {
    const parsedRes = await parseResume(file.name, buf.toString("base64"));
    parsed = parsedRes.parsed;
    quality = await scoreQuality(parsed.raw_text, parsed);
    const insightRes = await resumeInsights(parsed.raw_text, parsed, {
      provider: settings?.provider,
      model: settings?.model,
    });
    insights = insightRes.insights || [];
    structuredInsights = insightRes;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not parse resume. Is the AI service running?" }, { status: 502 });
  }

  const resume = await Resume.create({
    userId: session.user.id,
    filename: file.name,
    mimeType: file.type,
    filePath: stored,
    parsed,
    rawText: parsed.raw_text,
    qualityScore: quality.score,
    qualityBreakdown: quality.breakdown,
    suggestions: quality.suggestions,
    insights,
    structuredInsights,
  });

  return NextResponse.json({ resume });
}
