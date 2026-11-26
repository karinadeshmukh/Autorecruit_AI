import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { AuditLog } from "@/models/AuditLog";
import { isHr } from "@/lib/session";
import { APPLICATION_STAGES } from "@autorecruit/shared";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.companyId || !isHr(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { stage } = await req.json();
  if (!APPLICATION_STAGES.includes(stage)) {
    return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
  }
  await dbConnect();
  const application = await Application.findOneAndUpdate(
    { _id: id, companyId: session.user.companyId },
    {
      $set: { stage },
      $push: { stageHistory: { stage, at: new Date(), by: session.user.id } },
    },
    { new: true }
  );
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await AuditLog.create({
    actorId: session.user.id,
    action: "stage_change",
    entity: "application",
    entityId: id,
    meta: { stage },
  });
  return NextResponse.json({ application });
}
