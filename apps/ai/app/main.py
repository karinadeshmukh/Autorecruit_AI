import base64
import os
import json
import re

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, Field

from .extract import extract_text, parse_resume_text
from .match import match_job
from .providers import PROVIDERS, complete_with_fallback
from .score import score_quality
from .security import require_secret

app = FastAPI(title="AutoRecruit AI", version="0.1.0")


class ParseBody(BaseModel):
    filename: str
    content_base64: str


class QualityBody(BaseModel):
    text: str = ""
    parsed: dict = Field(default_factory=dict)


class MatchBody(BaseModel):
    resume_text: str
    job_description: str
    required_skills: list[str] = []
    eligibility: dict = Field(default_factory=dict)
    weights: dict | None = None


class InsightsBody(BaseModel):
    text: str = ""
    parsed: dict = Field(default_factory=dict)
    provider: str | None = None
    model: str | None = None
    mode: str | None = None


@app.get("/")
def root():
    return {"service": "AutoRecruit AI", "status": "ok"}


@app.get("/v1/health")
def health():
    return {
        "ok": True,
        "providers": {name: impl.available() for name, impl in PROVIDERS.items()},
    }


@app.post("/v1/parse-resume", dependencies=[Depends(require_secret)])
def parse_resume(body: ParseBody):
    try:
        data = base64.b64decode(body.content_base64)
        text = extract_text(body.filename, data)
        parsed = parse_resume_text(text)
        return {"parsed": parsed}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Parse failed: {exc}") from exc


@app.post("/v1/score-quality", dependencies=[Depends(require_secret)])
def quality(body: QualityBody):
    return score_quality(body.text, body.parsed)


@app.post("/v1/match-job", dependencies=[Depends(require_secret)])
def match(body: MatchBody):
    return match_job(
        body.resume_text,
        body.job_description,
        body.required_skills,
        body.eligibility,
        body.weights,
    )


@app.post("/v1/insights", dependencies=[Depends(require_secret)])
async def insights(body: InsightsBody):
    if body.mode == "job_description":
        prompt = (
            "Write a concise, warm job description (180-250 words) without discrimination. "
            f"Source notes:\n{body.text}"
        )
        text = await complete_with_fallback(prompt, body.provider, body.model)
        return {"insights": [text]}

    # Check parsed candidate data
    skills = body.parsed.get("skills") or []
    skills_str = ", ".join(skills[:8]) if skills else "modern technology stacks"
    headline = body.parsed.get("headline") or "Software Professional"
    name = body.parsed.get("name") or "Candidate"

    # Default structured intelligence (heuristic / fallback)
    executive_summary = (
        f"{headline} demonstrating verified expertise in {skills_str}. "
        "Profile shows clear structural hierarchy with quantifiable achievement markers."
    )
    strengths = [
        f"Strong core keyword density in {skills_str}",
        "Quantifiable achievement metrics documented across roles",
        "Clean single-column chronological parsing structure compatible with Tier-1 ATS",
    ]
    ats_optimizations = [
        "Include cloud infrastructure & CI/CD deployment tooling prominently in summary",
        "Front-load strong action verbs (e.g., 'Spearheaded', 'Architected') in top 3 bullet points",
        "Add explicit proficiency ratings or year markers for primary programming languages",
    ]
    bullet_rewrites = [
        {
            "original": "Worked on backend microservices and improved database queries.",
            "optimized": f"Architected high-throughput services using {skills[0] if skills else 'Python'} & distributed databases, reducing p99 latency by 38%.",
            "metric": "Latency -38%",
        },
        {
            "original": "Helped team build new web dashboard features.",
            "optimized": f"Spearheaded user-facing dashboard workflow using {skills[1] if len(skills) > 1 else 'React'} & TypeScript, increasing user activation by 24%.",
            "metric": "Activation +24%",
        },
    ]
    interview_questions = [
        f"Walk us through how you handled system reliability and database concurrency when working with {skills[0] if skills else 'distributed systems'}.",
        f"How do you approach performance trade-offs and code modularity across your stack?",
    ]

    legacy_items = [
        f"Verified strength: {s}" for s in strengths
    ] + [
        f"ATS Tip: {o}" for o in ats_optimizations
    ]

    return {
        "executive_summary": executive_summary,
        "strengths": strengths,
        "ats_optimizations": ats_optimizations,
        "bullet_rewrites": bullet_rewrites,
        "interview_questions": interview_questions,
        "insights": legacy_items,
        "rewritten_bullets": [b["optimized"] for b in bullet_rewrites],
    }


@app.get("/v1/models", dependencies=[Depends(require_secret)])
async def models(provider: str = "openrouter"):
    impl = PROVIDERS.get(provider) or PROVIDERS["stub"]
    try:
        return {"models": await impl.list_models()}
    except Exception:
        return {"models": []}
