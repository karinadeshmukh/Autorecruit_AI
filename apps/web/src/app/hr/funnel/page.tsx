import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { Card } from "@/components/ui";
import Link from "next/link";
import mongoose from "mongoose";

const FUNNEL_ORDER = [
  "applied", "screened", "assessment", "shortlisted",
  "interview", "offer", "hired", "rejected",
] as const;

export default async function FunnelPage() {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  await dbConnect();
  const apps = (await Application.find({ companyId: new mongoose.Types.ObjectId(user.companyId) })
    .populate("candidateId", "name")
    .populate("jobId", "title")
    .lean()) as any[];

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Hiring funnel</h1>
      <p className="mt-2 text-muted">Move people yourself — AutoRecruit never auto-rejects.</p>
      <div className="mt-6 flex gap-3 overflow-x-auto pb-4">
        {FUNNEL_ORDER.map((stage) => (
          <div key={stage} className="w-56 shrink-0">
            <p className="mb-2 text-sm font-bold capitalize">{stage}</p>
            <div className="space-y-2">
              {apps
                .filter((a: any) => a.stage === stage)
                .map((a: any) => (
                  <Card key={String(a._id)} className="p-3">
                    <Link href={`/hr/applicants/${a._id}`} className="text-sm font-semibold">
                      {a.candidateId?.name}
                    </Link>
                    <p className="text-xs text-muted">{a.jobId?.title}</p>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
