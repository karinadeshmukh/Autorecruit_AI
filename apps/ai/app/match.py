from typing import Any

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

_embedder = None


def _semantic_vectors(a: str, b: str) -> float:
    global _embedder
    try:
        from sentence_transformers import SentenceTransformer

        if _embedder is None:
            _embedder = SentenceTransformer("all-MiniLM-L6-v2")
        va, vb = _embedder.encode([a[:8000], b[:8000]])
        denom = (np.linalg.norm(va) * np.linalg.norm(vb)) or 1.0
        return float(np.dot(va, vb) / denom)
    except Exception:
        vec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=4000)
        m = vec.fit_transform([a, b])
        return float(cosine_similarity(m[0], m[1])[0, 0])


def match_job(
    resume_text: str,
    job_description: str,
    required_skills: list[str] | None = None,
    eligibility: dict[str, Any] | None = None,
    weights: dict[str, float] | None = None,
) -> dict[str, Any]:
    required_skills = [s.lower() for s in (required_skills or []) if s]
    weights = weights or {"keywords": 0.3, "semantic": 0.4, "eligibility": 0.2, "extras": 0.1}
    resume_l = (resume_text or "").lower()
    jd = job_description or ""

    vec = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
    try:
        m = vec.fit_transform([resume_text or "", jd])
        tfidf_cos = float(cosine_similarity(m[0], m[1])[0, 0])
    except ValueError:
        tfidf_cos = 0.0

    matched = [s for s in required_skills if s in resume_l]
    missing = [s for s in required_skills if s not in resume_l]
    keyword_overlap = (len(matched) / len(required_skills)) if required_skills else tfidf_cos
    keyword_score = 100 * (0.5 * tfidf_cos + 0.5 * keyword_overlap)

    semantic = _semantic_vectors(resume_text or "", jd)
    semantic_score = max(0.0, min(100.0, semantic * 100))

    elig = 70.0
    min_years = (eligibility or {}).get("minYears")
    if min_years:
        years = len(__import__("re").findall(r"(\d+)\+?\s+years", resume_l))
        elig = 90 if years or "senior" in resume_l else 45
    education = (eligibility or {}).get("education")
    if education and str(education).lower() not in resume_l:
        elig = min(elig, 55)

    extras = 80.0 if len((resume_text or "").split()) > 120 else 40.0

    score = (
        weights.get("keywords", 0.3) * keyword_score
        + weights.get("semantic", 0.4) * semantic_score
        + weights.get("eligibility", 0.2) * elig
        + weights.get("extras", 0.1) * extras
    )
    return {
        "score": round(score, 1),
        "keyword_score": round(keyword_score, 1),
        "semantic_score": round(semantic_score, 1),
        "eligibility_score": round(elig, 1),
        "extras_score": round(extras, 1),
        "matched_keywords": matched,
        "missing_keywords": missing,
    }
