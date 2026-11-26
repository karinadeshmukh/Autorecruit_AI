"use client";

export function StageButtons({ id }: { id: string }) {
  async function setStage(stage: string) {
    await fetch(`/api/applications/${id}/stage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    window.location.reload();
  }
  return (
    <div className="flex gap-1">
      <button className="rounded-full bg-lime px-3 py-1 text-xs font-semibold" onClick={() => setStage("shortlisted")}>
        Shortlist
      </button>
      <button className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold" onClick={() => setStage("interview")}>
        Interview
      </button>
      <button className="rounded-full bg-coral/15 px-3 py-1 text-xs font-semibold text-coral" onClick={() => setStage("rejected")}>
        Reject
      </button>
    </div>
  );
}
