"use client";

import { Button, Input, Label, Textarea } from "@/components/ui";
import { useState } from "react";

export function JobForm({ quizzes }: { quizzes: { _id: string; title: string }[] }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function assist() {
    const title = (document.querySelector('[name="title"]') as HTMLInputElement)?.value;
    const res = await fetch("/api/jobs/new/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, notes: (document.querySelector('[name="description"]') as HTMLTextAreaElement)?.value }),
    });
    const data = await res.json();
    const text = data.insights?.[0] || data.description;
    if (text) {
      const el = document.querySelector('[name="description"]') as HTMLTextAreaElement;
      if (el) el.value = text;
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const screeningQuestions = String(fd.get("screening") || "")
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((prompt) => ({ prompt, required: true }));
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        description: fd.get("description"),
        location: fd.get("location"),
        jobType: fd.get("jobType"),
        experienceLevel: fd.get("experienceLevel"),
        remote: fd.get("remote") === "on",
        salaryMin: fd.get("salaryMin"),
        salaryMax: fd.get("salaryMax"),
        skills: fd.get("skills"),
        education: fd.get("education"),
        minYears: fd.get("minYears"),
        screeningQuestions,
        quizId: fd.get("quizId") || undefined,
      }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Could not create job");
      return;
    }
    window.location.href = "/hr/jobs";
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label>Title</Label>
        <Input name="title" required />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>Description</Label>
          <button type="button" className="text-xs font-semibold" onClick={assist}>
            AI assist JD
          </button>
        </div>
        <Textarea name="description" rows={8} required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Location</Label>
          <Input name="location" />
        </div>
        <div>
          <Label>Type</Label>
          <select name="jobType" className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm">
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>
        <div>
          <Label>Experience</Label>
          <select name="experienceLevel" className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm">
            <option>Entry</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" name="remote" />
          <Label className="mb-0">Remote</Label>
        </div>
        <div>
          <Label>Salary min</Label>
          <Input name="salaryMin" type="number" />
        </div>
        <div>
          <Label>Salary max</Label>
          <Input name="salaryMax" type="number" />
        </div>
      </div>
      <div>
        <Label>Required skills (comma)</Label>
        <Input name="skills" placeholder="React, TypeScript, MongoDB" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Education</Label>
          <Input name="education" />
        </div>
        <div>
          <Label>Min years</Label>
          <Input name="minYears" type="number" />
        </div>
      </div>
      <div>
        <Label>Screening questions (one per line)</Label>
        <Textarea name="screening" rows={4} placeholder="Why this role?" />
      </div>
      <div>
        <Label>Attach quiz</Label>
        <select name="quizId" className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm">
          <option value="">None</option>
          {quizzes.map((q) => (
            <option key={q._id} value={q._id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-coral">{error}</p>}
      <Button disabled={pending}>{pending ? "Publishing…" : "Publish opening"}</Button>
    </form>
  );
}
