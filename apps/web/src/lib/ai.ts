const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
const AI_SERVICE_SECRET = process.env.AI_SERVICE_SECRET || "change-me-ai-service-secret";

async function aiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${AI_SERVICE_URL}${path}`, {
    ...init,
    headers: {
      "x-ai-secret": AI_SERVICE_SECRET,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `AI service error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type ParsedResume = {
  name?: string;
  email?: string;
  phone?: string;
  headline?: string;
  skills: string[];
  experience: { title: string; company: string; dates?: string; bullets: string[] }[];
  education: { school: string; degree?: string; year?: string }[];
  raw_text: string;
};

export type QualityReport = {
  score: number;
  breakdown: Record<string, number>;
  suggestions: string[];
};

export type MatchReport = {
  score: number;
  keyword_score: number;
  semantic_score: number;
  eligibility_score: number;
  extras_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
};

export type BulletRewrite = {
  original: string;
  optimized: string;
  metric: string;
};

export type ResumeInsightsResponse = {
  executive_summary?: string;
  strengths?: string[];
  ats_optimizations?: string[];
  bullet_rewrites?: BulletRewrite[];
  interview_questions?: string[];
  insights: string[];
  rewritten_bullets?: string[];
};

export async function parseResume(filename: string, contentBase64: string) {
  return aiFetch<{ parsed: ParsedResume }>("/v1/parse-resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, content_base64: contentBase64 }),
  });
}

export async function scoreQuality(text: string, parsed: ParsedResume) {
  return aiFetch<QualityReport>("/v1/score-quality", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, parsed }),
  });
}

export async function matchJob(payload: {
  resume_text: string;
  job_description: string;
  required_skills: string[];
  eligibility?: Record<string, unknown>;
  weights?: Record<string, number>;
}) {
  return aiFetch<MatchReport>("/v1/match-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function resumeInsights(
  text: string,
  parsed: ParsedResume,
  settings?: { provider?: string; model?: string; mode?: string }
) {
  return aiFetch<ResumeInsightsResponse>("/v1/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, parsed, ...settings }),
  });
}

export async function listAiModels(provider: string) {
  return aiFetch<{ models: { id: string; name: string }[] }>(`/v1/models?provider=${encodeURIComponent(provider)}`);
}

export async function aiHealth() {
  return aiFetch<{ ok: boolean; providers: Record<string, boolean> }>("/v1/health");
}
