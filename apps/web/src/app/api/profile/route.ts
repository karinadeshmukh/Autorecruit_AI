import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await dbConnect();
  await User.findByIdAndUpdate(session.user.id, {
    headline: body.headline,
    location: body.location,
    bio: body.bio,
    skills: typeof body.skills === "string" ? body.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : body.skills,
  });
  return NextResponse.json({ ok: true });
}
