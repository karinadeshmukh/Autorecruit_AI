"use client";

import { Button, Card } from "@/components/ui";
import { useState } from "react";

export function ResumeUpload() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setStatus("Parsing…");
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/resumes", { method: "POST", body: fd });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setStatus(data.error || "Upload failed");
      return;
    }
    window.location.reload();
  }

  return (
    <Card className="flex min-h-52 flex-col items-center justify-center border-dashed">
      <p className="font-bold">Drop a PDF or DOCX</p>
      <p className="mt-1 text-sm text-muted">We’ll extract skills, experience and a quality score.</p>
      <label className="mt-4">
        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onChange} disabled={pending} />
        <Button type="button" variant="lime" disabled={pending} onClick={(e) => (e.currentTarget.previousSibling as HTMLInputElement)?.click()}>
          {pending ? "Working…" : "Choose file"}
        </Button>
      </label>
      {status && <p className="mt-3 text-sm text-muted">{status}</p>}
    </Card>
  );
}
