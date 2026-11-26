"use client";

import { Button, Input, Label, Textarea } from "@/components/ui";
import { useState } from "react";

type Q = { type: "mcq" | "short"; prompt: string; options: string; correctIndex: number };

export function QuizBuilder() {
  const [questions, setQuestions] = useState<Q[]>([
    { type: "mcq", prompt: "", options: "A\nB\nC\nD", correctIndex: 0 },
  ]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title"),
      description: fd.get("description"),
      timeLimitMinutes: Number(fd.get("timeLimitMinutes") || 20),
      questions: questions.map((q) => ({
        type: q.type,
        prompt: q.prompt,
        options: q.type === "mcq" ? q.options.split("\n").map((s) => s.trim()).filter(Boolean) : [],
        correctIndex: Number(q.correctIndex),
        points: 1,
      })),
    };
    const res = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) window.location.href = "/hr/quizzes";
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label>Title</Label>
        <Input name="title" required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea name="description" rows={3} />
      </div>
      <div>
        <Label>Time limit (minutes)</Label>
        <Input name="timeLimitMinutes" type="number" defaultValue={20} />
      </div>
      {questions.map((q, i) => (
        <div key={i} className="rounded-3xl border border-black/10 bg-white p-4">
          <select
            className="mb-3 rounded-full border border-black/10 px-3 py-1 text-sm"
            value={q.type}
            onChange={(e) => {
              const next = [...questions];
              next[i].type = e.target.value as "mcq" | "short";
              setQuestions(next);
            }}
          >
            <option value="mcq">MCQ</option>
            <option value="short">Short answer</option>
          </select>
          <Input
            placeholder="Question"
            value={q.prompt}
            onChange={(e) => {
              const next = [...questions];
              next[i].prompt = e.target.value;
              setQuestions(next);
            }}
          />
          {q.type === "mcq" && (
            <>
              <Textarea
                className="mt-3"
                rows={4}
                value={q.options}
                onChange={(e) => {
                  const next = [...questions];
                  next[i].options = e.target.value;
                  setQuestions(next);
                }}
              />
              <Label className="mt-2">Correct option index (0-based)</Label>
              <Input
                type="number"
                value={q.correctIndex}
                onChange={(e) => {
                  const next = [...questions];
                  next[i].correctIndex = Number(e.target.value);
                  setQuestions(next);
                }}
              />
            </>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => setQuestions([...questions, { type: "mcq", prompt: "", options: "A\nB\nC", correctIndex: 0 }])}
      >
        Add question
      </Button>
      <Button type="submit">Save quiz</Button>
    </form>
  );
}
