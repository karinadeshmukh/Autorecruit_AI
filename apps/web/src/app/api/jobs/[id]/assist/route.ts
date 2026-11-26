import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isHr } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { AiSettings } from "@/models/AiSettings";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !isHr(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { title, notes } = await req.json();
  await dbConnect();
  const settings = await AiSettings.findOne({ key: "global" });
  const url = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${url}/v1/insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-ai-secret": process.env.AI_SERVICE_SECRET || "change-me-ai-service-secret",
      },
      body: JSON.stringify({
        text: `Write a job description for ${title}. Notes: ${notes || ""}`,
        parsed: { skills: [], experience: [], education: [], raw_text: notes || title },
        provider: settings?.provider,
        model: settings?.model,
        mode: "job_description",
      }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      insights: [
        `${title} — we are looking for someone who can ship with clarity, collaborate across product and engineering, and raise the quality bar.`,
      ],
    });
  }
}
