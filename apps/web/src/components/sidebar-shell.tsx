"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Send,
  GraduationCap,
  User,
  Kanban,
  BarChart3,
  Cpu,
  LogOut,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  Building2,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Logo } from "./logo";
import { Badge, Button } from "./ui";

type NavItem = {
  href: string;
  label: string;
  icon: any;
  badge?: string;
};

const candidateNav: NavItem[] = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/jobs", label: "Browse Jobs", icon: Briefcase },
  { href: "/app/resume", label: "ATS Resume & Score", icon: FileText, badge: "AI" },
  { href: "/app/applications", label: "Applications", icon: Send },
  { href: "/app/assessments", label: "Skill Quizzes", icon: GraduationCap },
  { href: "/app/profile", label: "Profile Settings", icon: User },
];

const hrNav: NavItem[] = [
  { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hr/jobs", label: "Job Openings", icon: Briefcase },
  { href: "/hr/funnel", label: "Hiring Funnel", icon: Kanban, badge: "Kanban" },
  { href: "/hr/quizzes", label: "Assessment Quizzes", icon: GraduationCap },
  { href: "/hr/analytics", label: "Hiring Intelligence", icon: BarChart3 },
];

const adminNav: NavItem[] = [
  { href: "/admin/ai", label: "AI Models & Fallbacks", icon: Cpu, badge: "Engine" },
];

interface SidebarShellProps {
  children: React.ReactNode;
  kind: "candidate" | "hr" | "admin";
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    companyName?: string;
  };
  onSignOut: () => Promise<void>;
}

export function SidebarShell({ children, kind, user, onSignOut }: SidebarShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = kind === "candidate" ? candidateNav : kind === "hr" ? hrNav : adminNav;
  const roleLabel =
    kind === "candidate"
      ? "Candidate Portal"
      : kind === "hr"
        ? (user.companyName ? `${user.companyName} HR` : "Company HR")
        : "Platform Admin";

  return (
    <div className="min-h-screen bg-[#F6F3EC] flex">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop & Mobile Drawer Sidebar - Permanently fixed */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col justify-between border-r border-black/5 bg-[#FFFEFB] px-5 py-6 shadow-sm transition-transform duration-300 overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Close for mobile */}
          <div className="flex items-center justify-between px-2">
            <Logo />
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-full p-1 text-muted hover:bg-black/5 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Portal Switcher Badge Card */}
          <div className="rounded-2xl border border-black/5 bg-[#F6F3EC]/70 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Workspace</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#89C717]"></span>
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-xs font-extrabold text-white">
                {kind === "hr" ? (
                  <Building2 className="h-4 w-4 text-[#C8F04D]" />
                ) : kind === "admin" ? (
                  <ShieldCheck className="h-4 w-4 text-[#C8F04D]" />
                ) : (
                  <User className="h-4 w-4 text-[#C8F04D]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-ink">{roleLabel}</p>
                <p className="truncate text-[11px] text-muted">{user.name || user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/app" && item.href !== "/hr" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center justify-between rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-ink text-white shadow-sm"
                      : "text-muted hover:bg-black/5 hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        active ? "text-[#C8F04D]" : "text-muted group-hover:text-ink"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active ? "bg-[#C8F04D] text-ink" : "bg-black/5 text-muted"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Action Widget */}
          {kind === "candidate" && (
            <div className="rounded-2xl border border-black/5 bg-[#F6F3EC]/50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-lime" /> ATS Resume Score
                </p>
                <span className="text-[10px] font-bold rounded-full bg-[#C8F04D] px-2 py-0.5 text-ink">
                  Job-Ready
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Keep your ATS score above 85 to rank in top candidate tiers.
              </p>
              <Link
                href="/app/resume"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-white border border-black/10 py-1.5 text-xs font-bold text-ink hover:bg-black/5"
              >
                Inspect Score →
              </Link>
            </div>
          )}

          {kind === "hr" && (
            <div className="rounded-2xl border border-black/5 bg-[#F6F3EC]/50 p-4">
              <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-lime" /> Quick Action
              </p>
              <p className="mt-1 text-xs text-muted">
                Post new opening with AI assisted JD & screening rules.
              </p>
              <Link
                href="/hr/jobs/new"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-lime py-1.5 text-xs font-bold text-ink hover:brightness-95"
              >
                + Post Opening
              </Link>
            </div>
          )}
        </div>

        {/* Footer User Info & Sign out */}
        <div className="border-t border-black/5 pt-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <Link
              href="/jobs"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Public Jobs Board
            </Link>
            <span className="text-[10px] font-bold text-muted bg-black/5 px-2 py-0.5 rounded-full">v1.0</span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[#F6F3EC]/60 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-bold text-white text-xs">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-ink">{user.name || "User"}</p>
                <p className="truncate text-[11px] text-muted">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => onSignOut()}
              title="Log out"
              className="rounded-full p-2 text-muted hover:bg-black/10 hover:text-ink transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-[#FFFEFB]/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-full p-2 text-muted hover:bg-black/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted">
              <span>AutoRecruit</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="capitalize text-ink font-bold">{kind}</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="capitalize text-ink">
                {pathname.split("/")[2] || "Overview"}
              </span>
            </div>
          </div>

          {/* Right header controls */}
          <div className="flex items-center gap-3">
            {/* Live AI engine status badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-black/5 bg-[#F6F3EC] px-3 py-1 text-xs font-semibold text-ink">
              <span className="h-2 w-2 rounded-full bg-[#89C717] ring-2 ring-[#C8F04D]/50" />
              <span>Hybrid ATS Engine: Active</span>
            </div>

            {kind === "hr" ? (
              <Button href="/hr/jobs/new" variant="lime" className="!py-1.5 !px-3.5 !text-xs">
                + New Opening
              </Button>
            ) : (
              <Button href="/app/jobs" variant="secondary" className="!py-1.5 !px-3.5 !text-xs">
                Explore Jobs
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

