"use client";

import { Button, Card, Label, Textarea } from "@/components/ui";
import { useState } from "react";

export function ApplyForm({
  jobId,
  resumeId,
  questions,
}: {
  jobId: string;
  resumeId: string;
  questions: { prompt: string; required?: boolean }[];
}) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!resumeId) {
      setError("Upload a resume first.");
      return;
    }
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const screeningAnswers = questions.map((q, i) => ({
      question: q.prompt,
      answer: String(fd.get(`q-${i}`) || ""),
    }));
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, resumeId, screeningAnswers }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Could not apply");
      return;
    }
    window.location.href = "/app/applications";
  }

  return (
    <Card className="mt-6">
      <h2 className="font-bold">Apply with your latest resume</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {questions.map((q, i) => (
          <div key={q.prompt}>
            <Label>{q.prompt}</Label>
            <Textarea name={`q-${i}`} required={q.required !== false} rows={3} />
          </div>
        ))}
        {error && <p className="text-sm text-coral">{error}</p>}
        <Button disabled={pending}>{pending ? "Submitting…" : "Submit application"}</Button>
      </form>
    </Card>
  );
}
