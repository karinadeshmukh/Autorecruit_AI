import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

export async function requireRole(roles: string[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    if (user.role === "CANDIDATE") redirect("/app");
    if (user.role === "PLATFORM_ADMIN") redirect("/admin/ai");
    redirect("/hr");
  }
  return user;
}

export function isHr(role?: string) {
  return role === "HR" || role === "COMPANY_ADMIN";
}
