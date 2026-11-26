from app.match import match_job
from app.score import score_quality


def test_quality_independent_of_job_text():
    parsed = {
        "email": "a@b.com",
        "phone": "555-0100",
        "skills": ["python", "react"],
        "experience": [{"title": "Eng", "bullets": ["Grew revenue 20%"]}],
        "education": [{"school": "State U"}],
        "raw_text": "Jane Dev python react Grew revenue 20% State U 555-0100 a@b.com",
    }
    a = score_quality(parsed["raw_text"], parsed)
    b = score_quality(parsed["raw_text"] + " unused job words kubernetes hive", parsed)
    assert a["score"] > 40
    # extra tokens should not collapse the quality score
    assert abs(a["score"] - b["score"]) < 15


def test_match_changes_with_jd():
    resume = "react typescript next.js product designer figma"
    low = match_job(resume, "senior java spring boot backend", ["java", "spring"])
    high = match_job(resume, "react typescript product designer figma", ["react", "figma"])
    assert high["score"] > low["score"]
    assert "react" in high["matched_keywords"]
