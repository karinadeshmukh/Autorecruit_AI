import { MarketingNav } from "@/components/marketing-nav";
import { Button, Card, Badge, ScoreRing } from "@/components/ui";
import { HeroPeople } from "@/components/illustrations";
import { Logo } from "@/components/logo";
import { JobCard } from "@/components/job-card";
import { dbConnect } from "@/lib/mongodb";
import { Job } from "@/models/Job";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Brain,
  ShieldCheck,
  TrendingUp,
  FileText,
  Search,
  Briefcase,
  Users,
  Target,
  Award,
  Zap,
  ArrowRight,
  Sliders,
  HelpCircle,
  Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredJobs: any[] = [];
  try {
    await dbConnect();
    featuredJobs = (await Job.find({ status: "open" })
      .populate("companyId", "name logoText logoUrl logoBg")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()) as any[];
  } catch {
    // Graceful fallback during build or before mongo connects
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-ink selection:bg-[#C8F04D]">
      <MarketingNav />

      {/* 1. HERO SECTION */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-8 lg:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#FFFEFB] px-4 py-1.5 text-xs font-bold text-ink shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#89C717]"></span>
              </span>
              <span>Next-Gen Hybrid ATS & Recruiter Intelligence</span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl text-ink">
              Find your next role. <br />
              Hire with <span className="lime-mark">confidence</span>.
            </h1>

            <p className="mt-5 max-w-lg text-base text-muted leading-relaxed">
              AutoRecruit blends deterministic keyword matching with Sentence-Transformers semantic embeddings.
              Candidates get transparent ATS feedback; HR teams rank hundreds of applicants with zero blind auto-rejections.
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button href="/register" className="!px-7 !py-3.5 !text-base shadow-md">
                I’m a candidate
              </Button>
              <Button href="/register/company" variant="lime" className="!px-7 !py-3.5 !text-base shadow-md">
                I’m hiring talent →
              </Button>
            </div>

            {/* Pill Search Bar */}
            <form
              action="/jobs"
              className="mt-8 flex max-w-xl items-center overflow-hidden rounded-full border border-black/10 bg-white p-1.5 shadow-md"
            >
              <div className="flex flex-1 items-center gap-2 px-4">
                <Search className="h-4 w-4 text-muted" />
                <input
                  suppressHydrationWarning
                  name="q"
                  placeholder="Role, tech stack, or skill..."
                  className="w-full text-sm outline-none placeholder:text-muted/70 bg-transparent font-medium"
                />
              </div>
              <div className="hidden h-6 w-px bg-black/10 sm:block" />
              <div className="hidden sm:flex items-center px-3">
                <input
                  suppressHydrationWarning
                  name="location"
                  placeholder="Remote / City"
                  className="w-28 text-sm outline-none placeholder:text-muted/70 bg-transparent font-medium"
                />
              </div>
              <Button type="submit" variant="primary" className="!px-5 !py-2.5">
                Search
              </Button>
            </form>

            {/* Quick tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
              <span>Trending:</span>
              {["Full-time", "Remote", "React", "Python", "Design Systems", "AI/ML"].map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?q=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-black/5 px-2.5 py-1 text-ink/80 hover:bg-black/10 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Overlapping Hero Visuals */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <HeroPeople />

            {/* Floating Job Card */}
            <Card className="absolute -top-4 -right-2 w-64 p-4 !rounded-3xl border border-black/10 shadow-xl bg-white/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Featured Opening</span>
                <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-bold text-ink">Active</span>
              </div>
              <div className="mt-2.5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#635BFF] text-white font-black text-xs shadow-xs">
                  ST
                </span>
                <div>
                  <p className="font-bold text-xs text-ink">Staff Payments Architect</p>
                  <p className="text-[11px] text-muted">Stripe · $245,000</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-2.5 text-[11px]">
                <span className="text-muted">42 Applicants</span>
                <span className="font-bold text-ink">View Role →</span>
              </div>
            </Card>

            {/* Floating Candidate Chip */}
            <div className="absolute -bottom-4 left-2 rounded-3xl bg-white p-3.5 shadow-xl border border-black/10 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F5C518] text-xs font-extrabold text-ink">
                SC
              </span>
              <div>
                <p className="text-xs font-bold text-ink">Sarah Chen</p>
                <p className="text-[11px] text-muted">Staff Distributed Systems</p>
              </div>
              <div className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white ml-2">
                Shortlisted
              </div>
            </div>

            {/* Glowing Lime ATS Score Badge */}
            <div className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-[#C8F04D] px-4 py-2.5 text-xs font-extrabold text-ink shadow-lg flex items-center gap-2 border border-black/10">
              <Sparkles className="h-4 w-4" />
              <span>ATS Match: 95%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED COMPANIES LOGO MARQUEE */}
      <section className="border-y border-black/5 bg-[#FFFEFB]/60 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted">
            TRUSTED BY TALENT & RECRUITING TEAMS AT MODERN TECHNOLOGY COMPANIES
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-14 text-sm font-extrabold opacity-85">
            {[
              ["Stripe", "ST", "#635BFF"],
              ["Vercel", "▲", "#000000"],
              ["Linear", "LN", "#5E6AD2"],
              ["Figma", "FG", "#F24E1E"],
              ["Notion", "N", "#111111"],
              ["Supabase", "⚡", "#3ECF8E"],
              ["Datadog", "DD", "#632CA6"],
              ["Anthropic", "AN", "#CC785C"],
            ].map(([name, mark, color]) => (
              <div key={name} className="flex items-center gap-2.5 grayscale hover:grayscale-0 transition-all cursor-default">
                <span
                  className="grid h-7 w-7 place-items-center rounded-lg text-xs font-black text-white"
                  style={{ backgroundColor: color }}
                >
                  {mark}
                </span>
                <span className="text-base font-extrabold tracking-tight text-ink">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW THE HYBRID ATS ENGINE WORKS (Deep Architecture Section) */}
      <section className="py-24 lime-glow">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">The Algorithmic Difference</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl text-ink">
              How our <span className="lime-mark">hybrid ATS</span> evaluates talent fairly
            </h2>
            <p className="mt-4 text-muted text-base leading-relaxed">
              Traditional ATS platforms use crude keyword counting that misses great engineers and invites keyword stuffing.
              AutoRecruit separates candidate quality from role compatibility with deep vector embeddings.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Deterministic Rule Parsing",
                desc: "PyMuPDF and python-docx extract verifiable contact details, skills, and work history without LLM hallucinations.",
                icon: FileText,
                badge: "Zero Guesswork",
              },
              {
                step: "02",
                title: "Dual-Score Separation",
                desc: "Resume Quality (formatting, completeness, metrics) is evaluated independently of any specific job opening.",
                icon: Sliders,
                badge: "Job-Agnostic",
              },
              {
                step: "03",
                title: "Semantic Vector Cosine",
                desc: "all-MiniLM-L6-v2 sentence transformers calculate true conceptual alignment between resume experience and the JD.",
                icon: Brain,
                badge: "384-Dim Vectors",
              },
              {
                step: "04",
                title: "Explainable Human Decisions",
                desc: "AI ranks and surfaces quantified rewrites. AutoRecruit never auto-rejects; recruiters make every hiring call.",
                icon: ShieldCheck,
                badge: "HR in Control",
              },
            ].map((col) => {
              const Icon = col.icon;
              return (
                <Card key={col.step} className="flex flex-col justify-between !rounded-3xl border border-black/10 hover:shadow-lg transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-ink/20">{col.step}</span>
                      <span className="rounded-full bg-lime px-2.5 py-0.5 text-[10px] font-extrabold text-ink">
                        {col.badge}
                      </span>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-black/5 grid place-items-center mb-3">
                      <Icon className="h-5 w-5 text-ink" />
                    </div>
                    <h3 className="font-bold text-base text-ink">{col.title}</h3>
                    <p className="mt-2 text-xs text-muted leading-relaxed">{col.desc}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURE SPOTLIGHT: CANDIDATE VS RECRUITER ADVANTAGES */}
      <section className="py-20 border-b border-black/5 bg-[#FFFEFB]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-ink">
              Two powerful portals. One shared <span className="lime-mark">intelligence</span>.
            </h2>
            <p className="mt-3 text-muted text-sm">
              Purpose-built experiences designed for candidates seeking transparency and recruiters demanding precision.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {/* Candidate Card */}
            <Card className="!p-8 !rounded-3xl border border-black/10 bg-[#F6F3EC]/50 space-y-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-ink text-white px-3 py-1 text-xs font-bold">For Candidates</span>
                <span className="text-xs font-bold text-muted">Free Forever</span>
              </div>
              <h3 className="text-2xl font-extrabold text-ink">Stop submitting resumes into black holes</h3>
              <ul className="space-y-3.5 text-sm text-ink/90">
                {[
                  "Live ATS Quality Score (0-100) with detailed section breakdown",
                  "AI Quantified Bullet Rewrites showing how to convert duties into measurable impact",
                  "Transparent application tracking with real status updates",
                  "Auto-graded technical assessments to prove skill beyond a static document",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#89C717] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button href="/register" className="w-full">
                Build & Score Your Resume Free
              </Button>
            </Card>

            {/* Recruiter Card */}
            <Card className="!p-8 !rounded-3xl border border-black/10 bg-[#F6F3EC]/50 space-y-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-lime text-ink px-3 py-1 text-xs font-bold">For HR & Founders</span>
                <span className="text-xs font-bold text-muted">Multi-Tenant</span>
              </div>
              <h3 className="text-2xl font-extrabold text-ink">Shortlist 500 applicants in 60 seconds</h3>
              <ul className="space-y-3.5 text-sm text-ink/90">
                {[
                  "Rank applicants automatically with customizable ATS weight configurations",
                  "Spacious job posting wizard with AI-assisted job description generator",
                  "Visual Kanban hiring funnel (Applied → Screened → Interview → Offer → Hired)",
                  "Custom MCQ technical quiz builder with automatic candidate grading",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-[#89C717] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button href="/register/company" variant="lime" className="w-full">
                Start Hiring with AutoRecruit →
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. LIVE FEATURED OPENINGS */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Live Opportunities</span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
              Featured positions open <span className="lime-mark">today</span>
            </h2>
          </div>
          <Button href="/jobs" variant="secondary">
            View All Openings ({featuredJobs.length > 0 ? "19" : "0"}) →
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <JobCard key={String(job._id)} job={job} href={`/jobs/${job._id}`} />
          ))}
        </div>
      </section>

      {/* 6. HEAD-TO-HEAD COMPARISON TABLE */}
      <section className="py-20 border-t border-black/5 bg-[#FFFEFB]/80">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              Why leading teams switch from legacy ATS
            </h2>
            <p className="mt-2 text-sm text-muted">
              Compare AutoRecruit AI against legacy enterprise recruitment suites.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="py-4 font-bold text-ink">Hiring Capability</th>
                  <th className="py-4 font-extrabold text-ink bg-lime/20 px-4 rounded-t-2xl">AutoRecruit AI</th>
                  <th className="py-4 font-bold text-muted px-4">Traditional ATS (Greenhouse / Lever)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {[
                  ["Resume Matching Engine", "Sentence-Transformers Semantic Vectors + TF-IDF", "Crude exact keyword matching"],
                  ["Applicant Rejection Policy", "Zero automated rejections (Human-in-the-loop)", "Silent automated black hole rejections"],
                  ["Dual Score Isolation", "Resume Quality isolated from Job Match", "Single arbitrary heuristic score"],
                  ["Integrated Skill Quizzes", "Auto-graded MCQ & short-answer assessments", "Requires expensive 3rd-party integration"],
                  ["Candidate Transparency", "Free ATS score breakdown & bullet rewrites", "Zero feedback provided to candidates"],
                  ["Model Independence", "OpenRouter, Gemini, Hugging Face, or offline Stub", "Locked proprietary blackbox algorithms"],
                ].map(([cap, auto, trad], i) => (
                  <tr key={i} className="hover:bg-black/[0.02]">
                    <td className="py-4 font-semibold text-ink">{cap}</td>
                    <td className="py-4 font-bold text-ink bg-lime/10 px-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#89C717] shrink-0" />
                      <span>{auto}</span>
                    </td>
                    <td className="py-4 text-muted px-4">{trad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. STATS TILES (Moodboard match: Sunflower, Coral, Lime, Ink) */}
      <section className="py-16 mx-auto max-w-6xl px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl bg-[#F5C518] p-6 text-ink shadow-sm">
            <p className="text-4xl font-black">94%</p>
            <p className="mt-2 text-sm font-bold">Recruiter Screening Time Saved</p>
            <p className="mt-1 text-xs opacity-80">Rank 500 applicants in under 60 seconds.</p>
          </div>

          <div className="rounded-3xl bg-[#E23D3D] p-6 text-white shadow-sm">
            <p className="text-4xl font-black">0%</p>
            <p className="mt-2 text-sm font-bold">Blind Auto-Rejections</p>
            <p className="mt-1 text-xs opacity-90">AI scores & advises; HR retains final hire decisions.</p>
          </div>

          <div className="rounded-3xl bg-[#C8F04D] p-6 text-ink shadow-sm">
            <p className="text-4xl font-black">2.8x</p>
            <p className="mt-2 text-sm font-bold">Candidate Response Velocity</p>
            <p className="mt-1 text-xs opacity-80">Transparent quality scores attract top technical talent.</p>
          </div>

          <div className="rounded-3xl bg-ink p-6 text-white shadow-sm">
            <p className="text-4xl font-black">100%</p>
            <p className="mt-2 text-sm font-bold">Tenant-Isolated Security</p>
            <p className="mt-1 text-xs opacity-80">Strict companyId query isolation & Auth.js JWTs.</p>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 border-t border-black/5 bg-[#FFFEFB]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Testimonials</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
              Loved by hiring managers & applicants
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "AutoRecruit cut our time-to-shortlist from two weeks to one afternoon. The semantic match caught three incredible engineers whose resumes lacked exact buzzwords.",
                author: "Priya Shah",
                title: "Head of Talent at Stripe",
                tag: "Verified Recruiter",
              },
              {
                quote: "The ATS quality score showed me exactly why my previous resume kept failing corporate parsers. The AI bullet rewrites gave me quantifiable bullets that actually got interviews.",
                author: "Alex Rivera",
                title: "Senior Full-Stack Engineer",
                tag: "Hired via AutoRecruit",
              },
              {
                quote: "Being able to attach an auto-graded React architecture quiz directly to the job post saved our engineering team over 40 hours of first-round screening calls.",
                author: "Guillermo Ramos",
                title: "Engineering Director at Vercel",
                tag: "Hiring Manager",
              },
            ].map((t, idx) => (
              <Card key={idx} className="!p-6 !rounded-3xl border border-black/10 flex flex-col justify-between">
                <p className="text-sm leading-relaxed text-ink/90 italic">"{t.quote}"</p>
                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs text-ink">{t.author}</p>
                    <p className="text-[11px] text-muted">{t.title}</p>
                  </div>
                  <span className="rounded-full bg-lime/40 px-2 py-0.5 text-[10px] font-bold text-ink">
                    {t.tag}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TRANSPARENT PRICING TIERS */}
      <section className="py-20 mx-auto max-w-6xl px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-muted">Transparent Pricing</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            Simple, honest plans for every team
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="!p-8 !rounded-3xl border border-black/10 space-y-5">
            <div>
              <p className="font-bold text-base text-ink">Job Seekers</p>
              <p className="text-xs text-muted mt-1">For engineers & designers</p>
            </div>
            <p className="text-4xl font-black text-ink">$0<span className="text-xs font-semibold text-muted">/forever</span></p>
            <ul className="space-y-2.5 text-xs text-ink/90">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Unlimited resume parses</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> ATS Quality Score Breakdown</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> 1-Click job applications</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Skill assessment quizzes</li>
            </ul>
            <Button href="/register" className="w-full">
              Get Started Free
            </Button>
          </Card>

          <Card className="!p-8 !rounded-3xl border-2 border-ink bg-white relative space-y-5 shadow-xl">
            <span className="absolute -top-3 right-6 rounded-full bg-lime px-3 py-0.5 text-[10px] font-extrabold text-ink uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <p className="font-bold text-base text-ink">Growth Company</p>
              <p className="text-xs text-muted mt-1">For fast-growing startups</p>
            </div>
            <p className="text-4xl font-black text-ink">$99<span className="text-xs font-semibold text-muted">/month</span></p>
            <ul className="space-y-2.5 text-xs text-ink/90">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Up to 15 active job postings</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Hybrid ATS Semantic Ranking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Kanban hiring funnel board</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Custom MCQ assessment builder</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> AI job description assistant</li>
            </ul>
            <Button href="/register/company" variant="lime" className="w-full">
              Start 14-Day Free Trial →
            </Button>
          </Card>

          <Card className="!p-8 !rounded-3xl border border-black/10 space-y-5">
            <div>
              <p className="font-bold text-base text-ink">Enterprise</p>
              <p className="text-xs text-muted mt-1">For large recruiting orgs</p>
            </div>
            <p className="text-4xl font-black text-ink">Custom</p>
            <ul className="space-y-2.5 text-xs text-ink/90">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Unlimited job postings</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Dedicated AI sidecar cluster</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Custom model adapter endpoints</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#89C717]" /> Dedicated account manager</li>
            </ul>
            <Button href="/register/company" variant="secondary" className="w-full">
              Contact Sales
            </Button>
          </Card>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 border-t border-black/5 bg-[#FFFEFB]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the Sentence-Transformers semantic matching work?",
                a: "Instead of simply counting keywords, our Python AI sidecar uses the all-MiniLM-L6-v2 model to generate 384-dimensional dense vector embeddings of the candidate's resume and job description. We calculate cosine similarity between these representations, allowing candidates with relevant experience to match even if they use slightly different terminology.",
              },
              {
                q: "Why does AutoRecruit keep Resume Quality and Job Match separate?",
                a: "A resume can have impeccable formatting, clear metrics, and great structure (high quality score), yet be completely unsuitable for a backend role (low job match score). Keeping them separate prevents qualified candidates with slight formatting quirks from being prematurely discarded.",
              },
              {
                q: "Does AutoRecruit ever automatically reject applicants?",
                a: "Never by default. AutoRecruit provides ranked recommendations, match breakdowns, and screening insights, but all stage advancements and rejection decisions remain strictly in human recruiter control.",
              },
              {
                q: "Which LLM providers are supported?",
                a: "Our provider-independent layer supports OpenRouter, Google Gemini, Hugging Face Inference API, and an offline heuristic stub that operates without any external API keys.",
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-black/10 bg-[#F6F3EC]/50 p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-sm text-ink">
                  <span>{faq.q}</span>
                  <span className="transition group-open:rotate-180 text-muted">↓</span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11. HIGH-IMPACT DARK FOOTER CTA */}
      <footer className="bg-ink text-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center border-b border-white/10 pb-16">
            <div>
              <Logo light />
              <h2 className="mt-6 max-w-md text-3xl font-extrabold leading-snug">
                Try thoughtful hiring with modern ATS intelligence.
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-md">
                Join Stripe, Vercel, Linear, and hundreds of high-growth companies recruiting with AutoRecruit AI.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/register" variant="lime" className="!px-7 !py-3 !text-sm">
                Candidate Signup Free
              </Button>
              <Button href="/register/company" variant="secondary" className="!px-7 !py-3 !text-sm">
                Post an Opening
              </Button>
            </div>
          </div>

          <div className="pt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
            <p>© {new Date().getFullYear()} AutoRecruit AI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/jobs" className="hover:text-white transition-colors">Jobs</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
              <Link href="/admin/ai" className="hover:text-white transition-colors">AI Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
