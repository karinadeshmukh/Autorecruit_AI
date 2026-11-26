import { Logo } from "./logo";
import { Button } from "./ui";
import { auth } from "@/auth";
import { isHr } from "@/lib/session";

export async function MarketingNav({ dark = false }: { dark?: boolean }) {
  const session = await auth();
  const dest = !session
    ? "/login"
    : session.user.role === "CANDIDATE"
      ? "/app"
      : session.user.role === "PLATFORM_ADMIN"
        ? "/admin/ai"
        : "/hr";

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Logo light={dark} />
      <nav className={`hidden items-center gap-8 text-sm font-medium md:flex ${dark ? "text-white" : ""}`}>
        <a href="/jobs">Jobs</a>
        <a href="/#companies">For companies</a>
        <a href="/about">About</a>
      </nav>
      <div className="flex items-center gap-3">
        {isHr(session?.user.role) ? (
          <Button href="/hr/jobs/new" variant="ghost">
            Post a job
          </Button>
        ) : (
          <Button href="/register/company" variant="ghost">
            Post a job
          </Button>
        )}
        <Button href={dest}>{session ? "Dashboard" : "Log in"}</Button>
      </div>
    </header>
  );
}
