"use client";

import { Button, Input, Label, Textarea } from "@/components/ui";
import { useState } from "react";

export function ProfileForm({
  defaults,
}: {
  defaults: { headline: string; location: string; bio: string; skills: string };
}) {
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd)),
    });
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label>Headline</Label>
        <Input name="headline" defaultValue={defaults.headline} />
      </div>
      <div>
        <Label>Location</Label>
        <Input name="location" defaultValue={defaults.location} />
      </div>
      <div>
        <Label>Bio</Label>
        <Textarea name="bio" defaultValue={defaults.bio} rows={4} />
      </div>
      <div>
        <Label>Skills (comma separated)</Label>
        <Input name="skills" defaultValue={defaults.skills} />
      </div>
      <Button>Save</Button>
      {saved && <span className="ml-3 text-sm text-muted">Saved</span>}
    </form>
  );
}
