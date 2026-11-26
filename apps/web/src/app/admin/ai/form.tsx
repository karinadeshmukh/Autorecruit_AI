"use client";

import { Button, Input, Label } from "@/components/ui";
import { useEffect, useState } from "react";

export function AiSettingsForm() {
  const [data, setData] = useState<{
    settings: { provider: string; model: string; fallbacks: string[] };
    models: { id: string; name: string }[];
    health: { ok: boolean; providers: Record<string, boolean> };
  } | null>(null);
  const [provider, setProvider] = useState("openrouter");
  const [model, setModel] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/ai")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setProvider(d.settings.provider);
        setModel(d.settings.model);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, model, fallbacks: [] }),
    });
    setSaved(true);
  }

  if (!data) return <p className="mt-6 text-muted">Loading…</p>;

  return (
    <form onSubmit={save} className="mt-6 space-y-4">
      <div>
        <Label>Provider</Label>
        <select
          className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="openrouter">OpenRouter</option>
          <option value="gemini">Google Gemini</option>
          <option value="huggingface">Hugging Face</option>
          <option value="stub">Stub (offline)</option>
        </select>
      </div>
      <div>
        <Label>Model id</Label>
        {data.models.length > 0 ? (
          <select
            className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {data.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name || m.id}
              </option>
            ))}
          </select>
        ) : (
          <Input value={model} onChange={(e) => setModel(e.target.value)} />
        )}
      </div>
      <p className="text-sm text-muted">
        AI service {data.health?.ok ? "healthy" : "unavailable"}. Providers:{" "}
        {Object.entries(data.health?.providers || {})
          .map(([k, v]) => `${k}:${v ? "on" : "off"}`)
          .join(" · ") || "unknown"}
      </p>
      <Button>Save</Button>
      {saved && <span className="ml-2 text-sm">Saved</span>}
    </form>
  );
}
