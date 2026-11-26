import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { isHr } from "@/lib/session";

export async function GET() {
  const session = await auth();
  if (!session?.user?.companyId || !isHr(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const companyId = session.user.companyId;
  const [byStage, jobs, apps] = await Promise.all([
    Application.aggregate([{ $match: { companyId: (await import("mongoose")).default.Types.ObjectId.createFromHexString(companyId) } }, { $group: { _id: "$stage", count: { $sum: 1 }, avgScore: { $avg: "$matchScore" } } }]),
    Job.countDocuments({ companyId }),
    Application.find({ companyId }).sort({ createdAt: -1 }).limit(200).select("createdAt stage matchScore"),
  ]);

  const byDay: Record<string, number> = {};
  for (const a of apps) {
    const d = new Date(a.createdAt).toISOString().slice(0, 10);
    byDay[d] = (byDay[d] || 0) + 1;
  }

  return NextResponse.json({
    jobs,
    byStage,
    applicationsOverTime: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    avgMatch: apps.length ? apps.reduce((s, a) => s + (a.matchScore || 0), 0) / apps.length : 0,
    totalApplications: apps.length,
  });
}
