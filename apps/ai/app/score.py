import re
from typing import Any


def score_quality(text: str, parsed: dict[str, Any]) -> dict[str, Any]:
    text = text or parsed.get("raw_text") or ""
    length = len(text.split())
    contact = 100 if parsed.get("email") and parsed.get("phone") else 50 if parsed.get("email") else 20
    skills = min(100, len(parsed.get("skills") or []) * 15)
    exp = min(100, len(parsed.get("experience") or []) * 25)
    edu = 80 if parsed.get("education") else 30
    quantified = len(re.findall(r"\d+%|\$\d+|\d+\+", text))
    metrics = min(100, quantified * 20)
    structure = 80 if length > 150 else 40 if length > 60 else 15
    if length > 900:
        structure = max(40, structure - 20)

    breakdown = {
        "contact": contact,
        "skills": skills,
        "experience": exp,
        "education": edu,
        "metrics": metrics,
        "structure": structure,
    }
    score = sum(breakdown.values()) / len(breakdown)
    suggestions = []
    if contact < 80:
        suggestions.append("Add a clear email and phone near the top.")
    if skills < 60:
        suggestions.append("List concrete tools and skills instead of generic soft skills only.")
    if metrics < 50:
        suggestions.append("Quantify impact with numbers, percentages, or dollar amounts.")
    if structure < 50:
        suggestions.append("Use standard sections: summary, experience, education, skills.")
    if not suggestions:
        suggestions.append("Strong structure. Tailor keywords when you apply to a specific role.")
    return {"score": round(score, 1), "breakdown": breakdown, "suggestions": suggestions}
