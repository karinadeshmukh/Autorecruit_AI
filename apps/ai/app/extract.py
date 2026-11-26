import io
import re
from typing import Any

import fitz
from docx import Document


def extract_text(filename: str, data: bytes) -> str:
    name = filename.lower()
    if name.endswith(".pdf"):
        doc = fitz.open(stream=data, filetype="pdf")
        return "\n".join(page.get_text() for page in doc)
    if name.endswith(".docx") or name.endswith(".doc"):
        document = Document(io.BytesIO(data))
        return "\n".join(p.text for p in document.paragraphs)
    return data.decode("utf-8", errors="ignore")


EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
PHONE_RE = re.compile(r"(\+?\d[\d\s().-]{7,}\d)")
SKILL_HINTS = [
    "python", "javascript", "typescript", "react", "next.js", "node", "java",
    "sql", "mongodb", "aws", "docker", "figma", "product", "design", "fastapi",
    "tailwind", "machine learning", "nlp", "excel", "communication",
]


def parse_resume_text(text: str) -> dict[str, Any]:
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    email_m = EMAIL_RE.search(text)
    phone_m = PHONE_RE.search(text)
    skills = sorted({s for s in SKILL_HINTS if s.lower() in text.lower()})
    experience: list[dict[str, Any]] = []
    education: list[dict[str, Any]] = []
    section = ""
    bullets: list[str] = []
    current_exp = None
    for ln in lines:
        low = ln.lower()
        if "experience" in low and len(ln) < 40:
            section = "exp"
            continue
        if "education" in low and len(ln) < 40:
            section = "edu"
            continue
        if "skill" in low and len(ln) < 40:
            section = "skills"
            continue
        if section == "exp":
            if ln.startswith(("•", "-", "*")) or ln[:2].isdigit():
                bullets.append(re.sub(r"^[\s•\-\*\d.]+", "", ln))
            elif len(ln) < 80 and not ln.endswith("."):
                if current_exp:
                    current_exp["bullets"] = bullets
                    experience.append(current_exp)
                    bullets = []
                current_exp = {"title": ln, "company": "", "bullets": []}
        if section == "edu" and len(ln) < 120:
            education.append({"school": ln, "degree": "", "year": ""})
    if current_exp:
        current_exp["bullets"] = bullets
        experience.append(current_exp)

    name = lines[0] if lines and "@" not in lines[0] and len(lines[0]) < 60 else ""
    return {
        "name": name,
        "email": email_m.group(0) if email_m else "",
        "phone": phone_m.group(0) if phone_m else "",
        "headline": lines[1] if len(lines) > 1 else "",
        "skills": skills,
        "experience": experience[:8],
        "education": education[:6],
        "raw_text": text,
    }
