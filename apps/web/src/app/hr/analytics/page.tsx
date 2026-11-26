import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { Card } from "@/components/ui";
import mongoose from "mongoose";

export default async function AnalyticsPage() {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  await dbConnect();
  const companyId = new mongoose.Types.ObjectId(user.companyId);
  const [jobCount, appsRaw, byStage] = await Promise.all([
    Job.countDocuments({ companyId }),
    Application.find({ companyId }).select("createdAt matchScore stage").lean(),
    Application.aggregate([{ $match: { companyId } }, { $group: { _id: "$stage", n: { $sum: 1 } } }]),
  ]);
  const apps = appsRaw as any[];
  const avg = apps.length ? apps.reduce((s: number, a: any) => s + (a.matchScore || 0), 0) / apps.length : 0;
  const byDay: Record<string, number> = {};
  for (const a of apps) {
    const d = new Date(a.createdAt).toISOString().slice(5, 10);
    byDay[d] = (byDay[d] || 0) + 1;
  }
  const max = Math.max(1, ...Object.values(byDay));

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Analytics</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Jobs</p>
          <p className="text-3xl font-extrabold">{jobCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Applications</p>
          <p className="text-3xl font-extrabold">{apps.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Avg match score</p>
          <p className="text-3xl font-extrabold">{Math.round(avg)}</p>
        </Card>
      </div>
      <Card className="mt-6">
        <h2 className="font-bold">Applications over time</h2>
        <div className="mt-4 flex h-40 items-end gap-1">
          {Object.entries(byDay).map(([d, n]) => (
            <div key={d} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-lime" style={{ height: `${(n / max) * 100}%` }} />
              <span className="text-[10px] text-muted">{d}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mt-6">
        <h2 className="font-bold">Conversion by stage</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {byStage.map((s: any) => (
            <li key={s._id} className="flex justify-between">
              <span className="capitalize">{s._id}</span>
              <span className="font-semibold">{s.n}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
