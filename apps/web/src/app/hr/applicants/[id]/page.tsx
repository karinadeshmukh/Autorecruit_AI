import { requireRole } from "@/lib/session";
import { dbConnect } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { QuizAttempt } from "@/models/QuizAttempt";
import { Card, Badge, ScoreRing } from "@/components/ui";
import { notFound } from "next/navigation";
import { StageButtons } from "../../jobs/[id]/stage-buttons";
import { CheckCircle2, XCircle, HelpCircle, FileText, Sparkles, GraduationCap, Mail, MapPin } from "lucide-react";

export default async function ApplicantPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["HR", "COMPANY_ADMIN"]);
  const { id } = await params;
  await dbConnect();
  const app = (await Application.findOne({ _id: id, companyId: user.companyId })
    .populate("candidateId")
    .populate("resumeId")
    .populate("jobId", "title skills eligibility")
    .lean()) as any;
  if (!app) notFound();
  const attempt = app.quizAttemptId ? ((await QuizAttempt.findById(app.quizAttemptId).lean()) as any) : null;
  const report = app.matchReport || {};
  const si = app.resumeId?.structuredInsights || {};

  const interviewQuestions = si.interview_questions || [
    `How did you architect and maintain system uptime when implementing ${report.matched_keywords?.[0] || "core services"}?`,
    `Walk us through an engineering trade-off you had to make when meeting a critical project milestone.`,
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-ink">{app.candidateId?.name}</h1>
            <Badge tone={app.stage === "hired" ? "lime" : app.stage === "rejected" ? "coral" : "ink"}>
              {app.stage}
            </Badge>
          </div>
          <p className="text-muted text-sm mt-1 flex items-center gap-3">
            <span className="font-semibold text-ink">{app.jobId?.title}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {app.candidateId?.email}</span>
            {app.candidateId?.location && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {app.candidateId.location}</span>
              </>
            )}
          </p>
        </div>
        <StageButtons id={id} />
      </div>

      {/* Dual Scores Banner (Job Compatibility vs General Resume Quality) */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex items-center gap-4 border-lime/30 bg-[#F6F3EC]/60">
          <ScoreRing score={app.matchScore || 0} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-lime"></span>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Role Compatibility</p>
            </div>
            <p className="text-2xl font-extrabold text-ink">{Math.round(app.matchScore || 0)}<span className="text-xs font-normal text-muted">/100</span></p>
            <p className="text-[11px] text-muted">Keyword + semantic blend</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <ScoreRing score={app.resumeId?.qualityScore || 0} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Resume Quality</p>
            <p className="text-2xl font-extrabold text-ink">{Math.round(app.resumeId?.qualityScore || 0)}<span className="text-xs font-normal text-muted">/100</span></p>
            <p className="text-[11px] text-muted">Structure & formatting index</p>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Assessment Quiz</p>
          {attempt ? (
            <div className="flex items-center gap-3 my-auto">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime text-ink font-extrabold text-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-ink">{attempt.score} / {attempt.maxScore} pts</p>
                <p className="text-xs text-muted font-medium">{Math.round((attempt.score / (attempt.maxScore || 1)) * 100)}% Auto-graded score</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted my-auto">No quiz attempt recorded yet</p>
          )}
        </Card>
      </div>

      {/* Match Breakdown & Keywords */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-3">
          <h2 className="font-bold text-base text-ink">Hybrid ATS Match Breakdown</h2>
          <span className="text-xs font-semibold text-muted">Weighted algorithm breakdown</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ["Keywords (30%)", report.keyword_score || 0],
            ["Semantic Cosine (40%)", report.semantic_score || 0],
            ["Eligibility (20%)", report.eligibility_score || 0],
            ["Extras & Structure (10%)", report.extras_score || 0],
          ].map(([label, score]) => (
            <div key={label as string} className="rounded-2xl bg-[#F6F3EC] p-3 text-xs">
              <span className="text-muted font-medium">{label}</span>
              <p className="text-lg font-bold text-ink mt-0.5">{Math.round(Number(score))}%</p>
            </div>
          ))}
        </div>

        <div className="pt-2 grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#89C717]" /> Matched Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(report.matched_keywords || []).length > 0 ? (
                report.matched_keywords.map((k: string) => (
                  <span key={k} className="rounded-full bg-[#C8F04D] px-2.5 py-0.5 text-xs font-bold text-ink capitalize">
                    {k}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted">None specified</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
              <XCircle className="h-4 w-4 text-coral" /> Missing Required Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(report.missing_keywords || []).length > 0 ? (
                report.missing_keywords.map((k: string) => (
                  <span key={k} className="rounded-full bg-coral/15 px-2.5 py-0.5 text-xs font-semibold text-coral capitalize">
                    {k}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#89C717] font-semibold">100% core keywords matched</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Suggested Interview Focus Questions */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-lime" />
          <h2 className="font-bold text-base text-ink">AI-Generated Interview Focus Questions</h2>
        </div>
        <p className="text-xs text-muted">
          Recommended technical deep-dive questions based on the candidate's verified experience vs this opening:
        </p>
        <div className="space-y-2 pt-1">
          {interviewQuestions.map((q: string, idx: number) => (
            <div key={idx} className="rounded-2xl bg-[#F6F3EC] p-3 text-xs text-ink font-medium border border-black/5">
              <span className="font-bold text-muted mr-2">Q{idx + 1}:</span> {q}
            </div>
          ))}
        </div>
      </Card>

      {/* Screening Questions Answers */}
      {app.screeningAnswers?.length > 0 && (
        <Card className="space-y-3">
          <h2 className="font-bold text-base text-ink">Candidate Screening Responses</h2>
          <div className="space-y-2">
            {app.screeningAnswers.map((s: { question: string; answer: string }, i: number) => (
              <div key={i} className="rounded-2xl bg-[#F6F3EC] p-3 text-xs space-y-1">
                <p className="font-bold text-ink">{s.question}</p>
                <p className="text-muted">{s.answer || "No response provided"}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Raw Parsed Resume */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted" />
          <h2 className="font-bold text-base text-ink">Structured Resume Details</h2>
        </div>
        <pre className="max-h-72 overflow-auto rounded-2xl bg-[#F6F3EC] p-4 text-xs text-ink whitespace-pre-wrap font-mono">
          {JSON.stringify(app.resumeId?.parsed, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
