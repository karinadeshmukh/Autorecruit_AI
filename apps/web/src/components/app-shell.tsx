import { auth, signOut } from "@/auth";
import { SidebarShell } from "./sidebar-shell";
import { dbConnect } from "@/lib/mongodb";
import { Company } from "@/models/Company";

export async function AppShell({
  children,
  kind,
}: {
  children: React.ReactNode;
  kind: "candidate" | "hr" | "admin";
}) {
  const session = await auth();
  let companyName: string | undefined;

  if (session?.user?.companyId) {
    try {
      await dbConnect();
      const comp = await Company.findById(session.user.companyId).select("name").lean();
      if (comp) companyName = (comp as any).name;
    } catch {
      // ignore
    }
  }

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <SidebarShell
      kind={kind}
      user={{
        name: session?.user?.name,
        email: session?.user?.email,
        role: session?.user?.role,
        companyName,
      }}
      onSignOut={handleSignOut}
    >
      {children}
    </SidebarShell>
  );
}
