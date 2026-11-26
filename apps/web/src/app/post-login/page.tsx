import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PostLogin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "CANDIDATE") redirect("/app");
  if (session.user.role === "PLATFORM_ADMIN") redirect("/admin/ai");
  redirect("/hr");
}
