import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Company } from "@/models/Company";

export async function POST(req: Request) {
  const fd = await req.formData();
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "")
    .toLowerCase()
    .trim();
  const password = String(fd.get("password") || "");
  const role = String(fd.get("role") || "CANDIDATE");
  const companyName = String(fd.get("companyName") || "").trim();

  if (!name || !email || password.length < 8) {
    return NextResponse.json({ error: "Name, email and 8+ character password required" }, { status: 400 });
  }

  await dbConnect();
  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  let companyId;
  if (role === "COMPANY_ADMIN") {
    if (!companyName) return NextResponse.json({ error: "Company name required" }, { status: 400 });
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
    const company = await Company.create({
      name: companyName,
      slug,
      logoText: companyName.slice(0, 2).toUpperCase(),
    });
    companyId = company._id;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    passwordHash,
    role: role === "COMPANY_ADMIN" ? "COMPANY_ADMIN" : "CANDIDATE",
    companyId,
  });

  return NextResponse.json({ ok: true });
}
