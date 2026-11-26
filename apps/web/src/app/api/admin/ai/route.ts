import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { AiSettings } from "@/models/AiSettings";
import { AuditLog } from "@/models/AuditLog";
import { listAiModels, aiHealth } from "@/lib/ai";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "PLATFORM_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const settings = (await AiSettings.findOne({ key: "global" })) || (await AiSettings.create({ key: "global" }));
  let models: { id: string; name: string }[] = [];
  let health = null;
  try {
    models = (await listAiModels(settings.provider)).models;
  } catch {
    models = [];
  }
  try {
    health = await aiHealth();
  } catch {
    health = { ok: false, providers: {} };
  }
  return NextResponse.json({ settings, models, health });
}

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "PLATFORM_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await dbConnect();
  const settings = await AiSettings.findOneAndUpdate(
    { key: "global" },
    {
      $set: {
        provider: body.provider,
        model: body.model,
        fallbacks: body.fallbacks || [],
        enabledProviders: body.enabledProviders,
      },
    },
    { new: true, upsert: true }
  );
  await AuditLog.create({
    actorId: session.user.id,
    action: "ai_settings",
    entity: "aiSettings",
    entityId: "global",
    meta: { provider: body.provider, model: body.model },
  });
  return NextResponse.json({ settings });
}
