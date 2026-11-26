"use client";

import { Button, Card } from "@/components/ui";
import { useState } from "react";

type Q = { prompt: string; type: string; options?: string[] };

export function QuizTake({
  quizId,
  applicationId,
  questions,
}: {
  quizId: string;
  applicationId?: string;
  questions: Q[];
}) {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ score: number; maxScore: number } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const answers = questions.map((q, i) =>
      q.type === "mcq"
        ? { questionIndex: i, selectedIndex: Number(fd.get(`q-${i}`)) }
        : { questionIndex: i, text: String(fd.get(`q-${i}`) || "") }
    );
    setPending(true);
    const res = await fetch(`/api/quizzes/${quizId}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, applicationId }),
    });
    const data = await res.json();
    setPending(false);
    setDone({ score: data.attempt.score, maxScore: data.attempt.maxScore });
  }

  if (done) {
    return (
      <Card className="mt-6">
        <p className="text-2xl font-extrabold">
          {done.score} / {done.maxScore}
        </p>
        <p className="text-sm text-muted">MCQs are auto-graded. Short answers are visible to HR.</p>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {questions.map((q, i) => (
        <Card key={i}>
          <p className="font-semibold">{q.prompt}</p>
          {q.type === "mcq" ? (
            <div className="mt-3 space-y-2">
              {(q.options || []).map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2 text-sm">
                  <input type="radio" name={`q-${i}`} value={oi} required />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <textarea name={`q-${i}`} className="mt-3 w-full rounded-2xl border border-black/10 p-3 text-sm" rows={4} />
          )}
        </Card>
      ))}
      <Button disabled={pending}>{pending ? "Submitting…" : "Submit quiz"}</Button>
    </form>
  );
}
